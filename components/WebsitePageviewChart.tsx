'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded p-2.5 text-xs font-mono">
      <p className="text-text-secondary mb-1">{label}</p>
      <p className="text-accent-green">pageviews: <strong>{payload[0]?.value}</strong></p>
    </div>
  );
};

export function WebsitePageviewChart({ data }: { data: { date: string; value: number }[] }) {
  if (data.length === 0) return <p className="text-text-secondary text-xs font-mono">no data</p>;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="#1c1c1c" />
        <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} width={28} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="value" stroke="#4A9B6F" strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
