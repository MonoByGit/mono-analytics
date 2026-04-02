'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  date: string;
  value: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-border rounded-xl p-3 text-sm">
      <p className="text-text-secondary mb-1">{label}</p>
      <p className="text-accent-green tabular-nums">Pageviews: <strong>{payload[0]?.value}</strong></p>
    </div>
  );
};

export function WebsitePageviewChart({ data }: { data: DataPoint[] }) {
  if (data.length === 0) {
    return <p className="text-text-secondary text-sm">No pageview data available.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#8E8E93', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#8E8E93', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={35}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          name="Pageviews"
          stroke="#30D158"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#30D158' }}
          style={{ filter: 'drop-shadow(0 0 6px #30D15860)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
