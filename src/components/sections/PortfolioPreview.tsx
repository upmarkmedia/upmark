"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { getWorkItems } from "@/lib/firestore";
import type { WorkItem } from "@/types";

const GRADIENT_HOVER_MAP: Record<string, string> = {
  "from-purple-900/30 to-indigo-900/10": "from-purple-900 via-purple-700/70 to-transparent",
  "from-blue-900/30 to-slate-900/10": "from-blue-900 via-blue-700/70 to-transparent",
  "from-amber-900/30 to-orange-900/10": "from-amber-900 via-amber-700/70 to-transparent",
  "from-emerald-900/30 to-teal-900/10": "from-emerald-900 via-emerald-700/70 to-transparent",
  "from-rose-900/30 to-red-900/10": "from-rose-900 via-rose-700/70 to-transparent",
  "from-cyan-900/30 to-blue-900/10": "from-cyan-900 via-cyan-700/70 to-transparent",
};
const DEFAULT_HOVER_GRADIENT = "from-black via-black/70 to-transparent";

const FALLBACK_ITEMS: WorkItem[] = [
  { title: "Ingri", client: "Ingri", tag: "Fashion & Lifestyle", description: "Premium fashion brand growth strategy.", imageUrl: "/images/casestudy-ingri.png", gradient: "from-purple-900/30 to-indigo-900/10", category: "Studies", metrics: [], published: true },
  { title: "Motorworks", client: "Motorworks", tag: "Automotive Services", description: "Full-stack digital transformation.", imageUrl: "/images/casestudy-motorworks.png", gradient: "from-blue-900/30 to-slate-900/10", category: "Studies", metrics: [], published: true },
  { title: "Luxe Stays", client: "Luxe Stays", tag: "Hospitality & Hotels", description: "Direct-to-consumer brand strategy.", imageUrl: "/images/casestudy-luxestays.png", gradient: "from-amber-900/30 to-orange-900/10", category: "Studies", metrics: [], published: true },
  { title: "The Grove Kitchen", client: "The Grove Kitchen", tag: "Food & Restaurant", description: "Viral-first content strategy.", imageUrl: "/images/casestudy-grove.png", gradient: "from-emerald-900/30 to-teal-900/10", category: "Studies", metrics: [], published: true },
  { title: "Vertex Corp", client: "Vertex Corp", tag: "B2B Technology", description: "GTM strategy overhaul.", imageUrl: "/images/casestudy-vertex.png", gradient: "from-rose-900/30 to-red-900/10", category: "Studies", metrics: [], published: true },
  { title: "Bloom Retail", client: "Bloom Retail", tag: "E-commerce & Retail", description: "Paid and organic strategy restructuring.", imageUrl: "/images/casestudy-bloom.png", gradient: "from-cyan-900/30 to-blue-900/10", category: "Studies", metrics: [], published: true },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function PortfolioPreview() {
  const [items, setItems] = useState<WorkItem[]>([]);

  useEffect(() => {
    getWorkItems()
      .then((all) => {
        const published = all.filter(
          (w) =>
            w.published &&
            ["Studies", "Portfolio", "Success Stories", "Client Testimonials"].includes(w.category)
        );
        if (published.length > 0) {
          setItems(shuffleArray(published));
        } else {
          setItems(shuffleArray(FALLBACK_ITEMS));
        }
      })
      .catch(() => {
        setItems(shuffleArray(FALLBACK_ITEMS));
      });
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="container mx-auto px-4 sm:px-6 relative z-10 pb-8 sm:pb-10 md:pb-16">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="lg:w-1/2">
          <span className="text-secondary-surface-dark font-extrabold tracking-[0.2em] uppercase text-lg sm:text-xl mb-2 block">
            OUR WORK
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-heading text-primary-text tracking-tight leading-tight uppercase">
            Brands we&apos;ve helped<br />
            <span className="text-accent-gold">grow and lead.</span>
          </h2>
        </div>
        <div className="lg:w-1/2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-muted-text text-base sm:text-lg max-w-md font-light leading-relaxed">
            Real brands.<br className="hidden sm:block" />
            Real results.<br className="hidden sm:block" />
            Integrated marketing in action.
          </p>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-primary-text/70 hover:text-primary-text font-semibold text-sm uppercase tracking-wider transition-colors shrink-0"
          >
            View All Work <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="relative group">
        <button
          id="portfolio-prev"
          className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary-bg/90 backdrop-blur-md border border-primary-text/10 flex items-center justify-center text-primary-text transition-all duration-300 hover:bg-primary-bg hover:border-accent-blue/50 shadow-lg opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          id="portfolio-next"
          className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary-bg/90 backdrop-blur-md border border-primary-text/10 flex items-center justify-center text-primary-text transition-all duration-300 hover:bg-primary-bg hover:border-accent-blue/50 shadow-lg opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={20} />
        </button>

        <Swiper
          modules={[Navigation]}
          spaceBetween={12}
          slidesPerView={2}
          loop={items.length > 2}
          speed={600}
          navigation={{
            prevEl: "#portfolio-prev",
            nextEl: "#portfolio-next",
          }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id || item.title}>
              <Link
                href={`/work?item=${item.id || encodeURIComponent(item.title)}`}
                className="group/card block cursor-pointer"
              >
                <div className="relative rounded-sm overflow-hidden bg-secondary-surface/40 border border-primary-text/10 hover:border-accent-blue/30 transition-[border-color,box-shadow] duration-200 aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl || "/images/placeholder.png"}
                    alt={`${item.title} — ${item.tag || item.category} case study by Upmark`}
                    className="h-full w-full object-contain group-hover/card:scale-[1.03] transition-transform duration-500"
                  />

                  <div
                    className={`absolute inset-0 bg-gradient-to-t z-20 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ${
                      GRADIENT_HOVER_MAP[item.gradient || ""] || DEFAULT_HOVER_GRADIENT
                    }`}
                  />

                  <div className="absolute top-3 left-3 z-30 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                    <div className="px-3 py-1 bg-black/60 rounded-full text-[10px] text-white uppercase tracking-widest font-semibold border border-white/10">
                      {item.tag || item.category}
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 z-30 translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500">
                    <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                    {item.client && (
                      <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mt-0.5">
                        {item.client}
                      </div>
                    )}
                    <div className="inline-flex items-center gap-2 text-blue-400 font-semibold text-xs mt-2 group-hover/card:gap-3 transition-[gap]">
                      View Details <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
