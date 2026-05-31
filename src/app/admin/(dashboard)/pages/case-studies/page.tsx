"use client";

import { useCallback, useState, useEffect } from "react";
import {
  getCaseStudies, createCaseStudy, updateCaseStudy, deleteCaseStudy,
  getSiteSettings, updateSiteSettings,
} from "@/lib/firestore";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";
import { SeoSection } from "@/components/admin/ui/SeoSection";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { RowSkeleton } from "@/components/admin/ui/Skeleton";
import { FormModal } from "@/components/admin/ui/FormModal";
import { useCollection } from "@/hooks/useCollection";
import { revalidatePathAction } from "@/app/actions";
import {
  Plus, Pencil, Trash2, X, FileText, RefreshCw, Save, Loader2,
} from "lucide-react";
import type { CaseStudy, CaseStudyCategory, SeoPageConfig, PageVisibility } from "@/types";

const CATEGORY_TABS: { label: string; value: CaseStudyCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Studies", value: "Studies" },
  { label: "Success Stories", value: "Success Stories" },
];

const categoryBadgeColor: Record<string, string> = {
  Studies: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Success Stories": "bg-green-500/10 text-green-400 border-green-500/20",
  "Portfolio": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Client Testimonials": "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const CASE_STUDIES_SEO_DEFAULTS: SeoPageConfig = {
  title: "Case Studies | Upmark — Real Results, Real Growth",
  description: "Explore Upmark's case studies showing measurable growth for brands across fashion, hospitality, tech and more.",
  keywords: "case studies, marketing results, growth strategy",
};

export default function CaseStudiesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingStudy, setEditingStudy] = useState<CaseStudy | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<CaseStudyCategory | "all">("all");

  const fetchStudies = useCallback(() => getCaseStudies(), []);
  const coll = useCollection<CaseStudy, Omit<CaseStudy, "id" | "createdAt" | "updatedAt">>(
    fetchStudies,
    createCaseStudy,
    updateCaseStudy,
    deleteCaseStudy,
    ["title", "client", "category"]
  );

  const filteredByCategory = categoryFilter === "all"
    ? coll.filteredItems
    : coll.filteredItems.filter((cs) => cs.category === categoryFilter);

  const [seoSaving, setSeoSaving] = useState(false);
  const [seoSuccess, setSeoSuccess] = useState("");
  const [seo, setSeo] = useState<SeoPageConfig>(CASE_STUDIES_SEO_DEFAULTS);
  const [visibility, setVisibility] = useState<PageVisibility>({});
  const [visSaving, setVisSaving] = useState(false);
  const [visSuccess, setVisSuccess] = useState("");

  useEffect(() => {
    getSiteSettings().then((data) => {
      if (data?.seo?.["case-studies"]) {
        setSeo({ ...CASE_STUDIES_SEO_DEFAULTS, ...data.seo["case-studies"] });
      }
      if (data?.visibility) setVisibility(data.visibility);
    }).catch(() => {});
  }, []);

  const handleSeoChange = (field: keyof SeoPageConfig, value: string) => {
    setSeo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSeoSave = async () => {
    setSeoSaving(true);
    setSeoSuccess("");
    try {
      await updateSiteSettings({ seo: { "case-studies": seo } });
      await revalidatePathAction("/case-studies");
      setSeoSuccess("SEO saved.");
      setTimeout(() => setSeoSuccess(""), 3000);
    } catch {
      alert("Failed to save SEO.");
    } finally {
      setSeoSaving(false);
    }
  };

  const handleVisSave = async () => {
    setVisSaving(true);
    setVisSuccess("");
    try {
      await updateSiteSettings({ visibility });
      await revalidatePathAction("/case-studies");
      setVisSuccess("Visibility saved.");
      setTimeout(() => setVisSuccess(""), 3000);
    } catch {
      alert("Failed to save visibility.");
    } finally {
      setVisSaving(false);
    }
  };

  function openCreate() {
    setEditingStudy(undefined);
    setShowForm(true);
  }
  function openEdit(study: CaseStudy) {
    setEditingStudy(study);
    setShowForm(true);
  }
  function closeForm() {
    setShowForm(false);
    setEditingStudy(undefined);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Case Studies"
        description="Manage case studies, portfolio items, and SEO for the Case Studies page."
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

      <FormModal
        open={showForm}
        onClose={closeForm}
        title={editingStudy ? "Edit Case Study" : "New Case Study"}
      >
        <CaseStudyForm
          initialData={editingStudy}
          onSubmit={async (data) => {
            if (editingStudy?.id) {
              await coll.update(editingStudy.id, data);
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

      {/* Category filter tabs — replaces the old Portfolio page */}
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
              ? "No case studies match your search."
              : categoryFilter !== "all"
                ? `No ${categoryFilter.toLowerCase()} yet. Click "Add New" to create one.`
                : 'No case studies yet. Click "Add New" to create one.'
          }
          action={coll.searchQuery ? undefined : { label: "Add New", onClick: openCreate }}
        />
      ) : (
        <div className="bg-[#1E293B] rounded-xl border border-white/5 overflow-hidden">
          <div className="hidden md:grid md:grid-cols-[1fr_120px_80px_120px_80px] gap-4 px-6 py-3 border-b border-white/5 bg-white/[0.02]">
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Title / Client</span>
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Category</span>
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Status</span>
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Metrics</span>
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider text-right">Actions</span>
          </div>
          {filteredByCategory.map((study) => (
            <div
              key={study.id}
              className="grid grid-cols-1 md:grid-cols-[1fr_120px_80px_120px_80px] gap-2 md:gap-4 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#F8FAFC] truncate">{study.title}</p>
                <p className="text-xs text-[#94A3B8] truncate">{study.client}</p>
              </div>
              <div>
                <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${categoryBadgeColor[study.category] || "bg-white/5 text-[#94A3B8] border-white/10"}`}>
                  {study.category}
                </span>
              </div>
              <div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${study.published ? "text-green-400" : "text-[#94A3B8]"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${study.published ? "bg-green-400" : "bg-[#94A3B8]"}`} />
                  {study.published ? "Live" : "Draft"}
                </span>
              </div>
              <div className="text-xs text-[#94A3B8] truncate">{study.metrics?.join(", ") || "—"}</div>
              <div className="flex items-center gap-2 justify-end">
                <button onClick={() => openEdit(study)} className="p-2 text-[#94A3B8] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 rounded-lg transition-all" title="Edit">
                  <Pencil size={14} />
                </button>
                <button onClick={() => study.id && coll.remove(study.id)} disabled={coll.deletingId === study.id} className="p-2 text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50" title="Delete">
                  {coll.deletingId === study.id ? <X size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!coll.loading && filteredByCategory.length > 0 && (
        <p className="text-xs text-[#94A3B8] text-center">
          {filteredByCategory.length} case {filteredByCategory.length === 1 ? "study" : "studies"}
        </p>
      )}

      {/* ─── Page Visibility ────────────── */}
      <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
          <h2 className="text-lg font-semibold text-white">Visibility</h2>
        </div>
        <p className="text-sm text-[#94A3B8] mb-4">Toggle the case studies page on/off.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          <label className="flex items-center gap-3 p-3 rounded-lg bg-[#0F172A] border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
            <input
              type="checkbox"
              checked={visibility.caseStudies ?? true}
              onChange={(e) => setVisibility((prev) => ({ ...prev, caseStudies: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-white/10 rounded-full peer-checked:bg-[#3B82F6] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative flex-shrink-0"></div>
            <span className="text-sm text-[#F8FAFC]">Page (entire case studies page)</span>
          </label>
        </div>
        <div className="flex items-center justify-end gap-3">
          {visSuccess && <span className="text-emerald-400 text-sm">{visSuccess}</span>}
          <button onClick={handleVisSave} disabled={visSaving} className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
            {visSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Visibility
          </button>
        </div>
      </div>

      <SeoSection config={seo} onChange={handleSeoChange} path="/case-studies" />
      <div className="flex items-center justify-end gap-3">
        {seoSuccess && <span className="text-emerald-400 text-sm">{seoSuccess}</span>}
        <button onClick={handleSeoSave} disabled={seoSaving} className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
          {seoSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save SEO
        </button>
      </div>
    </div>
  );
}
