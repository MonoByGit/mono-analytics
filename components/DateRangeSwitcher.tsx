'use client';

type Mode = 'day' | 'week' | 'month';

interface DateRangeSwitcherProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

const modes: { value: Mode; label: string }[] = [
  { value: 'day', label: 'day' },
  { value: 'week', label: '7d' },
  { value: 'month', label: '30d' },
];

export function DateRangeSwitcher({ mode, onChange }: DateRangeSwitcherProps) {
  return (
    <div className="flex gap-px bg-border rounded overflow-hidden">
      {modes.map(m => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={`px-3 py-1.5 text-xs font-mono transition-colors duration-150 ${
            mode === m.value
              ? 'bg-accent-amber text-[#0a0a0a] font-bold'
              : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-raised'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
