'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SendTimeData {
  day: string;
  openRate: number;
  sent: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded p-2.5 text-xs font-mono">
      <p className="text-text-secondary mb-1">{label}</p>
      <p className="text-accent-amber">open rate: <strong>{payload[0]?.value?.toFixed(1)}%</strong></p>
      <p className="text-text-secondary">sent: <strong>{payload[1]?.value}</strong></p>
    </div>
  );
};

export function SendTimeChart({ data }: { data: SendTimeData[] }) {
  if (!data.length) return <p className="text-text-secondary text-xs font-mono">no data</p>;

  const maxRate = Math.max(...data.map(d => d.openRate), 1);

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="#1c1c1c" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} width={38} tickFormatter={(v) => `${v}%`} domain={[0, Math.ceil(maxRate * 1.2)]} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="openRate" name="open rate" radius={[2, 2, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.openRate === maxRate ? '#E8773A' : '#333'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
