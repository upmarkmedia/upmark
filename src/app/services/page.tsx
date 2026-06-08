import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CapabilityMap } from "@/components/interactive-diagram";
import { getServices, getSiteSettings } from "@/lib/firestore";

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

  if (!pageVisible) return null;

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-32">
      <section className="container mx-auto px-4 sm:px-6 relative z-10">
        {headerVisible && (
        <div className="mb-12 sm:mb-20">
          <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs mb-4 block flex items-center gap-4">
            <span className="w-8 h-[1px] bg-accent-blue"></span>
            WHAT WE DO
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-heading text-primary-text tracking-tight mb-4 sm:mb-6">
            One agency. <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-blue-400">Every capability.</span>
          </h2>
          <p className="text-muted-text text-base sm:text-xl max-w-2xl font-light">
            From strategy to production to distribution, we cover the full marketing spectrum so you never need another vendor.
          </p>
        </div>
        )}

        {mapVisible && <CapabilityMap services={services} />}

        {/* Global CTA at the bottom */}
        {ctaVisible && (
        <div className="mt-16 sm:mt-24 text-center relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-accent-blue/15 blur-[40px] sm:blur-[60px] rounded-full -z-10"></div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-heading text-primary-text tracking-tight mb-6 sm:mb-8">
            See the thinking in <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-purple-400">action!</span>
          </h2>
          <p className="text-base sm:text-xl text-muted-text mb-8 sm:mb-12 font-light max-w-2xl mx-auto">
            Our case studies and portfolio aren't just proof of what we've made — they're evidence of how integrated thinking produces better outcomes.
          </p>
          <div className="flex flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/work"
              className="bg-white text-black px-6 py-4 sm:px-10 sm:py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:scale-105"
            >
              View our work <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-4 sm:px-10 sm:py-5 rounded-full font-bold text-lg border-2 border-primary-text/30 text-primary-text hover:bg-primary-text hover:text-white transition-all duration-300 w-full sm:w-auto justify-center hover:shadow-lg hover:shadow-primary-text/20 hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
        )}
      </section>
    </div>
  );
}
