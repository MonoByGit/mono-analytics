'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { DateRangeSwitcher } from '@/components/DateRangeSwitcher';
import { KPICard } from '@/components/ui/KPICard';
import { SkeletonCard, SkeletonChart } from '@/components/ui/SkeletonCard';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { CorrelationChart } from '@/components/CorrelationChart';
import { CampaignCard } from '@/components/CampaignCard';
import { formatPercent } from '@/lib/dateRange';

const fetcher = (url: string) => fetch(url).then(r => r.json());

type Mode = 'day' | 'week' | 'month';

export default function HomePage() {
  const [mode, setMode] = useState<Mode>('week');

  const { data: overview, error: overviewError, mutate: retryOverview } = useSWR(
    `/api/dashboard/overview?mode=${mode}`,
    fetcher
  );

  const { data: correlation, error: corrError, mutate: retryCorr } = useSWR(
    `/api/dashboard/correlation?mode=${mode}`,
    fetcher
  );

  const { data: campaigns, error: campError, mutate: retryCamp } = useSWR(
    `/api/campaigns`,
    fetcher
  );

  const ins = overview?.instantly;
  const uma = overview?.umami;

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-bold text-2xl tracking-tight">Overview</h1>
          <p className="text-text-secondary text-sm mt-0.5">Your ops at a glance</p>
        </div>
        <DateRangeSwitcher mode={mode} onChange={setMode} />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {!overview && !overviewError ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : overviewError || overview?.instantlyError ? (
          <ErrorCard
            message="Email data unavailable"
            onRetry={() => retryOverview()}
            className="col-span-2 md:col-span-3"
          />
        ) : (
          <>
            <KPICard
              label="Sent"
              value={ins?.emails_sent_count ?? 0}
              color="default"
            />
            <KPICard
              label="Open Rate"
              value={ins && ins.emails_sent_count ? (ins.open_count / ins.emails_sent_count) * 100 : 0}
              isPercent
              color="blue"
            />
            <KPICard
              label="Reply Rate"
              value={ins && ins.emails_sent_count ? (ins.reply_count / ins.emails_sent_count) * 100 : 0}
              isPercent
              color="green"
            />
            <KPICard
              label="Opportunities"
              value={ins?.opportunities_count ?? 0}
              color="blue"
            />
            <KPICard
              label="Pageviews"
              value={uma?.pageviews?.value ?? 0}
              color="default"
            />
            <KPICard
              label="Visitors"
              value={uma?.visitors?.value ?? 0}
              color="default"
            />
          </>
        )}
      </div>

      {/* Correlation Chart */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-semibold">Email × Web Correlation</h2>
            <p className="text-text-secondary text-xs mt-0.5">Opens vs Pageviews over time</p>
          </div>
          <div className="flex gap-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-blue inline-block" />
              Email Opens
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-green inline-block" />
              Pageviews
            </span>
          </div>
        </div>
        {!correlation && !corrError ? (
          <div className="h-64 bg-[#1a1a1a] rounded animate-pulse" />
        ) : corrError || correlation?.instantlyError ? (
          <ErrorCard message="Correlation data unavailable" onRetry={() => retryCorr()} className="h-48" />
        ) : (
          <CorrelationChart data={correlation?.data ?? []} />
        )}
      </div>

      {/* Campaign Cards */}
      <div>
        <h2 className="text-white font-semibold mb-4">Active Campaigns</h2>
        {!campaigns && !campError ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} className="h-36" />)}
          </div>
        ) : campError ? (
          <ErrorCard message="Campaigns unavailable" onRetry={() => retryCamp()} />
        ) : campaigns?.campaigns?.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-8 text-center">
            <p className="text-text-secondary">No campaigns found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(campaigns?.campaigns ?? [])
              .filter((c: any) => c.status === 'active')
              .map((c: any) => (
                <CampaignCard key={c.id} campaign={c} analytics={c.analytics} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
