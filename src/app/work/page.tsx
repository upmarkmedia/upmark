"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import { PreviewDialog } from "@/components/ui/PreviewDialog";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getWorkItems, getSiteSettings, getTestimonials } from "@/lib/firestore";
import type { WorkItem, WorkSection, Testimonial, PageVisibility } from "@/types";

const FALLBACK_WORK_ITEMS: WorkItem[] = [
  { title: "Ingri", client: "Ingri", tag: "Fashion & Lifestyle", stat1: "+210%", stat1label: "Revenue Growth", stat2: "+380%", stat2label: "Social Engagement", description: "Ingri was a premium fashion brand struggling to differentiate in a saturated market. Organic reach had declined 60% and paid ROI was stagnating. We rebuilt their positioning from scratch and engineered a multi-channel content engine that drove consistent growth.", imageUrl: "/images/casestudy-ingri.png", gradient: "from-purple-900/30 to-indigo-900/10", category: "Studies", metrics: [], published: true },
  { title: "Motorworks", client: "Motorworks", tag: "Automotive Services", stat1: "+320%", stat1label: "Lead Volume", stat2: "-58%", stat2label: "Cost Per Lead", description: "Motorworks had strong offline reputation but near-zero digital presence. Competitors dominated local search and their website converted at under 1%. We launched a full-stack digital strategy that transformed their pipeline.", imageUrl: "/images/casestudy-motorworks.png", gradient: "from-blue-900/30 to-slate-900/10", category: "Studies", metrics: [], published: true },
  { title: "Luxe Stays", client: "Luxe Stays", tag: "Hospitality & Hotels", stat1: "+175%", stat1label: "Booking Rate", stat2: "+£420K", stat2label: "Direct Revenue", description: "Luxe Stays was over-reliant on OTA platforms paying 18% commission. They needed direct bookings and brand awareness in a premium segment. We built a direct-to-consumer brand strategy that cut dependency on third-party platforms.", imageUrl: "/images/casestudy-luxestays.png", gradient: "from-amber-900/30 to-orange-900/10", category: "Studies", metrics: [], published: true },
  { title: "The Grove Kitchen", client: "The Grove Kitchen", tag: "Food & Restaurant", stat1: "+290%", stat1label: "Reservations", stat2: "0→45K", stat2label: "TikTok Followers", description: "The Grove Kitchen was a new independent restaurant with no digital footprint, limited budget and fierce competition from established names. We launched a viral-first content strategy that put them on the map in 90 days.", imageUrl: "/images/casestudy-grove.png", gradient: "from-emerald-900/30 to-teal-900/10", category: "Studies", metrics: [], published: true },
  { title: "Vertex Corp", client: "Vertex Corp", tag: "B2B Technology", stat1: "+£2.1M", stat1label: "Pipeline Value", stat2: "+430%", stat2label: "Demo Requests", description: "Vertex had a technically superior product but poor messaging and a sales team struggling to generate qualified demo requests. We overhauled their GTM strategy and built a lead-generation machine.", imageUrl: "/images/casestudy-vertex.png", gradient: "from-rose-900/30 to-red-900/10", category: "Studies", metrics: [], published: true },
  { title: "Bloom Retail", client: "Bloom Retail", tag: "E-commerce & Retail", stat1: "+340%", stat1label: "eCommerce Revenue", stat2: "6.8×", stat2label: "ROAS", description: "Bloom Retail had strong products but weak digital marketing — high ad spend with poor returns and no sustainable organic channel. We restructured their entire paid and organic strategy to drive profitable scale.", imageUrl: "/images/casestudy-bloom.png", gradient: "from-cyan-900/30 to-blue-900/10", category: "Studies", metrics: [], published: true },
];

const FALLBACK_PORTFOLIO: WorkItem[] = [
  { id: "p-1", title: "Ingri — SS26 Campaign Film", client: "Ingri", defaultGalleryMode: "grid", galleryUrls: [], duration: "1:45", description: "Cinematic campaign film for Ingri's Spring/Summer collection. Shot on location in Milan and London.", imageUrl: "/images/casestudy-ingri.png", category: "Production", metrics: [], published: true },
  { id: "p-2", title: "Luxe Stays — Brand Story", client: "Luxe Stays", defaultGalleryMode: "grid", galleryUrls: [], duration: "2:30", description: "Brand documentary capturing the essence of Luxe Stays hospitality. A narrative piece driving direct bookings.", imageUrl: "/images/casestudy-luxestays.png", category: "Production", metrics: [], published: true },
  { id: "p-3", title: "Bloom Retail — Product Lookbook", client: "Bloom Retail", defaultGalleryMode: "carousel", galleryUrls: [], description: "Editorial product photography for Bloom's seasonal lookbook. Styled for eCommerce and social platforms.", imageUrl: "/images/casestudy-bloom.png", category: "Production", metrics: [], published: true },
  { id: "p-4", title: "The Grove Kitchen — Menu Editorial", client: "The Grove Kitchen", defaultGalleryMode: "grid", galleryUrls: [], description: "Moody food photography for The Grove Kitchen's signature menu, shot on location in the restaurant.", imageUrl: "/images/casestudy-grove.png", category: "Production", metrics: [], published: true },
  { id: "p-5", title: "Motorworks — Service Showcase", client: "Motorworks", defaultGalleryMode: "carousel", galleryUrls: [], duration: "0:45", description: "Cinematic workshop showcase highlighting premium automotive service and attention to detail.", imageUrl: "/images/casestudy-motorworks.png", category: "Production", metrics: [], published: true },
  { id: "p-6", title: "Vertex Corp — Product Demo", client: "Vertex Corp", defaultGalleryMode: "grid", galleryUrls: [], duration: "1:15", description: "A technical product demonstration video that simplified complex B2B messaging into engaging visuals.", imageUrl: "/images/casestudy-vertex.png", category: "Production", metrics: [], published: true },
];

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

export default function WorkPage() {
  const [caseStudies, setCaseStudies] = useState<WorkItem[]>(FALLBACK_WORK_ITEMS);
  const [portfolioItems, setPortfolioItems] = useState<WorkItem[]>(FALLBACK_PORTFOLIO);
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
        const [all, settings, allTestimonials] = await Promise.all([
          getWorkItems(),
          getSiteSettings(),
          getTestimonials(),
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
        if (allTestimonials.length > 0) setTestimonials(allTestimonials);
        if (settings?.portfolioSection) setPortfolioSection(settings.portfolioSection);
        if (settings?.productionSection) setProductionSection(settings.productionSection);
        if (settings?.testimonialsSection) setTestimonialsSection(settings.testimonialsSection);
        if (settings?.visibility) setVisibility(settings.visibility);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  // Sequentially preload the first portfolio item's gallery
  useEffect(() => {
    if (portfolioItems && portfolioItems.length > 0) {
      const firstItemUrls = portfolioItems[0].galleryUrls;
      if (firstItemUrls && firstItemUrls.length > 0) {
        let isCancelled = false;
        const preload = async () => {
          for (const url of firstItemUrls) {
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
            } catch (e) {}
          }
        };
        preload();
        return () => {
          isCancelled = true;
        };
      }
    }
  }, [portfolioItems]);

  const show = (key: keyof PageVisibility) => visibility[key] ?? true;
  const pageVisible = show("work");
  const headerVisible = show("workHeader");
  const portfolioVisible = show("workPortfolio") && caseStudies.length > 0;
  const productionVisible = show("workProduction") && portfolioItems.length > 0;
  const testimonialsVisible = show("workTestimonials") && testimonials.length > 0;

  if (!pageVisible) return null;

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-32">
      {/* Page Header */}
      {headerVisible && (
      <section className="container mx-auto px-4 sm:px-6 relative z-10 mb-16 sm:mb-20">
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
      {portfolioVisible && (
      <section className="container mx-auto px-4 sm:px-6 relative z-10 mb-20 sm:mb-32 content-visibility-auto">
        <HorizontalCarousel
          label={portfolioSection.label}
          title={portfolioSection.title}
          subtitle={portfolioSection.subtitle}
        >
          {caseStudies.map((cs) => (
            <div
              key={cs.id || cs.title}
              onClick={() => { setSelectedCs(cs); setCsPreviewOpen(true); }}
              className="snap-start flex-shrink-0 cursor-pointer group"
            >
              <div className="relative rounded-sm overflow-hidden bg-secondary-surface/40 border border-primary-text/10 hover:border-accent-blue/30 transition-[border-color,box-shadow] duration-200 aspect-square w-[300px] sm:w-[420px] flex">
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
                <div className="absolute bottom-0 left-0 right-0 p-5 z-30 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{cs.title}</h3>
                  {cs.client && (
                    <div className="text-sm font-semibold text-blue-400 pb-3 border-b border-white/10 uppercase tracking-wider">{cs.client}</div>
                  )}
                  <p className="text-white/80 font-light text-sm line-clamp-2 mt-1 whitespace-pre-wrap">{cs.description}</p>
                  <div className="inline-flex items-center gap-2 text-blue-400 font-semibold text-sm group-hover:gap-3 transition-[gap] mt-3">
                    View Details <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </HorizontalCarousel>
      </section>
      )}

      {/* ─── Production Section ────────────────────────────── */}
      {productionVisible && (
      <section className="container mx-auto px-4 sm:px-6 relative z-10 mb-20 sm:mb-32 content-visibility-auto">
        <HorizontalCarousel
          label={productionSection.label}
          title={productionSection.title}
          subtitle={productionSection.subtitle}
        >
          {portfolioItems.map((item) => (
            <div
              key={item.id || item.title}
              onClick={() => { setSelectedPf(item); setPfPreviewOpen(true); }}
              className="snap-start flex-shrink-0 cursor-pointer group"
            >
              <div className="relative rounded-sm overflow-hidden bg-secondary-surface/40 border border-primary-text/10 hover:border-accent-blue/30 transition-[border-color]">
                <div className="aspect-square w-[300px] sm:w-[420px] relative overflow-hidden flex">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10"></div>

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

                  <div className="absolute bottom-0 left-0 right-0 p-5 z-30 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/90">
                         Gallery
                       </span>
                       {item.duration && <span className="text-[10px] text-white/70 font-mono tracking-widest">{item.duration}</span>}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                    {item.client && (
                      <div className="text-sm font-semibold text-blue-400 mt-1 uppercase tracking-wider">{item.client}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </HorizontalCarousel>
      </section>
      )}

      {/* ─── Testimonials Section ─────────────────────────── */}
      {testimonialsVisible && (
      <div id="testimonials" className="scroll-mt-32">
        <TestimonialsCarousel testimonials={testimonials} maxItems={testimonials.length || 3} section={testimonialsSection} />
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
