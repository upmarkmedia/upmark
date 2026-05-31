"use client";

import { useCallback, useState, useEffect } from "react";
import {
  getServices, createService, updateService, deleteService,
  getSiteSettings, updateSiteSettings,
} from "@/lib/firestore";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { SeoSection } from "@/components/admin/ui/SeoSection";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { CardSkeleton } from "@/components/admin/ui/Skeleton";
import { FormModal } from "@/components/admin/ui/FormModal";
import { useCollection } from "@/hooks/useCollection";
import { revalidatePathAction } from "@/app/actions";
import {
  Plus, Pencil, Trash2, X, Briefcase, RefreshCw, Save, Loader2,
} from "lucide-react";
import type { Service, SeoPageConfig, PageVisibility } from "@/types";

const SERVICES_SEO_DEFAULTS: SeoPageConfig = {
  title: "Services | Upmark — Full-Stack Marketing",
  description: "From strategy to execution — explore our integrated marketing services including performance marketing, content production, and campaign management.",
  keywords: "marketing services, content production, performance marketing",
};

export default function ServicesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>();

  const fetchServices = useCallback(() => getServices(), []);
  const coll = useCollection<Service, Omit<Service, "id" | "createdAt" | "updatedAt">>(
    fetchServices,
    createService,
    updateService,
    deleteService,
    ["title", "subtitle"]
  );

  const [seoSaving, setSeoSaving] = useState(false);
  const [seoSuccess, setSeoSuccess] = useState("");
  const [seo, setSeo] = useState<SeoPageConfig>(SERVICES_SEO_DEFAULTS);
  const [visibility, setVisibility] = useState<PageVisibility>({});
  const [visSaving, setVisSaving] = useState(false);
  const [visSuccess, setVisSuccess] = useState("");

  useEffect(() => {
    getSiteSettings().then((data) => {
      if (data?.seo?.services) {
        setSeo({ ...SERVICES_SEO_DEFAULTS, ...data.seo.services });
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
      await updateSiteSettings({ seo: { services: seo } });
      await revalidatePathAction("/services");
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
      await revalidatePathAction("/services");
      setVisSuccess("Visibility saved.");
      setTimeout(() => setVisSuccess(""), 3000);
    } catch {
      alert("Failed to save visibility.");
    } finally {
      setVisSaving(false);
    }
  };

  function openCreate() {
    setEditingService(undefined);
    setShowForm(true);
  }
  function openEdit(service: Service) {
    setEditingService(service);
    setShowForm(true);
  }
  function closeForm() {
    setShowForm(false);
    setEditingService(undefined);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Services"
        description="Manage your service offerings and SEO for the Services page."
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
        title={editingService ? "Edit Service" : "New Service"}
      >
        <ServiceForm
          initialData={editingService}
          onSubmit={async (data) => {
            if (editingService?.id) {
              await coll.update(editingService.id, data);
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
        placeholder="Search services..."
      />

      {coll.loading ? (
        <CardSkeleton rows={3} />
      ) : coll.filteredItems.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          message={coll.searchQuery ? "No services match your search." : 'No services yet. Click "Add New" to create one.'}
          action={coll.searchQuery ? undefined : { label: "Add New", onClick: openCreate }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coll.filteredItems.map((service) => (
            <div
              key={service.id}
              className="bg-[#1E293B] rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all group"
            >
              {service.icon_url ? (
                <div className="w-12 h-12 rounded-lg bg-[#0F172A] border border-white/5 overflow-hidden mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={service.icon_url} alt={service.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center mb-4">
                  <Briefcase size={20} className="text-[#3B82F6]" />
                </div>
              )}
              <h3 className="text-base font-semibold text-[#F8FAFC] mb-2">{service.title}</h3>
              <p className="text-sm text-[#94A3B8] line-clamp-3 mb-4">{service.description}</p>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(service)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#3B82F6] bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 rounded-lg transition-colors">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => service.id && coll.remove(service.id)} disabled={coll.deletingId === service.id} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50">
                  {coll.deletingId === service.id ? <X size={12} className="animate-spin" /> : <Trash2 size={12} />}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!coll.loading && coll.filteredItems.length > 0 && (
        <p className="text-xs text-[#94A3B8] text-center">
          {coll.filteredItems.length} service{coll.filteredItems.length === 1 ? "" : "s"}
        </p>
      )}

      {/* ─── Page & Section Visibility ────────────── */}
      <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
          <h2 className="text-lg font-semibold text-white">Visibility</h2>
        </div>
        <p className="text-sm text-[#94A3B8] mb-4">Toggle sections on/off on the public services page.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {[
            { key: "services", label: "Page (entire services page)" },
            { key: "servicesHeader", label: "Page Header" },
            { key: "servicesCapabilityMap", label: "Capability Map" },
            { key: "servicesCTA", label: "Bottom CTA" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 p-3 rounded-lg bg-[#0F172A] border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
              <input
                type="checkbox"
                checked={visibility[key as keyof PageVisibility] ?? true}
                onChange={(e) => setVisibility((prev) => ({ ...prev, [key]: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/10 rounded-full peer-checked:bg-[#3B82F6] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative flex-shrink-0"></div>
              <span className="text-sm text-[#F8FAFC]">{label}</span>
            </label>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3">
          {visSuccess && <span className="text-emerald-400 text-sm">{visSuccess}</span>}
          <button onClick={handleVisSave} disabled={visSaving} className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
            {visSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Visibility
          </button>
        </div>
      </div>

      <SeoSection config={seo} onChange={handleSeoChange} path="/services" />
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
