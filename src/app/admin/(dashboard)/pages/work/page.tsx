"use client";

import { useCallback, useState, useEffect } from "react";
import { getWorkItems, createWorkItem, updateWorkItem, deleteWorkItem, batchUpdateWorkItems, getSiteSettings, updateSiteSettings, getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/firestore";
import { WorkItemForm } from "@/components/admin/WorkItemForm";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import { SeoSection } from "@/components/admin/ui/SeoSection";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { RowSkeleton } from "@/components/admin/ui/Skeleton";
import { FormModal } from "@/components/admin/ui/FormModal";
import { useCollection } from "@/hooks/useCollection";
import { revalidatePathAction } from "@/app/actions";
import {
  Plus, Pencil, Trash2, X, FileText, RefreshCw, Save, Loader2, Film, MessageSquareQuote, Star, Quote, Search, ArrowUp, ArrowDown,
} from "lucide-react";
import type { WorkItem, WorkItemCategory, WorkSection, SeoPageConfig, Testimonial, PageVisibility } from "@/types";

type Tab = "portfolio" | "production" | "testimonials";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "portfolio", label: "Portfolio", icon: FileText },
  { key: "production", label: "Production", icon: Film },
  { key: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
];

const categoryBadgeColor: Record<string, string> = {
  Studies: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Success Stories": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Stills & Motions": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Portfolio": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Client Testimonials": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Production": "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const WORK_SEO_DEFAULTS: SeoPageConfig = {
  title: "Our Work | Upmark — Portfolio & Results",
  description: "See the results. Real campaigns, real growth — from fashion to tech. Explore our portfolio of case studies, production work and client testimonials.",
  keywords: "marketing portfolio, case studies, campaign results",
};

const inputClass = "w-full bg-primary-bg border border-primary-text/10 rounded-lg px-4 py-3 text-primary-text placeholder-primary-text/30 focus:outline-none focus:border-accent-blue transition-colors text-sm";

export default function WorkPageSettings() {
  // ─── Tab state ──────────────────────────────
  const [activeTab, setActiveTab] = useState<Tab>("portfolio");

  // ─── Work Items CRUD ─────────────────────────
  const [showWorkForm, setShowWorkForm] = useState(false);
  const [editingWorkItem, setEditingWorkItem] = useState<WorkItem | undefined>();
  const [workItemDefaultCategory, setWorkItemDefaultCategory] = useState<WorkItemCategory>("Portfolio");

  const fetchItems = useCallback(() => getWorkItems(), []);
  const coll = useCollection<WorkItem, Omit<WorkItem, "id" | "createdAt" | "updatedAt">>(
    fetchItems, createWorkItem, updateWorkItem, deleteWorkItem, ["title", "client", "category"]
  );

  // Per-tab search for work items
  const [portfolioSearch, setPortfolioSearch] = useState("");
  const [productionSearch, setProductionSearch] = useState("");

  // ─── Sort mode ─────────────────────────────
  type SortMode = "alphabetical" | "publishDate" | "custom";
  const [portfolioSortMode, setPortfolioSortMode] = useState<SortMode>("publishDate");
  const [productionSortMode, setProductionSortMode] = useState<SortMode>("publishDate");
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  function sortItems(items: WorkItem[], mode: SortMode): WorkItem[] {
    const sorted = [...items];
    switch (mode) {
      case "alphabetical":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "publishDate":
        sorted.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() ?? 0;
          const bTime = b.createdAt?.toMillis?.() ?? 0;
          return bTime - aTime;
        });
        break;
      case "custom":
        sorted.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        break;
    }
    return sorted;
  }

  async function applySortMode(
    targetItems: WorkItem[],
    mode: SortMode
  ): Promise<void> {
    if (targetItems.length === 0) return;
    const sorted = sortItems(targetItems, mode);
    const updates = sorted.map((item, i) => ({
      id: item.id!,
      data: { order: i },
    }));
    await batchUpdateWorkItems(updates);
    await coll.refresh();
  }

  async function handleMoveItem(
    items: WorkItem[],
    index: number,
    direction: "up" | "down"
  ) {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === items.length - 1)
    )
      return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const item = items[index];
    const swapItem = items[swapIndex];
    if (!item.id || !swapItem.id) return;

    setReorderingId(item.id);
    try {
      await batchUpdateWorkItems([
        { id: item.id, data: { order: swapItem.order ?? index } },
        { id: swapItem.id, data: { order: item.order ?? swapIndex } },
      ]);
      await coll.refresh();
    } catch (err) {
      console.error("Failed to reorder:", err);
    } finally {
      setReorderingId(null);
    }
  }

  const portfolioItems = coll.items.filter(
    (item) =>
      (["Studies", "Portfolio", "Success Stories", "Client Testimonials"].includes(item.category)) &&
      (!portfolioSearch ||
        [item.title, item.client, item.category].some((v) =>
          v?.toLowerCase().includes(portfolioSearch.toLowerCase())
        ))
  );
  const productionItems = coll.items.filter(
    (item) =>
      ["Stills & Motions", "Production"].includes(item.category) &&
      (!productionSearch ||
        [item.title, item.client, item.category].some((v) =>
          v?.toLowerCase().includes(productionSearch.toLowerCase())
        ))
  );

  const sortedPortfolio = sortItems(portfolioItems, portfolioSortMode);
  const sortedProduction = sortItems(productionItems, productionSortMode);

  // ─── Testimonials CRUD ───────────────────────
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | undefined>();
  const [deletingTestimonialId, setDeletingTestimonialId] = useState<string | null>(null);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<string | null>(null);
  const [testimonialSearch, setTestimonialSearch] = useState("");

  const featuredCount = testimonials.filter((t) => t.featured).length;

  const fetchTestimonials = useCallback(async () => {
    setTestimonialsLoading(true);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
    } finally {
      setTestimonialsLoading(false);
    }
  }, []);

  const filteredTestimonials = testimonials.filter(
    (t) =>
      !testimonialSearch ||
      t.name?.toLowerCase().includes(testimonialSearch.toLowerCase()) ||
      t.role?.toLowerCase().includes(testimonialSearch.toLowerCase()) ||
      t.quote?.toLowerCase().includes(testimonialSearch.toLowerCase())
  );

  // ─── Section settings ────────────────────────
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
    autoplayVideos: true,
    detailFields: ["title", "client", "description"],
  });
  const [testimonialsSection, setTestimonialsSection] = useState<WorkSection>({
    label: "CLIENT STORIES",
    title: "Don't just take our word for it.",
    subtitle: "",
  });
  const [seo, setSeo] = useState<SeoPageConfig>(WORK_SEO_DEFAULTS);
  const [visibility, setVisibility] = useState<PageVisibility>({});

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        if (data) {
          if (data.portfolioSection) setPortfolioSection(data.portfolioSection);
          if (data.productionSection) setProductionSection(data.productionSection);
          if (data.testimonialsSection) setTestimonialsSection(data.testimonialsSection);
          if (data.seo?.work) setSeo({ ...WORK_SEO_DEFAULTS, ...data.seo.work });
          if (data.visibility) setVisibility(data.visibility);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (activeTab === "testimonials") fetchTestimonials();
  }, [activeTab, fetchTestimonials]);

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
        testimonialsSection,
        visibility,
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

  // ─── Work Item form helpers ──────────────────
  function openCreateWorkItem(category: WorkItemCategory) {
    setEditingWorkItem({ category } as WorkItem);
    setWorkItemDefaultCategory(category);
    setShowWorkForm(true);
  }
  function openEditWorkItem(item: WorkItem) {
    setEditingWorkItem(item);
    setWorkItemDefaultCategory(item.category);
    setShowWorkForm(true);
  }
  function closeWorkForm() {
    setShowWorkForm(false);
    setEditingWorkItem(undefined);
  }

  // ─── Testimonial handlers ────────────────────
  async function handleCreateTestimonial(data: Omit<Testimonial, "id" | "createdAt" | "updatedAt">) {
    await createTestimonial(data);
    setShowTestimonialForm(false);
    await fetchTestimonials();
  }

  async function handleUpdateTestimonial(data: Omit<Testimonial, "id" | "createdAt" | "updatedAt">) {
    if (!editingTestimonial?.id) return;
    await updateTestimonial(editingTestimonial.id, data);
    setEditingTestimonial(undefined);
    setShowTestimonialForm(false);
    await fetchTestimonials();
  }

  async function handleDeleteTestimonial(id: string) {
    setDeletingTestimonialId(id);
    try {
      await deleteTestimonial(id);
      await fetchTestimonials();
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeletingTestimonialId(null);
    }
  }

  async function handleToggleFeatured(testimonial: Testimonial) {
    if (!testimonial.id) return;
    const newFeatured = !testimonial.featured;
    if (newFeatured && featuredCount >= 3) {
      alert("You can only feature up to 3 testimonials. Unfeature one first.");
      return;
    }
    setTogglingFeaturedId(testimonial.id);
    try {
      await updateTestimonial(testimonial.id, { featured: newFeatured });
      await fetchTestimonials();
    } catch (err) {
      console.error("Failed to toggle featured:", err);
    } finally {
      setTogglingFeaturedId(null);
    }
  }

  function openCreateTestimonial() {
    setEditingTestimonial(undefined);
    setShowTestimonialForm(true);
  }

  function openEditTestimonial(testimonial: Testimonial) {
    setEditingTestimonial(testimonial);
    setShowTestimonialForm(true);
  }

  function closeTestimonialForm() {
    setShowTestimonialForm(false);
    setEditingTestimonial(undefined);
  }

  // ─── Tab title / desc mapping ────────────────
  const tabMeta: Record<Tab, { title: string; desc: string }> = {
    portfolio: {
      title: "Portfolio",
      desc: "Case studies and success stories displayed in the portfolio carousel.",
    },
    production: {
      title: "Production",
      desc: "Stills and motion content displayed in the production carousel.",
    },
    testimonials: {
      title: "Testimonials",
      desc: "Client testimonials displayed in the testimonials carousel.",
    },
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <PageHeader
        title="Work Page"
        description="Manage all three sections of the work page — portfolio, production, and testimonials."
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={coll.refresh}
              className="flex items-center gap-2 px-4 py-2 bg-primary-text/5 hover:bg-primary-text/10 text-muted-text hover:text-primary-text text-sm rounded-lg border border-primary-text/5 transition-all"
            >
              <RefreshCw size={14} className={coll.loading ? "animate-spin" : ""} />
            </button>
          </div>
        }
      />

      {/* ─── Work Item Form Modal ─────────────────── */}
      <FormModal
        open={showWorkForm}
        onClose={closeWorkForm}
        title={editingWorkItem?.id ? "Edit Work Item" : "New Work Item"}
      >
        <WorkItemForm
          initialData={editingWorkItem}
          onSubmit={async (data) => {
            if (editingWorkItem?.id) {
              await coll.update(editingWorkItem.id, data);
            } else {
              await coll.create(data);
            }
            closeWorkForm();
          }}
          onCancel={closeWorkForm}
        />
      </FormModal>

      {/* ─── Tab Bar ──────────────────────────────── */}
      <div className="flex gap-1 bg-secondary-surface border border-primary-text/10 rounded-xl p-1 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "bg-accent-blue/10 text-accent-blue"
                  : "text-muted-text hover:text-primary-text hover:bg-primary-text/5"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════
          PORTFOLIO TAB
          ════════════════════════════════════════════ */}
      {activeTab === "portfolio" && (
        <div className="flex flex-col gap-6">
          <div className="bg-secondary-surface border border-primary-text/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-primary-text mb-1">{tabMeta.portfolio.title}</h2>
            <p className="text-sm text-muted-text mb-4">{tabMeta.portfolio.desc}</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-muted-text mb-1">Label (badge text)</label>
                <input value={portfolioSection.label} onChange={(e) => setPortfolioSection({ ...portfolioSection, label: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-muted-text mb-1">Title</label>
                <input value={portfolioSection.title} onChange={(e) => setPortfolioSection({ ...portfolioSection, title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-muted-text mb-1">Subtitle</label>
                <input value={portfolioSection.subtitle} onChange={(e) => setPortfolioSection({ ...portfolioSection, subtitle: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-1 bg-primary-bg border border-primary-text/5 rounded-lg p-1">
              {(["alphabetical", "publishDate", "custom"] as SortMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={async () => {
                    setPortfolioSortMode(mode);
                    if (mode !== "custom") {
                      await applySortMode(portfolioItems, mode);
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    portfolioSortMode === mode
                      ? "bg-accent-blue/10 text-accent-blue"
                      : "text-muted-text hover:text-primary-text"
                  }`}
                >
                  {mode === "alphabetical" ? "A–Z" : mode === "publishDate" ? "Date" : "Custom"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 flex-1 max-w-sm">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" />
                <input
                  type="text"
                  placeholder="Search portfolio items..."
                  value={portfolioSearch}
                  onChange={(e) => setPortfolioSearch(e.target.value)}
                  className="w-full bg-secondary-surface border border-primary-text/5 rounded-lg pl-11 pr-4 py-3 text-primary-text placeholder-primary-text/30 focus:outline-none focus:border-accent-blue transition-colors text-sm"
                />
              </div>
              <button
                onClick={() => openCreateWorkItem("Studies")}
                className="flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white text-sm font-medium rounded-lg transition-all flex-shrink-0"
              >
                <Plus size={16} /> Add New
              </button>
            </div>
          </div>

          {coll.loading ? (
            <RowSkeleton rows={3} />
          ) : portfolioItems.length === 0 ? (
            <EmptyState
              icon={FileText}
              message={portfolioSearch ? "No portfolio items match your search." : 'No portfolio items yet. Click "Add New" to create one.'}
              action={portfolioSearch ? undefined : { label: "Add New", onClick: () => openCreateWorkItem("Studies") }}
            />
          ) : (
            <div className="bg-secondary-surface rounded-xl border border-primary-text/5 overflow-hidden">
              <div className="hidden md:grid md:grid-cols-[32px_1fr_100px_80px_80px] gap-4 px-6 py-3 border-b border-primary-text/5 bg-primary-text/[0.02]">
                <span />
                <span className="text-xs font-semibold text-muted-text uppercase tracking-wider">Title / Client</span>
                <span className="text-xs font-semibold text-muted-text uppercase tracking-wider">Category</span>
                <span className="text-xs font-semibold text-muted-text uppercase tracking-wider">Status</span>
                <span className="text-xs font-semibold text-muted-text uppercase tracking-wider text-right">Actions</span>
              </div>
              {sortedPortfolio.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[32px_1fr_100px_80px_80px] gap-4 px-6 py-4 border-b border-primary-text/5 last:border-0 hover:bg-primary-text/[0.02] transition-colors items-center"
                >
                  <div className="flex flex-col items-center gap-0.5">
                    {portfolioSortMode === "custom" && (
                      <>
                        <button
                          onClick={() => handleMoveItem(sortedPortfolio, index, "up")}
                          disabled={index === 0 || reorderingId !== null}
                          className="p-0.5 text-muted-text hover:text-primary-text disabled:opacity-20 transition-colors"
                          title="Move up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          onClick={() => handleMoveItem(sortedPortfolio, index, "down")}
                          disabled={index === sortedPortfolio.length - 1 || reorderingId !== null}
                          className="p-0.5 text-muted-text hover:text-primary-text disabled:opacity-20 transition-colors"
                          title="Move down"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-primary-text truncate">{item.title}</p>
                    <p className="text-xs text-muted-text truncate">{item.client}</p>
                  </div>
                  <div>
                    <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${categoryBadgeColor[item.category] || "bg-primary-text/5 text-muted-text border-primary-text/10"}`}>
                      {item.category}
                    </span>
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${item.published ? "text-green-400" : "text-muted-text"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.published ? "bg-green-400" : "bg-muted-text"}`} />
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEditWorkItem(item)} className="p-2 text-muted-text hover:text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-all" title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => item.id && coll.remove(item.id)} disabled={coll.deletingId === item.id} className="p-2 text-muted-text hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50" title="Delete">
                      {coll.deletingId === item.id ? <X size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!coll.loading && portfolioItems.length > 0 && (
            <p className="text-xs text-muted-text text-center">
              {portfolioItems.length} portfolio {portfolioItems.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════
          PRODUCTION TAB
          ════════════════════════════════════════════ */}
      {activeTab === "production" && (
        <div className="flex flex-col gap-6">
          <div className="bg-secondary-surface border border-primary-text/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-primary-text mb-1">{tabMeta.production.title}</h2>
            <p className="text-sm text-muted-text mb-4">{tabMeta.production.desc}</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-muted-text mb-1">Label (badge text)</label>
                <input value={productionSection.label} onChange={(e) => setProductionSection({ ...productionSection, label: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-muted-text mb-1">Title</label>
                <input value={productionSection.title} onChange={(e) => setProductionSection({ ...productionSection, title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-muted-text mb-1">Subtitle</label>
                <input value={productionSection.subtitle} onChange={(e) => setProductionSection({ ...productionSection, subtitle: e.target.value })} className={inputClass} />
              </div>

              <div className="border-t border-primary-text/10 pt-4 mt-2">
                <label className="block text-xs text-muted-text mb-1">Autoplay Videos in Carousel</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={productionSection.autoplayVideos ?? true} onChange={(e) => setProductionSection({ ...productionSection, autoplayVideos: e.target.checked })} className="sr-only peer" />
                  <div className="w-9 h-5 bg-primary-text/10 rounded-full peer peer-checked:bg-accent-blue peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
              </div>

              <div className="border-t border-primary-text/10 pt-4 mt-2">
                <label className="block text-xs text-muted-text mb-3">Detail Fields (shown in preview overlay)</label>
                {["title", "client", "description", "tag", "mediaType", "duration", "details"].map((field) => (
                  <label key={field} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productionSection.detailFields?.includes(field) ?? false}
                      onChange={(e) => {
                        const current = productionSection.detailFields || [];
                        setProductionSection({
                          ...productionSection,
                          detailFields: e.target.checked
                            ? [...current, field]
                            : current.filter((f) => f !== field),
                        });
                      }}
                      className="accent-accent-blue"
                    />
                    <span className="text-sm text-primary-text capitalize">{field}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-1 bg-primary-bg border border-primary-text/5 rounded-lg p-1">
              {(["alphabetical", "publishDate", "custom"] as SortMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={async () => {
                    setProductionSortMode(mode);
                    if (mode !== "custom") {
                      await applySortMode(productionItems, mode);
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    productionSortMode === mode
                      ? "bg-accent-blue/10 text-accent-blue"
                      : "text-muted-text hover:text-primary-text"
                  }`}
                >
                  {mode === "alphabetical" ? "A–Z" : mode === "publishDate" ? "Date" : "Custom"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 flex-1 max-w-sm">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" />
                <input
                  type="text"
                  placeholder="Search production items..."
                  value={productionSearch}
                  onChange={(e) => setProductionSearch(e.target.value)}
                  className="w-full bg-secondary-surface border border-primary-text/5 rounded-lg pl-11 pr-4 py-3 text-primary-text placeholder-primary-text/30 focus:outline-none focus:border-accent-blue transition-colors text-sm"
                />
              </div>
              <button
                onClick={() => openCreateWorkItem("Production")}
                className="flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white text-sm font-medium rounded-lg transition-all flex-shrink-0"
              >
                <Plus size={16} /> Add New
              </button>
            </div>
          </div>

          {coll.loading ? (
            <RowSkeleton rows={3} />
          ) : productionItems.length === 0 ? (
            <EmptyState
              icon={Film}
              message={productionSearch ? "No production items match your search." : 'No production items yet. Click "Add New" to create one.'}
              action={productionSearch ? undefined : { label: "Add New", onClick: () => openCreateWorkItem("Production") }}
            />
          ) : (
            <div className="bg-secondary-surface rounded-xl border border-primary-text/5 overflow-hidden">
              <div className="hidden md:grid md:grid-cols-[32px_1fr_100px_80px_80px] gap-4 px-6 py-3 border-b border-primary-text/5 bg-primary-text/[0.02]">
                <span />
                <span className="text-xs font-semibold text-muted-text uppercase tracking-wider">Title / Client</span>
                <span className="text-xs font-semibold text-muted-text uppercase tracking-wider">Folder</span>
                <span className="text-xs font-semibold text-muted-text uppercase tracking-wider">Status</span>
                <span className="text-xs font-semibold text-muted-text uppercase tracking-wider text-right">Actions</span>
              </div>
              {sortedProduction.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[32px_1fr_100px_80px_80px] gap-4 px-6 py-4 border-b border-primary-text/5 last:border-0 hover:bg-primary-text/[0.02] transition-colors items-center"
                >
                  <div className="flex flex-col items-center gap-0.5">
                    {productionSortMode === "custom" && (
                      <>
                        <button
                          onClick={() => handleMoveItem(sortedProduction, index, "up")}
                          disabled={index === 0 || reorderingId !== null}
                          className="p-0.5 text-muted-text hover:text-primary-text disabled:opacity-20 transition-colors"
                          title="Move up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          onClick={() => handleMoveItem(sortedProduction, index, "down")}
                          disabled={index === sortedProduction.length - 1 || reorderingId !== null}
                          className="p-0.5 text-muted-text hover:text-primary-text disabled:opacity-20 transition-colors"
                          title="Move down"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-primary-text truncate">{item.title}</p>
                    <p className="text-xs text-muted-text truncate">{item.client}</p>
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20">
                      {item.galleryUrls?.length ? `${item.galleryUrls.length} Media` : "Empty"}
                    </span>
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${item.published ? "text-green-400" : "text-muted-text"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.published ? "bg-green-400" : "bg-muted-text"}`} />
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEditWorkItem(item)} className="p-2 text-muted-text hover:text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-all" title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => item.id && coll.remove(item.id)} disabled={coll.deletingId === item.id} className="p-2 text-muted-text hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50" title="Delete">
                      {coll.deletingId === item.id ? <X size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!coll.loading && productionItems.length > 0 && (
            <p className="text-xs text-muted-text text-center">
              {productionItems.length} production {productionItems.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════
          TESTIMONIALS TAB
          ════════════════════════════════════════════ */}
      {activeTab === "testimonials" && (
        <div className="flex flex-col gap-6">
          <div className="bg-secondary-surface border border-primary-text/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-primary-text mb-1">{tabMeta.testimonials.title}</h2>
            <p className="text-sm text-muted-text mb-4">{tabMeta.testimonials.desc}</p>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-muted-text mb-1">Label (badge text)</label>
                <input value={testimonialsSection.label} onChange={(e) => setTestimonialsSection({ ...testimonialsSection, label: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-muted-text mb-1">Title</label>
                <input value={testimonialsSection.title} onChange={(e) => setTestimonialsSection({ ...testimonialsSection, title: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs text-muted-text mb-1">Subtitle</label>
                <input value={testimonialsSection.subtitle} onChange={(e) => setTestimonialsSection({ ...testimonialsSection, subtitle: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Testimonials Form */}
          {showTestimonialForm && (
            <TestimonialForm
              initialData={editingTestimonial}
              onSubmit={editingTestimonial ? handleUpdateTestimonial : handleCreateTestimonial}
              onCancel={closeTestimonialForm}
            />
          )}

          {!showTestimonialForm && (
            <>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" />
                    <input
                      type="text"
                      placeholder="Search testimonials..."
                      value={testimonialSearch}
                      onChange={(e) => setTestimonialSearch(e.target.value)}
                      className="w-full bg-secondary-surface border border-primary-text/5 rounded-lg pl-11 pr-4 py-3 text-primary-text placeholder-primary-text/30 focus:outline-none focus:border-accent-blue transition-colors text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-accent-gold/10 border border-accent-gold/20 rounded-lg text-sm flex-shrink-0">
                    <Star size={14} className="text-accent-gold" />
                    <span className="text-accent-gold font-medium">{featuredCount}/3</span>
                    <span className="text-muted-text text-xs">featured</span>
                  </div>
                </div>
                <button
                  onClick={openCreateTestimonial}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white text-sm font-medium rounded-lg transition-all flex-shrink-0"
                >
                  <Plus size={16} /> Add New
                </button>
              </div>

              {testimonialsLoading ? (
                <RowSkeleton rows={3} />
              ) : filteredTestimonials.length === 0 ? (
                <EmptyState
                  icon={Quote}
                  message={testimonialSearch ? "No testimonials match your search." : 'No testimonials yet. Click "Add New" to create one.'}
                  action={testimonialSearch ? undefined : { label: "Add New", onClick: openCreateTestimonial }}
                />
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredTestimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className={`bg-secondary-surface rounded-xl border p-6 hover:border-primary-text/10 transition-all group ${
                        testimonial.featured ? "border-accent-gold/30 bg-accent-gold/[0.03]" : "border-primary-text/5"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <Quote size={24} className="text-accent-blue/30 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {testimonial.featured && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-gold/15 border border-accent-gold/30 rounded text-[10px] font-bold uppercase tracking-wider text-accent-gold">
                                <Star size={10} fill="currentColor" />
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-primary-text italic mb-4 line-clamp-3">
                            &quot;{testimonial.quote}&quot;
                          </p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-primary-text">{testimonial.name}</p>
                              <p className="text-xs text-muted-text">{testimonial.role}</p>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleToggleFeatured(testimonial)}
                                disabled={togglingFeaturedId === testimonial.id}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                  testimonial.featured
                                    ? "text-accent-gold bg-accent-gold/10 hover:bg-accent-gold/20"
                                    : "text-muted-text bg-primary-text/5 hover:bg-primary-text/10"
                                } disabled:opacity-50`}
                              >
                                <Star size={12} fill={testimonial.featured ? "currentColor" : "none"} />
                                {testimonial.featured ? "Unfeature" : "Feature"}
                              </button>
                              <button
                                onClick={() => openEditTestimonial(testimonial)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-accent-blue bg-accent-blue/10 hover:bg-accent-blue/20 rounded-lg transition-colors"
                              >
                                <Pencil size={12} />
                                Edit
                              </button>
                              <button
                                onClick={() => testimonial.id && handleDeleteTestimonial(testimonial.id)}
                                disabled={deletingTestimonialId === testimonial.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {deletingTestimonialId === testimonial.id ? (
                                  <X size={12} className="animate-spin" />
                                ) : (
                                  <Trash2 size={12} />
                                )}
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!testimonialsLoading && filteredTestimonials.length > 0 && (
                <p className="text-xs text-muted-text text-center">
                  {filteredTestimonials.length} testimonial{filteredTestimonials.length === 1 ? "" : "s"}
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* ─── Page & Section Visibility ────────────── */}
      <div className="bg-secondary-surface border border-primary-text/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent-blue" />
          <h2 className="text-lg font-semibold text-primary-text">Visibility</h2>
        </div>
        <p className="text-sm text-muted-text mb-4">Toggle sections on/off on the public work page.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { key: "work", label: "Page (entire work page)" },
            { key: "workHeader", label: "Page Header" },
            { key: "workPortfolio", label: "Portfolio" },
            { key: "workProduction", label: "Production" },
            { key: "workTestimonials", label: "Testimonials" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 p-3 rounded-lg bg-primary-bg border border-primary-text/5 cursor-pointer hover:border-primary-text/10 transition-colors">
              <input
                type="checkbox"
                checked={visibility[key as keyof PageVisibility] ?? true}
                onChange={(e) => setVisibility((prev) => ({ ...prev, [key]: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-primary-text/10 rounded-full peer-checked:bg-accent-blue peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative flex-shrink-0"></div>
              <span className="text-sm text-primary-text">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ─── SEO & Save ──────────────────────────── */}
      <SeoSection config={seo} onChange={handleSeoChange} path="/work" />

      <div className="flex items-center justify-end gap-3">
        {successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}
        <button onClick={handleSaveSettings} disabled={saving} className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Settings
        </button>
      </div>
    </div>
  );
}