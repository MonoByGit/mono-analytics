'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { CampaignCard } from '@/components/CampaignCard';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function CampaignsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all');
  const { data, error, mutate } = useSWR('/api/campaigns', fetcher);

  const STATUS_ORDER: Record<string, number> = { active: 0, paused: 1, draft: 2, completed: 3, stopped: 4 };
  const all = (data?.campaigns ?? []).slice().sort((a: any, b: any) =>
    (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9)
  );
  const filtered = filter === 'all' ? all : all.filter((c: any) => c.status === filter);

  return (
    <div className="p-5 md:p-7 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div>
          <h1 className="text-text-primary font-mono font-bold text-lg">campaigns</h1>
          <p className="text-text-secondary text-[11px] font-mono mt-0.5">{all.length} total</p>
        </div>
        <div className="flex gap-px bg-border rounded overflow-hidden">
          {(['all', 'active', 'paused'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[10px] font-mono capitalize transition-colors ${
                filter === f ? 'bg-accent-amber text-[#0a0a0a] font-bold' : 'bg-surface text-text-secondary hover:text-text-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {!data && !error ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} className="h-28" />)}
        </div>
      ) : error ? (
        <ErrorCard message="failed to load campaigns" onRetry={() => mutate()} />
      ) : filtered.length === 0 ? (
        <p className="text-text-secondary text-xs font-mono py-8">no {filter !== 'all' ? filter + ' ' : ''}campaigns found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((c: any) => (
            <CampaignCard key={c.id} campaign={c} analytics={c.analytics} />
          ))}
        </div>
      )}
    </div>
  );
}
