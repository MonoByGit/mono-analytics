'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DailyAnalytics } from '@/lib/types';
import { formatDate } from '@/lib/dateRange';

interface TrendChartProps {
  data: DailyAnalytics[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-border rounded-xl p-3 text-sm">
      <p className="text-text-secondary mb-2">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }} className="tabular-nums">
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  );
};

export function TrendChart({ data }: TrendChartProps) {
  const formatted = data.map(d => ({
    ...d,
    date: formatDate(d.date),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={formatted} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
        <XAxis dataKey="date" tick={{ fill: '#8E8E93', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#8E8E93', fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: '#8E8E93', fontSize: 12, paddingTop: 12 }} />
        <Line type="monotone" dataKey="sent" name="Sent" stroke="#8E8E93" strokeWidth={1.5} dot={false} />
        <Line type="monotone" dataKey="opened" name="Opened" stroke="#0A84FF" strokeWidth={2} dot={false} style={{ filter: 'drop-shadow(0 0 4px #0A84FF60)' }} />
        <Line type="monotone" dataKey="replied" name="Replied" stroke="#30D158" strokeWidth={2} dot={false} style={{ filter: 'drop-shadow(0 0 4px #30D15860)' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
