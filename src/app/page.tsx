import { Hero } from "@/components/sections/Hero";
import { ContentGrid } from "@/components/sections/ContentGrid";
import { PlaySquare, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, getFeaturedTestimonials } from "@/lib/firestore";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { ProcessOrbital } from "@/components/interactive-diagram";

// ─── Default content (fallbacks when admin hasn't configured) ────────

const DEFAULT_PHILOSOPHY_POINTERS = [
  { title: "Strategy First", desc: "Every campaign starts with insight-driven strategy. We define your positioning before we produce a single asset." },
  { title: "Full Execution", desc: "From concept to live campaign — creative direction, production, distribution and optimization, all under one roof." },
  { title: "Systematic Thinking", desc: "We don't build one-off ads. We architect marketing systems that compound over time and generate predictable growth." },
  { title: "Measurable Results", desc: "Every deliverable is tied to a business outcome. We track, report and relentlessly optimize for what matters." }
];

const DEFAULT_PROCESS_ITEMS: { title: string; description: string; imageUrl?: string }[] = [
  { title: "Insight", description: "Deep-dive into your market, audience, competitors and brand. We surface the insights that define your edge.", imageUrl: "/images/service-strategy.png" },
  { title: "Strategy", description: "We translate insight into a precise strategy — positioning, messaging, channels and a roadmap for execution.", imageUrl: "/images/service-seo.png" },
  { title: "Creative Production", description: "Our in-house team produces every asset — video, design, copy and content — aligned to the strategy.", imageUrl: "/images/service-content.png" },
  { title: "Campaign Launch", description: "Orchestrated rollout across paid, owned and earned channels with precision timing and audience targeting.", imageUrl: "/images/service-social.png" },
  { title: "Optimisation", description: "Real-time monitoring and rapid iteration. We cut what doesn't work and double down on what does.", imageUrl: "/images/service-performance.png" },
  { title: "Growth", description: "We systematically compound results — scaling budgets, expanding channels and building long-term growth loops.", imageUrl: "/images/process.png" }
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

export default async function Home() {
  const [settings, testimonials] = await Promise.all([
    getSiteSettings(),
    getFeaturedTestimonials(),
  ]);

  const vis = settings?.visibility ?? {};
  const show = (key: string) => vis[key as keyof typeof vis] ?? true;

  // Use admin-configured content or fall back to defaults
  const philosophyPointers = settings?.philosophyPointers?.length ? settings.philosophyPointers : DEFAULT_PHILOSOPHY_POINTERS;
  const processItems = (settings?.processSteps?.length ? settings.processSteps : DEFAULT_PROCESS_ITEMS).map((p, i) => ({
    id: i + 1,
    title: p.title,
    description: p.description,
    imageUrl: p.imageUrl,
  }));
  const contentItems = (settings?.contentItems?.length ? settings.contentItems : DEFAULT_CONTENT_ITEMS).map((c, i) => ({
    id: i + 1,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
  }));
  const studioCapabilities = settings?.studioCapabilities?.length ? settings.studioCapabilities : DEFAULT_STUDIO_CAPABILITIES;
  const aboutImageUrl = settings?.homeAboutImageUrl || "/images/philosophy.png";

  const pageVisible = show("home");
  const heroVisible = show("homeHero");
  const aboutVisible = show("homeAbout");
  const philosophyVisible = show("homePhilosophy") && philosophyPointers.length > 0;
  const processVisible = show("homeProcess") && processItems.length > 0;
  const contentStudioVisible = show("homeContentStudio") && contentItems.length > 0;
  const studioCapVisible = show("homeStudioCapabilities") && studioCapabilities.length > 0;
  const testimonialsVisible = show("homeTestimonials") && testimonials.length > 0;

  if (!pageVisible) return null;

  return (
    <div className="flex flex-col gap-12 sm:gap-16 md:gap-24 pb-16 sm:pb-24 md:pb-28 relative">
      {heroVisible && <Hero videoUrl={settings?.heroVideoUrl} mobileVideoUrl={settings?.heroMobileVideoUrl} />}

      {/* Philosophy / About Section */}
      {(aboutVisible || philosophyVisible) && (
      <section id="about" className="container mx-auto px-4 sm:px-6 scroll-mt-32">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-16 mb-12 sm:mb-20 text-primary-text items-center">
          {/* Left Side */}
          <div className="lg:w-7/12 flex flex-col items-start pr-0 lg:pr-10">
            <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs mb-6 inline-flex items-center gap-4">
              <span className="w-8 h-[1px] bg-accent-blue"></span>
              ABOUT US
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-primary-text tracking-tight leading-tight mb-4">
              Most agencies only <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-indigo-400">create content</span> <br className="hidden md:block" />or run ads.
            </h2>
            <h3 className="text-xl sm:text-2xl md:text-3xl mt-4 mb-6 sm:mb-8 font-semibold">
              Upmark builds <span className="text-accent-gold">complete marketing systems.</span>
            </h3>
            <div className="flex flex-col gap-4 sm:gap-6 text-muted-text font-light text-base sm:text-lg mb-8 sm:mb-10">
              <p>
                Founded on the belief that modern marketing must be fast, precise and measurable, Upmark brings together strategists, creatives, producers and performance marketers who operate as one integrated team.
              </p>
              <p>
                When your strategist sits next to your editor, your performance data informs your creative, and your content team understands your media budget — the work gets sharper. We're not a collection of specialists working in parallel. We're a single, integrated team where every discipline makes every other one better. That's the Upmark advantage.
              </p>
            </div>
            <div className="flex flex-row items-center justify-center gap-3 w-full">
              {show("services") && (
                <Link href="/services" className="group relative flex items-center justify-center gap-3 bg-accent-blue text-white px-5 py-3 rounded-lg font-semibold text-sm overflow-hidden transition-[transform] hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_-10px_rgba(59,130,246,0.6)]">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10">Our Services</span>
                </Link>
              )}
              <Link href="/about" className="group flex items-center justify-center px-5 py-3 rounded-lg font-semibold text-sm text-primary-text bg-primary-text/5 border border-primary-text/10 hover:bg-primary-text/10 hover:border-primary-text/20 transition-colors duration-200">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Side Visual */}
          <div className="lg:w-5/12 w-full flex justify-center items-center relative min-h-[280px] sm:min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/10 to-accent-gold/5 rounded-full blur-[40px] sm:blur-[60px] pointer-events-none"></div>
            <div className="relative w-full aspect-square max-w-[320px] sm:max-w-[450px] rounded-3xl overflow-hidden border border-primary-text/10 shadow-2xl">
              <Image
                src={aboutImageUrl}
                alt="Upmark strategy session — marketing team brainstorming around data-driven insights"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </div>
          </div>
        </div>

        {/* Philosophy Pointers */}
        {philosophyVisible && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {philosophyPointers.map((p, i) => (
            <div key={i} className="group p-6 sm:p-8 min-h-[200px] sm:min-h-0 rounded-2xl sm:rounded-3xl bg-secondary-surface/40 border border-primary-text/5 hover:border-accent-blue/30 transition-colors duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 sm:p-6 text-4xl sm:text-6xl font-black text-primary-text/5 group-hover:text-primary-text/10 transition-colors pointer-events-none">
                0{i + 1}
              </div>
              <h3 className="text-base sm:text-xl font-bold font-heading text-primary-text mb-2 sm:mb-3 relative z-10">{p.title}</h3>
              <p className="text-muted-text/90 text-base font-light leading-relaxed relative z-10">{p.desc}</p>
            </div>
          ))}
        </div>
        )}
      </section>
      )}

      {/* Process Section */}
      {processVisible && (
      <section className="w-full">
        <ProcessOrbital items={processItems} />
      </section>
      )}

      {/* Content Studio */}
      {(contentStudioVisible || studioCapVisible) && (
      <section className="container mx-auto px-4 sm:px-6 relative z-10 content-visibility-auto">
        <div className="mb-10 sm:mb-20 text-center flex flex-col items-center">
          <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs mb-4 block inline-flex items-center gap-4">
            <span className="w-8 h-[1px] bg-accent-blue"></span>
            CONTENT THAT CONVERTS
            <span className="w-8 h-[1px] bg-accent-blue"></span>
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-heading text-primary-text tracking-tight mb-4 sm:mb-6">Production <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-blue-400">Studio</span></h2>
          <p className="text-muted-text text-base sm:text-xl max-w-2xl font-light">Our production team creates across every format — from viral reels to cinematic brand films. All in-house. All on-brand.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            {contentStudioVisible && contentItems.map((item) => (
              <div key={item.id} className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-secondary-surface/40 border border-primary-text/5 text-center flex flex-col items-center">
                <div className="text-accent-blue font-bold text-xs uppercase tracking-widest mb-3">{item.subtitle}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-primary-text mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-muted-text font-light text-base">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Studio Capabilities feature block */}
          {studioCapVisible && (
          <div className="lg:col-span-1 p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-accent-blue/5 border border-accent-blue/20 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-xl bg-accent-blue/20 text-accent-blue flex items-center justify-center mb-6"><PlaySquare size={24} /></div>
            <h3 className="text-xl sm:text-2xl font-black text-primary-text mb-4 sm:mb-6">Studio Capabilities</h3>
            <p className="text-muted-text mb-6 sm:mb-8 text-base">Professional production infrastructure available to every Upmark client.</p>

            <ul className="flex flex-col gap-4">
              {studioCapabilities.map((cap, i) => (
                <li key={i} className="flex items-center gap-3 text-primary-text/90 text-base font-medium">
                  <CheckCircle2 size={16} className="text-accent-blue flex-shrink-0" />
                  {cap}
                </li>
              ))}
            </ul>
          </div>
          )}
        </div>
      </section>
      )}

      {/* Testimonials Carousel */}
      {testimonialsVisible && <TestimonialsCarousel testimonials={testimonials} />}

    </div>
  );
}
