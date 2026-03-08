/**
 * ChaosLP constants
 */

// ── Core ChaosLP ──────────────────────────────────────────────────────
export const CHAOSLP_ADDRESS = '0x8454d062506a27675706148ecdd194e45e44067a' as const;
export const CHAOSLP_FLAUNCH = '0x516af52d0c629b5e378da4dc64ecb0744ce10109' as const;
export const CHAOSLP_STAKING_ADDRESS = '0x48D9eC58746aD41731De91Efb1e315c8fcF5d20a' as const;
export const CHAOSLP_SAFE = '0xb7DD467A573809218aAE30EB2c60e8AE3a9198a0' as const;

// ── Paired Tokens ─────────────────────────────────────────────────────
export const ARBME_ADDRESS = '0xC647421C5Dc78D1c3960faA7A33f9aEFDF4B7B07' as const;
export const CLANKER_ADDRESS = '0x1bc0c42215582d5A085795f4baDbaC3ff36d1Bcb' as const;
export const FLAY_ADDRESS = '0xf1a7000000950c7ad8aff13118bb7ab561a448ee' as const;
export const VIRTUAL_ADDRESS = '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b' as const;

// ── Gauge Config ──────────────────────────────────────────────────────
export interface GaugeConfig {
  symbol: string;
  tokenAddress: string;
  gaugeAddress: string;
  decimals: number;
  pool: string;
}

export const CHAOSLP_GAUGES: GaugeConfig[] = [
  { symbol: 'CHAOSLP', tokenAddress: CHAOSLP_ADDRESS,  gaugeAddress: '0x48D9eC58746aD41731De91Efb1e315c8fcF5d20a', decimals: 18, pool: 'Hub Reward' },
  { symbol: 'ARBME',   tokenAddress: ARBME_ADDRESS,    gaugeAddress: '0xecf0307ed8d64cEEc82B1A2488D9c7969c0B26f2', decimals: 18, pool: 'CHAOSLP / ARBME' },
  { symbol: 'CLANKER', tokenAddress: CLANKER_ADDRESS,  gaugeAddress: '0xb9135C878DA7f229E39CD16121B5F7796eE7DB53', decimals: 18, pool: 'CHAOSLP / CLANKER' },
  { symbol: 'FLAY',    tokenAddress: FLAY_ADDRESS,     gaugeAddress: '0xE2aCDb1dea6422671e95500834eBc21dbbDf5F7D', decimals: 18, pool: 'CHAOSLP / FLAY' },
  { symbol: 'VIRTUAL', tokenAddress: VIRTUAL_ADDRESS,  gaugeAddress: '0x839ac3EB369D7f5d55f01Fb13770D515841439d6', decimals: 18, pool: 'CHAOSLP / VIRTUAL' },
];

// ── External Links ────────────────────────────────────────────────────
export const LINKS = {
  flaunch: `https://www.flaunch.gg/base/coin/${CHAOSLP_FLAUNCH}`,
  basescan: `https://basescan.org/token/${CHAOSLP_ADDRESS}`,
  stakingBasescan: `https://basescan.org/address/${CHAOSLP_STAKING_ADDRESS}`,
  safe: `https://app.safe.global/home?safe=base:${CHAOSLP_SAFE}`,
  multisig: `https://app.safe.global/home?safe=base:${CHAOSLP_SAFE}`,
  moltlaunch: 'https://moltlaunch.com/agent/0x3d9d',
  agentDocs: 'https://abc-alpha.epicdylan.com',
  warpcast: 'https://warpcast.com/abc-alpha',
  arbme: 'https://arbme.epicdylan.com',
} as const;
