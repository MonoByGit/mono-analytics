'use client';

interface PageRow {
  x: string;
  y: number;
}

export function TopPagesTable({ data }: { data: PageRow[] }) {
  if (!data.length) return <p className="text-text-secondary text-xs font-mono">no data</p>;

  const max = data[0]?.y || 1;

  return (
    <div className="space-y-1">
      {data.slice(0, 10).map((row, i) => (
        <div key={i} className="flex items-center gap-3 group">
          <p className="text-text-tertiary font-mono text-[10px] w-4 shrink-0">{i + 1}</p>
          <div className="flex-1 min-w-0">
            <p className="text-text-secondary font-mono text-xs truncate group-hover:text-text-primary transition-colors">{row.x || '/'}</p>
            <div className="mt-0.5 h-0.5 bg-surface-raised rounded-full overflow-hidden">
              <div className="h-full bg-accent-amber/60 rounded-full" style={{ width: `${(row.y / max) * 100}%` }} />
            </div>
          </div>
          <p className="text-text-primary font-mono text-xs font-bold tabular-nums shrink-0">{row.y.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
