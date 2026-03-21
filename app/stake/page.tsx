'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useSendTransaction } from 'wagmi'
import { createPublicClient, http, fallback, formatUnits, encodeFunctionData } from 'viem'
import { base } from 'viem/chains'
import {
  CHAOSLP_ADDRESS,
  CHAOSLP_STAKING_ADDRESS,
  CHAOSLP_GAUGES,
  type GaugeConfig,
} from '@/utils/constants'
import { STAKING_ABI, GAUGE_ABI, ERC20_ABI } from '@/utils/abis'
import { formatNumber, formatCountdown, parseToWei } from '@/utils/format'

const publicClient = createPublicClient({
  chain: base,
  transport: fallback([
    http('https://base-rpc.publicnode.com', { timeout: 5_000 }),
    http('https://mainnet.base.org', { timeout: 5_000 }),
    http('https://base.meowrpc.com', { timeout: 5_000 }),
    http('https://base.llamarpc.com', { timeout: 5_000 }),
  ]),
  pollingInterval: 4_000,
})

interface GaugeData extends GaugeConfig {
  rewardRate: string
  periodFinish: number
  earned: string
  apr: number
  status: 'live' | 'ended' | 'pending'
}

interface StakingState {
  totalStaked: string
  rewardRate: string
  periodFinish: number
  hubApr: number
  staked: string
  earned: string
  allowance: string
  balance: string
  gauges: GaugeData[]
}

function buildInitialState(): StakingState {
  const gauges: GaugeData[] = CHAOSLP_GAUGES.map(g => ({
    ...g, rewardRate: '0', periodFinish: 0, earned: '0', apr: 0, status: 'pending' as const,
  }))
  return {
    totalStaked: '0',
    rewardRate: '0',
    periodFinish: 0,
    hubApr: 0,
    staked: '0',
    earned: '0',
    allowance: '0',
    balance: '0',
    gauges,
  }
}

/** Fetch USD prices for multiple tokens from GeckoTerminal */
async function fetchTokenPrices(addresses: string[]): Promise<Record<string, number>> {
  try {
    const joined = addresses.map(a => a.toLowerCase()).join('%2C')
    const res = await fetch(
      `https://api.geckoterminal.com/api/v2/simple/networks/base/token_price/${joined}`,
      { headers: { Accept: 'application/json' } }
    )
    if (!res.ok) return {}
    const json = await res.json() as { data?: { attributes?: { token_prices?: Record<string, string> } } }
    const prices: Record<string, number> = {}
    const raw = json.data?.attributes?.token_prices || {}
    for (const [addr, price] of Object.entries(raw)) {
      prices[addr.toLowerCase()] = parseFloat(price) || 0
    }
    return prices
  } catch {
    return {}
  }
}

export default function StakePage() {
  const { address } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()

  const [data, setData] = useState<StakingState>(buildInitialState)
  const [loading, setLoading] = useState(false)
  const [stakeAmount, setStakeAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [stakeStep, setStakeStep] = useState<'input' | 'approved'>('input')
  const [approvedAmount, setApprovedAmount] = useState('')

  const fetchData = useCallback(async () => {
    try {
      const stakingAddr = CHAOSLP_STAKING_ADDRESS as `0x${string}`
      const tokenAddr = CHAOSLP_ADDRESS as `0x${string}`
      const walletAddr = address as `0x${string}` | undefined

      // Fetch on-chain data and token prices in parallel
      const allTokenAddrs = [CHAOSLP_ADDRESS, ...CHAOSLP_GAUGES.map(g => g.tokenAddress)]
      const [contractData, prices] = await Promise.all([
        Promise.all([
          publicClient.readContract({ address: stakingAddr, abi: STAKING_ABI, functionName: 'totalSupply' }),
          publicClient.readContract({ address: stakingAddr, abi: STAKING_ABI, functionName: 'rewardRate' }),
          publicClient.readContract({ address: stakingAddr, abi: STAKING_ABI, functionName: 'periodFinish' }),
        ]),
        fetchTokenPrices(allTokenAddrs),
      ])

      const [totalSupply, rewardRate, periodFinish] = contractData
      const now = Math.floor(Date.now() / 1000)
      const chaoslpPrice = prices[CHAOSLP_ADDRESS.toLowerCase()] || 0

      let hubApr = 0
      if (totalSupply > 0n && Number(periodFinish) > now) {
        hubApr = Number(rewardRate * 365n * 86400n * 100n * 10000n / totalSupply) / 10000
      }

      let staked = '0', earned = '0', allowance = '0', balance = '0'
      if (walletAddr) {
        const [s, e, a, b] = await Promise.all([
          publicClient.readContract({ address: stakingAddr, abi: STAKING_ABI, functionName: 'balanceOf', args: [walletAddr] }),
          publicClient.readContract({ address: stakingAddr, abi: STAKING_ABI, functionName: 'earned', args: [walletAddr] }),
          publicClient.readContract({ address: tokenAddr, abi: ERC20_ABI, functionName: 'allowance', args: [walletAddr, stakingAddr] }),
          publicClient.readContract({ address: tokenAddr, abi: ERC20_ABI, functionName: 'balanceOf', args: [walletAddr] }),
        ])
        staked = s.toString()
        earned = e.toString()
        allowance = a.toString()
        balance = b.toString()
      }

      const totalSupplyFloat = Number(formatUnits(totalSupply, 18))

      const gaugeData: GaugeData[] = await Promise.all(
        CHAOSLP_GAUGES.map(async (g) => {
          if (g.gaugeAddress === '0x0000000000000000000000000000000000000000') {
            return { ...g, rewardRate: '0', periodFinish: 0, earned: '0', apr: 0, status: 'pending' as const }
          }

          const addr = g.gaugeAddress as `0x${string}`
          const [gRewardRate, gPeriodFinish, gEarned] = await Promise.all([
            publicClient.readContract({ address: addr, abi: GAUGE_ABI, functionName: 'rewardRate' }),
            publicClient.readContract({ address: addr, abi: GAUGE_ABI, functionName: 'periodFinish' }),
            walletAddr
              ? publicClient.readContract({ address: addr, abi: GAUGE_ABI, functionName: 'earned', args: [walletAddr] })
              : 0n,
          ])

          const status = Number(gPeriodFinish) > now ? 'live' : Number(gPeriodFinish) > 0 ? 'ended' : 'pending'

          // Calculate USD-based APR: (annualRewardTokens * rewardPrice) / (totalStaked * chaoslpPrice) * 100
          let apr = 0
          const rewardPrice = prices[g.tokenAddress.toLowerCase()] || 0
          if (totalSupplyFloat > 0 && chaoslpPrice > 0 && rewardPrice > 0 && Number(gPeriodFinish) > now) {
            const annualTokens = Number(formatUnits(gRewardRate * 365n * 86400n, g.decimals))
            apr = (annualTokens * rewardPrice) / (totalSupplyFloat * chaoslpPrice) * 100
          }

          return { ...g, rewardRate: gRewardRate.toString(), periodFinish: Number(gPeriodFinish), earned: gEarned.toString(), apr, status }
        })
      )

      setData({
        totalStaked: totalSupply.toString(),
        rewardRate: rewardRate.toString(),
        periodFinish: Number(periodFinish),
        hubApr,
        staked, earned, allowance, balance,
        gauges: gaugeData,
      })
    } catch (err) {
      console.error('[StakePage] Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => {
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [fetchData])

  const waitForTx = async (hash: `0x${string}`) => {
    try {
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        timeout: 30_000,
        pollingInterval: 3_000,
      })
      if (receipt.status === 'reverted') {
        throw new Error('Transaction reverted on-chain')
      }
    } catch (e: unknown) {
      // If polling timed out, the tx may still have succeeded — refresh and let the user see
      if (e instanceof Error && e.message.includes('reverted')) throw e
      console.warn('[waitForTx] Receipt poll timed out, refreshing data anyway', e)
    }
    // Give public RPCs a moment to index the new block, then refresh twice
    await new Promise(r => setTimeout(r, 2000))
    await fetchData()
    // Second refresh catches RPCs that were still stale on first pass
    await new Promise(r => setTimeout(r, 4000))
    await fetchData()
  }

  const handleApprove = async () => {
    const amount = parseToWei(stakeAmount)
    if (amount === '0') return
    setActionLoading('approve'); setActionError(null)
    try {
      const txData = encodeFunctionData({ abi: ERC20_ABI, functionName: 'approve', args: [CHAOSLP_STAKING_ADDRESS as `0x${string}`, BigInt(amount)] })
      const hash = await sendTransactionAsync({ to: CHAOSLP_ADDRESS as `0x${string}`, data: txData })
      await waitForTx(hash)
      setApprovedAmount(stakeAmount)
      setStakeStep('approved')
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Approval failed')
    } finally { setActionLoading(null) }
  }

  const handleStake = async () => {
    const amt = stakeStep === 'approved' ? approvedAmount : stakeAmount
    const amount = parseToWei(amt)
    if (amount === '0') return
    setActionLoading('stake'); setActionError(null)
    try {
      const txData = encodeFunctionData({ abi: STAKING_ABI, functionName: 'stake', args: [BigInt(amount)] })
      const hash = await sendTransactionAsync({ to: CHAOSLP_STAKING_ADDRESS as `0x${string}`, data: txData })
      await waitForTx(hash)
      setStakeAmount('')
      setApprovedAmount('')
      setStakeStep('input')
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Stake failed')
    } finally { setActionLoading(null) }
  }

  const handleWithdraw = async () => {
    const amount = parseToWei(withdrawAmount)
    if (amount === '0') return
    setActionLoading('withdraw'); setActionError(null)
    try {
      const txData = encodeFunctionData({ abi: STAKING_ABI, functionName: 'withdraw', args: [BigInt(amount)] })
      const hash = await sendTransactionAsync({ to: CHAOSLP_STAKING_ADDRESS as `0x${string}`, data: txData })
      await waitForTx(hash)
      setWithdrawAmount('')
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Withdraw failed')
    } finally { setActionLoading(null) }
  }

  const handleClaim = async () => {
    setActionLoading('claim'); setActionError(null)
    try {
      const txData = encodeFunctionData({ abi: STAKING_ABI, functionName: 'getReward' })
      const hash = await sendTransactionAsync({ to: CHAOSLP_STAKING_ADDRESS as `0x${string}`, data: txData })
      await waitForTx(hash)
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Claim failed')
    } finally { setActionLoading(null) }
  }

  const handleExit = async () => {
    setActionLoading('exit'); setActionError(null)
    try {
      const txData = encodeFunctionData({ abi: STAKING_ABI, functionName: 'exit' })
      const hash = await sendTransactionAsync({ to: CHAOSLP_STAKING_ADDRESS as `0x${string}`, data: txData })
      await waitForTx(hash)
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Exit failed')
    } finally { setActionLoading(null) }
  }

  const needsApproval = stakeStep === 'input' && data ? BigInt(data.allowance) < BigInt(parseToWei(stakeAmount || '0')) : false
  const gauges = data?.gauges || CHAOSLP_GAUGES.map(g => ({ ...g, rewardRate: '0', periodFinish: 0, earned: '0', apr: 0, status: 'pending' as const }))
  // Spoke gauges only (exclude CHAOSLP hub to avoid duplicate display)
  const spokeGauges = gauges.filter(g => g.symbol !== 'CHAOSLP')
  const totalApr = (data?.hubApr || 0) + spokeGauges.reduce((sum, g) => sum + g.apr, 0)
  const setMaxStake = () => { if (data) setStakeAmount(formatUnits(BigInt(data.balance), 18)) }
  const setMaxWithdraw = () => { if (data) setWithdrawAmount(formatUnits(BigInt(data.staked), 18)) }

  if (loading) {
    return (
      <div className="empty-state">
        <div className="loading-spinner" />
        <p>Loading staking data...</p>
      </div>
    )
  }

  return (
    <>
      <div className="section-header">
        <h2>Stake ChaosLP</h2>
        <p className="section-desc">
          Stake once. Earn six tokens. Fee revenue from ChaosLP pools, distributed via 180-day rolling streams.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total Staked</span>
          <span className="stat-value">{data ? formatNumber(data.totalStaked) : '--'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total APR</span>
          <span className="stat-value">{totalApr > 0 ? `${totalApr.toFixed(1)}%` : '--'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active Gauges</span>
          <span className="stat-value">{gauges.filter(g => g.status === 'live').length} / {gauges.length}</span>
        </div>
      </div>

      {/* Gauge overview */}
      <div className="gauges-grid">
        {gauges.map(g => (
          <div key={g.symbol} className="gauge-card">
            <div className="gauge-header">
              <span className="gauge-symbol">{g.symbol}</span>
              <span className={`gauge-badge gauge-badge-${g.status}`}>
                {g.status === 'live' ? 'Live' : g.status === 'ended' ? 'Ended' : 'Pending'}
              </span>
            </div>
            <div className="gauge-stat">
              <span className="gauge-stat-label">Pool</span>
              <span className="gauge-stat-value">{g.pool}</span>
            </div>
            {g.status === 'live' && (
              <>
                <div className="gauge-stat">
                  <span className="gauge-stat-label">APR</span>
                  <span className="gauge-stat-value">{g.apr > 0 ? `${g.apr.toFixed(1)}%` : '--'}</span>
                </div>
                <div className="gauge-stat">
                  <span className="gauge-stat-label">Remaining</span>
                  <span className="gauge-stat-value">{formatCountdown(g.periodFinish)}</span>
                </div>
              </>
            )}
            {address && g.status === 'live' && BigInt(g.earned) > 0n && (
              <div className="gauge-stat">
                <span className="gauge-stat-label">Your Earned</span>
                <span className="gauge-stat-value text-positive">{formatNumber(g.earned, g.decimals)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Staking UI */}
      {!address ? (
        <div className="empty-state" style={{ marginTop: 'var(--spacing-xl)' }}>
          <p>Connect wallet to stake</p>
          <p className="hint">Use the connect button in the header</p>
        </div>
      ) : (
        <div className="staking-container" style={{ marginTop: 'var(--spacing-xl)' }}>
          {/* User Info */}
          <div className="staking-user-info">
            <div className="user-stat">
              <span className="user-stat-label">Your Stake</span>
              <span className="user-stat-value">{formatNumber(data?.staked || '0')} CHAOSLP</span>
            </div>
            {data && BigInt(data.earned) > 0n && (
              <div className="user-stat">
                <span className="user-stat-label">CHAOSLP Earned</span>
                <span className="user-stat-value text-positive">{formatNumber(data.earned)} CHAOSLP</span>
              </div>
            )}
            {spokeGauges.filter(g => g.status === 'live' && BigInt(g.earned) > 0n).map(g => (
              <div className="user-stat" key={g.symbol}>
                <span className="user-stat-label">{g.symbol} Earned</span>
                <span className="user-stat-value text-positive">{formatNumber(g.earned, g.decimals)} {g.symbol}</span>
              </div>
            ))}
            <div className="user-stat">
              <span className="user-stat-label">Wallet Balance</span>
              <span className="user-stat-value">{formatNumber(data?.balance || '0')} CHAOSLP</span>
            </div>
          </div>

          {actionError && (
            <div className="action-error" onClick={() => setActionError(null)}>{actionError}</div>
          )}

          {/* Stake */}
          {stakeStep === 'approved' ? (
          <div className="staking-section">
            <h3>Stake</h3>
            <div style={{ padding: 'var(--spacing-md)', border: '1px solid var(--accent)', borderRadius: 'var(--radius)', marginBottom: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Approved Amount</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{approvedAmount} CHAOSLP</div>
              </div>
              <span style={{ color: 'var(--accent)', fontSize: 'var(--text-sm)' }}>Approved</span>
            </div>
            <div className="action-buttons">
              <button className="btn btn-primary full-width" onClick={handleStake}
                disabled={actionLoading !== null}>
                {actionLoading === 'stake' ? 'Staking...' : `Stake ${approvedAmount} CHAOSLP`}
              </button>
            </div>
            <button onClick={() => { setStakeStep('input'); setApprovedAmount('') }}
              disabled={actionLoading !== null}
              style={{ marginTop: 'var(--spacing-sm)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Change amount
            </button>
          </div>
          ) : (
          <div className="staking-section">
            <h3>Stake</h3>
            <div className="input-group">
              <div className="input-label">
                <span>Amount</span>
                <span className="input-balance" onClick={setMaxStake}>Balance: {formatNumber(data?.balance || '0')}</span>
              </div>
              <div className="input-wrapper">
                <input type="number" className="amount-input" placeholder="0.00"
                  value={stakeAmount} onChange={e => setStakeAmount(e.target.value)} min="0" step="any" />
                <div className="input-token">CHAOSLP</div>
              </div>
            </div>
            <div className="action-buttons">
              {needsApproval ? (
                <button className="btn btn-primary full-width" onClick={handleApprove}
                  disabled={actionLoading !== null || !stakeAmount}>
                  {actionLoading === 'approve' ? 'Approving...' : `Approve ${stakeAmount} CHAOSLP`}
                </button>
              ) : (
                <button className="btn btn-primary full-width" onClick={handleStake}
                  disabled={actionLoading !== null || !stakeAmount}>
                  {actionLoading === 'stake' ? 'Staking...' : 'Stake'}
                </button>
              )}
            </div>
          </div>
          )}

          {/* Withdraw */}
          <div className="staking-section">
            <h3>Withdraw</h3>
            <div className="input-group">
              <div className="input-label">
                <span>Amount</span>
                <span className="input-balance" onClick={setMaxWithdraw}>Staked: {formatNumber(data?.staked || '0')}</span>
              </div>
              <div className="input-wrapper">
                <input type="number" className="amount-input" placeholder="0.00"
                  value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} min="0" step="any" />
                <div className="input-token">CHAOSLP</div>
              </div>
            </div>
            <div className="action-buttons">
              <button className="btn btn-secondary full-width" onClick={handleWithdraw}
                disabled={actionLoading !== null || !withdrawAmount || BigInt(data?.staked || '0') === 0n}>
                {actionLoading === 'withdraw' ? 'Withdrawing...' : 'Withdraw'}
              </button>
            </div>
          </div>

          {/* Rewards */}
          <div className="staking-section">
            <h3>Rewards</h3>
            <div className="rewards-list">
              {data && BigInt(data.earned) > 0n && (
                <div className="rewards-row">
                  <span className="rewards-amount">{formatNumber(data.earned)}</span>
                  <span className="rewards-token">CHAOSLP (hub)</span>
                </div>
              )}
              {spokeGauges.filter(g => g.status === 'live').map(g => (
                <div className="rewards-row" key={g.symbol}>
                  <span className="rewards-amount">{formatNumber(g.earned, g.decimals)}</span>
                  <span className="rewards-token">{g.symbol}</span>
                </div>
              ))}
              {spokeGauges.filter(g => g.status === 'live').length === 0 && (!data || BigInt(data.earned) === 0n) && (
                <div className="rewards-row">
                  <span className="rewards-token">No active rewards yet</span>
                </div>
              )}
            </div>
            <div className="rewards-buttons">
              <button className="btn btn-primary" onClick={handleClaim}
                disabled={actionLoading !== null}>
                {actionLoading === 'claim' ? 'Claiming...' : 'Claim All Rewards'}
              </button>
              <button className="btn btn-secondary" onClick={handleExit}
                disabled={actionLoading !== null || (BigInt(data?.staked || '0') === 0n && BigInt(data?.earned || '0') === 0n)}>
                {actionLoading === 'exit' ? 'Exiting...' : 'Exit All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
