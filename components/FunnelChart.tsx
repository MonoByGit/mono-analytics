'use client';

import { CampaignAnalytics } from '@/lib/types';

export function FunnelChart({ analytics }: { analytics: CampaignAnalytics }) {
  const contacted = analytics.contacted_count ?? 0;
  const opened = analytics.open_count ?? 0;
  const replied = analytics.reply_count ?? 0;
  const interested = analytics.total_opportunities ?? 0;

  // Instantly tracks total open events, not unique openers — opens can exceed contacts.
  // For the funnel bar we cap visually at contacted, but show the real number.
  const stages = [
    { label: 'contacted', value: contacted, barValue: contacted, color: '#666', note: null },
    { label: 'opened', value: opened, barValue: Math.min(opened, contacted), color: '#E8773A', note: opened > contacted ? 'total events' : null },
    { label: 'replied', value: replied, barValue: replied, color: '#4A9B6F', note: null },
    { label: 'interested', value: interested, barValue: interested, color: '#4A7BF7', note: null },
  ];

  const max = contacted || 1;

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => {
        const pct = Math.min(100, Math.round((stage.barValue / max) * 100));
        // Conversion vs previous stage — cap at 100% for opened since multiple opens inflate it
        const prevValue = stages[i - 1]?.value ?? 0;
        const rawConv = i > 0 && prevValue ? (stage.value / prevValue) * 100 : null;
        const conv = rawConv !== null ? `${Math.min(rawConv, 999).toFixed(1)}%` : null;

        return (
          <div key={stage.label} className="flex items-center gap-3">
            <div className="w-20 shrink-0">
              <p className="text-text-secondary text-[10px] font-mono uppercase tracking-widest">{stage.label}</p>
              {stage.note && <p className="text-text-tertiary text-[9px] font-mono">{stage.note}</p>}
            </div>
            <div className="flex-1 h-1.5 bg-surface-raised rounded-sm overflow-hidden">
              <div className="h-full rounded-sm transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: stage.color }} />
            </div>
            <p className="w-12 text-right font-mono text-sm font-bold tabular-nums" style={{ color: stage.color }}>
              {stage.value.toLocaleString()}
            </p>
            {conv && <p className="w-12 text-right text-[10px] font-mono text-text-tertiary">{conv}</p>}
          </div>
        );
      })}
      {opened > contacted && (
        <p className="text-text-tertiary text-[9px] font-mono pt-1 border-t border-border">
          * opens ({opened}) &gt; contacted ({contacted}) — Instantly counts total open events, not unique openers
        </p>
      )}
    </div>
  );
}
