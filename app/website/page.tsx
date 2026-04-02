'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { DateRangeSwitcher } from '@/components/DateRangeSwitcher';
import { KPICard } from '@/components/ui/KPICard';
import { SkeletonCard, SkeletonChart } from '@/components/ui/SkeletonCard';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { TopPagesTable } from '@/components/TopPagesTable';
import { formatDate } from '@/lib/dateRange';

const WebsitePageviewChart = dynamic(
  () => import('@/components/WebsitePageviewChart').then(m => m.WebsitePageviewChart),
  { ssr: false }
);

const fetcher = (url: string) => fetch(url).then(r => r.json());
type Mode = 'day' | 'week' | 'month';

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

export default function WebsitePage() {
  const [mode, setMode] = useState<Mode>('day');

  const { data, error, mutate } = useSWR(`/api/websites/stats?mode=${mode}`, fetcher);
  const { data: pagesData } = useSWR(`/api/websites/pages?mode=${mode}`, fetcher);
  const { data: referrersData } = useSWR(`/api/websites/referrers?mode=${mode}`, fetcher);

  const stats = data?.stats;
  const pageviewData = (data?.pageviews?.pageviews ?? []).map((d: any) => ({
    date: formatDate((d.x ?? d.date ?? '').split(/[T ]/)[0]),
    value: d.y ?? d.value ?? 0,
  }));

  return (
    <div className="p-5 md:p-7 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div>
          <h1 className="text-text-primary font-mono font-bold text-lg">website</h1>
          <p className="text-text-secondary text-[11px] font-mono mt-0.5">umami analytics — memortium.nl</p>
        </div>
        <DateRangeSwitcher mode={mode} onChange={setMode} />
      </div>

      {!data && !error ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <SkeletonChart className="h-48" />
        </div>
      ) : error || data?.statsError ? (
        <ErrorCard message="failed to load website stats" onRetry={() => mutate()} />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <KPICard label="pageviews" value={stats?.pageviews?.value ?? 0} delta={stats?.pageviews?.change ?? null} />
            <KPICard label="visitors" value={stats?.visitors?.value ?? 0} delta={stats?.visitors?.change ?? null} color="amber" />
            <KPICard label="sessions" value={stats?.visits?.value ?? stats?.sessions?.value ?? 0} delta={stats?.visits?.change ?? null} />
            <KPICard label="avg duration" value={formatDuration(stats?.totaltime?.value ?? 0)} color="green" />
          </div>

          {/* Pageviews chart */}
          <div className="bg-surface border border-border rounded p-5">
            <p className="text-text-primary text-xs font-mono font-bold uppercase tracking-widest mb-4">daily pageviews</p>
            <WebsitePageviewChart data={pageviewData} />
          </div>

          {/* Top pages + referrers side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded p-5">
              <p className="text-text-primary text-xs font-mono font-bold uppercase tracking-widest mb-4">top pages</p>
              {!pagesData ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-3 bg-surface-raised rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <TopPagesTable data={pagesData?.data ?? []} />
              )}
            </div>

            <div className="bg-surface border border-border rounded p-5">
              <p className="text-text-primary text-xs font-mono font-bold uppercase tracking-widest mb-4">traffic sources</p>
              {!referrersData ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-3 bg-surface-raised rounded animate-pulse" />
                  ))}
                </div>
              ) : (referrersData?.data ?? []).length === 0 ? (
                <p className="text-text-secondary text-xs font-mono">no referrer data</p>
              ) : (
                <div className="space-y-2">
                  {(referrersData?.data ?? []).slice(0, 10).map((row: any, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                      <p className="text-text-secondary font-mono text-xs truncate max-w-[70%]">{row.x || 'direct'}</p>
                      <p className="text-text-primary font-mono text-xs font-bold tabular-nums">{row.y}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Engagement */}
          {stats?.bounces && (
            <div className="bg-surface border border-border rounded p-5">
              <p className="text-text-primary text-xs font-mono font-bold uppercase tracking-widest mb-4">engagement</p>
              <div className="grid grid-cols-2 gap-4">
                <KPICard
                  label="bounce rate"
                  value={(stats.visits?.value || stats.sessions?.value)
                    ? (stats.bounces.value / (stats.visits?.value || stats.sessions?.value)) * 100
                    : 0}
                  isPercent color="red"
                />
                <KPICard
                  label="visitor change"
                  value={stats.visitors?.change != null
                    ? `${stats.visitors.change > 0 ? '+' : ''}${stats.visitors.change.toFixed(1)}%`
                    : '—'}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
