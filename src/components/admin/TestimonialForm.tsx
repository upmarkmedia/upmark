"use client";

import { useForm } from "react-hook-form";
import { Loader2, Star } from "lucide-react";
import type { Testimonial } from "@/types";

interface TestimonialFormData {
  quote: string;
  name: string;
  role: string;
  order: number;
  featured: boolean;
}

interface TestimonialFormProps {
  initialData?: Testimonial;
  onSubmit: (data: Omit<Testimonial, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
}

export function TestimonialForm({
  initialData,
  onSubmit,
  onCancel,
}: TestimonialFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormData>({
    defaultValues: {
      quote: initialData?.quote || "",
      name: initialData?.name || "",
      role: initialData?.role || "",
      order: initialData?.order ?? 0,
      featured: initialData?.featured ?? false,
    },
  });

  const isFeatured = watch("featured");

  async function handleFormSubmit(data: TestimonialFormData) {
    await onSubmit({
      quote: data.quote,
      name: data.name,
      role: data.role,
      order: data.order,
      featured: data.featured,
    });
  }

  const inputClass =
    "w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-3 text-[#F8FAFC] placeholder-white/30 focus:outline-none focus:border-[#3B82F6] transition-colors text-sm";

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-6 bg-[#1E293B] p-6 lg:p-8 rounded-xl border border-white/5"
    >
      <h2 className="text-xl font-bold text-[#F8FAFC]">
        {initialData ? "Edit Testimonial" : "New Testimonial"}
      </h2>

      {/* Quote */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#F8FAFC]">Quote *</label>
        <textarea
          {...register("quote", { required: "Quote is required" })}
          rows={4}
          placeholder="What did the client say about working with you?"
          className={`${inputClass} resize-none`}
        />
        {errors.quote && (
          <p className="text-xs text-red-400">{errors.quote.message}</p>
        )}
      </div>

      {/* Name & Role */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Name *</label>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Sarah Jenkins"
            className={inputClass}
          />
          {errors.name && (
            <p className="text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Role / Company *</label>
          <input
            {...register("role", { required: "Role is required" })}
            placeholder="CMO, Vertex Corp"
            className={inputClass}
          />
          {errors.role && (
            <p className="text-xs text-red-400">{errors.role.message}</p>
          )}
        </div>
      </div>

      {/* Order & Featured */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Display Order</label>
          <input
            type="number"
            {...register("order", { valueAsNumber: true })}
            placeholder="0"
            className={inputClass}
          />
          <p className="text-xs text-[#94A3B8]">Lower numbers appear first in the carousel.</p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Featured (Top 3)</label>
          <label
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
              isFeatured
                ? "border-[#F59E0B]/40 bg-[#F59E0B]/10"
                : "border-white/10 bg-[#0F172A] hover:border-white/20"
            }`}
          >
            <input
              type="checkbox"
              {...register("featured")}
              className="sr-only"
            />
            <Star
              size={18}
              className={isFeatured ? "text-[#F59E0B]" : "text-[#94A3B8]"}
              fill={isFeatured ? "currentColor" : "none"}
            />
            <span className={`text-sm font-medium ${isFeatured ? "text-[#F59E0B]" : "text-[#94A3B8]"}`}>
              {isFeatured ? "Featured on homepage" : "Not featured"}
            </span>
          </label>
          <p className="text-xs text-[#94A3B8]">Mark as featured to display in the homepage carousel (max 3).</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-medium text-[#94A3B8] hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-white bg-[#3B82F6] hover:bg-blue-600 rounded-lg transition-all flex items-center gap-2 disabled:opacity-60"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
