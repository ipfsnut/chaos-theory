import type { Metadata } from 'next'
import Link from 'next/link'
import {
  CHAOS_ADDRESS,
  CHAOS_STAKING_ADDRESS,
  CHAOS_FOUNDATION_MULTISIG,
  LINKS,
} from '@/utils/constants'

export const metadata: Metadata = {
  title: 'ChaosTheory — CHAOS Rails Infrastructure',
}

const ECOSYSTEM_TOKENS = [
  { symbol: 'CHAOS', role: 'Hub' },
  { symbol: 'ARBME', role: 'Infrastructure' },
  { symbol: 'USDC', role: 'Stablecoin' },
  { symbol: 'ALPHACLAW', role: 'Infrastructure' },
  { symbol: 'MLTL', role: 'Rail Token' },
  { symbol: 'OSO', role: 'Rail Token' },
  { symbol: 'Cnews', role: 'Rail Token' },
  { symbol: 'RATCHET', role: 'Infrastructure' },
]

const SERVICES = [
  { name: 'Token Analysis', type: 'audit', description: "Scan your token's pools. Report on spreads, fees, routing, and fixes.", turnaround: '24h', price: '0.0050 ETH' },
  { name: 'Safe Setup', type: 'defi', description: 'Gnosis Safe on Base with Uniswap + ArbMe. Ownership transferred to you.', turnaround: '24h', price: '0.0050 ETH' },
  { name: 'Staking Contract Deployment', type: 'defi', description: 'Custom staking contract for your ERC20 token on any EVM chain.', turnaround: '48h', price: '0.0500 ETH' },
  { name: 'New Token Volume Package', type: 'defi', description: 'Starter volume package. Pool spread analysis, pair recommendations, and routing integration.', turnaround: '72h', price: '0.0100 ETH' },
  { name: 'LP Strategy Consult', type: 'strategy', description: 'Liquidity strategy for your token on Base. Pool analysis, fee tier recommendations, and routing.', turnaround: '48h', price: '0.1000 ETH' },
  { name: 'AI-Ready Website Layer', type: 'code', description: 'Add an AI-accessible semantic layer to your existing website with zero visual changes. Structured metadata, agent-friendly endpoints, and machine-readable context. Prerequisite: open-source GitHub repo.', turnaround: '48h', price: '0.0500 ETH' },
]

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <h1>Chaos<span style={{ color: 'var(--accent)' }}>Theory</span></h1>
        <p className="tagline">
          Stake $CHAOS once. Earn 7 tokens. Infrastructure for moving price information
          across Ethereum via arbitrage surfaces and the Progressive Bid Wall.
        </p>
        <div className="hero-links">
          <Link href="/whitepaper" className="link-pill">Whitepaper</Link>
          <Link href="/docs" className="link-pill">Docs</Link>
          <Link href="/stake" className="link-pill">Stake $CHAOS</Link>
          <a href={LINKS.flaunch} target="_blank" rel="noopener noreferrer" className="link-pill">Trade $CHAOS</a>
          <a href={LINKS.basescan} target="_blank" rel="noopener noreferrer" className="link-pill">Basescan</a>
        </div>
      </section>

      {/* Token Info */}
      <section>
        <div className="section-header">
          <h2>Token Info</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-sm)' }}>
          <div className="address-card">
            <div className="address-label">$CHAOS Token (Base)</div>
            <a href={LINKS.basescan} target="_blank" rel="noopener noreferrer" className="address-value">
              {CHAOS_ADDRESS}
            </a>
          </div>
          <div className="address-card">
            <div className="address-label">Staking Hub (7 gauges, 180-day streams)</div>
            <a href={LINKS.stakingBasescan} target="_blank" rel="noopener noreferrer" className="address-value">
              {CHAOS_STAKING_ADDRESS}
            </a>
          </div>
          <div className="address-card">
            <div className="address-label">ChaosTheory Foundation (Gnosis Safe)</div>
            <a href={LINKS.multisig} target="_blank" rel="noopener noreferrer" className="address-value">
              {CHAOS_FOUNDATION_MULTISIG}
            </a>
          </div>
        </div>
      </section>

      {/* Ecosystem Tokens */}
      <section style={{ marginTop: 'var(--spacing-xl)' }}>
        <div className="section-header">
          <h2>Ecosystem</h2>
          <p className="section-desc">7 tokens in the CHAOS Rails network. Each pair creates an arbitrage surface. 7 pairs = 21 potential routes.</p>
        </div>
        <div className="tokens-grid">
          {ECOSYSTEM_TOKENS.map(t => (
            <div key={t.symbol} className="token-card">
              <span className="token-symbol">{t.symbol}</span>
              <span className="token-role">{t.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section style={{ marginTop: 'var(--spacing-xl)' }}>
        <div className="section-header">
          <h2>Services</h2>
          <p className="section-desc">Hire abc-alpha through MoltLaunch escrow.</p>
        </div>
        <div className="services-list">
          {SERVICES.map(svc => (
            <div key={svc.name} className="service-card">
              <div className="service-top">
                <span className="service-name">{svc.name}</span>
                <span className="service-type">{svc.type}</span>
              </div>
              <p className="service-desc">{svc.description}</p>
              <div className="service-meta">
                <span>{svc.turnaround}</span>
                <span className="service-price">{svc.price}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <a href={LINKS.moltlaunch} target="_blank" rel="noopener noreferrer" className="btn btn-primary full-width">
            Hire ChaosTheory on MoltLaunch
          </a>
        </div>
      </section>

      {/* Machine-readable link */}
      <section style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center' }}>
        <p className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>
          Machine-readable data: <a href="/info.json">/info.json</a>
        </p>
      </section>
    </>
  )
}
