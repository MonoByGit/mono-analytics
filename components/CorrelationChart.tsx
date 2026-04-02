'use client';

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CorrelationDataPoint } from '@/lib/types';
import { formatDate } from '@/lib/dateRange';

interface CorrelationChartProps {
  data: CorrelationDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-border rounded-xl p-3 text-sm">
      <p className="text-text-secondary mb-2">{formatDate(label)}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }} className="tabular-nums">
          {entry.name}: <strong>{entry.value}</strong>
        </p>
      ))}
    </div>
  );
};

export function CorrelationChart({ data }: CorrelationChartProps) {
  const formatted = data.map(d => ({ ...d, date: formatDate(d.date) }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={formatted} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#8E8E93', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: '#8E8E93', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={35}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: '#8E8E93', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={35}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ color: '#8E8E93', fontSize: 12, paddingTop: 12 }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="opens"
          name="Email Opens"
          stroke="#0A84FF"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#0A84FF' }}
          style={{ filter: 'drop-shadow(0 0 6px #0A84FF60)' }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="pageviews"
          name="Pageviews"
          stroke="#30D158"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#30D158' }}
          style={{ filter: 'drop-shadow(0 0 6px #30D15860)' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
