"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users } from "lucide-react";

interface AboutCardItem {
  name: string;
  specialty: string;
  description: string;
  imageUrl?: string;
  cardOverlayText?: string;
}

interface AboutCardGridProps {
  items: AboutCardItem[];
  accentColor: "blue" | "gold";
}

export function AboutCardGrid({ items, accentColor }: AboutCardGridProps) {
  const [selected, setSelected] = useState<AboutCardItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (item: AboutCardItem) => {
    setSelected(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap justify-center gap-6">
        {items.map((item, i) => (
          <AboutCard
            key={i}
            item={item}
            onClick={() => openModal(item)}
            accentColor={accentColor}
          />
        ))}
      </div>

      <AboutDetailModal
        open={modalOpen}
        onClose={closeModal}
        item={selected}
        accentColor={accentColor}
      />
    </>
  );
}

function AboutCard({
  item,
  onClick,
  accentColor,
}: {
  item: AboutCardItem;
  onClick: () => void;
  accentColor: "blue" | "gold";
}) {
  const [initialTimerDone, setInitialTimerDone] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setInitialTimerDone(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const showOverlay = !initialTimerDone || isHovered;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-secondary-surface/40 border border-primary-text/5 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-sm"
    >
      <div className="relative h-[300px] sm:h-[420px] overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-blue/10 to-accent-gold/5">
            <Users size={48} className="text-primary-text/20" />
          </div>
        )}

        {/* Text overlay at bottom */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-5 z-10 transition-all duration-500 bg-gradient-to-t from-black via-black/70 to-transparent ${
            showOverlay ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {item.cardOverlayText && (
            <p className="text-white/80 text-sm font-medium mb-1">
              {item.cardOverlayText}
            </p>
          )}
          <h3 className="text-lg font-bold text-white">{item.name}</h3>
          <p
            className={`text-sm font-semibold ${
              accentColor === "blue" ? "text-blue-400" : "text-amber-400"
            }`}
          >
            {item.specialty}
          </p>
        </div>
      </div>
    </div>
  );
}

function AboutDetailModal({
  open,
  onClose,
  item,
  accentColor,
}: {
  open: boolean;
  onClose: () => void;
  item: AboutCardItem | null;
  accentColor: "blue" | "gold";
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
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
      {open && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-primary-bg rounded-2xl sm:rounded-3xl border border-primary-text/10 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-primary-text/20 border border-primary-text/10 flex items-center justify-center text-primary-text/80 hover:text-primary-text hover:bg-primary-text/30 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row max-h-[90vh]">
              {/* Image side */}
              <div className="md:w-1/2 w-full relative min-h-[280px] md:min-h-[500px]">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-blue/10 to-accent-gold/5">
                    <Users size={64} className="text-primary-text/20" />
                  </div>
                )}
              </div>

              {/* Content side */}
              <div className="md:w-1/2 w-full p-6 sm:p-8 md:p-10 overflow-y-auto">
                <h2 className="text-2xl sm:text-3xl font-black text-primary-text mb-2">
                  {item.name}
                </h2>
                <p
                  className={`text-lg font-semibold mb-6 ${
                    accentColor === "blue"
                      ? "text-accent-blue"
                      : "text-accent-gold"
                  }`}
                >
                  {item.specialty}
                </p>
                <div className="flex flex-col gap-4 text-muted-text font-light text-base sm:text-lg">
                  {item.description.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
