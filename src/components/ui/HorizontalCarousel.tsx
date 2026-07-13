"use client";

import { useId, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper } from "swiper/react";
import { Navigation } from "swiper/modules";

// Import Swiper styles if not already globally imported
import "swiper/css";
import "swiper/css/navigation";

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
  // Generate a unique ID for Swiper navigation buttons
  const carouselId = useId().replace(/:/g, "");

  return (
    <div className={className}>
      {/* Header */}
      {(title || label) && (
        <div className="mb-8 sm:mb-10">
          {label && (
            <span className={`font-extrabold tracking-[0.2em] uppercase text-xl mb-3 block ${lightText ? "text-white/60" : "text-secondary-surface-dark"}`}>
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
      )}

      {/* Swiper track */}
      <div className="relative group">
        <button
          id={`prev-${carouselId}`}
          className={`absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 shadow-lg ${
            lightText
              ? "bg-black/90 border-white/10 text-white hover:bg-black hover:border-white/50"
              : "bg-primary-bg/90 border-primary-text/10 text-primary-text hover:bg-primary-bg hover:border-accent-blue/50"
          }`}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          id={`next-${carouselId}`}
          className={`absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 shadow-lg ${
            lightText
              ? "bg-black/90 border-white/10 text-white hover:bg-black hover:border-white/50"
              : "bg-primary-bg/90 border-primary-text/10 text-primary-text hover:bg-primary-bg hover:border-accent-blue/50"
          }`}
        >
          <ChevronRight size={20} />
        </button>

        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={2}
          speed={600}
          navigation={{
            prevEl: `#prev-${carouselId}`,
            nextEl: `#next-${carouselId}`,
          }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
        >
          {children}
        </Swiper>
      </div>
    </div>
  );
}
