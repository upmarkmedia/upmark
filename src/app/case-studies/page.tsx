import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAdminSiteSettings as getSiteSettings } from "@/lib/firebase-admin";

export const metadata: Metadata = {
  title: "Case Studies | Upmark — Real Results, Real Growth",
  description: "Explore Upmark's case studies. See how we've driven measurable growth for brands across fashion, hospitality, tech and more.",
};

export default async function CaseStudiesPage() {
  const settings = await getSiteSettings();
  const vis = settings?.visibility ?? {};
  const show = (key: string) => vis[key as keyof typeof vis] ?? true;

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-32 relative">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col gap-16 sm:gap-24 md:gap-32">
        {/* Coming Soon */}
        <div className="max-w-4xl pt-4 sm:pt-10">
          <span className="text-secondary-surface-dark font-extrabold tracking-[0.2em] uppercase text-xl mb-3">
              CASE STUDIES
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold font-heading text-primary-text mb-4 sm:mb-6 tracking-tight uppercase">content coming soon...</h1>
        </div>

        {/* CTA Area */}
        <section className="graphite-grid rounded-sm mx-4 sm:mx-6">
          <div className="relative z-10 py-16 sm:py-24 text-center max-w-4xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black font-heading text-white tracking-tight mb-6 sm:mb-8">Ready to compound your growth?</h2>
            <p className="text-base sm:text-xl text-white/70 mb-8 sm:mb-12 font-light max-w-2xl mx-auto">
              Let&apos;s discuss how Upmark can build a complete marketing system for your business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              {show("contact") && (
                <Link href="/contact" className="bg-white text-black px-6 py-4 sm:px-10 sm:py-5 rounded-sm font-bold text-lg hover:bg-gray-100 transition-colors flex items-center gap-3 w-full sm:w-auto justify-center">
                  Start a Project <ArrowRight size={20} />
                </Link>
              )}
              {show("services") && (
                <Link href="/services" className="px-6 py-4 sm:px-10 sm:py-5 rounded-sm font-bold text-lg border border-white/30 text-white hover:bg-white hover:text-black transition-colors w-full sm:w-auto justify-center hover:border-white/40">
                  View our services
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
