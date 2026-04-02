'use client';

import { formatNumber } from '@/lib/dateRange';
import clsx from 'clsx';

interface KPICardProps {
  label: string;
  value: number | string;
  sub?: string;
  color?: 'blue' | 'green' | 'red' | 'default';
  isPercent?: boolean;
}

const colorMap = {
  blue: 'text-accent-blue',
  green: 'text-accent-green',
  red: 'text-accent-red',
  default: 'text-white',
};

export function KPICard({ label, value, sub, color = 'default', isPercent = false }: KPICardProps) {
  const displayValue = typeof value === 'number'
    ? isPercent ? `${value.toFixed(1)}%` : formatNumber(value)
    : value;

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 transition-all duration-200 hover:border-[#2f2f2f] hover:bg-[#161616]">
      <p className="text-text-secondary text-xs font-medium uppercase tracking-widest mb-3">{label}</p>
      <p className={clsx('text-3xl font-bold tabular-nums', colorMap[color])}>{displayValue}</p>
      {sub && <p className="text-text-secondary text-xs mt-1">{sub}</p>}
    </div>
  );
}
