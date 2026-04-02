'use client';

interface ErrorCardProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorCard({ message = 'Failed to load data', onRetry, className = '' }: ErrorCardProps) {
  return (
    <div className={`bg-surface border border-border rounded p-5 flex flex-col items-center justify-center gap-3 ${className}`}>
      <p className="text-accent-red font-mono text-xs uppercase tracking-widest">Error</p>
      <p className="text-text-secondary text-sm text-center font-mono">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-accent-amber text-xs font-mono px-3 py-1.5 border border-accent-amber/40 rounded hover:border-accent-amber transition-colors"
        >
          retry
        </button>
      )}
    </div>
  );
}
