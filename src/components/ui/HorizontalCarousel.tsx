"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalCarouselProps {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  label?: string;
  className?: string;
}

export function HorizontalCarousel({
  children,
  title,
  subtitle,
  label,
  className = "",
}: HorizontalCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector(":scope > *")?.clientWidth ?? 350;
    el.scrollBy({
      left: direction === "left" ? -(cardWidth + 24) : cardWidth + 24,
      behavior: "smooth",
    });
  };

  return (
    <div className={className}>
      {/* Header */}
      {(title || label) && (
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            {label && (
              <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs mb-4 block inline-flex items-center gap-4">
                <span className="w-8 h-[1px] bg-accent-blue"></span>
                {label}
                <span className="w-8 h-[1px] bg-accent-blue"></span>
              </span>
            )}
            {title && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-white tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-muted-text text-base sm:text-lg max-w-2xl font-light mt-3">
                {subtitle}
              </p>
            )}
          </div>

          {/* Desktop nav arrows */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0 ml-6">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-accent-blue/50 transition-colors text-white disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-accent-blue/50 transition-colors text-white disabled:opacity-20 disabled:cursor-not-allowed"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-5 sm:gap-6 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6 pb-4"
      >
        {children}
      </div>
    </div>
  );
}
