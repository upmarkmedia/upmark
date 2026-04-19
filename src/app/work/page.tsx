"use client";

import Image from "next/image";
import { ArrowUpRight, PlayCircle } from "lucide-react";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import { PreviewDialog } from "@/components/ui/PreviewDialog";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useState } from "react";

// ─── Case Studies data ─────────────────────────────────────
const caseStudies = [
  { title: "Ingri", tag: "Fashion & Lifestyle", stat1: "+210%", stat1label: "Revenue Growth", stat2: "+380%", stat2label: "Social Engagement", desc: "Ingri was a premium fashion brand struggling to differentiate in a saturated market. Organic reach had declined 60% and paid ROI was stagnating. We rebuilt their positioning from scratch and engineered a multi-channel content engine that drove consistent growth.", image: "/images/casestudy-ingri.png", gradient: "from-purple-900/30 to-indigo-900/10" },
  { title: "Motorworks", tag: "Automotive Services", stat1: "+320%", stat1label: "Lead Volume", stat2: "-58%", stat2label: "Cost Per Lead", desc: "Motorworks had strong offline reputation but near-zero digital presence. Competitors dominated local search and their website converted at under 1%. We launched a full-stack digital strategy that transformed their pipeline.", image: "/images/casestudy-motorworks.png", gradient: "from-blue-900/30 to-slate-900/10" },
  { title: "Luxe Stays", tag: "Hospitality & Hotels", stat1: "+175%", stat1label: "Booking Rate", stat2: "+£420K", stat2label: "Direct Revenue", desc: "Luxe Stays was over-reliant on OTA platforms paying 18% commission. They needed direct bookings and brand awareness in a premium segment. We built a direct-to-consumer brand strategy that cut dependency on third-party platforms.", image: "/images/casestudy-luxestays.png", gradient: "from-amber-900/30 to-orange-900/10" },
  { title: "The Grove Kitchen", tag: "Food & Restaurant", stat1: "+290%", stat1label: "Reservations", stat2: "0→45K", stat2label: "TikTok Followers", desc: "The Grove Kitchen was a new independent restaurant with no digital footprint, limited budget and fierce competition from established names. We launched a viral-first content strategy that put them on the map in 90 days.", image: "/images/casestudy-grove.png", gradient: "from-emerald-900/30 to-teal-900/10" },
  { title: "Vertex Corp", tag: "B2B Technology", stat1: "+£2.1M", stat1label: "Pipeline Value", stat2: "+430%", stat2label: "Demo Requests", desc: "Vertex had a technically superior product but poor messaging and a sales team struggling to generate qualified demo requests. We overhauled their GTM strategy and built a lead-generation machine.", image: "/images/casestudy-vertex.png", gradient: "from-rose-900/30 to-red-900/10" },
  { title: "Bloom Retail", tag: "E-commerce & Retail", stat1: "+340%", stat1label: "eCommerce Revenue", stat2: "6.8×", stat2label: "ROAS", desc: "Bloom Retail had strong products but weak digital marketing — high ad spend with poor returns and no sustainable organic channel. We restructured their entire paid and organic strategy to drive profitable scale.", image: "/images/casestudy-bloom.png", gradient: "from-cyan-900/30 to-blue-900/10" },
];

// ─── Portfolio (merged Stills & Motions) ────────────────────
const portfolioItems = [
  { id: "p-1", title: "Ingri — SS26 Campaign Film", client: "Ingri", type: "Motion" as const, duration: "1:45", desc: "Cinematic campaign film for Ingri's Spring/Summer collection. Shot on location in Milan and London.", image: "/images/casestudy-ingri.png" },
  { id: "p-2", title: "Luxe Stays — Brand Story", client: "Luxe Stays", type: "Motion" as const, duration: "2:30", desc: "Brand documentary capturing the essence of Luxe Stays hospitality. A narrative piece driving direct bookings.", image: "/images/casestudy-luxestays.png" },
  { id: "p-3", title: "Bloom Retail — Product Lookbook", client: "Bloom Retail", type: "Stills" as const, desc: "Editorial product photography for Bloom's seasonal lookbook. Styled for eCommerce and social platforms.", image: "/images/casestudy-bloom.png" },
  { id: "p-4", title: "The Grove Kitchen — Menu Editorial", client: "The Grove Kitchen", type: "Stills" as const, desc: "Moody food photography for The Grove Kitchen's signature menu, shot on location in the restaurant.", image: "/images/casestudy-grove.png" },
  { id: "p-5", title: "Motorworks — Service Showcase", client: "Motorworks", type: "Motion" as const, duration: "0:45", desc: "Cinematic workshop showcase highlighting premium automotive service and attention to detail.", image: "/images/casestudy-motorworks.png" },
  { id: "p-6", title: "Vertex Corp — Product Demo", client: "Vertex Corp", type: "Motion" as const, duration: "1:15", desc: "A technical product demonstration video that simplified complex B2B messaging into engaging visuals.", image: "/images/casestudy-vertex.png" },
];

export default function WorkPage() {
  // Case study preview
  const [csPreviewOpen, setCsPreviewOpen] = useState(false);
  const [selectedCs, setSelectedCs] = useState<(typeof caseStudies)[0] | null>(null);

  // Portfolio preview
  const [pfPreviewOpen, setPfPreviewOpen] = useState(false);
  const [selectedPf, setSelectedPf] = useState<(typeof portfolioItems)[0] | null>(null);

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-32">
      {/* Page Header */}
      <section className="container mx-auto px-4 sm:px-6 relative z-10 mb-16 sm:mb-20">
        <ScrollReveal className="text-center flex flex-col items-center">
          <span className="text-accent-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block inline-flex items-center gap-4">
             <span className="w-8 h-[1px] bg-accent-gold"></span>
             OUR WORK
             <span className="w-8 h-[1px] bg-accent-gold"></span>
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black font-heading text-white tracking-tight mb-4 sm:mb-6">
             Results that speak <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-gold to-yellow-400">for themselves.</span>
          </h1>
          <p className="text-muted-text text-base sm:text-xl max-w-2xl font-light">
             Real campaigns, real results. Each project below represents a complete marketing system built, launched and optimised by Upmark.
          </p>
        </ScrollReveal>
      </section>

      {/* ─── Case Studies Carousel ─────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 relative z-10 mb-20 sm:mb-32">
        <HorizontalCarousel
          label="CASE STUDIES"
          title={<>Strategies that <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-blue-400">deliver.</span></>}
          subtitle="Deep-dive case studies demonstrating measurable growth across industries."
        >
          {caseStudies.map((cs) => (
            <div
              key={cs.title}
              onClick={() => { setSelectedCs(cs); setCsPreviewOpen(true); }}
              className="snap-start flex-shrink-0 w-[320px] sm:w-[380px] md:w-[420px] cursor-pointer group"
            >
              <div className="rounded-2xl sm:rounded-3xl bg-secondary-surface/40 border border-white/5 hover:border-accent-blue/30 transition-all duration-200 overflow-hidden h-full hover:shadow-[0_0_40px_rgba(59,130,246,0.08)]">
                {/* Image */}
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  <Image
                    src={cs.image}
                    alt={`${cs.title} — ${cs.tag} case study by Upmark`}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    sizes="420px"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${cs.gradient} opacity-60`}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent"></div>
                  <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 rounded-full text-[10px] text-white uppercase tracking-widest font-semibold border border-white/10">
                    {cs.tag}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3">{cs.title}</h3>
                  <div className="flex items-center gap-6 mb-3 pb-3 border-b border-white/10">
                    <div>
                      <div className="text-lg sm:text-xl font-black text-white">{cs.stat1}</div>
                      <div className="text-muted-text text-[10px] uppercase tracking-wider">{cs.stat1label}</div>
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-black text-white">{cs.stat2}</div>
                      <div className="text-muted-text text-[10px] uppercase tracking-wider">{cs.stat2label}</div>
                    </div>
                  </div>
                  <p className="text-muted-text/90 font-light text-sm line-clamp-2 mb-3">{cs.desc}</p>
                  <div className="inline-flex items-center gap-2 text-accent-blue font-semibold text-sm group-hover:gap-3 transition-all">
                    View Details <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </HorizontalCarousel>
      </section>

      {/* ─── Portfolio Carousel ────────────────────────────── */}
      <section className="container mx-auto px-4 sm:px-6 relative z-10 mb-20 sm:mb-32">
        <HorizontalCarousel
          label="PORTFOLIO"
          title={<>Production <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-gold to-yellow-400">showcase.</span></>}
          subtitle="Cinematic quality stills and motion content produced entirely in-house."
        >
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              onClick={() => { setSelectedPf(item); setPfPreviewOpen(true); }}
              className="snap-start flex-shrink-0 w-[260px] sm:w-[300px] md:w-[340px] cursor-pointer group"
            >
              <div className="relative rounded-2xl overflow-hidden bg-secondary-surface/40 border border-white/5 hover:border-accent-blue/30 transition-all">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10"></div>
                  <Image
                    src={item.image}
                    alt={`${item.title} — production by Upmark`}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    sizes="340px"
                  />

                  {/* Play icon for motions */}
                  {item.type === "Motion" && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-white/70 group-hover:text-white transition-colors group-hover:scale-110 duration-300">
                      <PlayCircle size={48} strokeWidth={1} />
                    </div>
                  )}

                  {/* Text Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 translate-y-1 group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center gap-2 mb-2">
                       <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.type === 'Motion' ? 'bg-accent-blue/20 text-accent-blue' : 'bg-accent-gold/20 text-accent-gold'}`}>
                         {item.type}
                       </span>
                       {item.duration && <span className="text-[10px] text-white/70 font-mono tracking-widest">{item.duration}</span>}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </HorizontalCarousel>
      </section>

      {/* ─── Testimonials Section ─────────────────────────── */}
      <div id="testimonials" className="scroll-mt-32">
        <TestimonialsCarousel maxItems={3} />
      </div>

      {/* ─── Case Study Preview Dialog ───────────────────── */}
      {selectedCs && (
        <PreviewDialog
          open={csPreviewOpen}
          onClose={() => setCsPreviewOpen(false)}
          title={selectedCs.title}
          description={selectedCs.desc}
          imageUrl={selectedCs.image}
          stats={[
            { label: selectedCs.stat1label, value: selectedCs.stat1 },
            { label: selectedCs.stat2label, value: selectedCs.stat2 },
          ]}
          meta={[{ label: "Industry", value: selectedCs.tag }]}
        />
      )}

      {/* ─── Portfolio Preview Dialog ────────────────────── */}
      {selectedPf && (
        <PreviewDialog
          open={pfPreviewOpen}
          onClose={() => setPfPreviewOpen(false)}
          title={selectedPf.title}
          description={selectedPf.desc}
          imageUrl={selectedPf.image}
          meta={[
            { label: "Client", value: selectedPf.client },
            { label: "Type", value: selectedPf.type },
            ...(selectedPf.duration ? [{ label: "Duration", value: selectedPf.duration }] : []),
          ]}
        />
      )}
    </div>
  );
}
