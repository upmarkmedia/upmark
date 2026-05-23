"use client";

import { useCallback, useState, useEffect } from "react";
import { getWorkItems, createWorkItem, updateWorkItem, deleteWorkItem, getSiteSettings, updateSiteSettings } from "@/lib/firestore";
import { WorkItemForm } from "@/components/admin/WorkItemForm";
import { SeoSection } from "@/components/admin/ui/SeoSection";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { RowSkeleton } from "@/components/admin/ui/Skeleton";
import { FormModal } from "@/components/admin/ui/FormModal";
import { useCollection } from "@/hooks/useCollection";
import { revalidatePathAction } from "@/app/actions";
import {
  Plus, Pencil, Trash2, X, FileText, RefreshCw, Save, Loader2, ChevronDown, Film,
} from "lucide-react";
import type { WorkItem, WorkItemCategory, WorkSection, SeoPageConfig } from "@/types";

const CATEGORY_TABS: { label: string; value: WorkItemCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Studies", value: "Studies" },
  { label: "Success Stories", value: "Success Stories" },
  { label: "Stills & Motions", value: "Stills & Motions" },
];

const categoryBadgeColor: Record<string, string> = {
  Studies: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Success Stories": "bg-green-500/10 text-green-400 border-green-500/20",
  "Stills & Motions": "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const WORK_SEO_DEFAULTS: SeoPageConfig = {
  title: "Our Work | Upmark — Portfolio & Results",
  description: "See the results. Real campaigns, real growth — from fashion to tech. Explore our portfolio of case studies, production work and client testimonials.",
  keywords: "marketing portfolio, case studies, campaign results",
};

function Section({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-3">
          <Icon size={20} className="text-[#3B82F6]" />
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <ChevronDown size={18} className={`text-[#94A3B8] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-6 pb-6 border-t border-white/5 pt-6">{children}</div>}
    </div>
  );
}

const inputClass = "w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-3 text-[#F8FAFC] placeholder-white/30 focus:outline-none focus:border-[#3B82F6] transition-colors text-sm";

export default function WorkPageSettings() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkItem | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<WorkItemCategory | "all">("all");

  const fetchItems = useCallback(() => getWorkItems(), []);
  const coll = useCollection<WorkItem, Omit<WorkItem, "id" | "createdAt" | "updatedAt">>(
    fetchItems,
    createWorkItem,
    updateWorkItem,
    deleteWorkItem,
    ["title", "client", "category"]
  );

  const filteredByCategory = categoryFilter === "all"
    ? coll.filteredItems
    : coll.filteredItems.filter((item) => item.category === categoryFilter);

  // ─── Section settings ──────────────────────────────
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [portfolioSection, setPortfolioSection] = useState<WorkSection>({
    label: "PORTFOLIO",
    title: "Strategies that deliver.",
    subtitle: "Deep-dive case studies demonstrating measurable growth across industries.",
  });
  const [productionSection, setProductionSection] = useState<WorkSection>({
    label: "PRODUCTION",
    title: "Production showcase.",
    subtitle: "Cinematic quality stills and motion content produced entirely in-house.",
  });
  const [seo, setSeo] = useState<SeoPageConfig>(WORK_SEO_DEFAULTS);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        if (data) {
          if (data.portfolioSection) setPortfolioSection(data.portfolioSection);
          if (data.productionSection) setProductionSection(data.productionSection);
          if (data.seo?.work) setSeo({ ...WORK_SEO_DEFAULTS, ...data.seo.work });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
    load();
  }, []);

  const handleSeoChange = (field: keyof SeoPageConfig, value: string) => {
    setSeo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setSuccessMessage("");
    try {
      await updateSiteSettings({
        portfolioSection,
        productionSection,
        seo: { work: seo },
      });
      await revalidatePathAction("/work");
      setSuccessMessage("Work page settings saved.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Form helpers ──────────────────────────────────
  function openCreate() {
    setEditingItem(undefined);
    setShowForm(true);
  }
  function openEdit(item: WorkItem) {
    setEditingItem(item);
    setShowForm(true);
  }
  function closeForm() {
    setShowForm(false);
    setEditingItem(undefined);
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <PageHeader
        title="Work Page"
        description="Manage work entries and configure carousel sections & SEO."
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={coll.refresh}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white text-sm rounded-lg border border-white/5 transition-all"
            >
              <RefreshCw size={14} className={coll.loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all"
            >
              <Plus size={16} /> Add New
            </button>
          </div>
        }
      />

      {/* ─── Work Items List ──────────────────────────── */}
      <FormModal
        open={showForm}
        onClose={closeForm}
        title={editingItem ? "Edit Work Item" : "New Work Item"}
      >
        <WorkItemForm
          initialData={editingItem}
          onSubmit={async (data) => {
            if (editingItem?.id) {
              await coll.update(editingItem.id, data);
            } else {
              await coll.create(data);
            }
            closeForm();
          }}
          onCancel={closeForm}
        />
      </FormModal>

      <SearchInput
        value={coll.searchQuery}
        onChange={coll.setSearchQuery}
        placeholder="Search by title, client, or category..."
      />

      <div className="flex gap-1 bg-[#1E293B] border border-white/10 rounded-xl p-1 overflow-x-auto">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCategoryFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              categoryFilter === tab.value
                ? "bg-[#3B82F6]/10 text-[#3B82F6]"
                : "text-[#94A3B8] hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {coll.loading ? (
        <RowSkeleton rows={3} />
      ) : filteredByCategory.length === 0 ? (
        <EmptyState
          icon={FileText}
          message={
            coll.searchQuery
              ? "No work items match your search."
              : categoryFilter !== "all"
                ? `No ${categoryFilter.toLowerCase()} yet. Click "Add New" to create one.`
                : 'No work items yet. Click "Add New" to create one.'
          }
          action={coll.searchQuery ? undefined : { label: "Add New", onClick: openCreate }}
        />
      ) : (
        <div className="bg-[#1E293B] rounded-xl border border-white/5 overflow-hidden">
          <div className="hidden md:grid md:grid-cols-[1fr_100px_100px_80px_80px] gap-4 px-6 py-3 border-b border-white/5 bg-white/[0.02]">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Title / Client</span>
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Category</span>
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Status</span>
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Stats</span>
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider text-right">Actions</span>
          </div>
          {filteredByCategory.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_80px_80px] gap-2 md:gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#F8FAFC] truncate">{item.title}</p>
                <p className="text-xs text-[#94A3B8] truncate">{item.client}</p>
              </div>
              <div>
                <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${categoryBadgeColor[item.category] || "bg-white/5 text-[#94A3B8] border-white/10"}`}>
                  {item.category}
                </span>
              </div>
              <div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${item.published ? "text-green-400" : "text-[#94A3B8]"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${item.published ? "bg-green-400" : "bg-[#94A3B8]"}`} />
                  {item.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="text-xs text-[#94A3B8] truncate">
                {item.stat1 ? `${item.stat1} / ${item.stat2 || "—"}` : "—"}
              </div>
              <div className="flex items-center gap-2 justify-end">
                <button onClick={() => openEdit(item)} className="p-2 text-[#94A3B8] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-lg transition-all" title="Edit">
                  <Pencil size={14} />
                </button>
                <button onClick={() => item.id && coll.remove(item.id)} disabled={coll.deletingId === item.id} className="p-2 text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50" title="Delete">
                  {coll.deletingId === item.id ? <X size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!coll.loading && filteredByCategory.length > 0 && (
        <p className="text-xs text-[#94A3B8] text-center">
          {filteredByCategory.length} work {filteredByCategory.length === 1 ? "item" : "items"}
        </p>
      )}

      {/* ─── Settings ─────────────────────────────────── */}
      <Section title="Portfolio Carousel" icon={Film} defaultOpen={false}>
        <p className="text-sm text-[#94A3B8] mb-4">Configure the portfolio carousel on the work page. Displays case studies and success stories.</p>
        <div className="flex flex-col gap-3">
          <div><label className="block text-xs text-[#94A3B8] mb-1">Label (badge text)</label><input value={portfolioSection.label} onChange={(e) => setPortfolioSection({ ...portfolioSection, label: e.target.value })} className={inputClass} /></div>
          <div><label className="block text-xs text-[#94A3B8] mb-1">Title</label><input value={portfolioSection.title} onChange={(e) => setPortfolioSection({ ...portfolioSection, title: e.target.value })} className={inputClass} /></div>
          <div><label className="block text-xs text-[#94A3B8] mb-1">Subtitle</label><input value={portfolioSection.subtitle} onChange={(e) => setPortfolioSection({ ...portfolioSection, subtitle: e.target.value })} className={inputClass} /></div>
        </div>
      </Section>

      <Section title="Production Carousel" icon={Film}>
        <p className="text-sm text-[#94A3B8] mb-4">Configure the production carousel on the work page. Displays stills and motion content.</p>
        <div className="flex flex-col gap-3">
          <div><label className="block text-xs text-[#94A3B8] mb-1">Label (badge text)</label><input value={productionSection.label} onChange={(e) => setProductionSection({ ...productionSection, label: e.target.value })} className={inputClass} /></div>
          <div><label className="block text-xs text-[#94A3B8] mb-1">Title</label><input value={productionSection.title} onChange={(e) => setProductionSection({ ...productionSection, title: e.target.value })} className={inputClass} /></div>
          <div><label className="block text-xs text-[#94A3B8] mb-1">Subtitle</label><input value={productionSection.subtitle} onChange={(e) => setProductionSection({ ...productionSection, subtitle: e.target.value })} className={inputClass} /></div>
        </div>
      </Section>

      <SeoSection config={seo} onChange={handleSeoChange} path="/work" />

      <div className="flex items-center justify-end gap-3">
        {successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}
        <button onClick={handleSaveSettings} disabled={saving} className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Settings
        </button>
      </div>
    </div>
  );
}