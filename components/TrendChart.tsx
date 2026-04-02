'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyAnalytics } from '@/lib/types';
import { formatDate } from '@/lib/dateRange';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded p-2.5 text-xs font-mono">
      <p className="text-text-secondary mb-1.5">{label}</p>
      {payload.map((e: any) => (
        <p key={e.name} style={{ color: e.color }}>{e.name}: <strong>{e.value}</strong></p>
      ))}
    </div>
  );
};

export function TrendChart({ data }: { data: DailyAnalytics[] }) {
  const formatted = data.map(d => ({ ...d, date: formatDate(d.date ?? '') }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={formatted} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="#1c1c1c" />
        <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} width={28} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: '#666', fontSize: 10, fontFamily: 'monospace', paddingTop: 8 }} />
        <Line type="monotone" dataKey="sent" name="sent" stroke="#444" strokeWidth={1} dot={false} />
        <Line type="monotone" dataKey="opened" name="opened" stroke="#E8773A" strokeWidth={1.5} dot={false} />
        <Line type="monotone" dataKey="replied" name="replied" stroke="#4A9B6F" strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
