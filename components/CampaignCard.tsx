'use client';

import { formatNumber, formatPercent } from '@/lib/dateRange';
import { InstantlyCampaign, CampaignAnalytics } from '@/lib/types';
import { SparklineChart } from './SparklineChart';
import clsx from 'clsx';
import Link from 'next/link';

interface CampaignCardProps {
  campaign: InstantlyCampaign;
  analytics: CampaignAnalytics | null;
  sparklineData?: { value: number }[];
}

export function CampaignCard({ campaign, analytics, sparklineData = [] }: CampaignCardProps) {
  const sent = analytics?.emails_sent_count ?? 0;
  const opened = analytics?.open_count ?? 0;
  const replied = analytics?.reply_count ?? 0;

  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <div className="bg-surface border border-border rounded-2xl p-5 transition-all duration-200 hover:border-[#2f2f2f] hover:bg-[#161616] cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{campaign.name}</p>
          </div>
          <span className={clsx(
            'text-xs px-2 py-0.5 rounded-full ml-2 shrink-0',
            campaign.status === 'active'
              ? 'bg-accent-green/15 text-accent-green'
              : 'bg-[#1f1f1f] text-text-secondary'
          )}>
            {campaign.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <p className="text-text-tertiary text-xs mb-1">Sent</p>
            <p className="text-white text-base font-bold tabular-nums">{formatNumber(sent)}</p>
          </div>
          <div>
            <p className="text-text-tertiary text-xs mb-1">Open Rate</p>
            <p className="text-accent-blue text-base font-bold tabular-nums">{formatPercent(opened, sent)}</p>
          </div>
          <div>
            <p className="text-text-tertiary text-xs mb-1">Reply Rate</p>
            <p className="text-accent-green text-base font-bold tabular-nums">{formatPercent(replied, sent)}</p>
          </div>
        </div>

        {sparklineData.length > 0 && (
          <SparklineChart data={sparklineData} />
        )}
      </div>
    </Link>
  );
}
