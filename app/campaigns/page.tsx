'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { CampaignCard } from '@/components/CampaignCard';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function CampaignsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all');
  const { data, error, mutate } = useSWR('/api/campaigns', fetcher);

  const allCampaigns = data?.campaigns ?? [];
  const filtered = filter === 'all' ? allCampaigns : allCampaigns.filter((c: any) => c.status === filter);

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-bold text-2xl tracking-tight">Campaigns</h1>
          <p className="text-text-secondary text-sm mt-0.5">{allCampaigns.length} total</p>
        </div>
        <div className="flex gap-1 bg-surface border border-border rounded-xl p-1">
          {(['all', 'active', 'paused'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                filter === f ? 'bg-accent-blue text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {!data && !error ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} className="h-36" />)}
        </div>
      ) : error ? (
        <ErrorCard message="Failed to load campaigns" onRetry={() => mutate()} />
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-8 text-center">
          <p className="text-text-secondary">No {filter !== 'all' ? filter : ''} campaigns found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c: any) => (
            <CampaignCard key={c.id} campaign={c} analytics={c.analytics} />
          ))}
        </div>
      )}
    </div>
  );
}
