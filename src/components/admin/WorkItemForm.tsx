"use client";

import { useForm } from "react-hook-form";
import { CloudinaryUploadWidget } from "./CloudinaryUploadWidget";
import { Loader2 } from "lucide-react";
import type { WorkItem, WorkItemCategory } from "@/types";

const CATEGORIES: WorkItemCategory[] = [
  "Studies",
  "Success Stories",
  "Stills & Motions",
];

const GRADIENT_OPTIONS = [
  { label: "Purple / Indigo", value: "from-purple-900/30 to-indigo-900/10" },
  { label: "Blue / Slate", value: "from-blue-900/30 to-slate-900/10" },
  { label: "Amber / Orange", value: "from-amber-900/30 to-orange-900/10" },
  { label: "Emerald / Teal", value: "from-emerald-900/30 to-teal-900/10" },
  { label: "Rose / Red", value: "from-rose-900/30 to-red-900/10" },
  { label: "Cyan / Blue", value: "from-cyan-900/30 to-blue-900/10" },
];

interface WorkItemFormData {
  title: string;
  client: string;
  description: string;
  category: WorkItemCategory;
  tag: string;
  stat1: string;
  stat1label: string;
  stat2: string;
  stat2label: string;
  gradient: string;
  imageUrl: string;
  mediaUrl: string;
  mediaType: "Stills" | "Motion";
  duration: string;
  metrics: { value: string }[];
  published: boolean;
}

interface WorkItemFormProps {
  initialData?: WorkItem;
  onSubmit: (data: Omit<WorkItem, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
}

export function WorkItemForm({
  initialData,
  onSubmit,
  onCancel,
}: WorkItemFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WorkItemFormData>({
    defaultValues: {
      title: initialData?.title || "",
      client: initialData?.client || "",
      description: initialData?.description || "",
      category: initialData?.category || "Studies",
      tag: initialData?.tag || "",
      stat1: initialData?.stat1 || "",
      stat1label: initialData?.stat1label || "",
      stat2: initialData?.stat2 || "",
      stat2label: initialData?.stat2label || "",
      gradient: initialData?.gradient || GRADIENT_OPTIONS[0].value,
      imageUrl: initialData?.imageUrl || "",
      mediaUrl: initialData?.mediaUrl || "",
      mediaType: initialData?.mediaType || "Stills",
      duration: initialData?.duration || "",
      metrics: initialData?.metrics?.map((v) => ({ value: v })) || [{ value: "" }],
      published: initialData?.published ?? false,
    },
  });

  const imageUrl = watch("imageUrl");
  const mediaUrl = watch("mediaUrl");
  const category = watch("category");

  async function handleFormSubmit(data: WorkItemFormData) {
    await onSubmit({
      title: data.title,
      client: data.client,
      description: data.description,
      category: data.category,
      tag: data.tag,
      stat1: data.stat1,
      stat1label: data.stat1label,
      stat2: data.stat2,
      stat2label: data.stat2label,
      gradient: data.gradient,
      imageUrl: data.imageUrl,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType,
      duration: data.duration,
      metrics: data.metrics.map((m) => m.value).filter(Boolean),
      published: data.published,
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
        {initialData ? "Edit Work Item" : "New Work Item"}
      </h2>

      {/* Title & Client */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Title *</label>
          <input
            {...register("title", { required: "Title is required" })}
            placeholder="Ingri — SS26 Campaign"
            className={inputClass}
          />
          {errors.title && (
            <p className="text-xs text-red-400">{errors.title.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Client *</label>
          <input
            {...register("client", { required: "Client is required" })}
            placeholder="Ingri"
            className={inputClass}
          />
          {errors.client && (
            <p className="text-xs text-red-400">{errors.client.message}</p>
          )}
        </div>
      </div>

      {/* Category & Tag */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Category *</label>
          <select
            {...register("category", { required: "Category is required" })}
            className={`${inputClass} appearance-none`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Tag / Industry</label>
          <input
            {...register("tag")}
            placeholder="e.g. Fashion & Lifestyle"
            className={inputClass}
          />
        </div>
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" {...register("published")} className="sr-only peer" />
          <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:bg-[#3B82F6] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
        </label>
        <span className="text-sm text-[#F8FAFC]">Published</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Stat 1 Value</label>
          <input {...register("stat1")} placeholder="e.g. +210%" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Stat 1 Label</label>
          <input {...register("stat1label")} placeholder="e.g. Revenue Growth" className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Stat 2 Value</label>
          <input {...register("stat2")} placeholder="e.g. +380%" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Stat 2 Label</label>
          <input {...register("stat2label")} placeholder="e.g. Social Engagement" className={inputClass} />
        </div>
      </div>

      {/* Gradient & Production fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Card Gradient</label>
          <select {...register("gradient")} className={`${inputClass} appearance-none`}>
            {GRADIENT_OPTIONS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>
        {category === "Stills & Motions" && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#F8FAFC]">Media Type</label>
            <select {...register("mediaType")} className={`${inputClass} appearance-none`}>
              <option value="Stills">Stills</option>
              <option value="Motion">Motion</option>
            </select>
          </div>
        )}
      </div>

      {category === "Stills & Motions" && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Duration (for Motion)</label>
          <input {...register("duration")} placeholder="e.g. 0:30" className={inputClass} />
        </div>
      )}

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#F8FAFC]">Description *</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          rows={3}
          placeholder="Brief summary..."
          className={`${inputClass} resize-none`}
        />
        {errors.description && (
          <p className="text-xs text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Metrics */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#F8FAFC]">Metrics (comma-separated)</label>
        <input
          defaultValue={initialData?.metrics?.join(", ") || ""}
          onChange={(e) => setValue("metrics", e.target.value.split(",").map((s) => ({ value: s.trim() })).filter((m) => m.value))}
          placeholder="+210% Revenue Growth, +380% Social Engagement"
          className={inputClass}
        />
      </div>

      {/* Media Uploads */}
      <CloudinaryUploadWidget
        onUpload={(url) => setValue("mediaUrl", url)}
        currentUrl={mediaUrl}
        label="Media Upload (Video)"
      />
      <input type="hidden" {...register("mediaUrl")} />

      <CloudinaryUploadWidget
        onUpload={(url) => setValue("imageUrl", url)}
        currentUrl={imageUrl}
        label="Card Image / Thumbnail"
      />
      <input type="hidden" {...register("imageUrl")} />

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