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
  { id: 'section-1', label: '1. Information on the Boundary' },
  { id: 'section-2', label: '2. Degrees of Freedom' },
  { id: 'section-2-1', label: '2.1 Constants', indent: true },
  { id: 'section-2-2', label: '2.2 Controls', indent: true },
  { id: 'section-2-3', label: '2.3 Emergents', indent: true },
  { id: 'section-3', label: '3. The Math' },
  { id: 'section-3-1', label: '3.1 In Practice', indent: true },
  { id: 'section-3-2', label: '3.2 The Ratchet', indent: true },
  { id: 'section-4', label: '4. Pair Architecture' },
  { id: 'section-5', label: '5. Staking' },
  { id: 'section-6', label: '6. The Flywheel' },
  { id: 'section-7', label: '7. Infrastructure' },
]

const CLAUDE_PROMPT = `Read the $CHAOSLP Rails whitepaper at https://chaos-theory.epicdylan.com/whitepaper and help me understand it. I may ask about specific sections, the math, or how the system works.`

export default function WhitepaperPage() {
  const [activeId, setActiveId] = useState('abstract')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [copyToast, setCopyToast] = useState(false)
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

  const handleOpenInClaude = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CLAUDE_PROMPT)
      setCopyToast(true)
      setTimeout(() => setCopyToast(false), 4000)
      window.open('https://claude.ai/new', '_blank')
    } catch {
      window.open('https://claude.ai/new', '_blank')
    }
  }, [])

  const activeLabel = SECTIONS.find(s => s.id === activeId)?.label || 'Abstract'

  return (
    <>
      {/* Hero */}
      <div className="rails-hero">
        <h1 className="rails-title">$CHAOSLP Rails</h1>
        <p className="rails-subtitle">Whitepaper v4.1</p>
        <p className="rails-byline">Built by abc-alpha &middot; March 2026</p>
        <div className="rails-hero-links">
          <Link href="/stake" className="link-pill">Stake $CHAOSLP</Link>
          <a href={LINKS.flaunch} target="_blank" rel="noopener noreferrer" className="link-pill">Trade $CHAOSLP</a>
          <a href={LINKS.agentDocs} target="_blank" rel="noopener noreferrer" className="link-pill">Agent Docs</a>
          <a href={LINKS.warpcast} target="_blank" rel="noopener noreferrer" className="link-pill">@abc-alpha</a>
          <button onClick={handleOpenInClaude} className="link-pill rails-claude-btn">
            Discuss with Claude
          </button>
        </div>
        {copyToast && (
          <div className="rails-toast">
            Prompt copied — paste into Claude to discuss the whitepaper
          </div>
        )}
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
                Buy $CHAOSLP. Stake it. Earn tokens.
              </p>
              <p>
                A DAO multisig manages LP positions across five trading pairs on Base. When markets move,
                arbitrage bots trade across those pairs and generate fees. Those fees get distributed to
                stakers as six different tokens on 180-day rolling streams.
              </p>
              <p>
                Staking also removes $CHAOSLP from circulation, which makes Flaunch&apos;s built-in
                Progressive Bid Wall more effective &mdash; less supply floating means less sell pressure
                for the wall to absorb.
              </p>
              <p>
                This paper describes how the mechanics work.
              </p>
            </div>
          </section>

          {/* 1. Information on the Boundary */}
          <section id="section-1" className="rails-section">
            <h2 className="rails-h2">1. Information on the Boundary</h2>
            <p>
              Ethereum is an information processing network. Tokens are its native unit of account, but the real
              substrate is information &mdash; price signals, liquidity depth, fee flows, arbitrage gradients. Every
              swap is a statement about relative value. Every arbitrage correction is the network resolving a
              disagreement between two sources of price information.
            </p>
            <p>
              $CHAOSLP Rails sits on what can be thought of as Ethereum&apos;s Markov blanket &mdash; the boundary layer
              where internal state meets external observation. The system doesn&apos;t generate information. It creates
              surfaces where existing information (price movements in ETH, USDC, ecosystem tokens) gets expressed,
              compared, and reconciled through trading activity. The value captured is a function of how much
              information flows across those surfaces.
            </p>
            <p>
              A single $CHAOSLP trading pair is a single surface. It can only express the relationship between CHAOSLP
              and one other token. Add a second pair and you&apos;ve created an arbitrage gradient &mdash; any time those
              two surfaces disagree about the price of CHAOSLP, information needs to flow between them to resolve the
              disagreement. That flow is a trade. That trade generates fees. Those fees become buy-side support.
            </p>
            <p>
              Five pairs create ten potential arbitrage gradients. Each new pair added doesn&apos;t just add one
              surface &mdash; it adds connections to every existing surface. The information flow scales combinatorially
              with the number of pairs.
            </p>
          </section>

          {/* 2. Degrees of Freedom */}
          <section id="section-2" className="rails-section">
            <h2 className="rails-h2">2. Degrees of Freedom</h2>
            <p>The system has three categories of variables: constants, controls, and emergents.</p>

            <h3 id="section-2-1" className="rails-h3">2.1 Constants (Protocol-Fixed)</h3>
            <p>
              These are set by Flaunch, Uniswap V4, and the $CHAOSLP token creation parameters. Nobody can change them.
            </p>
            <p>
              The <strong>Progressive Bid Wall (PBW)</strong> trails price. It places a limit buy order just below the
              current market price and repositions upward if price rises. It does not leave support at old price levels.
              It follows. This is a Uniswap V4 hook that executes autonomously on every swap.
            </p>
            <p>
              The PBW triggers at <strong>0.1 ETH</strong>. Each time the community&apos;s share of accumulated swap fees
              reaches 0.1 ETH, a new wall deployment occurs. The threshold is fixed.
            </p>
            <p>
              The <strong>Internal Swap Pool (ISP)</strong> converts token-side fees to ETH. Swap fees come in as both
              ETH and CHAOSLP. The ISP intercepts incoming buy orders and fills them with accumulated CHAOSLP fee tokens
              before they reach the pool. This converts fee revenue to ETH without sell pressure. It is automatic.
            </p>
            <p>
              The dev/community fee split is immutable. Set at token creation. The dev share goes to the Memestream NFT
              holder. The community share goes to the PBW. The ratio cannot be changed.
            </p>
            <p>
              Fee generation is symmetric. Both buys and sells generate fees. This is a property of the Uniswap V4
              pool, not a design choice.
            </p>
            <p>
              <strong>Fee deployment is asymmetric.</strong> Fees are only deployed as buy-side support.
            </p>

            <h3 id="section-2-2" className="rails-h3">2.2 Controls (Participant-Adjustable)</h3>
            <p>
              These are the variables that the DAO and participants can influence.
            </p>
            <p>
              <strong>Volume.</strong> The rate of swap activity across $CHAOSLP pairs. The DAO controls this by
              choosing which pairs to create, at what fee tiers, with what liquidity depth. More pairs with
              well-chosen counterpart tokens produce more arbitrage gradients and therefore more volume.
            </p>
            <p>
              <strong>Time at price.</strong> How long $CHAOSLP trades at a stable level before a shock moves it. Nobody
              directly controls price stability, but staking design and pair selection indirectly influence it. Pairs
              against stable assets (USDC) dampen volatility. Staking incentives discourage speculative churn. The
              architecture optimizes for extended consolidation.
            </p>
            <p>
              <strong>Circulating supply.</strong> The amount of $CHAOSLP available for active trading. When people
              stake, they remove supply from the float. Less circulating supply means any given wall deployment
              absorbs a larger percentage of potential sell pressure.
            </p>

            <h3 id="section-2-3" className="rails-h3">2.3 Emergents (Nobody Controls)</h3>
            <p>These arise from the interaction of constants and controls with market conditions.</p>
            <p>
              <strong>Wall thickness.</strong> The density of buy-side support at any given price level. This is a
              function of volume &times; time at price. Nobody can set it directly. It accumulates during
              consolidation and gets consumed during shocks.
            </p>
            <p>
              <strong>Floor price.</strong> Where the wall actually catches a sell-off. Depends on wall thickness at
              the moment of the shock relative to the magnitude of selling pressure. Not predictable, not
              controllable, only influenceable through the three control variables.
            </p>
            <p>
              <strong>Arb bot participation.</strong> Whether bots discover and trade the pairs. Influenced by spread
              width, liquidity depth, fee tiers, and data accessibility, but ultimately a market decision.
            </p>
            <p>
              <strong>ETH correlation.</strong> $CHAOSLP is priced in ETH. When ETH moves, everything moves. The wall
              can buffer this, but only proportional to its accumulated thickness.
            </p>
          </section>

          {/* 3. The Math */}
          <section id="section-3" className="rails-section">
            <h2 className="rails-h2">3. The Math</h2>
            <p>Given the degrees of freedom, the system reduces to a simple relationship:</p>
            <div className="rails-formula">
              Wall thickness at any price level = f(fee rate &times; volume &times; time at price)
            </div>
            <p>
              Where fee rate is fixed, volume is controlled by pair architecture, and time at price is influenced by
              supply dynamics and pair stability.
            </p>
            <p>The wall&apos;s defensive capacity at the moment of a shock is:</p>
            <div className="rails-formula">
              Shock absorption = wall thickness / (sell pressure &times; circulating supply)
            </div>
            <p>
              Staking reduces circulating supply, which increases shock absorption for any given wall thickness. More
              pairs increase volume, which increases wall thickness for any given time period. Stable counterpart
              pairs increase expected time at price, which increases wall thickness for any given volume level.
            </p>
            <p>
              Every design decision in the system &mdash; pair selection, fee tiers, staking incentives, RATCHET
              emissions, liquidity concentration &mdash; maps to one of these three terms.
            </p>

            <h3 id="section-3-1" className="rails-h3">3.1 What This Means in Practice</h3>
            <p>
              <strong>During consolidation:</strong> Volume generates fees. Fees trigger wall deployments. All
              deployments land at roughly the same price level. Wall thickness grows linearly with time (assuming
              constant volume). This is the productive regime.
            </p>
            <p>
              <strong>During a pump:</strong> The wall trails price upward. It&apos;s all concentrated near the top, but
              it&apos;s thin &mdash; there hasn&apos;t been enough time at any single level to accumulate meaningful depth.
            </p>
            <p>
              <strong>During a dump:</strong> Sellers hit the concentrated wall near the current price. If wall
              thickness &gt; sell pressure &times; circulating supply, price holds. If not, the wall is consumed and
              price falls until selling exhausts itself or hits the next equilibrium.
            </p>
            <p>
              <strong>After a dump:</strong> Consolidation begins at the new level. Wall building restarts from zero
              at that price. The ratchet only tightens if the pre-shock wall was thick enough to catch the fall above
              the previous consolidation level.
            </p>

            <h3 id="section-3-2" className="rails-h3">3.2 The Ratchet Is Conditional</h3>
            <p>
              The ratchet effect is real but it is not guaranteed. It is a probabilistic outcome that depends on the
              ratio of consolidation time to shock magnitude. Over many cycles, if the system maintains high arb
              volume during consolidation periods, the expected value of each cycle is positive &mdash; the floor
              trends upward. But any individual cycle can reset the floor if the shock exceeds the wall&apos;s capacity.
            </p>
            <p>
              The architecture doesn&apos;t promise a ratchet. It maximizes the probability of one by maximizing the
              rate of wall accumulation during the periods that matter.
            </p>
          </section>

          {/* 4. Pair Architecture */}
          <section id="section-4" className="rails-section">
            <h2 className="rails-h2">4. Pair Architecture as Information Topology</h2>
            <p>
              The choice of which tokens to pair against $CHAOSLP is not a financial decision. It is a decision about
              information topology &mdash; which price signals should flow through the $CHAOSLP network.
            </p>
            <h4 className="rails-h4">Stable Pairs (USDC)</h4>
            <p>
              A CHAOSLP/USDC pair creates an anchor. USDC doesn&apos;t move, so any price movement in CHAOSLP creates an
              immediate arb gradient against the USDC pair. This generates baseline volume that persists in all
              market conditions. The USDC pair is the system&apos;s clock.
            </p>
            <h4 className="rails-h4">Ecosystem Pairs (ARBME, FLAY, VIRTUAL)</h4>
            <p>
              Pairs against other ecosystem tokens create bidirectional information flow. Each token&apos;s volatility
              becomes a volume source for both. These pairs are cooperation agreements &mdash; two economies
              choosing to share fee-generating surface area.
            </p>
            <h4 className="rails-h4">Combinatorial Scaling</h4>
            <p>
              With <em>n</em> pairs, the number of potential two-hop arbitrage routes is{' '}
              <span className="rails-math">n(n-1)/2</span>. Five pairs create 10 potential routes. Adding a sixth
              pair doesn&apos;t add 1 surface &mdash; it adds 5 new routes.
            </p>
          </section>

          {/* 5. Staking */}
          <section id="section-5" className="rails-section">
            <h2 className="rails-h2">5. Staking</h2>
            <p>
              A DAO multisig manages LP positions paired against $CHAOSLP. Stakers deposit $CHAOSLP to the
              staking hub and earn rewards from those positions.
            </p>
            <h4 className="rails-h4">How It Works</h4>
            <p>
              The hub pays $CHAOSLP from fee buybacks. Each LP pair also has its own gauge that pays the
              paired token &mdash; so stakers passively accumulate ARBME, CLANKER, FLAY, VIRTUAL, and VENDYZ
              alongside their CHAOSLP rewards. All gauges run simultaneously with 180-day rolling streams.
            </p>
            <h4 className="rails-h4">Current Gauges</h4>
            <div className="rails-address-grid">
              <div className="address-card">
                <div className="address-label">Hub Reward</div>
                <span className="address-value" style={{ cursor: 'default', color: 'var(--text-secondary)' }}>CHAOSLP</span>
              </div>
              <div className="address-card">
                <div className="address-label">CHAOSLP / ARBME</div>
                <span className="address-value" style={{ cursor: 'default', color: 'var(--text-secondary)' }}>ARBME</span>
              </div>
              <div className="address-card">
                <div className="address-label">CHAOSLP / FLAY</div>
                <span className="address-value" style={{ cursor: 'default', color: 'var(--text-secondary)' }}>FLAY</span>
              </div>
              <div className="address-card">
                <div className="address-label">CHAOSLP / CLANKER</div>
                <span className="address-value" style={{ cursor: 'default', color: 'var(--text-secondary)' }}>CLANKER</span>
              </div>
              <div className="address-card">
                <div className="address-label">CHAOSLP / VIRTUAL</div>
                <span className="address-value" style={{ cursor: 'default', color: 'var(--text-secondary)' }}>VIRTUAL</span>
              </div>
              <div className="address-card">
                <div className="address-label">CHAOSLP / VENDYZ</div>
                <span className="address-value" style={{ cursor: 'default', color: 'var(--text-secondary)' }}>VENDYZ</span>
              </div>
            </div>
          </section>

          {/* 6. The Flywheel */}
          <section id="section-6" className="rails-section">
            <h2 className="rails-h2">6. The Flywheel</h2>
            <p>
              More surfaces create more information gradients. More gradients generate more volume. More volume
              generates more fees. More fees build walls during consolidation. Walls buffer shocks. Buffered shocks
              mean consolidation restarts at higher levels. Staking locks up supply, making walls go further.
            </p>
            <p>
              That&apos;s the loop. Whether it compounds depends on sustained volume during consolidation periods.
            </p>
          </section>

          {/* 7. Infrastructure */}
          <section id="section-7" className="rails-section">
            <h2 className="rails-h2">7. Infrastructure</h2>
            <div className="rails-address-grid">
              <div className="address-card">
                <div className="address-label">Rails Multisig (Gnosis Safe, Base)</div>
                <a href={LINKS.multisig} target="_blank" rel="noopener noreferrer" className="address-value">
                  0xb7DD467A573809218aAE30EB2c60e8AE3a9198a0
                </a>
              </div>
              <div className="address-card">
                <div className="address-label">ChaosLP Staking Hub (5 reward gauges, 180-day streams)</div>
                <a href={LINKS.stakingBasescan} target="_blank" rel="noopener noreferrer" className="address-value">
                  0x48D9eC58746aD41731De91Efb1e315c8fcF5d20a
                </a>
              </div>
              <div className="address-card">
                <div className="address-label">$CHAOSLP (Base, 80% creator fee)</div>
                <a href={LINKS.basescan} target="_blank" rel="noopener noreferrer" className="address-value">
                  0x8454d062506a27675706148ecdd194e45e44067a
                </a>
              </div>
              <div className="address-card">
                <div className="address-label">Flaunch Integration (PBW + ISP hooks)</div>
                <span className="address-value" style={{ cursor: 'default', color: 'var(--text-secondary)' }}>
                  Pool ID: 0x516af52d...
                </span>
              </div>
            </div>
          </section>

          {/* Links */}
          <section className="rails-section">
            <div className="rails-links-grid">
              <Link href="/stake" className="rails-link-card">
                <span className="rails-link-label">Stake $CHAOSLP</span>
                <span className="rails-link-url">chaos-theory.epicdylan.com/stake</span>
              </Link>
              <a href={LINKS.flaunch} target="_blank" rel="noopener noreferrer" className="rails-link-card">
                <span className="rails-link-label">Trade $CHAOSLP</span>
                <span className="rails-link-url">flaunch.gg</span>
              </a>
              <a href={LINKS.multisig} target="_blank" rel="noopener noreferrer" className="rails-link-card">
                <span className="rails-link-label">Rails Multisig</span>
                <span className="rails-link-url">0xb7DD...8a0</span>
              </a>
              <a href={LINKS.stakingBasescan} target="_blank" rel="noopener noreferrer" className="rails-link-card">
                <span className="rails-link-label">ChaosLP Staking Hub</span>
                <span className="rails-link-url">0x48D9...20a</span>
              </a>
              <a href={LINKS.arbme} target="_blank" rel="noopener noreferrer" className="rails-link-card">
                <span className="rails-link-label">ArbMe</span>
                <span className="rails-link-url">arbme.epicdylan.com</span>
              </a>
              <a href="https://warpcast.com/chaostheory0506" target="_blank" rel="noopener noreferrer" className="rails-link-card">
                <span className="rails-link-label">Warpcast</span>
                <span className="rails-link-url">@chaostheory0506</span>
              </a>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
