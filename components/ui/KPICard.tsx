'use client';

interface KPICardProps {
  label: string;
  value: number | string;
  delta?: number | null; // percentage change vs previous period
  color?: 'amber' | 'green' | 'red' | 'blue' | 'default';
  isPercent?: boolean;
}

function formatValue(value: number | string, isPercent: boolean): string {
  if (typeof value === 'string') return value;
  if (isPercent) return `${value.toFixed(1)}%`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
}

const colorMap: Record<string, string> = {
  amber: 'text-accent-amber',
  green: 'text-accent-green',
  red: 'text-accent-red',
  blue: 'text-accent-blue',
  default: 'text-text-primary',
};

export function KPICard({ label, value, delta, color = 'default', isPercent = false }: KPICardProps) {
  return (
    <div className="bg-surface border border-border rounded p-4 hover:border-[#333] transition-colors duration-150">
      <p className="text-text-secondary text-[10px] font-mono uppercase tracking-widest mb-3">{label}</p>
      <p className={`text-2xl font-mono font-bold tabular-nums ${colorMap[color]}`}>
        {formatValue(value, isPercent)}
      </p>
      {delta != null && (
        <p className={`text-[11px] font-mono mt-1.5 ${delta >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}% vs prev
        </p>
      )}
    </div>
  );
}
