"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/firestore";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import type { Testimonial } from "@/types";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  MessageSquareQuote,
  RefreshCw,
  Search,
  Quote,
  Star,
} from "lucide-react";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const featuredCount = testimonials.filter((t) => t.featured).length;

  async function handleCreate(
    data: Omit<Testimonial, "id" | "createdAt" | "updatedAt">
  ) {
    await createTestimonial(data);
    setShowForm(false);
    await fetchData();
  }

  async function handleUpdate(
    data: Omit<Testimonial, "id" | "createdAt" | "updatedAt">
  ) {
    if (!editingTestimonial?.id) return;
    await updateTestimonial(editingTestimonial.id, data);
    setEditingTestimonial(undefined);
    setShowForm(false);
    await fetchData();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteTestimonial(id);
      await fetchData();
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleFeatured(testimonial: Testimonial) {
    if (!testimonial.id) return;
    const newFeatured = !testimonial.featured;
    
    // Prevent featuring more than 3
    if (newFeatured && featuredCount >= 3) {
      alert("You can only feature up to 3 testimonials. Unfeature one first.");
      return;
    }

    setTogglingId(testimonial.id);
    try {
      await updateTestimonial(testimonial.id, { featured: newFeatured });
      await fetchData();
    } catch (err) {
      console.error("Failed to toggle featured:", err);
    } finally {
      setTogglingId(null);
    }
  }

  function openCreate() {
    setEditingTestimonial(undefined);
    setShowForm(true);
  }

  function openEdit(testimonial: Testimonial) {
    setEditingTestimonial(testimonial);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingTestimonial(undefined);
  }

  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.quote?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Testimonials</h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Manage client testimonials displayed on the website.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start">
          {/* Featured Counter */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg text-sm">
            <Star size={14} className="text-[#F59E0B]" />
            <span className="text-[#F59E0B] font-medium">{featuredCount}/3</span>
            <span className="text-[#94A3B8] text-xs">featured</span>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white text-sm rounded-lg border border-white/5 transition-all"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all"
          >
            <Plus size={16} />
            Add New
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <TestimonialForm
          initialData={editingTestimonial}
          onSubmit={editingTestimonial ? handleUpdate : handleCreate}
          onCancel={closeForm}
        />
      )}

      {/* Search */}
      {!showForm && (
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1E293B] border border-white/5 rounded-lg pl-11 pr-4 py-3 text-[#F8FAFC] placeholder-white/30 focus:outline-none focus:border-[#3B82F6] transition-colors text-sm"
          />
        </div>
      )}

      {/* List */}
      {!showForm && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1E293B] rounded-xl border border-white/5 p-6 animate-pulse"
                >
                  <div className="h-5 w-40 bg-white/5 rounded mb-4" />
                  <div className="h-4 w-full bg-white/5 rounded mb-2" />
                  <div className="h-4 w-3/4 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="bg-[#1E293B] rounded-xl border border-white/5 p-12 text-center">
              <MessageSquareQuote
                size={40}
                className="text-[#94A3B8]/30 mx-auto mb-4"
              />
              <p className="text-[#94A3B8]">
                {searchQuery
                  ? "No testimonials match your search."
                  : "No testimonials yet. Click \"Add New\" to create one."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className={`bg-[#1E293B] rounded-xl border p-6 hover:border-white/10 transition-all group ${
                    testimonial.featured
                      ? "border-[#F59E0B]/30 bg-[#F59E0B]/[0.03]"
                      : "border-white/5"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Quote size={24} className="text-[#3B82F6]/30 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {testimonial.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F59E0B]/15 border border-[#F59E0B]/30 rounded text-[10px] font-bold uppercase tracking-wider text-[#F59E0B]">
                            <Star size={10} fill="currentColor" />
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#F8FAFC] italic mb-4 line-clamp-3">
                        &quot;{testimonial.quote}&quot;
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#F8FAFC]">
                            {testimonial.name}
                          </p>
                          <p className="text-xs text-[#94A3B8]">
                            {testimonial.role}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Featured Toggle */}
                          <button
                            onClick={() => handleToggleFeatured(testimonial)}
                            disabled={togglingId === testimonial.id}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                              testimonial.featured
                                ? "text-[#F59E0B] bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20"
                                : "text-[#94A3B8] bg-white/5 hover:bg-white/10"
                            } disabled:opacity-50`}
                          >
                            <Star size={12} fill={testimonial.featured ? "currentColor" : "none"} />
                            {testimonial.featured ? "Unfeature" : "Feature"}
                          </button>
                          <button
                            onClick={() => openEdit(testimonial)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#3B82F6] bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 rounded-lg transition-colors"
                          >
                            <Pencil size={12} />
                            Edit
                          </button>
                          <button
                            onClick={() => testimonial.id && handleDelete(testimonial.id)}
                            disabled={deletingId === testimonial.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deletingId === testimonial.id ? (
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

          {!loading && filteredTestimonials.length > 0 && (
            <p className="text-xs text-[#94A3B8] text-center">
              {filteredTestimonials.length} testimonial
              {filteredTestimonials.length === 1 ? "" : "s"}
            </p>
          )}
        </>
      )}
    </div>
  );
}
