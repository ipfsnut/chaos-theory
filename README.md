# ChaosTheory

Infrastructure for moving price information across Ethereum. Stake $CHAOS once, earn 7 tokens via 180-day rolling LP fee streams from 7 CHAOS pairs on Base.

**Live site:** [chaos-theory.epicdylan.com](https://chaos-theory.epicdylan.com)

## What Is This

ChaosTheory is the staking and information hub for the $CHAOS token ecosystem on Base. The site provides:

- **Staking interface** — Connect a wallet, stake $CHAOS, claim rewards from 7 gauge contracts
- **Whitepaper** — Full v3.0 whitepaper with interactive sidebar navigation
- **Documentation** — Tokenomics, staking mechanics, governance, pool architecture
- **Blog** — Announcements and updates from the ChaosTheory Foundation
- **Machine-readable endpoint** — `/info.json` for AI agents and bots

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router, static export)
- [React](https://react.dev) 19
- [viem](https://viem.sh) — On-chain reads and transaction building
- [wagmi](https://wagmi.sh) — React hooks for wallet interaction
- [RainbowKit](https://www.rainbowkit.com) — Wallet connection UI
- TypeScript 5

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx              Landing page — hero, token info, ecosystem, services
  stake/page.tsx        Interactive staking UI (client-side)
  whitepaper/page.tsx   Whitepaper v3.0 with sidebar nav
  docs/page.tsx         Technical documentation
  blog/page.tsx         Blog posts
  layout.tsx            Root layout with providers
  globals.css           All styling (terminal green-on-black theme)
components/
  Header.tsx            Logo + nav + wallet button
  Footer.tsx            External links
  Providers.tsx         wagmi / React Query / RainbowKit wrapper
  WalletButton.tsx      RainbowKit connect button
config/
  wagmi.ts              Base chain + RainbowKit connector config
utils/
  constants.ts          Contract addresses, gauge config, external links
  abis.ts               Minimal ABIs for staking hub, gauges, ERC20
  format.ts             Number/address formatting utilities
public/
  info.json             Machine-readable metadata for agents
  chaos-icon.png        Logo
```

## Key Contracts (Base)

| Contract | Address |
|----------|---------|
| $CHAOS Token | `0xfab2ee8eb6b26208bfb5c41012661e62b4dc9292` |
| Staking Hub | `0x70e6c917A8AC437E629B67E84C0C0678eD54460d` |
| Foundation Multisig | `0x3CE26de6FF74e0Baa5F762b67465eEacfE84549F` |
| ARBME Gauge | `0x37547710faE12B4be7458b5E87C3106a85CfD72F` |

## Links

- [Trade $CHAOS on Flaunch](https://www.flaunch.gg/base/coin/0xFaB2ee8eB6B26208BfB5c41012661e62b4Dc9292)
- [Basescan](https://basescan.org/token/0xFaB2ee8eB6B26208BfB5c41012661e62b4Dc9292)
- [Foundation Multisig (Safe)](https://app.safe.global/home?safe=base:0x3CE26de6FF74e0Baa5F762b67465eEacfE84549F)
- [MoltLaunch Agent](https://moltlaunch.com/agent/0x3d9d)
- [Warpcast (@abc-alpha)](https://warpcast.com/abc-alpha)
- [Agent Docs](https://abc-alpha.epicdylan.com)
- [ArbMe](https://arbme.epicdylan.com)

## Deployment

Static export — compatible with any static host (Vercel, Netlify, etc.):

```bash
npm run build
```

Output is in the `.next/` directory.
