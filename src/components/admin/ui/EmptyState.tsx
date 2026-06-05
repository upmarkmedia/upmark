"use client";

import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  message,
  action,
}: {
  icon: LucideIcon;
  message: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="bg-secondary-surface rounded-xl border border-primary-text/5 p-12 text-center">
      <Icon size={40} className="text-muted-text/30 mx-auto mb-4" />
      <p className="text-muted-text">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white text-sm font-medium rounded-lg transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
