'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DateRangeSwitcher } from '@/components/DateRangeSwitcher';
import { KPICard } from '@/components/ui/KPICard';
import { SkeletonCard, SkeletonChart } from '@/components/ui/SkeletonCard';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { formatDate } from '@/lib/dateRange';

const fetcher = (url: string) => fetch(url).then(r => r.json());

type Mode = 'day' | 'week' | 'month';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-border rounded-xl p-3 text-sm">
      <p className="text-text-secondary mb-1">{label}</p>
      <p className="text-accent-green tabular-nums">Pageviews: <strong>{payload[0]?.value}</strong></p>
    </div>
  );
};

function formatDuration(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

export default function WebsitePage() {
  const [mode, setMode] = useState<Mode>('week');
  const { data, error, mutate } = useSWR(`/api/websites/stats?mode=${mode}`, fetcher);

  const stats = data?.stats;
  const pageviewData = (data?.pageviews?.pageviews ?? []).map((d: any) => ({
    date: formatDate(d.date?.split('T')[0] ?? d.date),
    value: d.value,
  }));

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-bold text-2xl tracking-tight">Website</h1>
          <p className="text-text-secondary text-sm mt-0.5">Umami Analytics</p>
        </div>
        <DateRangeSwitcher mode={mode} onChange={setMode} />
      </div>

      {!data && !error ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <SkeletonChart className="h-56" />
        </div>
      ) : error || data?.statsError ? (
        <ErrorCard message="Failed to load website stats" onRetry={() => mutate()} />
      ) : (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard label="Pageviews" value={stats?.pageviews?.value ?? 0} color="default" />
            <KPICard label="Visitors" value={stats?.visitors?.value ?? 0} color="blue" />
            <KPICard label="Sessions" value={stats?.sessions?.value ?? 0} color="default" />
            <KPICard
              label="Avg Duration"
              value={formatDuration(stats?.totaltime?.value ?? 0)}
              color="green"
            />
          </div>

          {/* Pageviews chart */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-6">Daily Pageviews</h2>
            {pageviewData.length === 0 ? (
              <p className="text-text-secondary text-sm">No pageview data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={pageviewData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
            )}
          </div>

          {/* Bounce Rate if available */}
          {stats?.bounces && (
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-4">Engagement</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-text-secondary text-xs mb-1">Bounce Rate</p>
                  <p className="text-white text-2xl font-bold tabular-nums">
                    {stats.sessions?.value
                      ? `${((stats.bounces.value / stats.sessions.value) * 100).toFixed(1)}%`
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-text-secondary text-xs mb-1">vs Previous Period</p>
                  <p className={`text-2xl font-bold tabular-nums ${
                    (stats.visitors?.value ?? 0) >= (stats.visitors?.prev ?? 0)
                      ? 'text-accent-green' : 'text-accent-red'
                  }`}>
                    {stats.visitors?.prev
                      ? `${(((stats.visitors.value - stats.visitors.prev) / stats.visitors.prev) * 100).toFixed(1)}%`
                      : '—'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
