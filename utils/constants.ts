/**
 * ChaosTheory constants — CHAOS-specific addresses and config
 */

// ── Core CHAOS ──────────────────────────────────────────────────────────
export const CHAOS_ADDRESS = '0xfab2ee8eb6b26208bfb5c41012661e62b4dc9292' as const;
export const CHAOS_STAKING_ADDRESS = '0x70e6c917A8AC437E629B67E84C0C0678eD54460d' as const;
export const CHAOS_FOUNDATION_MULTISIG = '0x3CE26de6FF74e0Baa5F762b67465eEacfE84549F' as const;

// ── Ecosystem Tokens ────────────────────────────────────────────────────
export const ARBME_ADDRESS = '0xC647421C5Dc78D1c3960faA7A33f9aEFDF4B7B07' as const;
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;
export const ALPHACLAW_ADDRESS = '0x8C19A8b92FA406Ae097EB9eA8a4A44cBC10EafE2' as const;
export const MLTL_ADDRESS = '0xa448d40f6793773938a6b7427091c35676899125' as const;
export const OSO_ADDRESS = '0xc78fabc2cb5b9cf59e0af3da8e3bc46d47753a4e' as const;
export const CNEWS_ADDRESS = '0x01de044ad8eb037334ddda97a38bb0c798e4eb07' as const;
export const RATCHET_ADDRESS = '0x392bc5DeEa227043d69Af0e67BadCbBAeD511B07' as const;

// ── Gauge Config ────────────────────────────────────────────────────────
export interface GaugeConfig {
  symbol: string;
  tokenAddress: string;
  gaugeAddress: string;
  decimals: number;
  pool: string;
  week: number;
}

export const CHAOS_GAUGES: GaugeConfig[] = [
  { symbol: 'ARBME',     tokenAddress: ARBME_ADDRESS,     gaugeAddress: '0x37547710faE12B4be7458b5E87C3106a85CfD72F', decimals: 18, pool: 'CHAOS / ARBME',     week: 1 },
  { symbol: 'USDC',      tokenAddress: USDC_ADDRESS,      gaugeAddress: '0x0000000000000000000000000000000000000000', decimals: 6,  pool: 'CHAOS / USDC',      week: 2 },
  { symbol: 'ALPHACLAW', tokenAddress: ALPHACLAW_ADDRESS,  gaugeAddress: '0x0000000000000000000000000000000000000000', decimals: 18, pool: 'CHAOS / ALPHACLAW', week: 3 },
  { symbol: 'MLTL',      tokenAddress: MLTL_ADDRESS,      gaugeAddress: '0x0000000000000000000000000000000000000000', decimals: 18, pool: 'CHAOS / MLTL',      week: 4 },
  { symbol: 'OSO',       tokenAddress: OSO_ADDRESS,       gaugeAddress: '0x0000000000000000000000000000000000000000', decimals: 18, pool: 'CHAOS / OSO',       week: 5 },
  { symbol: 'Cnews',     tokenAddress: CNEWS_ADDRESS,     gaugeAddress: '0x0000000000000000000000000000000000000000', decimals: 18, pool: 'CHAOS / Cnews',     week: 6 },
  { symbol: 'RATCHET',   tokenAddress: RATCHET_ADDRESS,   gaugeAddress: '0x0000000000000000000000000000000000000000', decimals: 18, pool: 'CHAOS / RATCHET',   week: 7 },
];

// ── External Links ──────────────────────────────────────────────────────
export const LINKS = {
  flaunch: 'https://www.flaunch.gg/base/coin/0xFaB2ee8eB6B26208BfB5c41012661e62b4Dc9292',
  basescan: 'https://basescan.org/token/0xFaB2ee8eB6B26208BfB5c41012661e62b4Dc9292',
  stakingBasescan: 'https://basescan.org/address/0x70e6c917A8AC437E629B67E84C0C0678eD54460d',
  multisig: 'https://app.safe.global/home?safe=base:0x3CE26de6FF74e0Baa5F762b67465eEacfE84549F',
  moltlaunch: 'https://moltlaunch.com/agent/0x3d9d',
  warpcast: 'https://warpcast.com/abc-alpha',
  agentDocs: 'https://abc-alpha.epicdylan.com',
  arbme: 'https://arbme.epicdylan.com',
} as const;
