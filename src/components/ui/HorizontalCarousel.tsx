"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalCarouselProps {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  label?: string;
  className?: string;
  lightText?: boolean;
}

export function HorizontalCarousel({
  children,
  title,
  subtitle,
  label,
  className = "",
  lightText = false,
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
              <span className={`font-extrabold tracking-[0.2em] uppercase text-xl mb-3 ${lightText ? "text-white/60" : "text-secondary-surface-dark"}`}>
                {label}
              </span>
            )}
            {title && (
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-tight uppercase ${lightText ? "text-white" : "text-primary-text"}`}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`text-base sm:text-lg max-w-2xl font-light mt-3 ${lightText ? "text-white/50" : "text-muted-text"}`}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Desktop nav arrows */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0 ml-6">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors disabled:opacity-20 disabled:cursor-not-allowed ${
                lightText
                  ? "border-white/10 text-white hover:bg-white/5 hover:border-white/30"
                  : "border-primary-text/10 text-primary-text hover:bg-primary-text/5 hover:border-accent-blue/50"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors disabled:opacity-20 disabled:cursor-not-allowed ${
                lightText
                  ? "border-white/10 text-white hover:bg-white/5 hover:border-white/30"
                  : "border-primary-text/10 text-primary-text hover:bg-primary-text/5 hover:border-accent-blue/50"
              }`}
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
        className="flex overflow-x-auto gap-5 sm:gap-6 snap-x snap-mandatory hide-scrollbar -ml-4 pl-6 pr-4 sm:-mx-6 sm:px-6 pb-4"
      >
        {children}
      </div>
    </div>
  );
}
