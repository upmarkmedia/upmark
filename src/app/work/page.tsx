"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import { PreviewDialog } from "@/components/ui/PreviewDialog";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SwiperSlide } from "swiper/react";
import { getWorkItems, getSiteSettings, getTestimonials } from "@/lib/firestore";
import type { WorkItem, WorkSection, Testimonial, PageVisibility } from "@/types";

const GRADIENT_HOVER_MAP: Record<string, string> = {
  "from-purple-900/30 to-indigo-900/10": "from-purple-900 via-purple-700/70 to-transparent",
  "from-blue-900/30 to-slate-900/10": "from-blue-900 via-blue-700/70 to-transparent",
  "from-amber-900/30 to-orange-900/10": "from-amber-900 via-amber-700/70 to-transparent",
  "from-emerald-900/30 to-teal-900/10": "from-emerald-900 via-emerald-700/70 to-transparent",
  "from-rose-900/30 to-red-900/10": "from-rose-900 via-rose-700/70 to-transparent",
  "from-cyan-900/30 to-blue-900/10": "from-cyan-900 via-cyan-700/70 to-transparent",
};
const DEFAULT_HOVER_GRADIENT = "from-black via-black/70 to-transparent";

const DEFAULT_PORTFOLIO_SECTION: WorkSection = {
  label: "PORTFOLIO",
  title: "Strategies that deliver.",
  subtitle: "Deep-dive case studies demonstrating measurable growth across industries.",
};

const DEFAULT_PRODUCTION_SECTION: WorkSection = {
  label: "PRODUCTION",
  title: "Production showcase.",
  subtitle: "Cinematic quality stills and motion content produced entirely in-house.",
  autoplayVideos: true,
  detailFields: ["title", "client", "description"],
};

function WorkPageContent() {
  const searchParams = useSearchParams();
  const [caseStudies, setCaseStudies] = useState<WorkItem[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<WorkItem[]>([]);
  const [portfolioSection, setPortfolioSection] = useState<WorkSection>(DEFAULT_PORTFOLIO_SECTION);
  const [productionSection, setProductionSection] = useState<WorkSection>(DEFAULT_PRODUCTION_SECTION);
  const [testimonialsSection, setTestimonialsSection] = useState<WorkSection | undefined>();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [visibility, setVisibility] = useState<PageVisibility>({});
  const [csPreviewOpen, setCsPreviewOpen] = useState(false);
  const [selectedCs, setSelectedCs] = useState<WorkItem | null>(null);
  const [pfPreviewOpen, setPfPreviewOpen] = useState(false);
  const [selectedPf, setSelectedPf] = useState<WorkItem | null>(null);


  useEffect(() => {
    async function fetchData() {
      try {
        const [all, settings] = await Promise.all([
          getWorkItems(),
          getSiteSettings(),
        ]);
        const published = all.filter(w => w.published);
        const studies = published
          .filter(w => ["Studies", "Portfolio", "Success Stories", "Client Testimonials"].includes(w.category))
          .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        const portfolio = published
          .filter(w => ["Stills & Motions", "Production"].includes(w.category))
          .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        if (studies.length > 0) setCaseStudies(studies);
        if (portfolio.length > 0) setPortfolioItems(portfolio);
        if (settings?.portfolioSection) setPortfolioSection(settings.portfolioSection);
        if (settings?.productionSection) setProductionSection(settings.productionSection);
        if (settings?.testimonialsSection) setTestimonialsSection(settings.testimonialsSection);
        if (settings?.visibility) setVisibility(settings.visibility);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();

    async function fetchTestimonialsData() {
      try {
        const allTestimonials = await getTestimonials();
        if (allTestimonials.length > 0) setTestimonials(allTestimonials);
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      }
    };
    fetchTestimonialsData();
  }, []);

  // Auto-open preview dialog when navigated from homepage with ?item= param
  useEffect(() => {
    const itemId = searchParams.get("item");
    if (!itemId) return;

    const decoded = decodeURIComponent(itemId);

    // Search in case studies first
    const foundCs = caseStudies.find(
      (cs) => cs.id === itemId || cs.title === itemId || cs.title === decoded
    );
    if (foundCs) {
      setSelectedCs(foundCs);
      setCsPreviewOpen(true);
      return;
    }
    // Then search in production items
    const foundPf = portfolioItems.find(
      (pf) => pf.id === itemId || pf.title === itemId || pf.title === decoded
    );
    if (foundPf) {
      setSelectedPf(foundPf);
      setPfPreviewOpen(true);
    }
  }, [searchParams, caseStudies, portfolioItems]);

  // Sequentially preload the first portfolio item's gallery
  useEffect(() => {
    if (portfolioItems && portfolioItems.length > 0) {
      const firstItemUrls = portfolioItems[0].galleryUrls;
      if (firstItemUrls && firstItemUrls.length > 0) {
        let isCancelled = false;
        const elements: (HTMLVideoElement | HTMLImageElement)[] = [];
        const preload = async () => {
          for (const url of firstItemUrls) {
            if (isCancelled) break;
            try {
              if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
                await new Promise((resolve) => {
                  const video = document.createElement("video");
                  video.preload = "metadata";
                  video.src = url;
                  elements.push(video);
                  video.onloadedmetadata = () => resolve(true);
                  video.onerror = () => resolve(false);
                });
              } else {
                await new Promise((resolve) => {
                  const img = new window.Image();
                  img.src = url;
                  elements.push(img);
                  img.onload = () => resolve(true);
                  img.onerror = () => resolve(false);
                });
              }
            } catch (e) {}
          }
        };
        preload();
        return () => {
          isCancelled = true;
          elements.forEach((el) => {
            el.removeAttribute("src");
          });
        };
      }
    }
  }, [portfolioItems]);

  const show = (key: keyof PageVisibility) => visibility[key] ?? true;
  const pageVisible = show("work");
  const headerVisible = show("workHeader");
  const portfolioVisible = show("workPortfolio") && caseStudies.length > 0;
  const productionVisible = show("workProduction") && portfolioItems.length > 0;
  const testimonialsVisible = show("workTestimonials");

  if (!pageVisible) return null;

  return (
    <div className="pt-16 sm:pt-20">
      {/* Page Header */}
      {headerVisible && (
      <section className="container mx-auto px-4 sm:px-6 relative z-10 mb-10 sm:mb-12">
        <ScrollReveal className="text-center flex flex-col items-center">
           <span className="text-secondary-surface-dark font-extrabold tracking-[0.2em] uppercase text-xl mb-3">
              OUR WORK
           </span>
           <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold font-heading text-primary-text tracking-tight leading-tight mb-4 sm:mb-6 uppercase">
              Results that speak <span className="text-accent-gold">for themselves.</span>
           </h1>
          <p className="text-muted-text text-base sm:text-xl max-w-2xl font-light">
             Real campaigns, real results. Each project below represents a complete marketing system built, launched and optimised by Upmark.
          </p>
        </ScrollReveal>
      </section>
      )}

      {/* ─── Portfolio Section ─────────────────────────── */}
      {portfolioVisible && caseStudies.length > 0 && (
      <section className="bg-black relative z-10 content-visibility-auto py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
        <HorizontalCarousel
          label={portfolioSection.label}
          title={portfolioSection.title}
          subtitle={portfolioSection.subtitle}
          lightText
        >
          {caseStudies.map((cs) => (
            <SwiperSlide key={cs.id || cs.title}>
              <div
                onClick={() => { setSelectedCs(cs); setCsPreviewOpen(true); }}
                className="cursor-pointer group"
              >
              <div className="relative rounded-sm overflow-hidden bg-white border border-primary-text/10 hover:border-accent-blue/30 transition-[border-color,box-shadow] duration-200 aspect-square w-full flex">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cs.imageUrl || "/images/placeholder.png"}
                  alt={`${cs.title} — ${cs.tag} case study by Upmark`}
                  className="h-full w-full object-contain group-hover:scale-[1.03] transition-transform duration-500"
                />
                
                <div className={`absolute inset-0 bg-gradient-to-t z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${GRADIENT_HOVER_MAP[cs.gradient || ""] || DEFAULT_HOVER_GRADIENT}`}></div>

                <div className="absolute top-3 left-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                   <div className="px-3 py-1 bg-black/60 rounded-full text-[10px] text-white uppercase tracking-widest font-semibold border border-white/10">
                     {cs.tag || cs.category}
                   </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 z-30 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-base sm:text-2xl font-bold text-white leading-tight">{cs.title}</h3>
                  {cs.client && (
                    <div className="text-[10px] sm:text-sm font-semibold text-blue-400 pb-2 sm:pb-3 border-b border-white/10 uppercase tracking-wider mt-1">{cs.client}</div>
                  )}
                  <p className="text-white/80 font-light text-[10px] sm:text-sm line-clamp-2 mt-1 sm:mt-2 whitespace-pre-wrap">{cs.description}</p>
                  <div className="inline-flex items-center gap-1 sm:gap-2 text-blue-400 font-semibold text-[10px] sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-[gap] mt-2 sm:mt-3">
                    View Details <ArrowUpRight size={14} className="sm:w-4 sm:h-4" />
                  </div>
                </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </HorizontalCarousel>
        </div>
      </section>
      )}

      {/* ─── Production Section ────────────────────────────── */}
      {productionVisible && portfolioItems.length > 0 && (
      <section className="bg-accent-gold relative z-10 content-visibility-auto">
        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <HorizontalCarousel
          label={productionSection.label}
          title={productionSection.title}
          subtitle={productionSection.subtitle}
        >
          {portfolioItems.map((item) => (
            <SwiperSlide key={item.id || item.title}>
              <div
                onClick={() => { setSelectedPf(item); setPfPreviewOpen(true); }}
                className="cursor-pointer group"
              >
              <div className="relative rounded-sm overflow-hidden bg-white border border-primary-text/10 hover:border-accent-blue/30 transition-[border-color]">
                <div className="aspect-square w-full relative overflow-hidden flex">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl || "/images/placeholder.png"}
                    alt={`${item.title} — production by Upmark`}
                    className="h-full w-full object-contain group-hover:scale-[1.03] transition-transform duration-500"
                  />

                  <div className={`absolute inset-0 bg-gradient-to-t z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${GRADIENT_HOVER_MAP[item.gradient || ""] || DEFAULT_HOVER_GRADIENT}`}></div>

                  <div className="absolute top-3 left-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                     <div className="px-3 py-1 bg-black/60 rounded-full text-[10px] text-white uppercase tracking-widest font-semibold border border-white/10 backdrop-blur-md">
                       {item.tag || item.category}
                     </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 z-30 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                       <span className="px-1 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/90">
                         Gallery
                       </span>
                       {item.duration && <span className="text-[8px] sm:text-[10px] text-white/70 font-mono tracking-widest">{item.duration}</span>}
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-white leading-tight">{item.title}</h3>
                    {item.client && (
                      <div className="text-[10px] sm:text-sm font-semibold text-blue-400 mt-0.5 sm:mt-1 uppercase tracking-wider">{item.client}</div>
                    )}
                  </div>
                </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </HorizontalCarousel>
        </div>
      </section>
      )}

      {/* ─── Testimonials Section ─────────────────────────── */}
      {testimonialsVisible && (
      <div id="testimonials" className="scroll-mt-32 bg-black py-10 sm:py-16 -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-hidden">
        <TestimonialsCarousel testimonials={testimonials} maxItems={testimonials.length || 3} section={testimonialsSection} lightText noSectionPadding />
      </div>
      )}

      {/* ─── Case Study Preview Dialog ───────────────────── */}
      {selectedCs && (
        <PreviewDialog
          open={csPreviewOpen}
          onClose={() => setCsPreviewOpen(false)}
          title={selectedCs.title}
          description={selectedCs.description}
          imageUrl={selectedCs.imageUrl}
          meta={[
            { label: "Client", value: selectedCs.client || "—" },
            { label: "Industry", value: selectedCs.tag || "" }
          ]}
        />
      )}

      {/* ─── Portfolio Preview Dialog ────────────────────── */}
      {selectedPf && (
        <PreviewDialog
          open={pfPreviewOpen}
          onClose={() => setPfPreviewOpen(false)}
          title={selectedPf.title}
          description={selectedPf.description}
          imageUrl={selectedPf.imageUrl}
          galleryUrls={selectedPf.galleryUrls}
          defaultGalleryMode={selectedPf.defaultGalleryMode}
          detailFields={(productionSection.detailFields || [])
            .filter((field) => {
              const val = selectedPf[field as keyof WorkItem];
              return val !== undefined && val !== "";
            })
            .map((field) => {
              const labels: Record<string, string> = {
                title: "Title",
                client: "Client",
                description: "Description",
                tag: "Industry",
                duration: "Duration",
                details: "Details",
              };
              return { label: labels[field] || field, value: String(selectedPf[field as keyof WorkItem] ?? "") };
            })}
          autoHide
        />
      )}
    </div>
  );
}

export default function WorkPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center text-muted-text">
        <div className="w-10 h-10 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <WorkPageContent />
    </Suspense>
  );
}
