"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, ImageIcon, X } from "lucide-react";

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        config: Record<string, unknown>,
        callback: (error: unknown, result: { event: string; info: { secure_url: string; resource_type: string; format: string } }) => void
      ) => { open: () => void; destroy: () => void };
    };
  }
}

interface CloudinaryUploadWidgetProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  label?: string;
  multiple?: boolean;
  fit?: "cover" | "contain";
  height?: string;
}

export function CloudinaryUploadWidget({
  onUpload,
  currentUrl,
  label = "Upload Media",
  multiple = false,
  fit = "cover",
  height = "h-48",
}: CloudinaryUploadWidgetProps) {
  const widgetRef = useRef<{ open: () => void; destroy: () => void } | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");

  // Load the Cloudinary script once
  useEffect(() => {
    if (window.cloudinary) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup widget on unmount
      widgetRef.current?.destroy();
    };
  }, []);

  // Update preview if the parent changes currentUrl
  useEffect(() => {
    setPreview(currentUrl || "");
  }, [currentUrl]);

  function openWidget() {
    if (!scriptLoaded || !window.cloudinary) return;

    // Destroy previous widget instance if any
    widgetRef.current?.destroy();

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        sources: ["local", "url", "camera"],
        multiple: multiple,
        maxFileSize: 50000000, // 50MB
        resourceType: "auto",
        styles: {
          palette: {
            window: "#1E293B",
            sourceBg: "#0F172A",
            windowBorder: "#3B82F6",
            tabIcon: "#3B82F6",
            inactiveTabIcon: "#94A3B8",
            menuIcons: "#3B82F6",
            link: "#3B82F6",
            action: "#3B82F6",
            inProgress: "#3B82F6",
            complete: "#22C55E",
            error: "#EF4444",
            textDark: "#0F172A",
            textLight: "#F8FAFC",
          },
          fonts: {
            default: null,
            "'Inter', sans-serif": {
              url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
              active: true,
            },
          },
        },
      },
      (error: unknown, result: { event: string; info: { secure_url: string } }) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return;
        }
        if (result.event === "success") {
          const url = result.info.secure_url;
          if (!multiple) setPreview(url);
          onUpload(url);
        }
      }
    );

    widgetRef.current = widget;
    widget.open();
  }

  function clearMedia() {
    setPreview("");
    onUpload("");
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-primary-text">{label}</label>

      {multiple ? (
        <button
          type="button"
          onClick={openWidget}
          disabled={!scriptLoaded}
          className="flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed border-primary-text/10 rounded-lg bg-primary-bg hover:border-accent-blue/50 hover:bg-accent-blue/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center">
            {scriptLoaded ? (
              <Upload size={16} className="text-accent-blue" />
            ) : (
              <ImageIcon size={16} className="text-muted-text" />
            )}
          </div>
          <span className="text-xs font-medium text-muted-text">
            {scriptLoaded ? "Click to add media" : "Loading widget..."}
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
              onClick={openWidget}
              className="px-4 py-2 bg-accent-blue text-white text-sm font-medium rounded-lg hover:bg-accent-blue/90 transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={clearMedia}
              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openWidget}
          disabled={!scriptLoaded}
          className={`flex flex-col items-center justify-center gap-3 ${height} border-2 border-dashed border-primary-text/10 rounded-lg bg-primary-bg hover:border-accent-blue/50 hover:bg-accent-blue/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="w-12 h-12 rounded-full bg-accent-blue/10 flex items-center justify-center">
            {scriptLoaded ? (
              <Upload size={20} className="text-accent-blue" />
            ) : (
              <ImageIcon size={20} className="text-muted-text" />
            )}
          </div>
          <span className="text-sm font-medium text-muted-text">
            {scriptLoaded ? "Click to upload" : "Loading widget..."}
          </span>
        </button>
      )}
    </div>
  );
}
