"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, ImageIcon, X, Loader2 } from "lucide-react";
import { uploadToR2 } from "@/lib/upload";

interface R2UploadWidgetProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  label?: string;
  multiple?: boolean;
  fit?: "cover" | "contain";
  height?: string;
}

export function R2UploadWidget({
  onUpload,
  currentUrl,
  label = "Upload Media",
  multiple = false,
  fit = "cover",
  height = "h-48",
}: R2UploadWidgetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");

  // Update preview if the parent changes currentUrl
  useEffect(() => {
    setPreview(currentUrl || "");
  }, [currentUrl]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const url = await uploadToR2(file);
      if (!multiple) setPreview(url);
      onUpload(url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function clearMedia() {
    setPreview("");
    onUpload("");
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-primary-text">{label}</label>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*"
      />

      {multiple ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed border-primary-text/10 rounded-lg bg-primary-bg hover:border-accent-blue/50 hover:bg-accent-blue/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center">
            {isUploading ? (
              <Loader2 size={16} className="text-accent-blue animate-spin" />
            ) : (
              <Upload size={16} className="text-accent-blue" />
            )}
          </div>
          <span className="text-xs font-medium text-muted-text">
            {isUploading ? "Uploading..." : "Click to add media"}
          </span>
        </button>
      ) : preview ? (
        <div className={`relative group rounded-lg overflow-hidden border border-primary-text/10 bg-primary-bg ${height}`}>
          {preview.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <video
              src={preview}
              autoPlay
              muted
              loop
              playsInline
              className={`w-full h-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={preview}
              alt="Uploaded media preview"
              className={`w-full h-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
            />
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-accent-blue text-white text-sm font-medium rounded-lg hover:bg-accent-blue/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isUploading ? <Loader2 size={16} className="animate-spin" /> : "Replace"}
            </button>
            <button
              type="button"
              onClick={clearMedia}
              disabled={isUploading}
              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`flex flex-col items-center justify-center gap-3 ${height} border-2 border-dashed border-primary-text/10 rounded-lg bg-primary-bg hover:border-accent-blue/50 hover:bg-accent-blue/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="w-12 h-12 rounded-full bg-accent-blue/10 flex items-center justify-center">
            {isUploading ? (
              <Loader2 size={20} className="text-accent-blue animate-spin" />
            ) : (
              <ImageIcon size={20} className="text-muted-text" />
            )}
          </div>
          <span className="text-sm font-medium text-muted-text">
            {isUploading ? "Uploading..." : "Click to upload"}
          </span>
        </button>
      )}
    </div>
  );
}
