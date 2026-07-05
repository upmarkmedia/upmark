"use client";

import { useForm } from "react-hook-form";
import { R2UploadWidget } from "./R2UploadWidget";
import { Loader2, Star } from "lucide-react";
import type { Testimonial } from "@/types";

interface TestimonialFormData {
  quote: string;
  name: string;
  role: string;
  order: number;
  featured: boolean;
  imageUrl: string;
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
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormData>({
    defaultValues: {
      quote: initialData?.quote || "",
      name: initialData?.name || "",
      role: initialData?.role || "",
      order: initialData?.order ?? 0,
      featured: initialData?.featured ?? false,
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const isFeatured = watch("featured");
  const imageUrl = watch("imageUrl");

  async function handleFormSubmit(data: TestimonialFormData) {
    await onSubmit({
      quote: data.quote,
      name: data.name,
      role: data.role,
      order: data.order,
      featured: data.featured,
      imageUrl: data.imageUrl,
    });
  }

  const inputClass =
    "w-full bg-primary-bg border border-primary-text/10 rounded-lg px-4 py-3 text-primary-text placeholder-primary-text/30 focus:outline-none focus:border-accent-blue transition-colors text-sm";

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-6 bg-secondary-surface p-6 lg:p-8 rounded-xl border border-primary-text/5"
    >
      <h2 className="text-xl font-bold text-primary-text">
        {initialData ? "Edit Testimonial" : "New Testimonial"}
      </h2>

      {/* Quote */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-primary-text">Quote *</label>
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
          <label className="text-sm font-medium text-primary-text">Name *</label>
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
          <label className="text-sm font-medium text-primary-text">Role / Company *</label>
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
          <label className="text-sm font-medium text-primary-text">Display Order</label>
          <input
            type="number"
            {...register("order", { valueAsNumber: true })}
            placeholder="0"
            className={inputClass}
          />
          <p className="text-xs text-muted-text">Lower numbers appear first in the carousel.</p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-primary-text">Featured (Top 3)</label>
          <label
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
              isFeatured
                ? "border-accent-gold/40 bg-accent-gold/10"
                : "border-primary-text/10 bg-primary-bg hover:border-primary-text/20"
            }`}
          >
            <input
              type="checkbox"
              {...register("featured")}
              className="sr-only"
            />
            <Star
              size={18}
              className={isFeatured ? "text-accent-gold" : "text-muted-text"}
              fill={isFeatured ? "currentColor" : "none"}
            />
            <span className={`text-sm font-medium ${isFeatured ? "text-accent-gold" : "text-muted-text"}`}>
              {isFeatured ? "Featured on homepage" : "Not featured"}
            </span>
          </label>
          <p className="text-xs text-muted-text">Mark as featured to display in the homepage carousel (max 3).</p>
        </div>
      </div>

      {/* Image Upload */}
      <R2UploadWidget
        onUpload={(url) => setValue("imageUrl", url)}
        currentUrl={imageUrl}
        label="Author Image"
      />
      <input type="hidden" {...register("imageUrl")} />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-primary-text/5">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-medium text-muted-text hover:text-primary-text bg-primary-text/5 hover:bg-primary-text/10 rounded-lg transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-white bg-accent-blue hover:bg-accent-blue/90 rounded-lg transition-all flex items-center gap-2 disabled:opacity-60"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" />}
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
