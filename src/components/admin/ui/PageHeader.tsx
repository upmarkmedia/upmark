"use client";

import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">{title}</h1>
        {description && (
          <p className="text-[#94A3B8] text-sm mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 self-start">{actions}</div>}
    </div>
  );
}
