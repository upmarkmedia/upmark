import { Hero } from "@/components/sections/Hero";
import { ContentGrid } from "@/components/sections/ContentGrid";
import { PlaySquare, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, getTestimonials } from "@/lib/firestore";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";

// ─── Default content (fallbacks when admin hasn't configured) ────────

const DEFAULT_PHILOSOPHY_POINTERS = [
  { title: "Strategy First", desc: "Every campaign starts with insight-driven strategy. We define your positioning before we produce a single asset." },
  { title: "Full Execution", desc: "From concept to live campaign — creative direction, production, distribution and optimization, all under one roof." },
  { title: "Systematic Thinking", desc: "We don't build one-off ads. We architect marketing systems that compound over time and generate predictable growth." },
  { title: "Measurable Results", desc: "Every deliverable is tied to a business outcome. We track, report and relentlessly optimize for what matters." }
];

const DEFAULT_PROCESS_ITEMS = [
  { title: "Insight", description: "Deep-dive into your market, audience, competitors and brand. We surface the insights that define your edge." },
  { title: "Strategy", description: "We translate insight into a precise strategy — positioning, messaging, channels and a roadmap for execution." },
  { title: "Creative Production", description: "Our in-house team produces every asset — video, design, copy and content — aligned to the strategy." },
  { title: "Campaign Launch", description: "Orchestrated rollout across paid, owned and earned channels with precision timing and audience targeting." },
  { title: "Optimisation", description: "Real-time monitoring and rapid iteration. We cut what doesn't work and double down on what does." },
  { title: "Growth", description: "We systematically compound results — scaling budgets, expanding channels and building long-term growth loops." }
];

const DEFAULT_CONTENT_ITEMS = [
  { title: "Short-form", subtitle: "Reels & Shorts", description: "Vertical-first content engineered for algorithm performance and share velocity." },
  { title: "Paid Creative", subtitle: "Campaign Ads", description: "Static, animated and video ad creatives across Meta, Google and programmatic networks." },
  { title: "Long-form", subtitle: "Brand Films", description: "Cinematic brand storytelling that defines identity and creates emotional connection." },
  { title: "Photography", subtitle: "Product Shoots", description: "Studio and lifestyle product photography optimised for eCommerce and social." },
  { title: "Ongoing", subtitle: "Social Media Content", description: "Ongoing weekly content production — graphics, carousels, captions and stories." },
  { title: "Video", subtitle: "YouTube & Long-form", description: "Full-length branded content, tutorials and documentaries that build authority." },
];

const DEFAULT_STUDIO_CAPABILITIES = [
  "In-house production team", "Director + DP on every shoot", "4K / cinema-grade equipment", 
  "Same-day turnaround available", "Licensed music library", "Motion graphics included", 
  "Platform-native formatting", "Raw footage delivery"
];

const DEFAULT_ADVANTAGES = [
  { title: "Integrated by design", desc: "Not a creative studio, not a media buyer, not a consultant. We combine all three into one system." },
  { title: "Speed without compromise", desc: "We move at startup speed with agency-level production quality. Fast means first to market." },
  { title: "Transparent reporting", desc: "Real-time dashboards and weekly performance reviews. You always know exactly what your marketing is doing." },
  { title: "Embedded in your team", desc: "We work as an extension of your business — attending meetings, understanding culture and owning outcomes." },
  { title: "Built for scale", desc: "Our systems are engineered to scale. As your business grows, your marketing infrastructure grows with it." },
  { title: "Channel-agnostic thinking", desc: "We follow your audience, not trends. Whatever channel converts, we optimise there first." }
];

export default async function Home() {
  const [settings, testimonials] = await Promise.all([
    getSiteSettings(),
    getTestimonials(),
  ]);

  // Use admin-configured content or fall back to defaults
  const philosophyPointers = settings?.philosophyPointers?.length ? settings.philosophyPointers : DEFAULT_PHILOSOPHY_POINTERS;
  const processItems = (settings?.processSteps?.length ? settings.processSteps : DEFAULT_PROCESS_ITEMS).map((p, i) => ({
    id: i + 1,
    title: p.title,
    description: p.description,
  }));
  const contentItems = (settings?.contentItems?.length ? settings.contentItems : DEFAULT_CONTENT_ITEMS).map((c, i) => ({
    id: i + 1,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
  }));
  const studioCapabilities = settings?.studioCapabilities?.length ? settings.studioCapabilities : DEFAULT_STUDIO_CAPABILITIES;
  const advantages = (settings?.advantages?.length ? settings.advantages : DEFAULT_ADVANTAGES).map((a, i) => ({
    id: i + 1,
    title: a.title,
    desc: a.desc,
  }));

  return (
    <div className="flex flex-col gap-16 sm:gap-24 md:gap-32 pb-16 sm:pb-24 md:pb-32 relative">
      <Hero videoUrl={settings?.heroVideoUrl} />

      {/* Philosophy / About Section */}
      <section id="about" className="container mx-auto px-4 sm:px-6 mt-8 sm:mt-16 md:mt-24 scroll-mt-32">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-16 mb-12 sm:mb-20 text-white items-center">
           {/* Left Side */}
           <div className="lg:w-7/12 flex flex-col items-start pr-0 lg:pr-10">
             <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs mb-6 inline-flex items-center gap-4">
               <span className="w-8 h-[1px] bg-accent-blue"></span>
                ABOUT US
             </span>
             <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight mb-4">
               Most agencies only <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-indigo-400">create content</span> <br className="hidden md:block"/>or run ads.
             </h2>
             <h3 className="text-xl sm:text-2xl md:text-3xl mt-4 mb-6 sm:mb-8 font-semibold">
               Upmark builds <span className="text-accent-gold">complete marketing systems.</span>
             </h3>
             <div className="flex flex-col gap-4 sm:gap-6 text-muted-text font-light text-base sm:text-lg mb-8 sm:mb-10">
                <p>
                  We integrate strategy, performance marketing, content production, campaign execution and distribution into a single, coherent growth engine. The result is not a collection of deliverables — it is a system that compounds.
                </p>
                <p>
                  Founded on the belief that modern marketing must be fast, precise and measurable, Upmark brings together strategists, creatives, producers and performance marketers who operate as one integrated team.
                </p>
             </div>
                          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link href="/services" className="group flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-semibold text-sm sm:text-base text-white border border-white/20 hover:border-accent-blue hover:bg-accent-blue/5 transition-all w-full sm:w-auto">
                  Explore our services
                </Link>
                <Link href="/#about" className="group flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-semibold text-sm sm:text-base text-white bg-accent-blue/10 border border-accent-blue/30 hover:bg-accent-blue/20 hover:border-accent-blue/50 transition-all w-full sm:w-auto">
                  Learn More
                </Link>
              </div>
           </div>
           
           {/* Right Side Visual */}
           <div className="lg:w-5/12 w-full flex justify-center items-center relative min-h-[280px] sm:min-h-[400px]">
             <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/10 to-accent-gold/5 rounded-full blur-[40px] sm:blur-[60px] pointer-events-none"></div>
             <div className="relative w-full aspect-square max-w-[320px] sm:max-w-[450px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/images/philosophy.png"
                  alt="Upmark strategy session — marketing team brainstorming around data-driven insights"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-bg/60 via-transparent to-transparent"></div>
             </div>
           </div>
        </div>

        {/* Philosophy Pointers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {philosophyPointers.map((p, i) => (
            <div key={i} className="group p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-secondary-surface/40 border border-white/5 hover:border-accent-blue/30 transition-colors duration-300 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-3 sm:p-6 text-4xl sm:text-6xl font-black text-white/5 group-hover:text-white/10 transition-colors pointer-events-none">
                 0{i + 1}
               </div>
              <h3 className="text-base sm:text-xl font-bold font-heading text-white mb-2 sm:mb-3 relative z-10">{p.title}</h3>
              <p className="text-muted-text/90 text-base font-light leading-relaxed relative z-10">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="container mx-auto px-4 sm:px-6 relative z-10 mt-8 sm:mt-16 md:mt-24">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-16 items-start">
           
           {/* Left Side: Text and Steps */}
           <div className="lg:w-7/12 w-full flex flex-col pr-0 lg:pr-8">
             <div className="mb-12">
               <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs mb-4 block flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-accent-blue"></span>
                  HOW WE WORK
               </span>
               <h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-heading text-white tracking-tight mb-4 sm:mb-6">Our <span className="text-accent-gold">6-Step Process</span></h2>
               <p className="text-muted-text text-base sm:text-xl max-w-2xl font-light">A rigorous system built for consistency, speed and measurable outcomes at every stage.</p>
             </div>
             
             {/* Enumerate Steps 1-6 */}
             <ContentGrid items={processItems} type="numbered" columns={2} />
             
             {/* CTA Buttons */}
             <div className="mt-10 sm:mt-16 flex flex-col sm:flex-row items-center justify-start gap-3 sm:gap-4">
               <Link href="/services" className="group relative w-full sm:w-auto flex items-center justify-center gap-3 bg-accent-blue text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-semibold text-sm sm:text-base overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_-10px_rgba(59,130,246,0.6)]">
                 <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <span className="relative z-10 flex items-center gap-2">Our Services </span>
               </Link>
               
               <Link href="/work" className="group w-full sm:w-auto flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-semibold text-sm sm:text-base text-primary-text bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors duration-200">
                 View our work
               </Link>
             </div>
           </div>

           {/* Right Side Visual */}
           <div className="lg:w-5/12 w-full lg:sticky lg:top-32 flex flex-col gap-6 items-center">
             <div className="w-full aspect-[4/5] rounded-[2rem] border border-white/5 overflow-hidden relative group shadow-2xl">
               <Image
                 src="/images/process.png"
                 alt="Upmark 6-step marketing process — strategic workflow dashboard"
                 fill
                 className="object-cover group-hover:scale-105 transition-transform duration-700"
                 sizes="(max-width: 1024px) 100vw, 40vw"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-primary-bg/70 via-primary-bg/20 to-transparent z-10"></div>
               <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-blue/15 rounded-full blur-[50px] z-0"></div>
               <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-gold/8 rounded-full blur-[50px] z-0"></div>
             </div>
           </div>
           
        </div>
      </section>

      {/* Content Studio */}
      <section className="container mx-auto px-4 sm:px-6 relative z-10 mt-4 sm:mt-10">
        <div className="mb-10 sm:mb-20 text-center flex flex-col items-center">
          <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs mb-4 block inline-flex items-center gap-4">
             <span className="w-8 h-[1px] bg-accent-blue"></span>
             CONTENT THAT CONVERTS
             <span className="w-8 h-[1px] bg-accent-blue"></span>
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-heading text-white tracking-tight mb-4 sm:mb-6">Production <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-blue-400">Studio</span></h2>
          <p className="text-muted-text text-base sm:text-xl max-w-2xl font-light">Our production team creates across every format — from viral reels to cinematic brand films. All in-house. All on-brand.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
           <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
             {contentItems.map((item) => (
                <div key={item.id} className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-secondary-surface/40 border border-white/5">
                   <div className="text-accent-blue font-bold text-xs uppercase tracking-widest mb-3">{item.subtitle}</div>
                   <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">{item.title}</h3>
                   <p className="text-muted-text font-light text-base">{item.description}</p>
                </div>
             ))}
           </div>
           
           {/* Studio Capabilities feature block */}
           <div className="lg:col-span-1 p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-accent-blue/5 border border-accent-blue/20 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-xl bg-accent-blue/20 text-accent-blue flex items-center justify-center mb-6"><PlaySquare size={24} /></div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-4 sm:mb-6">Studio Capabilities</h3>
              <p className="text-muted-text mb-6 sm:mb-8 text-base">Professional production infrastructure available to every Upmark client.</p>
              
              <ul className="flex flex-col gap-4">
                {studioCapabilities.map((cap, i) => (
                   <li key={i} className="flex items-center gap-3 text-white/90 text-base font-medium">
                      <CheckCircle2 size={16} className="text-accent-blue flex-shrink-0" />
                      {cap}
                   </li>
                ))}
              </ul>
           </div>
        </div>
      </section>

      {/* Why Upmark */}
      <section className="container mx-auto px-4 sm:px-6 relative z-10 mt-4 sm:mt-10">
        <div className="mb-10 sm:mb-20 text-center flex flex-col items-center">
          <span className="text-accent-gold font-bold tracking-[0.2em] uppercase text-xs mb-4 block inline-flex items-center gap-4">
             <span className="w-8 h-[1px] bg-accent-gold"></span>
             WHY UPMARK
             <span className="w-8 h-[1px] bg-accent-gold"></span>
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-heading text-white mb-10 sm:mb-16 tracking-tight">Different by <span className="text-accent-gold">design.</span></h2>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6 max-w-4xl mx-auto mb-12 sm:mb-20">
           <div className="border border-white/10 bg-secondary-surface/30 p-5 sm:p-8 rounded-xl sm:rounded-2xl flex flex-col md:flex-row gap-3 sm:gap-6 md:items-center justify-between">
              <h3 className="text-lg sm:text-2xl font-bold text-white md:w-1/2">Marketing without execution is just theory.</h3>
              <p className="text-muted-text md:w-1/2 font-light">Ideas without action don&apos;t grow brands. We build, launch and optimize — every time.</p>
           </div>
           <div className="border border-white/10 bg-secondary-surface/30 p-5 sm:p-8 rounded-xl sm:rounded-2xl flex flex-col md:flex-row gap-3 sm:gap-6 md:items-center justify-between">
              <h3 className="text-lg sm:text-2xl font-bold text-white md:w-1/2">Strategy. Production. Distribution. One team.</h3>
              <p className="text-muted-text md:w-1/2 font-light">Stop managing three agencies. Upmark unifies your entire marketing operation under one roof.</p>
           </div>
           <div className="border border-white/10 bg-secondary-surface/30 p-5 sm:p-8 rounded-xl sm:rounded-2xl flex flex-col md:flex-row gap-3 sm:gap-6 md:items-center justify-between">
              <h3 className="text-lg sm:text-2xl font-bold text-white md:w-1/2">We measure what matters. Results.</h3>
              <p className="text-muted-text md:w-1/2 font-light">Vanity metrics are noise. We track revenue, pipeline, ROAS and real business outcomes.</p>
           </div>
        </div>

      </section>

      {/* Testimonials Carousel */}
      <TestimonialsCarousel testimonials={testimonials} />

    </div>
  );
}
