'use client';

import { useEffect } from 'react';

export default function CampaignDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Campaign detail error:', error);
  }, [error]);

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto">
      <div className="bg-surface border border-border rounded-2xl p-8 text-center space-y-4">
        <p className="text-accent-red font-semibold">Something went wrong</p>
        <pre className="text-text-secondary text-xs text-left bg-[#0d0d0d] rounded-xl p-4 overflow-auto max-h-48 whitespace-pre-wrap">
          {error?.message ?? 'Unknown error'}
          {'\n\n'}
          {error?.stack ?? ''}
        </pre>
        <button
          onClick={reset}
          className="text-accent-blue text-sm px-4 py-2 rounded-lg border border-accent-blue hover:bg-accent-blue/10 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
