import { Hero } from "@/components/sections/Hero";
import { PlaySquare, CheckCircle2, ArrowRight, Send } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getSiteSettings, getFeaturedTestimonials, getServices } from "@/lib/firestore";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { BrandCarousel } from "@/components/sections/BrandCarousel";
import { ProcessOrbital } from "@/components/interactive-diagram";
import { ContactForm } from "@/components/forms/ContactForm";
import { PortfolioPreview } from "@/components/sections/PortfolioPreview";
import { parseHighlighted } from "@/lib/parseHighlighted";

// ─── Default content (fallbacks when admin hasn't configured) ────────

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

const DEFAULT_BRANDS = [
  { name: "Google" }, { name: "Meta" }, { name: "Shopify" }, { name: "Stripe" },
  { name: "Notion" }, { name: "Figma" }, { name: "Vercel" }, { name: "Slack" },
];

export default async function Home() {
  const [settings, testimonials, rawServices] = await Promise.all([
    getSiteSettings(),
    getFeaturedTestimonials(),
    getServices(),
  ]);

  const serializedTestimonials = testimonials.map((t) => ({
    ...t,
    createdAt: t.createdAt && typeof t.createdAt === "object" && "toDate" in t.createdAt
      ? t.createdAt.toDate().toISOString()
      : t.createdAt,
    updatedAt: t.updatedAt && typeof t.updatedAt === "object" && "toDate" in t.updatedAt
      ? t.updatedAt.toDate().toISOString()
      : t.updatedAt,
  }));

  const featuredServiceIds = settings?.featuredServiceIds;
  const featuredServices = (featuredServiceIds?.length
    ? featuredServiceIds
        .map((id) => rawServices.find((s) => s.id === id))
        .filter(Boolean)
    : rawServices.sort((a, b) => (a.order || 0) - (b.order || 0)).slice(0, 4)
  ).map((s, i) => {
    const IconComponent = s!.icon_name ? (LucideIcons as any)[s!.icon_name] : null;
    return { ...s!, icon: IconComponent };
  });

  const vis = settings?.visibility ?? {};
  const show = (key: string) => vis[key as keyof typeof vis] ?? true;

  // Use admin-configured content or fall back to defaults
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
  const brandCarouselItems = settings?.brandCarouselItems?.length ? settings.brandCarouselItems : DEFAULT_BRANDS;
  const homeAboutEyebrow = settings?.homeAboutEyebrow || "ABOUT US";
  const homeAboutTitle = settings?.homeAboutTitle || "Most agencies only **create content** or run ads.";
  const homeAboutSubtitle = settings?.homeAboutSubtitle || "Upmark builds **complete marketing systems.**";
  const homeAboutDescription = settings?.homeAboutDescription || "Founded on the belief that modern marketing must be fast, precise and measurable, Upmark brings together strategists, creatives, producers and performance marketers who operate as one integrated team.\n\nWhen your strategist sits next to your editor, your performance data informs your creative, and your content team understands your media budget — the work gets sharper. We're not a collection of specialists working in parallel. We're a single, integrated team where every discipline makes every other one better. That's the Upmark advantage.";

  const pageVisible = show("home");
  const heroVisible = show("homeHero");
  const aboutVisible = show("homeAbout");
  const processVisible = show("homeProcess") && processItems.length > 0;
  const contentStudioVisible = show("homeContentStudio") && contentItems.length > 0;
  const studioCapVisible = show("homeStudioCapabilities") && studioCapabilities.length > 0;
  const testimonialsVisible = show("homeTestimonials");
  const brandCarouselVisible = show("homeBrandCarousel") && brandCarouselItems.length > 0;
  const contactVisible = show("homeContact");
  const portfolioPreviewVisible = show("homePortfolio");

  if (!pageVisible) return null;

  return (
    <div className="flex flex-col relative">
      {/* Hero + Brand Carousel — flush, no gaps */}
      {heroVisible && <Hero videoUrl={settings?.heroVideoUrl} />}
      {brandCarouselVisible && <BrandCarousel brands={brandCarouselItems} />}

      {/* Remaining sections with gaps */}
      <div className="flex flex-col gap-8 sm:gap-12 md:gap-16 pt-2 sm:pt-8 md:pt-12">
      {/* About Section */}
      {aboutVisible && (
      <section id="about" className="container mx-auto px-4 sm:px-6 scroll-mt-32 overflow-hidden">
        <div className="mb-4 sm:mb-12 text-primary-text">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-12 lg:gap-16 items-start">
            {/* Left: Heading */}
            <div className="lg:w-1/2 flex flex-col items-start min-w-0">
              <span className="text-secondary-surface-dark font-extrabold tracking-[0.2em] uppercase text-lg sm:text-xl mb-2 sm:mb-3">
                {homeAboutEyebrow}
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-heading text-primary-text tracking-tight leading-tight mb-3 sm:mb-4 uppercase break-words">
                {parseHighlighted(homeAboutTitle, "gradient")}
              </h2>
              <h3 className="text-lg sm:text-2xl md:text-3xl mt-2 sm:mt-4 font-semibold">
                {parseHighlighted(homeAboutSubtitle, "gold")}
              </h3>
            </div>
            {/* Right: Description */}
            <div className="lg:w-1/2 flex flex-col gap-3 sm:gap-6 text-muted-text font-light text-sm sm:text-lg pt-0 lg:pt-14">
              {homeAboutDescription.split("\n\n").filter(Boolean).map((p, i) => (
                <p key={i} className={i > 0 ? "hidden sm:block" : ""}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Services */}
        {show("services") && featuredServices.length > 0 && (
        <>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5">
          {featuredServices.slice(0, 4).map((s, i) => (
              <Link key={s.id || i} href={`/services#${s.id}`} className={`group p-4 sm:p-6 min-h-[140px] sm:min-h-[200px] rounded-sm border border-primary-text/8 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${i % 2 === 0 ? 'bg-secondary-surface hover:bg-accent-blue' : 'bg-primary-bg hover:bg-accent-blue'}`}>
                <div className="relative z-10">
                  <div className="mb-3 sm:mb-4">
                    {s.icon && <s.icon size={32} strokeWidth={1.5} />}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold font-heading text-primary-text uppercase tracking-wider mb-1 sm:mb-1.5">{s.title}</h3>
                  <p className="text-muted-text text-[12px] sm:text-[13px] font-light leading-relaxed line-clamp-2 sm:line-clamp-3">{s.description}</p>
                </div>
              </Link>
          ))}
          {/* Explore More - full width on mobile, 5th column on desktop */}
          <Link href="/services" className="hidden lg:flex group p-6 min-h-[200px] rounded-sm bg-secondary-surface hover:bg-accent-blue border border-primary-text/8 transition-all duration-300 relative overflow-hidden flex-col justify-between">
            <div className="relative z-10">
              <div className="mb-4">
                <ArrowRight size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-bold font-heading text-primary-text uppercase tracking-wider mb-1.5">Explore More</h3>
              <p className="text-muted-text text-[13px] font-light leading-relaxed">See all our services and how we can help your brand grow.</p>
            </div>
          </Link>
        </div>
          {/* Explore More - visible only on mobile, full width */}
          <Link href="/services" className="lg:hidden group p-4 min-h-[100px] rounded-sm bg-secondary-surface hover:bg-accent-blue border border-primary-text/8 transition-all duration-300 relative overflow-hidden flex flex-col justify-between mt-3">
            <div className="relative z-10">
              <div className="mb-3">
                <ArrowRight size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs font-bold font-heading text-primary-text uppercase tracking-wider mb-1">Explore More</h3>
              <p className="text-muted-text text-[12px] font-light leading-relaxed">See all our services and how we can help your brand grow.</p>
            </div>
          </Link>
        </>
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
        <div className="mb-6 sm:mb-12 text-center flex flex-col items-center">
          <span className="text-secondary-surface-dark font-extrabold tracking-[0.2em] uppercase text-xl mb-3">
            CONTENT THAT CONVERTS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-primary-text tracking-tight leading-tight mb-4 sm:mb-6 uppercase">Production <span className="text-accent-blue">Studio</span></h2>
          <p className="text-muted-text text-base sm:text-xl max-w-2xl font-light">Our production team creates across every format — from viral reels to cinematic brand films. All in-house. All on-brand.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            {contentStudioVisible && contentItems.map((item) => (
              <div key={item.id} className="p-5 sm:p-8 rounded-sm bg-secondary-surface/40 border border-primary-text/5 text-center flex flex-col items-center">
                <div className="text-accent-blue font-bold text-xs uppercase tracking-widest mb-3">{item.subtitle}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-primary-text mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-muted-text font-light text-base">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Studio Capabilities feature block */}
          {studioCapVisible && (
          <div className="lg:col-span-1 p-6 sm:p-10 rounded-sm bg-accent-blue/5 border border-accent-blue/20 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-sm bg-accent-blue/20 text-accent-blue flex items-center justify-center mb-6"><PlaySquare size={24} /></div>
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

      {/* Portfolio Preview */}
      {portfolioPreviewVisible && <PortfolioPreview />}

      {/* Testimonials Carousel */}
      {testimonialsVisible && (
        <div className="bg-[#0A0A0A] w-full">
          <TestimonialsCarousel testimonials={serializedTestimonials} section={settings?.testimonialsSection} lightText />
        </div>
      )}

      </div>

      {/* Contact Section — flush, no gaps */}
      {contactVisible && (
      <section id="contact" className="bg-accent-blue scroll-mt-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-20">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-12 lg:gap-16 items-start">
            {/* Left: Heading */}
            <div className="lg:w-1/2 flex flex-col items-start min-w-0">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading text-[#0A0A0A] tracking-tight leading-tight mb-4 sm:mb-4 uppercase break-words">
                LET&apos;S <span className="text-white">CREATE</span><br />SOMETHING <span className="text-white">GREAT</span>
              </h2>
              <p className="text-[#0A0A0A]/80 text-sm sm:text-xl md:text-2xl max-w-lg font-semibold">
                Have a project in mind? We&apos;d love to hear about it. Fill out the form and our team will get back to you within 24 hours.
              </p>
            </div>
            {/* Right: Contact Form */}
            <div className="lg:w-1/2 w-full">
              <ContactForm variant="yellow" />
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
}
