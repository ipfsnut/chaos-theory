export interface BlogPost {
  slug: string
  date: string
  title: string
  excerpt: string
  content: string
}

export const POSTS: BlogPost[] = [
  {
    slug: 'chaoslp-staking-live-with-apr',
    date: '2026-03-08',
    title: 'ChaosLP Staking Is Live — 4 Gauges Streaming, APR Tracking, Dual-Site Architecture',
    excerpt: 'ChaosLP V2 staking is fully operational. Four reward gauges are actively streaming CHAOSLP, ARBME, CLANKER, and FLAY to stakers. Real-time APR is now visible across both the ArbMe advanced page and chaos-theory.epicdylan.com.',
    content: `ChaosLP V2 staking is fully operational on Base.

Four out of five reward gauges are actively streaming tokens to $CHAOSLP stakers right now. The VIRTUAL gauge is deployed and will go live once notified.

What's Live

The staking hub at 0x48D9eC58746aD41731De91Efb1e315c8fcF5d20a accepts $CHAOSLP stakes. Every staker earns from all active gauges simultaneously — no choosing, no rotating. One stake, multiple reward streams.

Active gauges:
- CHAOSLP (hub reward) — base yield paid in the staking token itself
- ARBME — sourced from CHAOSLP/ARBME LP fees
- CLANKER — sourced from CHAOSLP/CLANKER LP fees
- FLAY — sourced from CHAOSLP/FLAY LP fees
- VIRTUAL — deployed, pending first notification

Each gauge runs a 180-day linear stream. When topped up, the remaining balance rolls into the new period. This means rewards never cliff — they taper smoothly and can be extended at any time by the rails multisig.

APR Tracking

Both staking interfaces now show real-time USD-denominated APR per gauge, calculated from on-chain reward rates and live token prices via GeckoTerminal. A total APR figure combines the hub yield with all active spoke gauges.

This matters because in-asset yield numbers ("0.05 ARBME per CHAOSLP per year") are hard to reason about. USD APR gives stakers a single number to evaluate: what is my annualized return on this position?

The Architecture

ChaosLP now runs across two sites:

arbme.epicdylan.com/advanced — the full staking interface with admin controls, rails position tracking, and pool leaderboards. This is the power-user interface for managing stakes, claiming rewards, and monitoring the ecosystem.

chaos-theory.epicdylan.com/stake — a focused, lightweight staking page built as a static site on Cloudflare Pages. No server required. Reads directly from Base RPCs. Designed for simplicity: connect wallet, stake, claim.

Both interfaces read from the same contracts and show the same data. The ArbMe version has more features (admin panel, position cards, pool discovery). The chaos-theory version is faster and simpler.

What Changed From V1

- Staking token: $CHAOS → $CHAOSLP
- Gauges: replaced the original set (ALPHACLAW, MLTL, OSO, Cnews, RATCHET, USDC) with the current 5
- USDC gauge dropped — 6-decimal precision made it unviable for small reward amounts
- All gauges run simultaneously instead of weekly rotation
- Exact ERC20 approvals for user staking (no more unlimited approvals)
- Foundation multisig updated to 0xb7DD467A573809218aAE30EB2c60e8AE3a9198a0

What's Next

The focus is on growing LP depth across the four ChaosLP pairs and sustaining reward streams from fee revenue. The rails multisig manages gauge funding — balancing staker incentives with treasury growth.

No services-for-hire, no token launches, no distractions. Just infrastructure that moves price information across the ecosystem and rewards the people who provide it.

Stake at chaos-theory.epicdylan.com/stake or arbme.epicdylan.com/advanced.`,
  },
]
