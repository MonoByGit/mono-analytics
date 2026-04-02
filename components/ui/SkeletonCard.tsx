export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-surface border border-border rounded-2xl p-5 animate-pulse ${className}`}>
      <div className="h-3 bg-[#1f1f1f] rounded w-1/3 mb-4" />
      <div className="h-8 bg-[#1f1f1f] rounded w-1/2 mb-2" />
      <div className="h-3 bg-[#1f1f1f] rounded w-2/3" />
    </div>
  );
}

export function SkeletonChart({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-surface border border-border rounded-2xl p-5 animate-pulse ${className}`}>
      <div className="h-4 bg-[#1f1f1f] rounded w-1/4 mb-6" />
      <div className="h-48 bg-[#1f1f1f] rounded" />
    </div>
  );
}
