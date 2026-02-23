'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount, useSendTransaction } from 'wagmi'
import { createPublicClient, http, formatUnits, encodeFunctionData, maxUint256 } from 'viem'
import { base } from 'viem/chains'
import {
  CHAOS_ADDRESS,
  CHAOS_STAKING_ADDRESS,
  CHAOS_GAUGES,
  type GaugeConfig,
} from '@/utils/constants'
import { STAKING_ABI, GAUGE_ABI, ERC20_ABI } from '@/utils/abis'
import { formatNumber, formatCountdown, parseToWei } from '@/utils/format'

const publicClient = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org'),
})

interface GaugeData extends GaugeConfig {
  rewardRate: string
  periodFinish: number
  earned: string
  inAssetApr: number
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

export default function StakePage() {
  const { address } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()

  const [data, setData] = useState<StakingState | null>(null)
  const [loading, setLoading] = useState(true)
  const [stakeAmount, setStakeAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const stakingAddr = CHAOS_STAKING_ADDRESS as `0x${string}`
      const chaosAddr = CHAOS_ADDRESS as `0x${string}`
      const walletAddr = address as `0x${string}` | undefined

      // Read hub state
      const [totalSupply, rewardRate, periodFinish] = await Promise.all([
        publicClient.readContract({ address: stakingAddr, abi: STAKING_ABI, functionName: 'totalSupply' }),
        publicClient.readContract({ address: stakingAddr, abi: STAKING_ABI, functionName: 'rewardRate' }),
        publicClient.readContract({ address: stakingAddr, abi: STAKING_ABI, functionName: 'periodFinish' }),
      ])

      // Hub APR
      const now = Math.floor(Date.now() / 1000)
      let hubApr = 0
      if (totalSupply > 0n && Number(periodFinish) > now) {
        hubApr = Number(rewardRate * 365n * 86400n * 100n * 10000n / totalSupply) / 10000
      }

      // User data
      let staked = '0', earned = '0', allowance = '0', balance = '0'
      if (walletAddr) {
        const [s, e, a, b] = await Promise.all([
          publicClient.readContract({ address: stakingAddr, abi: STAKING_ABI, functionName: 'balanceOf', args: [walletAddr] }),
          publicClient.readContract({ address: stakingAddr, abi: STAKING_ABI, functionName: 'earned', args: [walletAddr] }),
          publicClient.readContract({ address: chaosAddr, abi: ERC20_ABI, functionName: 'allowance', args: [walletAddr, stakingAddr] }),
          publicClient.readContract({ address: chaosAddr, abi: ERC20_ABI, functionName: 'balanceOf', args: [walletAddr] }),
        ])
        staked = s.toString()
        earned = e.toString()
        allowance = a.toString()
        balance = b.toString()
      }

      // Read gauges
      const gaugeData: GaugeData[] = await Promise.all(
        CHAOS_GAUGES.map(async (g) => {
          if (g.gaugeAddress === '0x0000000000000000000000000000000000000000') {
            return { ...g, rewardRate: '0', periodFinish: 0, earned: '0', inAssetApr: 0, status: 'pending' as const }
          }

          const addr = g.gaugeAddress as `0x${string}`
          const [gRewardRate, gPeriodFinish, gEarned] = await Promise.all([
            publicClient.readContract({ address: addr, abi: GAUGE_ABI, functionName: 'rewardRate' }),
            publicClient.readContract({ address: addr, abi: GAUGE_ABI, functionName: 'periodFinish' }),
            walletAddr
              ? publicClient.readContract({ address: addr, abi: GAUGE_ABI, functionName: 'earned', args: [walletAddr] })
              : 0n,
          ])

          let inAssetApr = 0
          if (totalSupply > 0n && Number(gPeriodFinish) > now) {
            const annualRaw = gRewardRate * 365n * 86400n
            inAssetApr = Number(formatUnits(annualRaw, g.decimals)) / Number(formatUnits(totalSupply, 18))
          }

          const status = Number(gPeriodFinish) > now ? 'live' : Number(gPeriodFinish) > 0 ? 'ended' : 'pending'

          return {
            ...g,
            rewardRate: gRewardRate.toString(),
            periodFinish: Number(gPeriodFinish),
            earned: gEarned.toString(),
            inAssetApr,
            status,
          }
        })
      )

      setData({
        totalStaked: totalSupply.toString(),
        rewardRate: rewardRate.toString(),
        periodFinish: Number(periodFinish),
        hubApr,
        staked,
        earned,
        allowance,
        balance,
        gauges: gaugeData,
      })
    } catch (err) {
      console.error('[StakePage] Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => { fetchData() }, [fetchData])

  // Refresh every 30s
  useEffect(() => {
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  const waitAndRefresh = async () => {
    await new Promise(r => setTimeout(r, 4000))
    await fetchData()
  }

  const handleApprove = async () => {
    setActionLoading('approve'); setActionError(null)
    try {
      const txData = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CHAOS_STAKING_ADDRESS as `0x${string}`, maxUint256],
      })
      await sendTransactionAsync({
        to: CHAOS_ADDRESS as `0x${string}`,
        data: txData,
      })
      await waitAndRefresh()
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Approval failed')
    } finally {
      setActionLoading(null)
    }
  }

  const handleStake = async () => {
    const amount = parseToWei(stakeAmount)
    if (amount === '0') return
    setActionLoading('stake'); setActionError(null)
    try {
      const txData = encodeFunctionData({
        abi: STAKING_ABI,
        functionName: 'stake',
        args: [BigInt(amount)],
      })
      await sendTransactionAsync({
        to: CHAOS_STAKING_ADDRESS as `0x${string}`,
        data: txData,
      })
      setStakeAmount('')
      await waitAndRefresh()
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Stake failed')
    } finally {
      setActionLoading(null)
    }
  }

  const handleWithdraw = async () => {
    const amount = parseToWei(withdrawAmount)
    if (amount === '0') return
    setActionLoading('withdraw'); setActionError(null)
    try {
      const txData = encodeFunctionData({
        abi: STAKING_ABI,
        functionName: 'withdraw',
        args: [BigInt(amount)],
      })
      await sendTransactionAsync({
        to: CHAOS_STAKING_ADDRESS as `0x${string}`,
        data: txData,
      })
      setWithdrawAmount('')
      await waitAndRefresh()
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Withdraw failed')
    } finally {
      setActionLoading(null)
    }
  }

  const handleClaim = async () => {
    setActionLoading('claim'); setActionError(null)
    try {
      const txData = encodeFunctionData({
        abi: STAKING_ABI,
        functionName: 'getReward',
      })
      await sendTransactionAsync({
        to: CHAOS_STAKING_ADDRESS as `0x${string}`,
        data: txData,
      })
      await waitAndRefresh()
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Claim failed')
    } finally {
      setActionLoading(null)
    }
  }

  const handleExit = async () => {
    setActionLoading('exit'); setActionError(null)
    try {
      const txData = encodeFunctionData({
        abi: STAKING_ABI,
        functionName: 'exit',
      })
      await sendTransactionAsync({
        to: CHAOS_STAKING_ADDRESS as `0x${string}`,
        data: txData,
      })
      await waitAndRefresh()
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : 'Exit failed')
    } finally {
      setActionLoading(null)
    }
  }

  // Derived
  const needsApproval = data
    ? BigInt(data.allowance) < BigInt(parseToWei(stakeAmount || '0'))
    : false

  const gauges = data?.gauges || CHAOS_GAUGES.map(g => ({
    ...g, rewardRate: '0', periodFinish: 0, earned: '0', inAssetApr: 0, status: 'pending' as const,
  }))

  const setMaxStake = () => {
    if (data) setStakeAmount(formatUnits(BigInt(data.balance), 18))
  }

  const setMaxWithdraw = () => {
    if (data) setWithdrawAmount(formatUnits(BigInt(data.staked), 18))
  }

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
        <h2>Stake $CHAOS</h2>
        <p className="section-desc">
          Stake once. Earn 7 tokens. 180-day rolling streams from LP fees across 7 CHAOS pairs.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total Staked</span>
          <span className="stat-value">{data ? formatNumber(data.totalStaked) : '--'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Hub APR</span>
          <span className="stat-value">{data ? `${data.hubApr.toFixed(1)}%` : '--'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active Gauges</span>
          <span className="stat-value">{gauges.filter(g => g.status === 'live').length} / 7</span>
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
                  <span className="gauge-stat-label">APR (in-asset)</span>
                  <span className="gauge-stat-value">{g.inAssetApr.toFixed(2)}</span>
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
              <span className="user-stat-value">{formatNumber(data?.staked || '0')} CHAOS</span>
            </div>
            {data && BigInt(data.earned) > 0n && (
              <div className="user-stat">
                <span className="user-stat-label">CHAOS Earned</span>
                <span className="user-stat-value text-positive">{formatNumber(data.earned)} CHAOS</span>
              </div>
            )}
            {gauges.filter(g => g.status === 'live' && BigInt(g.earned) > 0n).map(g => (
              <div className="user-stat" key={g.symbol}>
                <span className="user-stat-label">{g.symbol} Earned</span>
                <span className="user-stat-value text-positive">{formatNumber(g.earned, g.decimals)} {g.symbol}</span>
              </div>
            ))}
            <div className="user-stat">
              <span className="user-stat-label">Wallet Balance</span>
              <span className="user-stat-value">{formatNumber(data?.balance || '0')} CHAOS</span>
            </div>
          </div>

          {actionError && (
            <div className="action-error" onClick={() => setActionError(null)}>{actionError}</div>
          )}

          {/* Stake */}
          <div className="staking-section">
            <h3>Stake</h3>
            <div className="input-group">
              <div className="input-label">
                <span>Amount</span>
                <span className="input-balance" onClick={setMaxStake}>
                  Balance: {formatNumber(data?.balance || '0')}
                </span>
              </div>
              <div className="input-wrapper">
                <input
                  type="number" className="amount-input" placeholder="0.00"
                  value={stakeAmount} onChange={e => setStakeAmount(e.target.value)}
                  min="0" step="any"
                />
                <div className="input-token">CHAOS</div>
              </div>
            </div>
            <div className="action-buttons">
              {needsApproval ? (
                <button className="btn btn-primary full-width" onClick={handleApprove}
                  disabled={actionLoading === 'approve' || !stakeAmount}>
                  {actionLoading === 'approve' ? 'Approving...' : 'Approve'}
                </button>
              ) : (
                <button className="btn btn-primary full-width" onClick={handleStake}
                  disabled={actionLoading === 'stake' || !stakeAmount}>
                  {actionLoading === 'stake' ? 'Staking...' : 'Stake'}
                </button>
              )}
            </div>
          </div>

          {/* Withdraw */}
          <div className="staking-section">
            <h3>Withdraw</h3>
            <div className="input-group">
              <div className="input-label">
                <span>Amount</span>
                <span className="input-balance" onClick={setMaxWithdraw}>
                  Staked: {formatNumber(data?.staked || '0')}
                </span>
              </div>
              <div className="input-wrapper">
                <input
                  type="number" className="amount-input" placeholder="0.00"
                  value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
                  min="0" step="any"
                />
                <div className="input-token">CHAOS</div>
              </div>
            </div>
            <div className="action-buttons">
              <button className="btn btn-secondary full-width" onClick={handleWithdraw}
                disabled={actionLoading === 'withdraw' || !withdrawAmount || BigInt(data?.staked || '0') === 0n}>
                {actionLoading === 'withdraw' ? 'Withdrawing...' : 'Withdraw'}
              </button>
            </div>
          </div>

          {/* Rewards */}
          <div className="staking-section">
            <h3>Rewards</h3>
            <div className="rewards-list">
              {gauges.filter(g => g.status === 'live').map(g => (
                <div className="rewards-row" key={g.symbol}>
                  <span className="rewards-amount">{formatNumber(g.earned, g.decimals)}</span>
                  <span className="rewards-token">{g.symbol}</span>
                </div>
              ))}
              {data && BigInt(data.earned) > 0n && (
                <div className="rewards-row">
                  <span className="rewards-amount">{formatNumber(data.earned)}</span>
                  <span className="rewards-token">CHAOS (hub)</span>
                </div>
              )}
              {gauges.filter(g => g.status === 'live').length === 0 && (!data || BigInt(data.earned) === 0n) && (
                <div className="rewards-row">
                  <span className="rewards-token">No active rewards yet</span>
                </div>
              )}
            </div>
            <div className="rewards-buttons">
              <button className="btn btn-primary" onClick={handleClaim}
                disabled={actionLoading === 'claim'}>
                {actionLoading === 'claim' ? 'Claiming...' : 'Claim All Rewards'}
              </button>
              <button className="btn btn-secondary" onClick={handleExit}
                disabled={actionLoading === 'exit' || (BigInt(data?.staked || '0') === 0n && BigInt(data?.earned || '0') === 0n)}>
                {actionLoading === 'exit' ? 'Exiting...' : 'Exit All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
