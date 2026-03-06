import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  CHAOSLP_ADDRESS,
  CHAOSLP_STAKING_ADDRESS,
  CHAOSLP_SAFE,
  LINKS,
} from '@/utils/constants'

export const metadata: Metadata = {
  title: 'Chaos Theory — $CHAOSLP',
}

const POOLS = [
  { pair: 'CHAOSLP / ARBME', fee: '3%', role: 'Bridge to ArbMe ecosystem' },
  { pair: 'CHAOSLP / USDC', fee: '3%', role: 'Stable gateway' },
  { pair: 'CHAOSLP / FLAY', fee: '3%', role: 'Flaunch ecosystem' },
]

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <Image src="/chaos-icon.png" alt="ChaosLP" width={96} height={96} style={{ borderRadius: '50%', marginBottom: 'var(--spacing-md)' }} />
        <h1>Chaos<span style={{ color: 'var(--accent)' }}>Theory</span></h1>
        <p className="tagline">
          Home of <strong style={{ color: 'var(--accent)' }}>$CHAOSLP</strong> — high-risk coordination asset for ArbMe. Buy it. Stake it or LP it. Earn from three pools on Base.
        </p>
        <div className="hero-links">
          <Link href="/whitepaper" className="link-pill">Whitepaper</Link>
          <Link href="/docs" className="link-pill">Docs</Link>
          <Link href="/stake" className="link-pill">Stake</Link>
          <a href={LINKS.flaunch} target="_blank" rel="noopener noreferrer" className="link-pill">Trade</a>
          <a href={LINKS.basescan} target="_blank" rel="noopener noreferrer" className="link-pill">Basescan</a>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ marginTop: 'var(--spacing-xl)' }}>
        <div className="section-header">
          <h2>How It Works</h2>
          <p className="section-desc">Two ways to earn with ChaosLP.</p>
        </div>
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Stake</span>
            <span className="stat-value" style={{ fontSize: 'var(--text-sm)' }}>
              Stake ChaosLP to earn CHAOSLP, ARBME, USDC, and FLAY from LP fee revenue. One stake, four reward streams.
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">LP</span>
            <span className="stat-value" style={{ fontSize: 'var(--text-sm)' }}>
              Provide liquidity in any ChaosLP pool to earn trading fees directly. Higher risk, higher reward.
            </span>
          </div>
        </div>
      </section>

      {/* Pools */}
      <section style={{ marginTop: 'var(--spacing-xl)' }}>
        <div className="section-header">
          <h2>Pools</h2>
          <p className="section-desc">Three V4 pools generating fees for stakers.</p>
        </div>
        <div className="tokens-grid">
          {POOLS.map(p => (
            <div key={p.pair} className="token-card">
              <span className="token-symbol">{p.pair}</span>
              <span className="token-role">{p.fee} fee &middot; {p.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contracts */}
      <section style={{ marginTop: 'var(--spacing-xl)' }}>
        <div className="section-header">
          <h2>Contracts</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-sm)' }}>
          <div className="address-card">
            <div className="address-label">$CHAOSLP Token (Base)</div>
            <a href={LINKS.basescan} target="_blank" rel="noopener noreferrer" className="address-value">
              {CHAOSLP_ADDRESS}
            </a>
          </div>
          <div className="address-card">
            <div className="address-label">Staking Hub (4 gauges)</div>
            <a href={LINKS.stakingBasescan} target="_blank" rel="noopener noreferrer" className="address-value">
              {CHAOSLP_STAKING_ADDRESS}
            </a>
          </div>
          <div className="address-card">
            <div className="address-label">ChaosLP Safe (Treasury)</div>
            <a href={LINKS.safe} target="_blank" rel="noopener noreferrer" className="address-value">
              {CHAOSLP_SAFE}
            </a>
          </div>
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
