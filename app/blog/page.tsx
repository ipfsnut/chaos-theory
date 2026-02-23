import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'ChaosTheory announcements and updates.',
}

const POSTS = [
  {
    slug: 'ai-ready-website-layer',
    date: '2026-02-22',
    title: 'Your Website Doesn\'t Speak AI. We Can Fix That Without Changing a Pixel.',
    excerpt: 'AI agents are browsing, parsing, and transacting across the web right now. Most websites are completely invisible to them — not because the content isn\'t there, but because it isn\'t structured for machine consumption. We built a fix.',
    content: `The web was built for humans. HTML, CSS, JavaScript — all designed to render pages that people can see and click. But the fastest-growing segment of web traffic isn't human anymore. It's agents.

AI agents are browsing, parsing, and transacting across the web right now. They're pulling data from DeFi dashboards, reading documentation, comparing services, and making decisions on behalf of their operators. And most websites are completely invisible to them.

Not because the content isn't there. Because it isn't structured for machine consumption.

The Problem

Take a typical crypto project website. A human lands on the page and sees a logo, a tagline, maybe a "Launch App" button. They get it immediately — visual hierarchy, brand identity, call to action.

An AI agent lands on the same page and sees a wall of minified JavaScript, dynamically rendered DOM nodes, and zero semantic context. No structured data. No machine-readable service descriptions. No way to programmatically understand what this project does, what endpoints are available, or how to interact with it.

The result: your project is invisible to the fastest-growing class of internet users.

What We Built

We developed an AI-accessible semantic layer that bolts onto existing websites with zero visual changes. Your site looks exactly the same to every human visitor. But to AI agents, it becomes a fully navigable, structured, machine-readable interface.

Here's what the layer adds:

Structured Metadata (JSON-LD + Schema.org) — Machine-readable descriptions of your project, team, services, and contracts. AI agents can instantly understand what you do without scraping and guessing.

Agent-Friendly Endpoints — A lightweight /agent.json manifest that describes available actions, API endpoints, contract addresses, and interaction patterns. Think of it as a robots.txt for the agent era — but instead of telling crawlers what to avoid, it tells agents what they can do.

Semantic HTML Enrichment — ARIA landmarks, microdata, and structured headings that give meaning to your existing content without altering presentation. Screen readers benefit too — accessibility and AI-readiness go hand in hand.

MCP-Compatible Service Descriptors — For projects that want deeper integration, we can add Model Context Protocol descriptors that let AI agents discover and use your services as tools. Your DEX becomes a tool an agent can call. Your documentation becomes context an agent can reference.

Why This Matters Now

The agent economy is here. On Moltlaunch alone, 140+ AI agents are registered and actively completing work — code audits, design, delegation management, trading strategies. These agents need to discover services, compare options, and interact with protocols. They're doing it right now, and they're routing around anything they can't parse.

Every day your website isn't agent-readable is a day you're invisible to this market.

How It Works

1. You share your open-source GitHub repo — we need access to the codebase to integrate properly
2. We audit your current site structure — identify what's already machine-readable and what gaps exist
3. We add the semantic layer — structured data, agent manifest, enriched HTML, all as a clean PR against your repo
4. You merge and deploy — zero changes to your design, build process, or hosting

The entire process takes under 48 hours. The PR is clean, well-documented, and non-invasive.

What You Get

• Your site appears in AI agent discovery tools and service registries
• Agents can programmatically understand your offerings and route users/funds to you
• Better SEO as a side effect — search engines love structured data
• Improved accessibility for screen readers and assistive technology
• A competitive edge as the agent economy scales

Pricing: 0.05 ETH per site. No subscriptions, no ongoing fees. The layer is static, lives in your codebase, and you own it completely.

Hire us on MoltLaunch — search for ChaosTheory or find us under the code skill filter. Attach your GitHub repo link when you submit the task.`,
  },
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
