import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSiteSettings } from "@/lib/firestore";

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
          <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs mb-4 block flex items-center gap-4">
             <span className="w-8 h-[1px] bg-accent-blue"></span>
             CASE STUDIES
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold font-heading text-white mb-4 sm:mb-6 tracking-tight">content coming soon...</h1>
        </div>

        {/* CTA Area */}
        <section className="mt-10 py-16 border-t border-white/10 flex flex-col items-center justify-center text-center">
           <h2 className="text-2xl sm:text-3xl md:text-5xl font-black font-heading text-white mb-6 sm:mb-8">Ready to compound your growth?</h2>
           <p className="text-muted-text text-base sm:text-lg max-w-xl mb-8 sm:mb-10 font-light">Let&apos;s discuss how Upmark can build a complete marketing system for your business.</p>
           <div className="flex flex-col sm:flex-row items-center gap-4">
              {show("contact") && (
                <Link href="/contact" className="group flex items-center justify-center gap-2 bg-accent-blue text-white px-8 py-4 rounded-lg font-semibold text-base overflow-hidden transition-[transform] hover:scale-[1.02] shadow-[0_0_30px_-10px_rgba(59,130,246,0.6)]">
                 Start a Project <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </Link>
              )}
              {show("services") && (
                <Link href="/services" className="group flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base text-primary-text bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors duration-200">
                 View our services <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </Link>
              )}
           </div>
        </section>
      </div>
    </div>
  );
}
