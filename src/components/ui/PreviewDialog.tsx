"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  imageUrl?: string;
  mediaUrl?: string;
  children?: ReactNode;
  stats?: { label: string; value: string }[];
  meta?: { label: string; value: string }[];
}

export function PreviewDialog({
  open,
  onClose,
  title,
  description,
  imageUrl,
  mediaUrl,
  children,
  stats,
  meta,
}: PreviewDialogProps) {
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-[#1E293B] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-colors"
              aria-label="Close preview"
            >
              <X size={20} />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1">
              {/* Media Area */}
              {(imageUrl || mediaUrl) && (
                <div className="relative w-full aspect-video bg-black/30 overflow-hidden">
                  {mediaUrl ? (
                    <video
                      src={mediaUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 720px"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              {/* Text Content */}
              <div className="p-6 sm:p-8 md:p-10">
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 pr-10">
                  {title}
                </h2>

                {/* Stats Row */}
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

                {/* Description */}
                {description && (
                  <p className="text-muted-text font-light text-sm sm:text-base leading-relaxed mb-6">
                    {description}
                  </p>
                )}

                {/* Meta Info */}
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

                {/* Custom children */}
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
