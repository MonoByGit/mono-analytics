'use client';

import { CampaignAnalytics } from '@/lib/types';

interface FunnelChartProps {
  analytics: CampaignAnalytics;
}

export function FunnelChart({ analytics }: FunnelChartProps) {
  const stages = [
    { label: 'Contacted', value: analytics.contacted_count, color: '#0A84FF' },
    { label: 'Opened', value: analytics.open_count, color: '#30D158' },
    { label: 'Replied', value: analytics.reply_count, color: '#FF9F0A' },
    { label: 'Interested', value: analytics.opportunities_count, color: '#BF5AF2' },
  ];

  const max = stages[0].value || 1;

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => {
        const pct = Math.round((stage.value / max) * 100);
        const convPct = i > 0 && stages[i - 1].value
          ? ((stage.value / stages[i - 1].value) * 100).toFixed(1)
          : null;

        return (
          <div key={stage.label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-text-secondary text-xs">{stage.label}</span>
                {convPct && (
                  <span className="text-text-tertiary text-xs">↓ {convPct}%</span>
                )}
              </div>
              <span className="text-white text-sm font-bold tabular-nums">{stage.value.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: stage.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
