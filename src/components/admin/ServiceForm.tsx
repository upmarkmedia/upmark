"use client";

import { useForm } from "react-hook-form";
import { R2UploadWidget } from "./R2UploadWidget";
import { Loader2 } from "lucide-react";
import type { Service } from "@/types";

interface ServiceFormData {
  title: string;
  description: string;
  icon_url: string;
  icon_name: string;
  label: string;
  subtitle: string;
  order: number;
}

interface ServiceFormProps {
  initialData?: Service;
  onSubmit: (data: Omit<Service, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
}

export function ServiceForm({
  initialData,
  onSubmit,
  onCancel,
}: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      icon_url: initialData?.icon_url || "",
      icon_name: initialData?.icon_name || "",
      label: initialData?.label || "",
      subtitle: initialData?.subtitle || "",
      order: initialData?.order ?? 0,
    },
  });

  const iconUrl = watch("icon_url");

  async function handleFormSubmit(data: ServiceFormData) {
    await onSubmit({
      title: data.title,
      description: data.description,
      icon_url: data.icon_url,
      icon_name: data.icon_name,
      label: data.label,
      subtitle: data.subtitle,
      order: data.order,
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
        {initialData ? "Edit Service" : "New Service"}
      </h2>

      {/* Title & Subtitle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-primary-text">Title *</label>
          <input
            {...register("title", { required: "Title is required" })}
            placeholder="Marketing Strategy"
            className={inputClass}
          />
          {errors.title && (
            <p className="text-xs text-red-400">{errors.title.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-primary-text">Subtitle / Category Tag</label>
          <input
            {...register("subtitle")}
            placeholder="e.g. Foundation, Paid Media, Social"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-primary-text">Map Label</label>
          <input
            {...register("label")}
            placeholder="e.g. Content"
            className={inputClass}
          />
          <p className="text-xs text-muted-text">Short text for the capability map</p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-primary-text">Lucide Icon Name</label>
          <input
            {...register("icon_name")}
            placeholder="e.g. PlaySquare"
            className={inputClass}
          />
          <p className="text-xs text-muted-text">Used if icon image is not uploaded</p>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-primary-text">
          Description *
        </label>
        <textarea
          {...register("description", {
            required: "Description is required",
          })}
          rows={4}
          placeholder="Describe the service..."
          className={`${inputClass} resize-none`}
        />
        {errors.description && (
          <p className="text-xs text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Order */}
      <div className="flex flex-col gap-2 max-w-xs">
        <label className="text-sm font-medium text-primary-text">Display Order</label>
        <input
          type="number"
          {...register("order", { valueAsNumber: true })}
          placeholder="0"
          className={inputClass}
        />
        <p className="text-xs text-muted-text">Lower numbers appear first. Services with the same order are sorted by creation date.</p>
      </div>

      {/* Icon Upload */}
      <R2UploadWidget
        onUpload={(url) => setValue("icon_url", url)}
        currentUrl={iconUrl}
        label="Service Icon"
      />
      <input type="hidden" {...register("icon_url")} />

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
