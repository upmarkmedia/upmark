"use client";

import { useEffect, useCallback, useRef, useState, type ReactNode } from "react";
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
  children,
  stats,
  meta,
  detailFields,
  autoHide,
}: PreviewDialogProps) {
  const [detailsVisible, setDetailsVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!autoHide) return;
    timerRef.current = setTimeout(() => setDetailsVisible(false), 5000);
    const showDetails = () => {
      setDetailsVisible(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setDetailsVisible(false), 5000);
    };
    document.addEventListener("mousemove", showDetails);
    document.addEventListener("keydown", showDetails);
    document.addEventListener("touchstart", showDetails);
    return () => {
      clearTimeout(timerRef.current);
      document.removeEventListener("mousemove", showDetails);
      document.removeEventListener("keydown", showDetails);
      document.removeEventListener("touchstart", showDetails);
    };
  }, [autoHide]);

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
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm md:backdrop-blur-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-[#1E293B] sm:border border-white/10 sm:rounded-2xl md:rounded-3xl overflow-hidden max-w-3xl w-screen h-[100dvh] sm:w-full sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-colors"
              aria-label="Close preview"
            >
              <X size={20} />
            </button>

            <div className="overflow-y-auto flex-1">
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

              <motion.div
                animate={{
                  opacity: detailsVisible ? 1 : 0,
                  y: detailsVisible ? 0 : 20,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`p-6 sm:p-8 md:p-10 ${detailsVisible ? "" : "pointer-events-none"}`}
              >
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 pr-12">
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
                  <p className="text-muted-text font-light text-base sm:text-lg leading-relaxed mb-6">
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
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
