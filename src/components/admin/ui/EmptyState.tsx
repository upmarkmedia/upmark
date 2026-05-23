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
    <div className="bg-[#1E293B] rounded-xl border border-white/5 p-12 text-center">
      <Icon size={40} className="text-[#94A3B8]/30 mx-auto mb-4" />
      <p className="text-[#94A3B8]">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
