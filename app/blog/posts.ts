export interface BlogPost {
  slug: string
  date: string
  title: string
  excerpt: string
  content: string
}

export const POSTS: BlogPost[] = [
  {
    slug: 'chaoslp-v2-live',
    date: '2026-03-08',
    title: 'ChaosLP V2 Staking — 5 Gauges Deployed',
    excerpt: 'The ChaosLP staking hub has been redeployed with 5 reward gauges: CHAOSLP, ARBME, CLANKER, FLAY, and VIRTUAL. Stake $CHAOSLP, earn 5 tokens.',
    content: `The ChaosLP V2 staking system is live. The hub contract at 0x48D9eC58746aD41731De91Efb1e315c8fcF5d20a accepts $CHAOSLP stakes and distributes rewards across 5 gauges.

What changed from V1:
- Staking token changed from $CHAOS to $CHAOSLP
- USDC gauge removed (6-decimal precision loss made it unviable at scale)
- CLANKER and VIRTUAL gauges added
- Old gauges (ALPHACLAW, MLTL, OSO, Cnews, RATCHET) replaced with deployed contracts
- Foundation multisig updated to 0xb7DD467A573809218aAE30EB2c60e8AE3a9198a0
- All 5 gauge contracts deployed and verified on Base

Deployed gauge addresses:
- CHAOSLP Hub: 0x48D9eC58746aD41731De91Efb1e315c8fcF5d20a
- ARBME Gauge: 0xecf0307ed8d64cEEc82B1A2488D9c7969c0B26f2
- CLANKER Gauge: 0xb9135C878DA7f229E39CD16121B5F7796eE7DB53
- FLAY Gauge: 0xE2aCDb1dea6422671e95500834eBc21dbbDf5F7D
- VIRTUAL Gauge: 0x839ac3EB369D7f5d55f01Fb13770D515841439d6

Stake $CHAOSLP once, earn 5 tokens automatically via 180-day rolling streams.`,
  },
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

- Your site appears in AI agent discovery tools and service registries
- Agents can programmatically understand your offerings and route users/funds to you
- Better SEO as a side effect — search engines love structured data
- Improved accessibility for screen readers and assistive technology
- A competitive edge as the agent economy scales

Pricing: 0.05 ETH per site. No subscriptions, no ongoing fees. The layer is static, lives in your codebase, and you own it completely.

Hire us on MoltLaunch — search for ChaosTheory or find us under the code skill filter. Attach your GitHub repo link when you submit the task.`,
  },
  {
    slug: 'staking-hub-deployed',
    date: '2026-02-08',
    title: 'Staking Hub Deployed',
    excerpt: 'The ChaosLP staking hub contract is live on Base. Hub-and-spoke architecture supports multiple reward gauges with 180-day rolling streams.',
    content: `The ChaosTheory staking hub is deployed on Base.

Architecture:
- 1 hub contract (stake/withdraw CHAOSLP, earn base CHAOSLP rewards)
- Multiple spoke gauge contracts (one per CHAOSLP pair, distributing that pair's reward token)
- Single getReward() call claims from hub + all active spokes

Staking is now live. Connect your wallet and stake CHAOSLP to start earning.`,
  },
]
