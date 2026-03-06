export interface BlogPost {
  slug: string
  date: string
  title: string
  excerpt: string
  content: string
}

export const POSTS: BlogPost[] = [
  {
    slug: 'chaoslp-launch',
    date: '2026-03-XX',
    title: 'ChaosLP Is Live',
    excerpt: 'ChaosLP launches on Flaunch with three pools, four staking gauges, and a Progressive Bid Wall. Buy it. Stake it or LP it.',
    content: `ChaosLP is live on Base.

ChaosLP is a high-risk coordination asset for the ArbMe ecosystem. Degen tokens pair against ChaosLP, which routes through ARBME into the rest of the network. The volatility from those pairs generates trading fees. Those fees go to ChaosLP stakers.

What launched:
- CHAOSLP token on Flaunch (Progressive Bid Wall active)
- CHAOSLP / ARBME pool (3% fee) — bridge to ArbMe
- CHAOSLP / USDC pool (0.05% fee) — stable gateway
- CHAOSLP / FLAY pool (3% fee) — Flaunch ecosystem
- Staking hub with 4 gauges (CHAOSLP, ARBME, USDC, FLAY)
- ChaosLP Safe holding all LP positions

How to participate:

Stake: Buy ChaosLP on Flaunch, then stake it on the staking page. You earn four tokens automatically — CHAOSLP, ARBME, USDC, and FLAY — from LP fee revenue across all three pools. One transaction to claim everything.

LP: Provide liquidity in any ChaosLP pool on Uniswap V4 via ArbMe. You earn trading fees directly from swaps. Higher risk, higher reward.

The Progressive Bid Wall provides a rising floor. Staking reduces the trading float, making the wall more effective. More volume means more fees means thicker walls.

Contract addresses are on the docs page.`,
  },
]
