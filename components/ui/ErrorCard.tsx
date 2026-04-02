'use client';

interface ErrorCardProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorCard({ message = 'Failed to load data', onRetry, className = '' }: ErrorCardProps) {
  return (
    <div className={`bg-surface border border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="text-accent-red text-2xl">⚠</div>
      <p className="text-text-secondary text-sm text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-accent-blue text-sm px-4 py-2 rounded-lg border border-accent-blue hover:bg-accent-blue/10 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
