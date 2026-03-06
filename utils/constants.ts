/**
 * ChaosLP constants
 * TODO: Update addresses after deployment (Phases 1-4)
 */

// ── Core ChaosLP ──────────────────────────────────────────────────────
export const CHAOSLP_ADDRESS = '0x8454d062506a27675706148ecdd194e45e44067a' as const;
export const CHAOSLP_FLAUNCH = '0x516af52d0c629b5e378da4dc64ecb0744ce10109' as const;
export const CHAOSLP_STAKING_ADDRESS = 'TODO_STAKING_HUB_ADDRESS' as const;
export const CHAOSLP_SAFE = '0xb7DD467A573809218aAE30EB2c60e8AE3a9198a0' as const;

// ── Paired Tokens ─────────────────────────────────────────────────────
export const ARBME_ADDRESS = '0xC647421C5Dc78D1c3960faA7A33f9aEFDF4B7B07' as const;
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;
export const FLAY_ADDRESS = '0xf1a7000000950c7ad8aff13118bb7ab561a448ee' as const;

// ── Gauge Config ──────────────────────────────────────────────────────
export interface GaugeConfig {
  symbol: string;
  tokenAddress: string;
  gaugeAddress: string;
  decimals: number;
  pool: string;
}

export const CHAOSLP_GAUGES: GaugeConfig[] = [
  { symbol: 'CHAOSLP', tokenAddress: CHAOSLP_ADDRESS, gaugeAddress: 'TODO_CHAOSLP_GAUGE', decimals: 18, pool: 'Hub Reward' },
  { symbol: 'ARBME',   tokenAddress: ARBME_ADDRESS,   gaugeAddress: 'TODO_ARBME_GAUGE',   decimals: 18, pool: 'CHAOSLP / ARBME' },
  { symbol: 'USDC',    tokenAddress: USDC_ADDRESS,    gaugeAddress: 'TODO_USDC_GAUGE',    decimals: 6,  pool: 'CHAOSLP / USDC' },
  { symbol: 'FLAY',    tokenAddress: FLAY_ADDRESS,    gaugeAddress: 'TODO_FLAY_GAUGE',    decimals: 18, pool: 'CHAOSLP / FLAY' },
];

// ── External Links ────────────────────────────────────────────────────
export const LINKS = {
  flaunch: `https://www.flaunch.gg/base/coin/${CHAOSLP_FLAUNCH}`,
  basescan: `https://basescan.org/token/${CHAOSLP_ADDRESS}`,
  stakingBasescan: `https://basescan.org/address/${CHAOSLP_STAKING_ADDRESS}`,
  safe: `https://app.safe.global/home?safe=base:${CHAOSLP_SAFE}`,
  warpcast: 'https://warpcast.com/abc-alpha',
  arbme: 'https://arbme.epicdylan.com',
} as const;
