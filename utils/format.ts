import { formatUnits } from 'viem';

export function formatNumber(value: string, decimals: number = 18): string {
  const num = parseFloat(formatUnits(BigInt(value || '0'), decimals));
  if (num === 0) return '0';
  if (num < 0.01) return '<0.01';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(2) + 'K';
  return num.toFixed(2);
}

export function formatCountdown(periodFinish: number): string {
  const now = Math.floor(Date.now() / 1000);
  const remaining = periodFinish - now;
  if (remaining <= 0) return 'Ended';
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((remaining % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export function formatUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  if (value >= 1) return `$${value.toFixed(2)}`;
  return `$${value.toFixed(4)}`;
}

export function parseToWei(value: string, decimals: number = 18): string {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return '0';
  return BigInt(Math.floor(num * Math.pow(10, decimals))).toString();
}

export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
