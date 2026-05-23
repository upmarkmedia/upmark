"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { CloudinaryUploadWidget } from "./CloudinaryUploadWidget";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { CaseStudy, CaseStudyCategory } from "@/types";

const CATEGORIES: CaseStudyCategory[] = [
  "Studies",
  "Success Stories",
];

const GRADIENT_OPTIONS = [
  { label: "Purple / Indigo", value: "from-purple-900/30 to-indigo-900/10" },
  { label: "Blue / Slate", value: "from-blue-900/30 to-slate-900/10" },
  { label: "Amber / Orange", value: "from-amber-900/30 to-orange-900/10" },
  { label: "Emerald / Teal", value: "from-emerald-900/30 to-teal-900/10" },
  { label: "Rose / Red", value: "from-rose-900/30 to-red-900/10" },
  { label: "Cyan / Blue", value: "from-cyan-900/30 to-blue-900/10" },
];

interface CaseStudyFormData {
  title: string;
  client: string;
  description: string;
  category: CaseStudyCategory;
  mediaUrl: string;
  metrics: { value: string }[];
  tag: string;
  stat1: string;
  stat1label: string;
  stat2: string;
  stat2label: string;
  gradient: string;
  imageUrl: string;
  hiredFor: string;
  situation: string;
  keyExecutions: string;
  timeframe: string;
  websiteUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  published: boolean;
}

interface CaseStudyFormProps {
  initialData?: CaseStudy;
  onSubmit: (data: Omit<CaseStudy, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
}

export function CaseStudyForm({
  initialData,
  onSubmit,
  onCancel,
}: CaseStudyFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CaseStudyFormData>({
    defaultValues: {
      title: initialData?.title || "",
      client: initialData?.client || "",
      description: initialData?.description || "",
      category: initialData?.category || "Studies",
      mediaUrl: initialData?.mediaUrl || "",
      metrics: initialData?.metrics?.map((v) => ({ value: v })) || [
        { value: "" },
      ],
      tag: initialData?.tag || "",
      stat1: initialData?.stat1 || "",
      stat1label: initialData?.stat1label || "",
      stat2: initialData?.stat2 || "",
      stat2label: initialData?.stat2label || "",
      gradient: initialData?.gradient || GRADIENT_OPTIONS[0].value,
      imageUrl: initialData?.imageUrl || "",
      hiredFor: initialData?.hiredFor || "",
      situation: initialData?.situation || "",
      keyExecutions: initialData?.keyExecutions || "",
      timeframe: initialData?.timeframe || "",
      websiteUrl: initialData?.websiteUrl || "",
      linkedinUrl: initialData?.linkedinUrl || "",
      youtubeUrl: initialData?.youtubeUrl || "",
      published: initialData?.published ?? false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "metrics",
  });

  const mediaUrl = watch("mediaUrl");
  const imageUrl = watch("imageUrl");

  async function handleFormSubmit(data: CaseStudyFormData) {
    await onSubmit({
      title: data.title,
      client: data.client,
      description: data.description,
      category: data.category,
      mediaUrl: data.mediaUrl,
      metrics: data.metrics.map((m) => m.value).filter(Boolean),
      tag: data.tag,
      stat1: data.stat1,
      stat1label: data.stat1label,
      stat2: data.stat2,
      stat2label: data.stat2label,
      gradient: data.gradient,
      imageUrl: data.imageUrl,
      hiredFor: data.hiredFor,
      situation: data.situation,
      keyExecutions: data.keyExecutions,
      timeframe: data.timeframe,
      websiteUrl: data.websiteUrl,
      linkedinUrl: data.linkedinUrl,
      youtubeUrl: data.youtubeUrl,
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
        {initialData ? "Edit Case Study" : "New Case Study"}
      </h2>

      {/* Title & Client */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Title *</label>
          <input
            {...register("title", { required: "Title is required" })}
            placeholder="Revenue Scale"
            className={inputClass}
          />
          {errors.title && (
            <p className="text-xs text-red-400">{errors.title.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">
            Client *
          </label>
          <input
            {...register("client", { required: "Client is required" })}
            placeholder="Acme Corp"
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
          <label className="text-sm font-medium text-[#F8FAFC]">
            Category *
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className={`${inputClass} appearance-none`}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">
            Tag / Industry
          </label>
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

      {/* Stats Row */}
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

      {/* Gradient */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Card Gradient</label>
          <select {...register("gradient")} className={`${inputClass} appearance-none`}>
            {GRADIENT_OPTIONS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#F8FAFC]">
          Short Description *
        </label>
        <textarea
          {...register("description", {
            required: "Description is required",
          })}
          rows={3}
          placeholder="Brief summary for the card..."
          className={`${inputClass} resize-none`}
        />
        {errors.description && (
          <p className="text-xs text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Detailed Sections */}
      <div className="flex flex-col gap-4 border-t border-white/10 pt-4">
        <h3 className="text-lg font-semibold text-white">Detailed Content Sections</h3>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">What we were hired to do</label>
          <textarea
            {...register("hiredFor")}
            rows={3}
            placeholder="e.g. Starting from 2022, we worked with..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">The situation</label>
          <textarea
            {...register("situation")}
            rows={3}
            placeholder="e.g. While the brand was not new..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Key executions</label>
          <textarea
            {...register("keyExecutions")}
            rows={4}
            placeholder="e.g. We handled a bunch of crisis management..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Timeframe</label>
          <input
            {...register("timeframe")}
            placeholder="e.g. Approximately 1 year"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">Website URL</label>
          <input
            {...register("websiteUrl")}
            placeholder="https://example.com"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">LinkedIn URL</label>
          <input
            {...register("linkedinUrl")}
            placeholder="https://linkedin.com/company/..."
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#F8FAFC]">YouTube URL</label>
          <input
            {...register("youtubeUrl")}
            placeholder="https://youtube.com/@..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-[#F8FAFC]">Metrics</label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <input
              {...register(`metrics.${index}.value`)}
              placeholder={`e.g. +210% Revenue Growth`}
              className={`${inputClass} flex-1`}
            />
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ value: "" })}
          className="flex items-center gap-2 text-sm text-[#3B82F6] hover:text-blue-400 transition-colors self-start"
        >
          <Plus size={16} />
          Add Metric
        </button>
      </div>

      {/* Media Upload (Video) */}
      <CloudinaryUploadWidget
        onUpload={(url) => setValue("mediaUrl", url)}
        currentUrl={mediaUrl}
        label="Media Upload (Video)"
      />
      <input type="hidden" {...register("mediaUrl")} />

      {/* Image Upload (Card thumbnail) */}
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
