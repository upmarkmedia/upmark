import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getCaseStudies } from "@/lib/firestore";

export const metadata: Metadata = {
  title: "Case Studies | Upmark — Real Results, Real Growth",
  description: "Explore Upmark's case studies. See how we've driven measurable growth for brands across fashion, hospitality, tech and more.",
};

// ─── Default fallback data ─────────────────────────────────
const DEFAULT_STUDIES = [
  {
    id: "study-1",
    title: "Building a Growth Engine for Fashion DTC",
    description: "A strategic deep-dive into how we architected a multi-channel acquisition system for Ingri — combining paid media, organic content and influencer partnerships into a single, self-reinforcing growth loop that delivered 210% revenue growth in 8 months.",
    category: "Studies" as const,
    client: "Ingri",
    metrics: ["+210% Revenue", "+380% Engagement"],
    mediaUrl: "",
    tag: "Growth Architecture",
    stat1: "+210%",
    stat1label: "Revenue Growth",
    stat2: "8 months",
    stat2label: "Timeline",
    imageUrl: "/images/casestudy-ingri.png",
    gradient: "from-purple-900/30 to-indigo-900/10",
  },
  {
    id: "study-2",
    title: "Redefining B2B Lead Generation at Scale",
    description: "How we transformed Vertex Corp's go-to-market strategy — replacing cold outbound with an inbound-first demand generation system that created £2.1M in qualified pipeline and 430% more demo requests within two quarters.",
    category: "Studies" as const,
    client: "Vertex Corp",
    metrics: ["+£2.1M Pipeline", "+430% Demos"],
    mediaUrl: "",
    tag: "Demand Generation",
    stat1: "+£2.1M",
    stat1label: "Pipeline Created",
    stat2: "+430%",
    stat2label: "Demo Requests",
    imageUrl: "/images/casestudy-vertex.png",
    gradient: "from-rose-900/30 to-red-900/10",
  },
  {
    id: "study-3",
    title: "Motorworks: From Zero to Digital-First",
    description: "Motorworks had a strong offline reputation but virtually no digital footprint. We built their entire online presence from scratch — SEO, paid search, social content and a conversion-optimised website — cutting cost-per-lead by 58% while tripling volume.",
    category: "Studies" as const,
    client: "Motorworks",
    metrics: ["+320% Leads", "-58% CPL"],
    mediaUrl: "",
    tag: "Digital Transformation",
    stat1: "+320%",
    stat1label: "Lead Volume",
    stat2: "-58%",
    stat2label: "Cost Per Lead",
    imageUrl: "/images/casestudy-motorworks.png",
    gradient: "from-blue-900/30 to-slate-900/10",
  },
  {
    id: "study-4",
    title: "Luxe Stays: Cutting OTA Dependency",
    description: "Luxe Stays was losing 18% of revenue to OTA commissions. We built a direct booking strategy combining brand content, SEO and targeted paid campaigns — generating £420K in direct revenue and boosting their booking rate by 175%.",
    category: "Studies" as const,
    client: "Luxe Stays",
    metrics: ["+175% Bookings", "+£420K Revenue"],
    mediaUrl: "",
    tag: "Hospitality Growth",
    stat1: "+175%",
    stat1label: "Booking Rate",
    stat2: "+£420K",
    stat2label: "Direct Revenue",
    imageUrl: "/images/casestudy-luxestays.png",
    gradient: "from-amber-900/30 to-orange-900/10",
  },
  {
    id: "study-5",
    title: "Bloom Retail: 6.8× ROAS at Scale",
    description: "Bloom Retail had strong products but inefficient marketing. We restructured their paid media, launched a content-driven organic strategy and optimised their product pages — achieving 6.8× ROAS and 340% revenue growth.",
    category: "Studies" as const,
    client: "Bloom Retail",
    metrics: ["6.8× ROAS", "+340% Revenue"],
    mediaUrl: "",
    tag: "E-commerce Scale",
    stat1: "6.8×",
    stat1label: "ROAS",
    stat2: "+340%",
    stat2label: "Revenue Growth",
    imageUrl: "/images/casestudy-bloom.png",
    gradient: "from-cyan-900/30 to-blue-900/10",
  },
  {
    id: "study-6",
    title: "The Grove Kitchen: Viral in 90 Days",
    description: "A new restaurant with zero digital presence. We designed a TikTok-first content strategy that generated 45K followers and boosted reservations by 290% — proving that strategic content can outperform paid media for local businesses.",
    category: "Studies" as const,
    client: "The Grove Kitchen",
    metrics: ["+290% Reservations", "45K Followers"],
    mediaUrl: "",
    tag: "Viral Growth",
    stat1: "+290%",
    stat1label: "Reservations",
    stat2: "0→45K",
    stat2label: "TikTok Followers",
    imageUrl: "/images/casestudy-grove.png",
    gradient: "from-emerald-900/30 to-teal-900/10",
  },
];

export default async function CaseStudiesPage() {
  const allCaseStudies = await getCaseStudies();

  // Use Firestore data if available, otherwise use defaults
  const studies = allCaseStudies.length > 0
    ? allCaseStudies.filter(cs => cs.category === "Studies" || cs.category === "Success Stories")
    : DEFAULT_STUDIES;

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-32 relative">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col gap-16 sm:gap-24 md:gap-32">
        {/* Page Header */}
        <div className="max-w-4xl pt-4 sm:pt-10">
          <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs mb-4 block flex items-center gap-4">
             <span className="w-8 h-[1px] bg-accent-blue"></span>
             CASE STUDIES
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold font-heading text-white mb-4 sm:mb-6 tracking-tight">Case Studies.</h1>
          <p className="text-base sm:text-xl text-muted-text font-light max-w-2xl">Results driven by strategy, scaled by execution. We measure our success purely by the continuous growth of our partners.</p>
        </div>

        {/* Case Studies Grid */}
        <section id="studies" className="scroll-mt-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
            {studies.map((item) => (
              <div key={item.id} className="group flex flex-col bg-secondary-surface/30 border border-white/5 rounded-3xl overflow-hidden hover:border-accent-blue/30 transition-all">
                {/* Visual */}
                <div className="w-full aspect-video relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient || 'from-blue-900/30 to-slate-900/10'} opacity-50 mix-blend-overlay z-10`}></div>
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={`${item.title} — case study by Upmark`}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent z-10"></div>
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 rounded-full text-xs text-white uppercase tracking-widest font-semibold border border-white/10 z-20">{item.tag || item.category}</div>
                </div>
                {/* Body */}
                <div className="p-5 sm:p-8 flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 line-clamp-2">{item.title}</h3>
                  <p className="text-muted-text/90 font-light text-sm mb-6 sm:mb-8 flex-grow">{item.description}</p>
                  {(item.stat1 || item.stat2) && (
                    <div className="flex items-center justify-between border-t border-white/10 pt-6">
                      {item.stat1 && (
                        <div>
                          <div className="text-2xl font-bold text-white">{item.stat1}</div>
                          <div className="text-[10px] text-muted-text uppercase tracking-wider">{item.stat1label}</div>
                        </div>
                      )}
                      {item.stat2 && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{item.stat2}</div>
                          <div className="text-[10px] text-muted-text uppercase tracking-wider">{item.stat2label}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Area */}
        <section className="mt-10 py-16 border-t border-white/10 flex flex-col items-center justify-center text-center">
           <h2 className="text-2xl sm:text-3xl md:text-5xl font-black font-heading text-white mb-6 sm:mb-8">Ready to compound your growth?</h2>
           <p className="text-muted-text text-base sm:text-lg max-w-xl mb-8 sm:mb-10 font-light">Let&apos;s discuss how Upmark can build a complete marketing system for your business.</p>
           <div className="flex flex-col sm:flex-row items-center gap-4">
             <Link href="/work" className="group flex items-center justify-center gap-2 bg-accent-blue text-white px-8 py-4 rounded-lg font-semibold text-base overflow-hidden transition-all hover:scale-[1.02] shadow-[0_0_30px_-10px_rgba(59,130,246,0.6)]">
               View our work <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </Link>
             <Link href="/services" className="group flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base text-primary-text bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors duration-200">
               View our services <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </Link>
           </div>
        </section>
      </div>
    </div>
  );
}
