'use client';

import { useState } from 'react';
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { CorrelationDataPoint } from '@/lib/types';
import { formatDate } from '@/lib/dateRange';

interface CorrelationChartProps {
  data: CorrelationDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded p-2.5 text-xs font-mono">
      <p className="text-text-secondary mb-1.5">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: <span className="font-bold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

const LAG_OPTIONS = [0, 1, 2, 3];

export function CorrelationChart({ data }: CorrelationChartProps) {
  const [lag, setLag] = useState(0);

  // Shift email opens forward by `lag` days to test delayed correlation
  const shifted = data.map((d, i) => {
    const opensSource = lag === 0 ? d : (data[i - lag] ?? { opens: 0 });
    return {
      date: formatDate(d.date),
      opens: (opensSource as CorrelationDataPoint).opens ?? 0,
      pageviews: d.pageviews,
    };
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-text-secondary text-[10px] font-mono uppercase tracking-widest">Email lag</span>
        <div className="flex gap-px bg-border rounded overflow-hidden">
          {LAG_OPTIONS.map(l => (
            <button
              key={l}
              onClick={() => setLag(l)}
              className={`px-2.5 py-1 text-[10px] font-mono transition-colors ${
                lag === l
                  ? 'bg-accent-amber text-[#0a0a0a] font-bold'
                  : 'bg-surface text-text-secondary hover:text-text-primary'
              }`}
            >
              {l}d
            </button>
          ))}
        </div>
        <span className="text-text-tertiary text-[10px] font-mono">
          {lag === 0 ? 'same day' : `opens shifted +${lag} day${lag > 1 ? 's' : ''} forward`}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={shifted} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="#1c1c1c" />
          <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} width={30} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#666', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false} width={30} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#666', fontSize: 10, fontFamily: 'monospace', paddingTop: 10 }} />
          <Line yAxisId="left" type="monotone" dataKey="opens" name="email opens" stroke="#E8773A" strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} />
          <Line yAxisId="right" type="monotone" dataKey="pageviews" name="pageviews" stroke="#4A9B6F" strokeWidth={1.5} dot={false} activeDot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
