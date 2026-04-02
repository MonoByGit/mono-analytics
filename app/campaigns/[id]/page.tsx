'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import Link from 'next/link';
import { DateRangeSwitcher } from '@/components/DateRangeSwitcher';
import { KPICard } from '@/components/ui/KPICard';

// Load chart components client-only — Recharts uses browser APIs that break SSR
const FunnelChart = dynamic(() => import('@/components/FunnelChart').then(m => m.FunnelChart), { ssr: false });
const TrendChart = dynamic(() => import('@/components/TrendChart').then(m => m.TrendChart), { ssr: false });
import { SkeletonCard, SkeletonChart } from '@/components/ui/SkeletonCard';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { formatPercent } from '@/lib/dateRange';

const fetcher = (url: string) => fetch(url).then(r => r.json());

type Mode = 'day' | 'week' | 'month';

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const [mode, setMode] = useState<Mode>('week');
  const { data, error, mutate } = useSWR(
    `/api/campaigns/${params.id}/detail?mode=${mode}`,
    fetcher
  );

  const campaign = data?.campaign;
  const analytics = data?.analytics;
  const daily = data?.daily ?? [];

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/campaigns" className="text-text-secondary hover:text-white transition-colors text-sm">
          ← Campaigns
        </Link>
        <span className="text-text-tertiary">/</span>
        <h1 className="text-white font-bold text-xl tracking-tight truncate">
          {campaign?.name ?? '...'}
        </h1>
        {campaign && (
          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
            campaign.status === 'active'
              ? 'bg-accent-green/15 text-accent-green'
              : 'bg-[#1f1f1f] text-text-secondary'
          }`}>
            {campaign.status}
          </span>
        )}
        <div className="ml-auto shrink-0">
          <DateRangeSwitcher mode={mode} onChange={setMode} />
        </div>
      </div>

      {error ? (
        <ErrorCard message="Failed to load campaign details" onRetry={() => mutate()} />
      ) : !data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <SkeletonChart className="h-48" />
          <SkeletonChart className="h-48" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard label="Total Leads" value={analytics?.total_leads ?? 0} />
            <KPICard label="Emails Sent" value={analytics?.emails_sent_count ?? 0} />
            <KPICard
              label="Bounce Rate"
              value={analytics && analytics.emails_sent_count
                ? (analytics.bounced_count / analytics.emails_sent_count) * 100 : 0}
              isPercent
              color="red"
            />
            <KPICard label="Opportunities" value={analytics?.opportunities_count ?? 0} color="blue" />
          </div>

          {/* Funnel */}
          {analytics && (
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-5">Conversion Funnel</h2>
              <FunnelChart analytics={analytics} />
            </div>
          )}

          {/* Daily Trend */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-5">Daily Trend</h2>
            {daily.length === 0 ? (
              <p className="text-text-secondary text-sm">No daily data available for this period.</p>
            ) : (
              <TrendChart data={daily} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
