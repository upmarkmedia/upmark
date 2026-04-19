"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/firestore";
import { Save, Loader2, Globe, ChevronDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import { revalidatePathAction } from "@/app/actions";
import type { SeoPageConfig } from "@/types";

const SEO_PAGES = [
  { key: "home", label: "Home", path: "/" },
  { key: "work", label: "Work / Portfolio", path: "/work" },
  { key: "case-studies", label: "Case Studies", path: "/case-studies" },
  { key: "services", label: "Services", path: "/services" },
  { key: "contact", label: "Contact", path: "/contact" },
];

const DEFAULT_SEO: Record<string, SeoPageConfig> = {
  home: { title: "Upmark — Integrated Marketing That Moves Markets", description: "Strategy, performance marketing, content and execution — unified. We build complete marketing systems that scale.", keywords: "marketing agency, integrated marketing, digital marketing, content production" },
  work: { title: "Our Work | Upmark — Portfolio & Results", description: "See the results. Real campaigns, real growth — from fashion to tech. Explore our portfolio of case studies, production work and client testimonials.", keywords: "marketing portfolio, case studies, campaign results" },
  "case-studies": { title: "Case Studies | Upmark — Real Results, Real Growth", description: "Explore Upmark's case studies showing measurable growth for brands across fashion, hospitality, tech and more.", keywords: "case studies, marketing results, growth strategy" },
  services: { title: "Services | Upmark — Full-Stack Marketing", description: "From strategy to execution — explore our integrated marketing services including performance marketing, content production, and campaign management.", keywords: "marketing services, content production, performance marketing" },
  contact: { title: "Contact Us | Upmark", description: "Ready to scale? Get in touch with Upmark to discuss your marketing strategy and start a project.", keywords: "contact upmark, marketing agency contact" },
};

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
    <div className="mt-4 p-4 bg-white rounded-xl border border-white/10">
      <div className="text-sm text-[#1a0dab] font-medium truncate">{title || "Page Title"}</div>
      <div className="text-xs text-[#006621] mt-0.5">https://upmark.co{path}</div>
      <div className="text-xs text-[#545454] mt-1 line-clamp-2">{description || "Page description will appear here..."}</div>
    </div>
  );
}

function PageSection({ pageKey, label, path, config, onChange }: {
  pageKey: string;
  label: string;
  path: string;
  config: SeoPageConfig;
  onChange: (key: string, field: keyof SeoPageConfig, value: string) => void;
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
            <h3 className="text-sm font-semibold text-[#F8FAFC]">{label}</h3>
            <p className="text-[10px] text-[#94A3B8] font-mono">{path}</p>
          </div>
        </div>
        <ChevronDown size={16} className={`text-[#94A3B8] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-white/5 pt-5 space-y-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#F8FAFC]">Page Title</label>
              <CharacterCounter value={config.title || ""} max={60} />
            </div>
            <input
              value={config.title || ""}
              onChange={(e) => onChange(pageKey, "title", e.target.value)}
              placeholder="Page title (recommended: 50-60 characters)"
              className={inputClass}
            />
          </div>

          {/* Meta Description */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#F8FAFC]">Meta Description</label>
              <CharacterCounter value={config.description || ""} max={160} />
            </div>
            <textarea
              value={config.description || ""}
              onChange={(e) => onChange(pageKey, "description", e.target.value)}
              placeholder="Compelling meta description (recommended: 120-160 characters)"
              className={`${inputClass} resize-none`}
              rows={3}
            />
          </div>

          {/* OG Image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#F8FAFC]">OG Image URL</label>
            <input
              value={config.ogImage || ""}
              onChange={(e) => onChange(pageKey, "ogImage", e.target.value)}
              placeholder="https://res.cloudinary.com/... (1200x630 recommended)"
              className={inputClass}
            />
          </div>

          {/* Keywords */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#F8FAFC]">Keywords</label>
            <input
              value={config.keywords || ""}
              onChange={(e) => onChange(pageKey, "keywords", e.target.value)}
              placeholder="keyword1, keyword2, keyword3"
              className={inputClass}
            />
            <p className="text-[10px] text-[#94A3B8]">Comma-separated. Used for meta keywords tag.</p>
          </div>

          {/* Google Preview */}
          <div>
            <label className="text-xs font-medium text-[#94A3B8] mb-2 block">Google Search Preview</label>
            <GooglePreview
              title={config.title || ""}
              description={config.description || ""}
              path={path}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function SeoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [seoConfig, setSeoConfig] = useState<Record<string, SeoPageConfig>>(DEFAULT_SEO);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSiteSettings();
        if (data?.seo) {
          // Merge with defaults so all pages have entries
          const merged = { ...DEFAULT_SEO };
          for (const key of Object.keys(data.seo)) {
            merged[key] = { ...merged[key], ...data.seo[key] };
          }
          setSeoConfig(merged);
        }
      } catch (error) {
        console.error("Failed to load SEO settings:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleFieldChange = (pageKey: string, field: keyof SeoPageConfig, value: string) => {
    setSeoConfig((prev) => ({
      ...prev,
      [pageKey]: { ...prev[pageKey], [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage("");
    try {
      await updateSiteSettings({ seo: seoConfig });
      // Revalidate all public pages
      await Promise.all(
        SEO_PAGES.map((p) => revalidatePathAction(p.path))
      );
      setSuccessMessage("SEO settings saved successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save SEO settings:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-[#94A3B8]">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC] flex items-center gap-3">
            <Globe className="text-[#3B82F6]" size={24} /> SEO Management
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Manage page titles, meta descriptions, and Open Graph data for each page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {successMessage && (
            <span className="text-emerald-400 text-sm">{successMessage}</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save SEO
          </button>
        </div>
      </div>

      {/* Per-page SEO sections */}
      <div className="flex flex-col gap-4">
        {SEO_PAGES.map((page) => (
          <PageSection
            key={page.key}
            pageKey={page.key}
            label={page.label}
            path={page.path}
            config={seoConfig[page.key] || {}}
            onChange={handleFieldChange}
          />
        ))}
      </div>

      {/* Bottom save */}
      <div className="flex items-center justify-between py-4">
        <div>
          {successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save All SEO Settings
        </button>
      </div>
    </div>
  );
}
