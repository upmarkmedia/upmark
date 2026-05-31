"use client";

import { useEffect, useCallback, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, LayoutGrid, GalleryHorizontalEnd } from "lucide-react";
import Image from "next/image";

interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  imageUrl?: string;
  mediaUrl?: string;
  galleryUrls?: string[];
  defaultGalleryMode?: "grid" | "carousel";
  children?: ReactNode;
  stats?: { label: string; value: string }[];
  meta?: { label: string; value: string }[];
  detailFields?: { label: string; value: string }[];
  autoHide?: boolean;
}

export function PreviewDialog({
  open,
  onClose,
  title,
  description,
  imageUrl,
  mediaUrl,
  galleryUrls,
  defaultGalleryMode,
  children,
  stats,
  meta,
  detailFields,
  autoHide,
}: PreviewDialogProps) {
  const [detailsVisible, setDetailsVisible] = useState(true);
  const [galleryMode, setGalleryMode] = useState<"grid" | "carousel">(defaultGalleryMode || "grid");
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const hasGallery = galleryUrls && galleryUrls.length > 0;

  // Sequentially preload the gallery urls when dialog opens
  useEffect(() => {
    if (!open || !hasGallery || !galleryUrls || galleryUrls.length === 0) return;

    let isCancelled = false;
    const preload = async () => {
      for (const url of galleryUrls) {
        if (isCancelled) break;
        try {
          if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
            await new Promise((resolve) => {
              const video = document.createElement("video");
              video.preload = "metadata";
              video.src = url;
              video.onloadedmetadata = () => resolve(true);
              video.onerror = () => resolve(false);
            });
          } else {
            await new Promise((resolve) => {
              const img = new window.Image();
              img.src = url;
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false);
            });
          }
        } catch (e) { }
      }
    };
    preload();
    return () => {
      isCancelled = true;
    };
  }, [open, hasGallery, galleryUrls]);

  // Reset states when opened with new content
  useEffect(() => {
    if (open) {
      setGalleryMode(defaultGalleryMode || "grid");
      setCurrentIndex(0);
    }
  }, [open, defaultGalleryMode]);



  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center sm:p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-auto max-w-[95vw] md:max-w-[90vw] max-h-[95vh] bg-[#0F172A] rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-colors"
              aria-label="Close preview"
            >
              <X size={20} />
            </button>

            <div className="overflow-y-auto flex-1">
              {hasGallery ? (
                galleryMode === "carousel" ? (
                  <div className="relative w-full overflow-hidden group flex items-center justify-center bg-[#1E293B]">
                    {galleryUrls[currentIndex].match(/\.(mp4|webm|ogg|mov)$/i) ? (
                      <video
                        key={galleryUrls[currentIndex]}
                        src={galleryUrls[currentIndex]}
                        controls
                        autoPlay
                        playsInline
                        className="w-auto h-auto max-w-full max-h-[65vh] object-contain"
                      />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={galleryUrls[currentIndex]}
                        alt={`${title} - Gallery Image ${currentIndex + 1}`}
                        className="w-auto h-auto max-w-full max-h-[65vh] object-contain"
                      />
                    )}
                    {galleryUrls.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev > 0 ? prev - 1 : galleryUrls.length - 1)); }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/70"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev < galleryUrls.length - 1 ? prev + 1 : 0)); }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/70"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-[100vw] sm:w-[800px] max-w-full p-6 sm:p-8 md:p-10 pb-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {galleryUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-video bg-black/30 rounded-lg overflow-hidden border border-white/10">
                          {url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                            <video src={url} controls playsInline className="w-full h-full object-contain bg-black" />
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={url} alt={`${title} ${idx + 1}`} loading="lazy" className="w-full h-full object-contain bg-black" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ) : (imageUrl || mediaUrl) ? (
                <div className="relative w-full overflow-hidden flex items-center justify-center bg-[#1E293B]">
                  {mediaUrl ? (
                    <video
                      src={mediaUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-auto h-auto max-w-full max-h-[65vh] object-contain"
                    />
                  ) : imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-auto h-auto max-w-full max-h-[65vh] object-contain"
                    />
                  ) : null}
                </div>
              ) : null}

              <div className="w-full bg-[#0F172A] p-6 sm:p-8 md:p-10 shrink-0 border-t border-white/5">
                <div className="max-h-[30vh] overflow-y-auto hide-scrollbar">
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 pr-12">
                    {title}
                  </h2>

                  {stats && stats.length > 0 && (
                    <div className="flex flex-wrap gap-6 sm:gap-10 mb-6 pb-6 border-b border-white/10">
                      {stats.map((s) => (
                        <div key={s.label}>
                          <div className="text-2xl sm:text-3xl font-black text-white">
                            {s.value}
                          </div>
                          <div className="text-xs text-muted-text uppercase tracking-wider">
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {description && (
                    <p className="text-muted-text font-light text-base sm:text-lg leading-relaxed mb-6 whitespace-pre-wrap">
                      {description}
                    </p>
                  )}

                  {detailFields && detailFields.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-6">
                      {detailFields.map((f) => (
                        <span
                          key={f.label}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/70"
                        >
                          <span className="text-accent-blue font-medium">
                            {f.label}:
                          </span>{" "}
                          {f.value}
                        </span>
                      ))}
                    </div>
                  )}

                  {meta && meta.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {meta.map((m) => (
                        <span
                          key={m.label}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/70"
                        >
                          <span className="text-accent-blue font-medium">
                            {m.label}:
                          </span>{" "}
                          {m.value}
                        </span>
                      ))}
                    </div>
                  )}

                  {children}
                </div>
              </div>
            </div>

            {hasGallery && (
              <div className="absolute bottom-6 right-6 z-30 flex items-center bg-black/60 backdrop-blur-md rounded-full border border-white/10 p-1 shadow-xl">
                <button
                  onClick={(e) => { e.stopPropagation(); setGalleryMode("carousel"); }}
                  className={`p-2 rounded-full transition-colors ${galleryMode === "carousel" ? "bg-white/20 text-white" : "text-white/50 hover:text-white"}`}
                  title="Carousel View"
                >
                  <GalleryHorizontalEnd size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setGalleryMode("grid"); }}
                  className={`p-2 rounded-full transition-colors ${galleryMode === "grid" ? "bg-white/20 text-white" : "text-white/50 hover:text-white"}`}
                  title="Grid View"
                >
                  <LayoutGrid size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
