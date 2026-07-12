import { Metadata } from "next";
import { CapabilityMap } from "@/components/interactive-diagram";
import { ContactForm } from "@/components/forms/ContactForm";
import { getSiteSettings, getServices } from "@/lib/firestore";

export const metadata: Metadata = {
  title: "Services | Upmark — Full-Stack Marketing Services",
  description: "From strategy to execution — Upmark offers integrated marketing services including brand strategy, performance marketing, content production, social media management, and SEO.",
};

export default async function ServicesPage() {
  const [rawServices, settings] = await Promise.all([
    getServices(),
    getSiteSettings(),
  ]);

  const vis = settings?.visibility ?? {};
  const show = (key: string) => vis[key as keyof typeof vis] ?? true;

  // Serialize timestamps for Client Component
  const services = rawServices
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(s => ({
      ...s,
      createdAt: undefined,
      updatedAt: undefined
    }));

  const pageVisible = show("services");
  const headerVisible = show("servicesHeader");
  const mapVisible = show("servicesCapabilityMap") && services.length > 0;
  const ctaVisible = show("servicesCTA");
  const contactSection = settings?.servicesContact ?? {};

  if (!pageVisible) return null;

  return (
    <div className="pt-24 sm:pt-32">
      <section className="container mx-auto px-4 sm:px-6 relative z-10">
        {headerVisible && (
        <div className="mb-12 sm:mb-20">
          <span className="text-secondary-surface-dark font-extrabold tracking-[0.2em] uppercase text-xl mb-3">
            WHAT WE DO
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-primary-text tracking-tight leading-tight mb-4 sm:mb-6 uppercase">
            One agency. <span className="text-accent-blue">Every capability.</span>
          </h2>
          <p className="text-muted-text text-base sm:text-xl max-w-2xl font-light">
            From strategy to production to distribution, we cover the full marketing spectrum so you never need another vendor.
          </p>
        </div>
        )}

        {mapVisible && <CapabilityMap services={services} />}

        <div className="h-16 sm:h-24" />
      </section>

      {/* Contact Section — flush, no gaps */}
      {ctaVisible && (
      <section id="contact" className="bg-accent-blue scroll-mt-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-24 md:py-32">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-12 lg:gap-16 items-start">
            {/* Left: Heading */}
            <div className="lg:w-1/2 flex flex-col items-start min-w-0 self-center">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading text-[#0A0A0A] tracking-tight leading-tight mb-4 sm:mb-4 uppercase break-words">
                {contactSection.heading || "LET'S"} <span className="text-white">{contactSection.headingHighlight || "CREATE"}</span><br />{contactSection.heading ? "" : "SOMETHING"} <span className="text-white">{contactSection.heading ? "" : "GREAT"}</span>
              </h2>
              <p className="text-[#0A0A0A]/80 text-sm sm:text-xl md:text-2xl max-w-lg font-semibold">
                {contactSection.subtitle || "Have a project in mind? We'd love to hear about it. Fill out the form and our team will get back to you within 24 hours."}
              </p>
            </div>
            {/* Right: Contact Form */}
            <div className="lg:w-1/2 w-full lg:pt-0">
              <ContactForm variant="yellow" />
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
}
