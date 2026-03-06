import type { Metadata } from 'next'
import { CHAOSLP_ADDRESS, CHAOSLP_STAKING_ADDRESS, CHAOSLP_SAFE, CHAOSLP_GAUGES, LINKS } from '@/utils/constants'

export const metadata: Metadata = {
  title: 'Docs',
  description: 'ChaosLP documentation — tokenomics, staking mechanics, and pool architecture.',
}

export default function DocsPage() {
  return (
    <div className="docs-content">
      <div className="section-header">
        <h2>Documentation</h2>
        <p className="section-desc">
          How ChaosLP works. Buy it, stake it or LP it, earn from three pools.
        </p>
      </div>

      <h2 id="overview">Overview</h2>
      <p>
        <strong>ChaosLP</strong> is a coordination asset on Base, launched via{' '}
        <a href={LINKS.flaunch} target="_blank" rel="noopener noreferrer">Flaunch</a>.
        It serves as ArbMe&apos;s high-risk pair token &mdash; degen tokens pair against ChaosLP,
        which routes through ARBME into the broader ecosystem.
      </p>
      <p>
        80% of Flaunch trading fees go to the ChaosLP Safe (treasury). 20% goes to the community
        share, funding the <strong>Progressive Bid Wall</strong> &mdash; autonomous buy-side support
        that creates a rising price floor.
      </p>

      <h2 id="how-to-earn">How to Earn</h2>
      <h3>Option 1: Stake</h3>
      <p>
        Buy ChaosLP and stake it. You earn four tokens automatically from LP fee revenue:
        CHAOSLP, ARBME, USDC, and FLAY. One transaction to claim all rewards.
      </p>
      <ol>
        <li><strong>Buy</strong> ChaosLP on <a href={LINKS.flaunch} target="_blank" rel="noopener noreferrer">Flaunch</a></li>
        <li><strong>Approve</strong> the staking hub to spend your ChaosLP</li>
        <li><strong>Stake</strong> your ChaosLP</li>
        <li><strong>Claim</strong> rewards anytime with <code>getReward()</code></li>
      </ol>

      <h3>Option 2: LP</h3>
      <p>
        Provide liquidity in any ChaosLP pool on Uniswap V4. You earn trading fees directly from swaps.
        Higher risk than staking, but direct fee exposure.
      </p>
      <ul>
        <li><strong>CHAOSLP / ARBME</strong> &mdash; 3% fee, high volume from degen routing</li>
        <li><strong>CHAOSLP / USDC</strong> &mdash; 3% fee, stable gateway</li>
        <li><strong>CHAOSLP / FLAY</strong> &mdash; 3% fee, Flaunch ecosystem</li>
      </ul>

      <h2 id="staking">Staking Mechanics</h2>
      <p>
        Hub-and-spoke architecture. One hub contract, four gauge contracts.
        Stake ChaosLP to the hub once, earn from all active gauges automatically.
      </p>

      <h3>Gauges</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-muted)' }}>Token</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-muted)' }}>Source</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-muted)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {CHAOSLP_GAUGES.map(g => (
              <tr key={g.symbol} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.5rem', fontWeight: 600 }}>{g.symbol}</td>
                <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>{g.pool}</td>
                <td style={{ padding: '0.5rem' }}>
                  {g.gaugeAddress.startsWith('TODO')
                    ? <span style={{ color: 'var(--warning)' }}>Pending</span>
                    : <span style={{ color: 'var(--positive)' }}>Live</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Reward Streams</h3>
      <p>
        Each gauge distributes rewards over a <strong>180-day rolling window</strong>. The Safe
        deposits fee revenue weekly. Each deposit restarts the countdown, ensuring continuous distribution.
        No emissions, no inflation &mdash; rewards come from real LP trading fees.
      </p>

      <h2 id="progressive-bid-wall">Progressive Bid Wall</h2>
      <p>
        Flaunch&apos;s V4 hook places a limit buy order below market price. It repositions upward as price rises.
        Triggers at 0.1 ETH of accumulated community fees. Token-side fees are converted to ETH via
        the Internal Swap Pool without sell pressure.
      </p>
      <p>
        Staking amplifies the PBW: staked tokens are removed from the float, so each wall deployment
        absorbs more of the potential sell pressure.
      </p>

      <h2 id="contracts">Contract Addresses</h2>
      <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        <div className="address-card">
          <div className="address-label">$CHAOSLP Token</div>
          <a href={LINKS.basescan} target="_blank" rel="noopener noreferrer" className="address-value">{CHAOSLP_ADDRESS}</a>
        </div>
        <div className="address-card">
          <div className="address-label">Staking Hub</div>
          <a href={LINKS.stakingBasescan} target="_blank" rel="noopener noreferrer" className="address-value">{CHAOSLP_STAKING_ADDRESS}</a>
        </div>
        <div className="address-card">
          <div className="address-label">ChaosLP Safe</div>
          <a href={LINKS.safe} target="_blank" rel="noopener noreferrer" className="address-value">{CHAOSLP_SAFE}</a>
        </div>
        {CHAOSLP_GAUGES.filter(g => !g.gaugeAddress.startsWith('TODO')).map(g => (
          <div key={g.symbol} className="address-card">
            <div className="address-label">{g.symbol} Gauge</div>
            <a href={`https://basescan.org/address/${g.gaugeAddress}`} target="_blank" rel="noopener noreferrer" className="address-value">{g.gaugeAddress}</a>
          </div>
        ))}
      </div>
    </div>
  )
}
