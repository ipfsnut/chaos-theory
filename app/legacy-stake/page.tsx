'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useSendTransaction } from 'wagmi'
import { createPublicClient, http, fallback, formatUnits, encodeFunctionData, maxUint256 } from 'viem'
import { base } from 'viem/chains'
import { STAKING_ABI, GAUGE_ABI, ERC20_ABI } from '@/utils/abis'
import { formatNumber, formatCountdown, parseToWei } from '@/utils/format'

// Old CHAOS contract addresses — hardcoded, these never change
const OLD_CHAOS_ADDRESS = '0xfab2ee8eb6b26208bfb5c41012661e62b4dc9292' as const
const OLD_STAKING_ADDRESS = '0x70e6c917A8AC437E629B67E84C0C0678eD54460d' as const

const OLD_GAUGES = [
  { symbol: 'ARBME', tokenAddress: '0xC647421C5Dc78D1c3960faA7A33f9aEFDF4B7B07', gaugeAddress: '0x37547710faE12B4be7458b5E87C3106a85CfD72F', decimals: 18, pool: 'CHAOS / ARBME' },
  { symbol: 'USDC',  tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', gaugeAddress: '0x8d3074Bdf9412D77269F59Cc506E318E5da27914', decimals: 6,  pool: 'CHAOS / USDC' },
]

const publicClient = createPublicClient({
  chain: base,
  transport: fallback([
    http('https://base.llamarpc.com'),
    http('https://base-rpc.publicnode.com'),
    http('https://mainnet.base.org'),
  ]),
})

interface GaugeData {
  symbol: string
  gaugeAddress: string
  decimals: number
  pool: string
  earned: string
  periodFinish: number
  status: 'live' | 'ended'
}

interface LegacyState {
  totalStaked: string
  staked: string
  earned: string
  balance: string
  gauges: GaugeData[]
}

export default function LegacyStakePage() {
  const { address } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()

  const [data, setData] = useState<LegacyState | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [withdrawAmount, setWithdrawAmount] = useState('')

  const fetchData = useCallback(async () => {
    try {
      const stakingAddr = OLD_STAKING_ADDRESS as `0x${string}`
      const chaosAddr = OLD_CHAOS_ADDRESS as `0x${string}`
      const walletAddr = address as `0x${string}` | undefined

      const [totalSupply] = await Promise.all([
        publicClient.readContract({ address: stakingAddr, abi: STAKING_ABI, functionName: 'totalSupply' }),
      ])

      let staked = '0', earned = '0', balance = '0'
      if (walletAddr) {
        const [s, e, b] = await Promise.all([
          publicClient.readContract({ address: stakingAddr, abi: STAKING_ABI, functionName: 'balanceOf', args: [walletAddr] }),
          publicClient.readContract({ address: stakingAddr, abi: STAKING_ABI, functionName: 'earned', args: [walletAddr] }),
          publicClient.readContract({ address: chaosAddr, abi: ERC20_ABI, functionName: 'balanceOf', args: [walletAddr] }),
        ])
        staked = s.toString()
        earned = e.toString()
        balance = b.toString()
      }

      const now = Math.floor(Date.now() / 1000)
      const gaugeData: GaugeData[] = await Promise.all(
        OLD_GAUGES.map(async (g) => {
          const addr = g.gaugeAddress as `0x${string}`
          const [gPeriodFinish, gEarned] = await Promise.all([
            publicClient.readContract({ address: addr, abi: GAUGE_ABI, functionName: 'periodFinish' }),
            walletAddr
              ? publicClient.readContract({ address: addr, abi: GAUGE_ABI, functionName: 'earned', args: [walletAddr] })
              : 0n,
          ])
          return {
            symbol: g.symbol,
            gaugeAddress: g.gaugeAddress,
            decimals: g.decimals,
            pool: g.pool,
            earned: gEarned.toString(),
            periodFinish: Number(gPeriodFinish),
            status: Number(gPeriodFinish) > now ? 'live' as const : 'ended' as const,
          }
        })
      )

      setData({ totalStaked: totalSupply.toString(), staked, earned, balance, gauges: gaugeData })
    } catch (err) {
      console.error('[LegacyStake] Error:', err)
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => { fetchData() }, [fetchData])

  const waitAndRefresh = async () => {
    await new Promise(r => setTimeout(r, 4000))
    await fetchData()
  }

  const handleWithdraw = async () => {
    const amount = parseToWei(withdrawAmount)
    if (amount === '0') return
    setActionLoading('withdraw'); setActionError(null)
    try {
      const txData = encodeFunctionData({ abi: STAKING_ABI, functionName: 'withdraw', args: [BigInt(amount)] })
      await sendTransactionAsync({ to: OLD_STAKING_ADDRESS as `0x${string}`, data: txData })
      setWithdrawAmount('')
      await waitAndRefresh()
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Withdraw failed')
    } finally { setActionLoading(null) }
  }

  const handleClaim = async () => {
    setActionLoading('claim'); setActionError(null)
    try {
      const txData = encodeFunctionData({ abi: STAKING_ABI, functionName: 'getReward' })
      await sendTransactionAsync({ to: OLD_STAKING_ADDRESS as `0x${string}`, data: txData })
      await waitAndRefresh()
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Claim failed')
    } finally { setActionLoading(null) }
  }

  const handleExit = async () => {
    setActionLoading('exit'); setActionError(null)
    try {
      const txData = encodeFunctionData({ abi: STAKING_ABI, functionName: 'exit' })
      await sendTransactionAsync({ to: OLD_STAKING_ADDRESS as `0x${string}`, data: txData })
      await waitAndRefresh()
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Exit failed')
    } finally { setActionLoading(null) }
  }

  const setMaxWithdraw = () => {
    if (data) setWithdrawAmount(formatUnits(BigInt(data.staked), 18))
  }

  if (loading) {
    return (
      <div className="empty-state">
        <div className="loading-spinner" />
        <p>Loading legacy staking data...</p>
      </div>
    )
  }

  const hasStake = data && BigInt(data.staked) > 0n
  const hasRewards = data && (
    BigInt(data.earned) > 0n ||
    data.gauges.some(g => BigInt(g.earned) > 0n)
  )

  return (
    <>
      <div className="section-header">
        <h2>Old CHAOS Staking</h2>
        <p className="section-desc">
          This is the legacy $CHAOS staking hub. No new rewards are being deposited.
          Use this page to withdraw your staked CHAOS and claim any remaining rewards.
        </p>
      </div>

      {/* Contract Info */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="address-card">
          <div className="address-label">Legacy Staking Hub</div>
          <a href={`https://basescan.org/address/${OLD_STAKING_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="address-value">
            {OLD_STAKING_ADDRESS}
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total Still Staked</span>
          <span className="stat-value">{data ? formatNumber(data.totalStaked) : '--'}</span>
        </div>
      </div>

      {/* Gauge status */}
      {data && data.gauges.length > 0 && (
        <div className="gauges-grid" style={{ marginTop: 'var(--spacing-lg)' }}>
          {data.gauges.map(g => (
            <div key={g.symbol} className="gauge-card">
              <div className="gauge-header">
                <span className="gauge-symbol">{g.symbol}</span>
                <span className={`gauge-badge gauge-badge-${g.status}`}>
                  {g.status === 'live' ? 'Winding Down' : 'Ended'}
                </span>
              </div>
              <div className="gauge-stat">
                <span className="gauge-stat-label">Pool</span>
                <span className="gauge-stat-value">{g.pool}</span>
              </div>
              {g.status === 'live' && (
                <div className="gauge-stat">
                  <span className="gauge-stat-label">Ends</span>
                  <span className="gauge-stat-value">{formatCountdown(g.periodFinish)}</span>
                </div>
              )}
              {address && BigInt(g.earned) > 0n && (
                <div className="gauge-stat">
                  <span className="gauge-stat-label">Your Unclaimed</span>
                  <span className="gauge-stat-value text-positive">{formatNumber(g.earned, g.decimals)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {!address ? (
        <div className="empty-state" style={{ marginTop: 'var(--spacing-xl)' }}>
          <p>Connect wallet to manage your legacy stake</p>
        </div>
      ) : !hasStake && !hasRewards ? (
        <div className="empty-state" style={{ marginTop: 'var(--spacing-xl)' }}>
          <p>You have no CHAOS staked in the legacy hub</p>
        </div>
      ) : (
        <div className="staking-container" style={{ marginTop: 'var(--spacing-xl)' }}>
          {/* User Info */}
          <div className="staking-user-info">
            <div className="user-stat">
              <span className="user-stat-label">Your Stake</span>
              <span className="user-stat-value">{formatNumber(data?.staked || '0')} CHAOS</span>
            </div>
            {data && BigInt(data.earned) > 0n && (
              <div className="user-stat">
                <span className="user-stat-label">CHAOS Earned</span>
                <span className="user-stat-value text-positive">{formatNumber(data.earned)} CHAOS</span>
              </div>
            )}
            {data?.gauges.filter(g => BigInt(g.earned) > 0n).map(g => (
              <div className="user-stat" key={g.symbol}>
                <span className="user-stat-label">{g.symbol} Earned</span>
                <span className="user-stat-value text-positive">{formatNumber(g.earned, g.decimals)} {g.symbol}</span>
              </div>
            ))}
          </div>

          {actionError && (
            <div className="action-error" onClick={() => setActionError(null)}>{actionError}</div>
          )}

          {/* Withdraw */}
          {hasStake && (
            <div className="staking-section">
              <h3>Withdraw CHAOS</h3>
              <div className="input-group">
                <div className="input-label">
                  <span>Amount</span>
                  <span className="input-balance" onClick={setMaxWithdraw}>Staked: {formatNumber(data?.staked || '0')}</span>
                </div>
                <div className="input-wrapper">
                  <input type="number" className="amount-input" placeholder="0.00"
                    value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} min="0" step="any" />
                  <div className="input-token">CHAOS</div>
                </div>
              </div>
              <div className="action-buttons">
                <button className="btn btn-secondary full-width" onClick={handleWithdraw}
                  disabled={actionLoading === 'withdraw' || !withdrawAmount}>
                  {actionLoading === 'withdraw' ? 'Withdrawing...' : 'Withdraw'}
                </button>
              </div>
            </div>
          )}

          {/* Rewards + Exit */}
          <div className="staking-section">
            <h3>Claim & Exit</h3>
            <div className="rewards-list">
              {data && BigInt(data.earned) > 0n && (
                <div className="rewards-row">
                  <span className="rewards-amount">{formatNumber(data.earned)}</span>
                  <span className="rewards-token">CHAOS (hub)</span>
                </div>
              )}
              {data?.gauges.filter(g => BigInt(g.earned) > 0n).map(g => (
                <div className="rewards-row" key={g.symbol}>
                  <span className="rewards-amount">{formatNumber(g.earned, g.decimals)}</span>
                  <span className="rewards-token">{g.symbol}</span>
                </div>
              ))}
            </div>
            <div className="rewards-buttons">
              {hasRewards && (
                <button className="btn btn-primary" onClick={handleClaim}
                  disabled={actionLoading === 'claim'}>
                  {actionLoading === 'claim' ? 'Claiming...' : 'Claim All Rewards'}
                </button>
              )}
              {hasStake && (
                <button className="btn btn-secondary" onClick={handleExit}
                  disabled={actionLoading === 'exit'}>
                  {actionLoading === 'exit' ? 'Exiting...' : 'Exit All (Withdraw + Claim)'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
