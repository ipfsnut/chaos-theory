'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { LINKS } from '@/utils/constants'

interface Section {
  id: string
  label: string
  indent?: boolean
}

const SECTIONS: Section[] = [
  { id: 'abstract', label: 'Abstract' },
  { id: 'section-1', label: '1. The Problem' },
  { id: 'section-2', label: '2. Architecture' },
  { id: 'section-2-1', label: '2.1 Routing Layer', indent: true },
  { id: 'section-2-2', label: '2.2 Three Pools', indent: true },
  { id: 'section-3', label: '3. Token Launch' },
  { id: 'section-4', label: '4. Staking' },
  { id: 'section-4-1', label: '4.1 Hub and Spokes', indent: true },
  { id: 'section-4-2', label: '4.2 Fee-Funded Gauges', indent: true },
  { id: 'section-5', label: '5. ArbMe Integration' },
  { id: 'section-6', label: '6. Progressive Bid Wall' },
  { id: 'section-7', label: '7. Contracts' },
  { id: 'section-8', label: '8. Roadmap' },
]

export default function WhitepaperPage() {
  const [activeId, setActiveId] = useState('abstract')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const headings = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    if (headings.length === 0) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          const top = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          )
          setActiveId(top.target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    headings.forEach(h => observerRef.current!.observe(h))
    return () => observerRef.current?.disconnect()
  }, [])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
      setMobileNavOpen(false)
    }
  }, [])

  const activeLabel = SECTIONS.find(s => s.id === activeId)?.label || 'Abstract'

  return (
    <>
      {/* Hero */}
      <div className="rails-hero">
        <h1 className="rails-title">Chaos Theory</h1>
        <p className="rails-subtitle">$CHAOSLP Whitepaper v1.0</p>
        <p className="rails-byline">Built by abc-alpha &middot; March 2026</p>
        <div className="rails-hero-links">
          <Link href="/stake" className="link-pill">Stake</Link>
          <a href={LINKS.flaunch} target="_blank" rel="noopener noreferrer" className="link-pill">Trade</a>
          <a href={LINKS.arbme} target="_blank" rel="noopener noreferrer" className="link-pill">ArbMe</a>
          <a href={LINKS.warpcast} target="_blank" rel="noopener noreferrer" className="link-pill">@abc-alpha</a>
        </div>
      </div>

      {/* Mobile sticky nav */}
      <div className="rails-mobile-nav">
        <button className="rails-mobile-nav-btn" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
          <span className="rails-mobile-nav-label">{activeLabel}</span>
          <span className={`rails-mobile-nav-arrow ${mobileNavOpen ? 'open' : ''}`}>&#9662;</span>
        </button>
        {mobileNavOpen && (
          <div className="rails-mobile-nav-dropdown">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                className={`rails-mobile-nav-item ${s.indent ? 'indent' : ''} ${activeId === s.id ? 'active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Layout: sidebar + content */}
      <div className="rails-layout">
        <nav className="rails-sidebar">
          <div className="rails-sidebar-inner">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                className={`rails-nav-item ${s.indent ? 'indent' : ''} ${activeId === s.id ? 'active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        <main className="rails-content">

          {/* Abstract */}
          <section id="abstract" className="rails-section">
            <h2 className="rails-h2">Abstract</h2>
            <div className="rails-abstract">
              <p>
                ChaosLP is a coordination asset on Base built around one idea: <strong>hold chaos, and when the market
                gets turbulent, swap into hot assets at a discount.</strong> It pairs against ARBME, USDC, and FLAY —
                three pools that generate fees during volatility. When everything else is dumping or pumping,
                ChaosLP holders are positioned to move.
              </p>
              <p>
                Three ways to play: hold ChaosLP and swap into opportunities during turbulence, stake it to earn
                from all three pools&apos; fee revenue, or provide liquidity directly for trading fee exposure.
                The Progressive Bid Wall creates a rising price floor underneath it all.
              </p>
            </div>
          </section>

          {/* 1. The Problem */}
          <section id="section-1" className="rails-section">
            <h2 className="rails-h2">1. The Problem</h2>
            <p>
              Market chaos creates opportunity — but only if you&apos;re already positioned. When a hot token
              pumps or a degen play dumps, you need liquid assets ready to swap. Most people hold stables
              and miss the window, or hold volatile tokens and can&apos;t exit fast enough.
            </p>
            <p>
              ChaosLP is designed for this moment. Hold it during calm periods, earn staking fees while you
              wait. When turbulence hits, swap ChaosLP into whatever&apos;s moving — ARBME, USDC, FLAY, or
              anything routed through the ArbMe ecosystem. The three pools give you exits into different
              asset classes instantly.
            </p>
            <p>
              The more volatile the market gets, the more fees the pools generate, and the more ChaosLP
              stakers earn. Chaos isn&apos;t the enemy — it&apos;s the product.
            </p>
          </section>

          {/* 2. Architecture */}
          <section id="section-2" className="rails-section">
            <h2 className="rails-h2">2. Architecture</h2>

            <h3 id="section-2-1" className="rails-h3">2.1 Routing Layer</h3>
            <p>
              ChaosLP sits between degen tokens and stable assets. The routing path is:
            </p>
            <div className="rails-formula">
              Degen Token &rarr; CHAOSLP &rarr; ARBME &rarr; USDC / WETH
            </div>
            <p>
              ChaosLP absorbs the volatility from the left side of this chain. ARBME stays relatively stable
              because it only touches ChaosLP, not the degen tokens directly. The volatility gets contained
              in the ChaosLP layer, and the fees generated from that volatility fund staking rewards.
            </p>

            <h3 id="section-2-2" className="rails-h3">2.2 Three Pools</h3>
            <p>Three Uniswap V4 pools, each serving a different role:</p>
            <div className="rails-address-grid">
              <div className="address-card">
                <div className="address-label">CHAOSLP / ARBME (3% fee)</div>
                <span className="address-value" style={{ cursor: 'default', color: 'var(--text-secondary)' }}>
                  Bridge pool. Connects ChaosLP to the ArbMe ecosystem. High fee tier captures value from volatile routing.
                </span>
              </div>
              <div className="address-card">
                <div className="address-label">CHAOSLP / USDC (3% fee)</div>
                <span className="address-value" style={{ cursor: 'default', color: 'var(--text-secondary)' }}>
                  Gateway pool. Stable anchor for direct ChaosLP &harr; dollar conversion. High fee captures volatility value.
                </span>
              </div>
              <div className="address-card">
                <div className="address-label">CHAOSLP / FLAY (3% fee)</div>
                <span className="address-value" style={{ cursor: 'default', color: 'var(--text-secondary)' }}>
                  Ecosystem pool. Connects ChaosLP to the Flaunch ecosystem. Cross-pollination between platforms.
                </span>
              </div>
            </div>
            <p>
              All three pools are full-range V4 positions held by the ChaosLP Safe. Fees accrue to the Safe
              and are distributed to staking gauges weekly.
            </p>
          </section>

          {/* 3. Token Launch */}
          <section id="section-3" className="rails-section">
            <h2 className="rails-h2">3. Token Launch</h2>
            <p>
              ChaosLP launches on <a href="https://flaunch.gg" target="_blank" rel="noopener noreferrer">Flaunch</a> with
              a premine. The premine provides initial liquidity for all three pools. Flaunch handles the native
              CHAOSLP/flETH pool with its built-in hooks.
            </p>
            <p>
              Initial market cap: $1,000. The token is designed to start small and grow through fee accumulation
              and the Progressive Bid Wall, not through hype.
            </p>
            <p>
              80% of Flaunch trading fees go to the ChaosLP Safe (creator fee). 20% goes to the community
              share, which funds the Progressive Bid Wall.
            </p>
          </section>

          {/* 4. Staking */}
          <section id="section-4" className="rails-section">
            <h2 className="rails-h2">4. Staking</h2>

            <h3 id="section-4-1" className="rails-h3">4.1 Hub and Spokes</h3>
            <p>
              ChaosLP uses a hub-and-spoke staking architecture. Stake ChaosLP once to the hub. Earn from
              all active gauges automatically.
            </p>
            <p>Four gauges, four reward tokens:</p>
            <ul>
              <li><strong>CHAOSLP</strong> &mdash; Hub base reward</li>
              <li><strong>ARBME</strong> &mdash; From CHAOSLP/ARBME pool fees</li>
              <li><strong>USDC</strong> &mdash; From CHAOSLP/USDC pool fees</li>
              <li><strong>FLAY</strong> &mdash; From CHAOSLP/FLAY pool fees</li>
            </ul>
            <p>
              One <code>getReward()</code> call claims all four tokens. One <code>exit()</code> withdraws
              everything and claims all rewards.
            </p>

            <h3 id="section-4-2" className="rails-h3">4.2 Fee-Funded Gauges</h3>
            <p>
              Every gauge is funded by real LP fee revenue. No emissions, no inflation, no token printing.
              The Safe collects fees from its LP positions weekly, then deposits them to the corresponding gauge.
              Each deposit starts or extends a 180-day distribution window.
            </p>
            <p>
              Staking reduces the ChaosLP float. Less float means less sell pressure, which means the
              Progressive Bid Wall is more effective. Stakers earn fees AND strengthen the floor.
            </p>
          </section>

          {/* 5. ArbMe Integration */}
          <section id="section-5" className="rails-section">
            <h2 className="rails-h2">5. ArbMe Integration</h2>
            <p>
              ArbMe is a DeFi hub on Base for managing pools, positions, and trading. ChaosLP is registered
              as a tradeable token in ArbMe, with all three pools visible in the interface.
            </p>
            <p>
              Degen tokens that pair against ChaosLP get automatic routing through ArbMe&apos;s infrastructure.
              The more tokens that choose ChaosLP as a pair asset, the more volume flows through, and the
              more fees stakers earn.
            </p>
          </section>

          {/* 6. Progressive Bid Wall */}
          <section id="section-6" className="rails-section">
            <h2 className="rails-h2">6. Progressive Bid Wall</h2>
            <p>
              ChaosLP launches on Flaunch, which provides a built-in Progressive Bid Wall (PBW) on the native
              CHAOSLP/flETH pool. The PBW is a Uniswap V4 hook that:
            </p>
            <ul>
              <li>Places a limit buy order just below the current market price</li>
              <li>Repositions upward as price rises</li>
              <li>Triggers every time 0.1 ETH of community fees accumulate</li>
              <li>Converts token-side fees to ETH via the Internal Swap Pool (no sell pressure)</li>
            </ul>
            <p>
              The PBW creates a rising floor. During consolidation, the wall thickens. During pumps, it trails
              upward. During dumps, it absorbs sell pressure. Over time, the floor ratchets up as long as
              volume sustains fee accumulation.
            </p>
            <p>
              ChaosLP staking amplifies the PBW effect: staked tokens are removed from the trading float,
              meaning any given wall deployment absorbs a larger percentage of potential sell pressure.
            </p>
          </section>

          {/* 7. Contracts */}
          <section id="section-7" className="rails-section">
            <h2 className="rails-h2">7. Contracts</h2>
            <div className="rails-address-grid">
              <div className="address-card">
                <div className="address-label">$CHAOSLP Token (Base)</div>
                <a href={LINKS.basescan} target="_blank" rel="noopener noreferrer" className="address-value">
                  TODO_CHAOSLP_TOKEN_ADDRESS
                </a>
              </div>
              <div className="address-card">
                <div className="address-label">Staking Hub (4 gauges, 180-day streams)</div>
                <a href={LINKS.stakingBasescan} target="_blank" rel="noopener noreferrer" className="address-value">
                  TODO_STAKING_HUB_ADDRESS
                </a>
              </div>
              <div className="address-card">
                <div className="address-label">ChaosLP Safe (Treasury, LP positions)</div>
                <a href={LINKS.safe} target="_blank" rel="noopener noreferrer" className="address-value">
                  0xb7DD467A573809218aAE30EB2c60e8AE3a9198a0
                </a>
              </div>
              <div className="address-card">
                <div className="address-label">Flaunch (PBW + ISP hooks)</div>
                <span className="address-value" style={{ cursor: 'default', color: 'var(--text-secondary)' }}>
                  Native CHAOSLP/flETH pool via Flaunch
                </span>
              </div>
            </div>
          </section>

          {/* 8. Roadmap */}
          <section id="section-8" className="rails-section">
            <h2 className="rails-h2">8. Roadmap</h2>
            <p><strong>Launch.</strong> Deploy Safe, launch ChaosLP on Flaunch, create three pools, deploy staking hub + gauges.</p>
            <p><strong>Seed.</strong> Fund initial LP positions and first gauge deposits. Staking goes live.</p>
            <p><strong>Grow.</strong> Onboard degen tokens as ChaosLP pairs. Each new pair adds volume, fees, and staking rewards.</p>
            <p><strong>Automate.</strong> Weekly fee collection and gauge distribution via cron. No manual intervention needed.</p>

            <div className="rails-links-grid">
              <Link href="/stake" className="rails-link-card">
                <span className="rails-link-label">Stake ChaosLP</span>
                <span className="rails-link-url">chaos-theory.epicdylan.com/stake</span>
              </Link>
              <a href={LINKS.flaunch} target="_blank" rel="noopener noreferrer" className="rails-link-card">
                <span className="rails-link-label">Trade ChaosLP</span>
                <span className="rails-link-url">flaunch.gg</span>
              </a>
              <a href={LINKS.arbme} target="_blank" rel="noopener noreferrer" className="rails-link-card">
                <span className="rails-link-label">ArbMe</span>
                <span className="rails-link-url">arbme.epicdylan.com</span>
              </a>
              <a href={LINKS.safe} target="_blank" rel="noopener noreferrer" className="rails-link-card">
                <span className="rails-link-label">ChaosLP Safe</span>
                <span className="rails-link-url">safe.global</span>
              </a>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
