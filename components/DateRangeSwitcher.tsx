'use client';

type Mode = 'day' | 'week' | 'month';

interface DateRangeSwitcherProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

const modes: { value: Mode; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

export function DateRangeSwitcher({ mode, onChange }: DateRangeSwitcherProps) {
  return (
    <div className="flex gap-1 bg-surface border border-border rounded-xl p-1">
      {modes.map(m => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            mode === m.value
              ? 'bg-accent-blue text-white'
              : 'text-text-secondary hover:text-white'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
