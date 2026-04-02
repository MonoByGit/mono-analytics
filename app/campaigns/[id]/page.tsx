'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import Link from 'next/link';
import { DateRangeSwitcher } from '@/components/DateRangeSwitcher';
import { KPICard } from '@/components/ui/KPICard';
import { SkeletonCard, SkeletonChart } from '@/components/ui/SkeletonCard';
import { ErrorCard } from '@/components/ui/ErrorCard';

const FunnelChart = dynamic(() => import('@/components/FunnelChart').then(m => m.FunnelChart), { ssr: false });
const TrendChart = dynamic(() => import('@/components/TrendChart').then(m => m.TrendChart), { ssr: false });

const fetcher = (url: string) => fetch(url).then(r => r.json());
type Mode = 'day' | 'week' | 'month';

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const [mode, setMode] = useState<Mode>('week');
  const { data, error, mutate } = useSWR(`/api/campaigns/${params.id}/detail?mode=${mode}`, fetcher);

  const campaign = data?.campaign;
  const analytics = data?.analytics;
  const daily = data?.daily ?? [];

  return (
    <div className="p-5 md:p-7 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
        <Link href="/campaigns" className="text-text-secondary hover:text-text-primary font-mono text-xs transition-colors">← campaigns</Link>
        <span className="text-text-tertiary font-mono text-xs">/</span>
        <h1 className="text-text-primary font-mono font-bold text-sm truncate flex-1">
          {campaign?.name ?? '...'}
        </h1>
        {campaign && (
          <span className={`text-[10px] font-mono px-1.5 py-0.5 border shrink-0 ${
            campaign.status === 'active'
              ? 'border-accent-green/30 text-accent-green'
              : 'border-border text-text-secondary'
          }`}>
            {campaign.status}
          </span>
        )}
        <DateRangeSwitcher mode={mode} onChange={setMode} />
      </div>

      {error ? (
        <ErrorCard message="failed to load campaign" onRetry={() => mutate()} />
      ) : !data ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <SkeletonChart className="h-40" />
          <SkeletonChart className="h-40" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <KPICard label="total leads" value={analytics?.leads_count ?? 0} />
            <KPICard label="emails sent" value={analytics?.emails_sent_count ?? 0} />
            <KPICard
              label="bounce rate"
              value={analytics?.emails_sent_count ? (analytics.bounced_count / analytics.emails_sent_count) * 100 : 0}
              isPercent color="red"
            />
            <KPICard label="opportunities" value={analytics?.total_opportunities ?? 0} color="amber" />
          </div>

          {analytics && (
            <div className="bg-surface border border-border rounded p-5">
              <p className="text-text-primary text-xs font-mono font-bold uppercase tracking-widest mb-5">conversion funnel</p>
              <FunnelChart analytics={analytics} />
            </div>
          )}

          <div className="bg-surface border border-border rounded p-5">
            <p className="text-text-primary text-xs font-mono font-bold uppercase tracking-widest mb-4">daily trend</p>
            {daily.length === 0 ? (
              <p className="text-text-secondary text-xs font-mono">no daily data for this period</p>
            ) : (
              <TrendChart data={daily} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
