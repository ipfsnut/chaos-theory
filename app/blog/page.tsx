import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'ChaosTheory announcements and updates.',
}

const POSTS = [
  {
    slug: 'usdc-rewards-live',
    date: '2026-02-22',
    title: 'USDC Rewards Activation',
    excerpt: 'The first USDC gauge is being deployed to the staking hub. CHAOS stakers will begin earning USDC from LP fee revenue across the CHAOS/USDC pair. Rewards stream over 180-day rolling windows.',
    content: `The ChaosTheory Foundation is deploying the USDC gauge contract — the second spoke in the hub-and-spoke staking system.

What this means for stakers:
- Stake $CHAOS once, earn USDC automatically alongside ARBME rewards
- USDC comes from LP trading fees on the CHAOS/USDC pair
- 180-day rolling distribution — the Foundation deposits weekly, extending the stream
- Claim all rewards (CHAOS hub + ARBME gauge + USDC gauge) in a single getReward() call

The CHAOS/USDC pair serves as the "stable anchor" in the pair architecture — it generates baseline arbitrage volume in all market conditions because USDC doesn't move. Every CHAOS price change creates an immediate arb gradient.

This is the second of seven planned gauges. Each new gauge adds a reward token from a different CHAOS pair, building toward the full 7-token reward portfolio.`,
  },
  {
    slug: 'arbme-gauge-live',
    date: '2026-02-15',
    title: 'ARBME Gauge Live — First Spoke Deployed',
    excerpt: 'The ARBME reward gauge is live. CHAOS stakers are now earning ARBME from LP fee revenue on the CHAOS/ARBME pair. First rewards are claimable.',
    content: `The first spoke gauge is live at 0x37547710faE12B4be7458b5E87C3106a85CfD72F.

CHAOS stakers are now earning ARBME tokens from trading activity on the CHAOS/ARBME Uniswap V4 pair. The Foundation deposited the initial ARBME rewards, starting the 180-day distribution window.

How it works:
1. LP fee revenue from CHAOS/ARBME pair flows to the Foundation multisig
2. Foundation deposits reward tokens to the gauge contract
3. Gauge distributes proportionally to all CHAOS stakers over 180 days
4. Stakers claim via the hub's getReward() — one tx claims all rewards

Next up: USDC gauge deployment for the CHAOS/USDC stable pair.`,
  },
  {
    slug: 'staking-hub-deployed',
    date: '2026-02-08',
    title: 'Staking Hub Deployed',
    excerpt: 'The CHAOS staking hub contract is live on Base. Hub-and-spoke architecture supports 7 reward gauges with 180-day rolling streams.',
    content: `The ChaosTheory staking hub is deployed at 0x70e6c917A8AC437E629B67E84C0C0678eD54460d on Base.

Architecture:
- 1 hub contract (stake/withdraw CHAOS, earn base CHAOS rewards)
- 7 spoke gauge contracts (one per CHAOS pair, distributing that pair's reward token)
- Single getReward() call claims from hub + all active spokes

Staking is now live. Connect your wallet and stake CHAOS to start earning.`,
  },
]

export default function BlogPage() {
  return (
    <>
      <div className="section-header">
        <h2>Blog</h2>
        <p className="section-desc">Announcements and updates from the ChaosTheory Foundation.</p>
      </div>

      <div className="blog-list">
        {POSTS.map(post => (
          <article key={post.slug} className="blog-card" id={post.slug}>
            <div className="blog-date">{post.date}</div>
            <h3 className="blog-title">{post.title}</h3>
            <div className="blog-excerpt">{post.excerpt}</div>
            <details style={{ marginTop: 'var(--spacing-md)' }}>
              <summary style={{ cursor: 'pointer', color: 'var(--accent)', fontSize: 'var(--text-sm)' }}>
                Read more
              </summary>
              <div style={{ marginTop: 'var(--spacing-md)', whiteSpace: 'pre-line', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                {post.content}
              </div>
            </details>
          </article>
        ))}
      </div>
    </>
  )
}
