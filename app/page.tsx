'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import { DateRangeSwitcher } from '@/components/DateRangeSwitcher';
import { KPICard } from '@/components/ui/KPICard';
import { SkeletonCard, SkeletonChart } from '@/components/ui/SkeletonCard';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { CampaignCard } from '@/components/CampaignCard';

const CorrelationChart = dynamic(() => import('@/components/CorrelationChart').then(m => m.CorrelationChart), { ssr: false });
const SendTimeChart = dynamic(() => import('@/components/SendTimeChart').then(m => m.SendTimeChart), { ssr: false });

const fetcher = (url: string) => fetch(url).then(r => r.json());
type Mode = 'day' | 'week' | 'month';

export default function HomePage() {
  const [mode, setMode] = useState<Mode>('week');

  const { data: overview, error: overviewError, mutate: retryOverview } = useSWR(`/api/dashboard/overview?mode=${mode}`, fetcher);
  const { data: correlation, error: corrError, mutate: retryCorr } = useSWR(`/api/dashboard/correlation?mode=${mode}`, fetcher);
  const { data: campaigns, error: campError, mutate: retryCamp } = useSWR('/api/campaigns', fetcher);
  const { data: sendTime } = useSWR('/api/campaigns/send-time', fetcher);

  const ins = overview?.instantly;
  const uma = overview?.umami;

  const openRate = ins?.emails_sent_count ? (ins.open_count / ins.emails_sent_count) * 100 : 0;
  const replyRate = ins?.emails_sent_count ? (ins.reply_count / ins.emails_sent_count) * 100 : 0;

  return (
    <div className="p-5 md:p-7 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div>
          <h1 className="text-text-primary font-mono font-bold text-lg">overview</h1>
          <p className="text-text-secondary text-[11px] font-mono mt-0.5">email × web analytics</p>
        </div>
        <DateRangeSwitcher mode={mode} onChange={setMode} />
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {!overview && !overviewError ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : overviewError ? (
          <ErrorCard message="data unavailable" onRetry={() => retryOverview()} className="col-span-2 md:col-span-3" />
        ) : (
          <>
            <KPICard label="sent" value={ins?.emails_sent_count ?? 0} />
            <KPICard label="open rate" value={openRate} isPercent color="amber" delta={uma?.pageviews?.change ?? null} />
            <KPICard label="reply rate" value={replyRate} isPercent color="green" />
            <KPICard label="opportunities" value={ins?.opportunities_count ?? 0} color="blue" />
            <KPICard label="pageviews" value={uma?.pageviews?.value ?? 0} delta={uma?.pageviews?.change ?? null} />
            <KPICard label="visitors" value={uma?.visitors?.value ?? 0} delta={uma?.visitors?.change ?? null} />
          </>
        )}
      </div>

      {/* Two column layout: correlation + send time */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Correlation chart — takes 2/3 */}
        <div className="lg:col-span-2 bg-surface border border-border rounded p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-text-primary text-xs font-mono font-bold uppercase tracking-widest">email × web correlation</p>
          </div>
          <p className="text-text-secondary text-[10px] font-mono mb-4">opens vs pageviews — use lag to reveal delayed traffic effect</p>
          {!correlation && !corrError ? (
            <div className="h-48 bg-surface-raised rounded animate-pulse" />
          ) : corrError ? (
            <ErrorCard message="correlation unavailable" onRetry={() => retryCorr()} className="h-36" />
          ) : (
            <CorrelationChart data={correlation?.data ?? []} />
          )}
        </div>

        {/* Send time — takes 1/3 */}
        <div className="bg-surface border border-border rounded p-5">
          <p className="text-text-primary text-xs font-mono font-bold uppercase tracking-widest mb-1">send time</p>
          <p className="text-text-secondary text-[10px] font-mono mb-4">open rate by day of week (30d)</p>
          {!sendTime ? (
            <div className="h-36 bg-surface-raised rounded animate-pulse" />
          ) : (
            <SendTimeChart data={sendTime?.data ?? []} />
          )}
        </div>
      </div>

      {/* Active Campaigns */}
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
          <p className="text-text-primary text-xs font-mono font-bold uppercase tracking-widest">active campaigns</p>
          <a href="/campaigns" className="text-accent-amber text-[10px] font-mono hover:text-text-primary transition-colors">view all →</a>
        </div>
        {!campaigns && !campError ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} className="h-28" />)}
          </div>
        ) : campError ? (
          <ErrorCard message="campaigns unavailable" onRetry={() => retryCamp()} />
        ) : (campaigns?.campaigns ?? []).filter((c: any) => c.status === 'active').length === 0 ? (
          <p className="text-text-secondary text-xs font-mono py-4">no active campaigns</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
