import type { Metadata } from 'next'
import { CHAOS_ADDRESS, CHAOS_STAKING_ADDRESS, CHAOS_FOUNDATION_MULTISIG, CHAOS_GAUGES, LINKS } from '@/utils/constants'

export const metadata: Metadata = {
  title: 'Docs',
  description: 'ChaosTheory documentation — tokenomics, staking mechanics, governance, and pool architecture.',
}

export default function DocsPage() {
  return (
    <div className="docs-content">
      <div className="section-header">
        <h2>Documentation</h2>
        <p className="section-desc">
          Tokenomics, staking mechanics, governance, and pool architecture for the CHAOS Rails ecosystem.
        </p>
      </div>

      <h2 id="tokenomics">Tokenomics</h2>
      <p>
        <strong>$CHAOS</strong> is the hub token of the CHAOS Rails network. It was launched on Base via{' '}
        <a href={LINKS.flaunch} target="_blank" rel="noopener noreferrer">Flaunch</a> with an 80% creator fee split.
        The creator share goes to the Memestream NFT holder (ID 7432). The community share feeds the{' '}
        <strong>Progressive Bid Wall (PBW)</strong> — autonomous buy-side support that trails price.
      </p>
      <h3>Key Mechanics</h3>
      <ul>
        <li><strong>Progressive Bid Wall (PBW):</strong> Uniswap V4 hook that places a limit buy below market price. Triggers at 0.1 ETH of accumulated community fees. Fully autonomous.</li>
        <li><strong>Internal Swap Pool (ISP):</strong> Converts token-side fees to ETH by intercepting buys. No sell pressure from fee conversion.</li>
        <li><strong>Fee asymmetry:</strong> Both buys and sells generate fees, but fees are only deployed as buy-side support.</li>
      </ul>

      <h3>Supply</h3>
      <p>
        $CHAOS has a fixed supply. Supply reduction comes from staking — tokens locked in the staking hub are removed
        from the trading float, increasing the effectiveness of every wall deployment.
      </p>

      <h2 id="staking">Staking Mechanics</h2>
      <p>
        The CHAOS staking system uses a <strong>hub-and-spoke</strong> architecture. One hub contract, seven gauge (spoke)
        contracts. Stake CHAOS to the hub once, and you automatically earn from all active gauges.
      </p>

      <h3>How It Works</h3>
      <ol>
        <li><strong>Approve</strong> — Allow the staking hub to spend your CHAOS tokens</li>
        <li><strong>Stake</strong> — Deposit CHAOS into the staking hub</li>
        <li><strong>Earn</strong> — Rewards accumulate from all active gauges (no action needed)</li>
        <li><strong>Claim</strong> — <code>getReward()</code> claims all hub + spoke rewards in one transaction</li>
        <li><strong>Exit</strong> — <code>exit()</code> withdraws all staked tokens and claims all rewards</li>
      </ol>

      <h3>Reward Streams</h3>
      <p>
        Each gauge distributes a different token over a <strong>180-day rolling window</strong>. The Foundation
        deposits reward tokens weekly. Each deposit restarts the 180-day countdown for that gauge,
        ensuring continuous distribution.
      </p>

      <h3>Gauges</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-muted)' }}>Week</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-muted)' }}>Token</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-muted)' }}>Pool</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', color: 'var(--text-muted)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {CHAOS_GAUGES.map(g => (
              <tr key={g.symbol} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.5rem' }}>{g.week}</td>
                <td style={{ padding: '0.5rem', fontWeight: 600 }}>{g.symbol}</td>
                <td style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>{g.pool}</td>
                <td style={{ padding: '0.5rem' }}>
                  {g.gaugeAddress === '0x0000000000000000000000000000000000000000'
                    ? <span style={{ color: 'var(--warning)' }}>Pending</span>
                    : <span style={{ color: 'var(--positive)' }}>Deployed</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="governance">Governance</h2>
      <p>
        ChaosTheory uses a <strong>competing multisig</strong> model. The first multisig (abc-alpha Foundation) manages
        the initial 7-pair portfolio. Future multisigs can be deployed by any operator — each competes for CHAOS
        stakers by offering differentiated LP portfolios and risk profiles.
      </p>
      <h3>Foundation Multisig</h3>
      <p>
        <a href={LINKS.multisig} target="_blank" rel="noopener noreferrer">
          {CHAOS_FOUNDATION_MULTISIG}
        </a>
      </p>
      <p>
        The Foundation controls reward token deposits to gauges and manages LP positions across 7 CHAOS pairs.
        All LP positions are visible on-chain via the multisig address.
      </p>

      <h3>$RATCHET Operator Incentives</h3>
      <p>
        100,000,000 $RATCHET per week from a pre-allocated treasury, distributed proportionally to multisigs
        based on $CHAOS staked. Self-staking is allowed — it represents skin in the game.
      </p>

      <h2 id="pool-architecture">Pool Architecture</h2>
      <p>
        Seven CHAOS pairs create 21 potential arbitrage routes. Each pair is a surface where price information
        gets expressed and reconciled through trading activity. The combinatorial scaling formula:
      </p>
      <div className="rails-formula" style={{ marginBottom: '1rem' }}>
        Routes = n(n-1)/2 where n = number of pairs
      </div>
      <ul>
        <li><strong>Stable pair (USDC):</strong> The system&apos;s clock — anchors CHAOS to dollar value</li>
        <li><strong>Ecosystem pairs (ARBME, MLTL):</strong> Bidirectional information flow — each token&apos;s volatility becomes volume for both</li>
        <li><strong>Cross-community pairs (OSO, Cnews, ALPHACLAW, RATCHET):</strong> Expands the topology</li>
      </ul>

      <h2 id="contracts">Contract Addresses</h2>
      <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
        <div className="address-card">
          <div className="address-label">$CHAOS Token</div>
          <a href={LINKS.basescan} target="_blank" rel="noopener noreferrer" className="address-value">{CHAOS_ADDRESS}</a>
        </div>
        <div className="address-card">
          <div className="address-label">Staking Hub</div>
          <a href={LINKS.stakingBasescan} target="_blank" rel="noopener noreferrer" className="address-value">{CHAOS_STAKING_ADDRESS}</a>
        </div>
        <div className="address-card">
          <div className="address-label">Foundation Multisig</div>
          <a href={LINKS.multisig} target="_blank" rel="noopener noreferrer" className="address-value">{CHAOS_FOUNDATION_MULTISIG}</a>
        </div>
        {CHAOS_GAUGES.filter(g => g.gaugeAddress !== '0x0000000000000000000000000000000000000000').map(g => (
          <div key={g.symbol} className="address-card">
            <div className="address-label">{g.symbol} Gauge</div>
            <a href={`https://basescan.org/address/${g.gaugeAddress}`} target="_blank" rel="noopener noreferrer" className="address-value">{g.gaugeAddress}</a>
          </div>
        ))}
      </div>
    </div>
  )
}
