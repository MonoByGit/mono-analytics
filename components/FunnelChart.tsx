'use client';

import { CampaignAnalytics } from '@/lib/types';

export function FunnelChart({ analytics }: { analytics: CampaignAnalytics }) {
  const stages = [
    { label: 'contacted', value: analytics.contacted_count ?? 0, color: '#666' },
    { label: 'opened', value: analytics.open_count ?? 0, color: '#E8773A' },
    { label: 'replied', value: analytics.reply_count ?? 0, color: '#4A9B6F' },
    { label: 'interested', value: analytics.opportunities_count ?? 0, color: '#4A7BF7' },
  ];

  const max = stages[0].value || 1;

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => {
        const pct = Math.min(100, Math.round(((stage.value ?? 0) / max) * 100));
        const conv = i > 0 && stages[i - 1].value
          ? `${(((stage.value ?? 0) / stages[i - 1].value) * 100).toFixed(1)}%`
          : null;

        return (
          <div key={stage.label} className="flex items-center gap-3">
            <div className="w-20 shrink-0">
              <p className="text-text-secondary text-[10px] font-mono uppercase tracking-widest">{stage.label}</p>
            </div>
            <div className="flex-1 h-1.5 bg-surface-raised rounded-sm overflow-hidden">
              <div className="h-full rounded-sm transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: stage.color }} />
            </div>
            <p className="w-12 text-right font-mono text-sm font-bold tabular-nums" style={{ color: stage.color }}>
              {(stage.value ?? 0).toLocaleString()}
            </p>
            {conv && <p className="w-12 text-right text-[10px] font-mono text-text-tertiary">{conv}</p>}
          </div>
        );
      })}
    </div>
  );
}
