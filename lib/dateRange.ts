import { TimeRange } from './types';

export function getTimeRange(mode: 'day' | 'week' | 'month'): TimeRange {
  const now = new Date();
  const endAt = now.getTime();
  let startAt: number;

  switch (mode) {
    case 'day':
      startAt = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      break;
    case 'week':
      startAt = endAt - 7 * 24 * 60 * 60 * 1000;
      break;
    case 'month':
    default:
      startAt = endAt - 30 * 24 * 60 * 60 * 1000;
      break;
  }

  const startDate = new Date(startAt).toISOString().split('T')[0];
  const endDate = new Date(endAt).toISOString().split('T')[0];

  return { mode, startAt, endAt, startDate, endDate };
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatPercent(numerator: number, denominator: number): string {
  if (!denominator) return '0%';
  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}
