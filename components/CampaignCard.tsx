'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { InstantlyCampaign, CampaignAnalytics } from '@/lib/types';

interface CampaignCardProps {
  campaign: InstantlyCampaign;
  analytics: CampaignAnalytics | null;
}

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function pct(num: number, den: number): string {
  if (!den) return '—';
  // Cap at 100% — Instantly counts total opens which can exceed sent count
  return `${Math.min(100, (num / den) * 100).toFixed(1)}%`;
}

export function CampaignCard({ campaign, analytics }: CampaignCardProps) {
  const sent = analytics?.emails_sent_count ?? 0;
  const opened = analytics?.open_count ?? 0;
  const replied = analytics?.reply_count ?? 0;
  const opps = analytics?.opportunities_count ?? 0;

  return (
    <Link href={`/campaigns/${campaign.id}`} className="block h-full">
      <div className="bg-surface border border-border rounded p-4 hover:border-[#333] transition-colors duration-150 cursor-pointer group h-full flex flex-col">
        <div className="flex items-start justify-between mb-4 flex-1">
          <p className="text-text-primary text-sm font-mono font-medium leading-tight pr-2 group-hover:text-accent-amber transition-colors line-clamp-2">{campaign.name}</p>
          <span className={clsx(
            'text-[10px] font-mono px-1.5 py-0.5 border shrink-0',
            campaign.status === 'active'
              ? 'border-accent-green/30 text-accent-green bg-accent-green/5'
              : 'border-border text-text-secondary'
          )}>
            {campaign.status}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-0 border border-border rounded overflow-hidden mt-auto">
          {[
            { label: 'sent', value: fmt(sent) },
            { label: 'open', value: pct(opened, sent), color: 'text-accent-amber' },
            { label: 'reply', value: pct(replied, sent), color: 'text-accent-green' },
            { label: 'opps', value: fmt(opps), color: 'text-accent-blue' },
          ].map((stat, i) => (
            <div key={stat.label} className={`p-2.5 ${i < 3 ? 'border-r border-border' : ''}`}>
              <p className="text-text-tertiary text-[9px] font-mono uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-sm font-mono font-bold tabular-nums ${stat.color ?? 'text-text-primary'}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
