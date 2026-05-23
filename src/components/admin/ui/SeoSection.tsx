"use client";

import { useState } from "react";
import { Globe, ChevronDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { SeoPageConfig } from "@/types";

const inputClass = "w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-3 text-[#F8FAFC] placeholder-white/30 focus:outline-none focus:border-[#3B82F6] transition-colors text-sm";

function CharacterCounter({ value, max }: { value: string; max: number }) {
  const length = value.length;
  const isOver = length > max;
  const isNearLimit = length > max * 0.9;
  return (
    <span className={`text-xs font-mono ${isOver ? "text-red-400" : isNearLimit ? "text-[#F59E0B]" : "text-[#94A3B8]/60"}`}>
      {length}/{max}
      {isOver && <AlertTriangle size={10} className="inline ml-1" />}
      {!isOver && length > 0 && <CheckCircle2 size={10} className="inline ml-1" />}
    </span>
  );
}

function GooglePreview({ title, description, path }: { title: string; description: string; path: string }) {
  return (
    <div className="mt-2 p-4 bg-white rounded-xl border border-white/10">
      <div className="text-sm text-[#1a0dab] font-medium truncate">{title || "Page Title"}</div>
      <div className="text-xs text-[#006621] mt-0.5">https://upmark.co{path}</div>
      <div className="text-xs text-[#545454] mt-1 line-clamp-2">{description || "Page description will appear here..."}</div>
    </div>
  );
}

export function SeoSection({
  config,
  onChange,
  path,
}: {
  config: SeoPageConfig;
  onChange: (field: keyof SeoPageConfig, value: string) => void;
  path: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#1E293B] border border-white/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
            <Globe size={16} className="text-[#3B82F6]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#F8FAFC]">SEO & Metadata</h3>
            <p className="text-[10px] text-[#94A3B8] font-mono">{path}</p>
          </div>
        </div>
        <ChevronDown size={16} className={`text-[#94A3B8] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-white/5 pt-5 space-y-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#F8FAFC]">Page Title</label>
              <CharacterCounter value={config.title || ""} max={60} />
            </div>
            <input value={config.title || ""} onChange={(e) => onChange("title", e.target.value)} placeholder="Page title (recommended: 50-60 characters)" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#F8FAFC]">Meta Description</label>
              <CharacterCounter value={config.description || ""} max={160} />
            </div>
            <textarea value={config.description || ""} onChange={(e) => onChange("description", e.target.value)} placeholder="Compelling meta description (recommended: 120-160 characters)" className={`${inputClass} resize-none`} rows={3} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#F8FAFC]">OG Image URL</label>
            <input value={config.ogImage || ""} onChange={(e) => onChange("ogImage", e.target.value)} placeholder="https://res.cloudinary.com/... (1200x630 recommended)" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#F8FAFC]">Keywords</label>
            <input value={config.keywords || ""} onChange={(e) => onChange("keywords", e.target.value)} placeholder="keyword1, keyword2, keyword3" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-[#94A3B8] mb-1 block">Google Search Preview</label>
            <GooglePreview title={config.title || ""} description={config.description || ""} path={path} />
          </div>
        </div>
      )}
    </div>
  );
}
