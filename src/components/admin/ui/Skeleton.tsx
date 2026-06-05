"use client";

export function RowSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bg-secondary-surface rounded-xl border border-primary-text/5 overflow-hidden">
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="px-6 py-5 border-b border-primary-text/5 animate-pulse flex items-center gap-4"
        >
          <div className="h-4 w-32 bg-primary-text/5 rounded" />
          <div className="h-4 w-20 bg-primary-text/5 rounded" />
          <div className="h-4 w-24 bg-primary-text/5 rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="bg-secondary-surface rounded-xl border border-primary-text/5 p-6 animate-pulse"
        >
          <div className="w-12 h-12 bg-primary-text/5 rounded-lg mb-4" />
          <div className="h-5 w-32 bg-primary-text/5 rounded mb-2" />
          <div className="h-4 w-full bg-primary-text/5 rounded" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="bg-secondary-surface rounded-xl border border-primary-text/5 p-6 animate-pulse"
        >
          <div className="h-5 w-40 bg-primary-text/5 rounded mb-4" />
          <div className="h-4 w-full bg-primary-text/5 rounded mb-2" />
          <div className="h-4 w-3/4 bg-primary-text/5 rounded" />
        </div>
      ))}
    </div>
  );
}
