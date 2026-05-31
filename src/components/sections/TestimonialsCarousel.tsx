"use client";

import { useState } from "react";
import { Quote } from "lucide-react";
import { HorizontalCarousel } from "@/components/ui/HorizontalCarousel";
import { PreviewDialog } from "@/components/ui/PreviewDialog";
import type { Testimonial, WorkSection } from "@/types";

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "default-1",
    quote: "Upmark completely transformed our digital strategy. Their integrated approach helped us scale our pipeline by 3x in just six months while maintaining incredibly high creative standards.",
    name: "Sarah Jenkins",
    role: "CMO, Vertex Corp"
  },
  {
    id: "default-2",
    quote: "Unlike other agencies that just run ads, Upmark actually took the time to understand our complete marketing system. The results have been phenomenal — a 340% increase in eCommerce revenue.",
    name: "Michael Ross",
    role: "Founder, Bloom Retail"
  },
  {
    id: "default-3",
    quote: "The speed and quality of Upmark's production team is unmatched. They feel less like an agency and more like an extension of our internal team. Highly recommended.",
    name: "Eleanor Vance",
    role: "Director of Marketing, Luxe Stays"
  }
];

interface TestimonialsCarouselProps {
  testimonials?: Testimonial[];
  maxItems?: number;
  section?: WorkSection;
}

export const TestimonialsCarousel = ({ testimonials, maxItems = 3, section }: TestimonialsCarouselProps) => {
  const allTestimonials = testimonials && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;
  const displayTestimonials = allTestimonials.slice(0, maxItems);
  
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const openPreview = (t: Testimonial) => {
    setSelectedTestimonial(t);
    setPreviewOpen(true);
  };

  return (
    <section className="container mx-auto px-4 sm:px-6 relative z-10">
      <HorizontalCarousel
        label={section?.label || "CLIENT STORIES"}
        title={section?.title || <>Don&apos;t just take <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-indigo-400">our word for it.</span></>}
      >
        {displayTestimonials.map((t) => (
          <div
            key={t.id}
            onClick={() => openPreview(t)}
            className="snap-start flex-shrink-0 w-[320px] sm:w-[400px] md:w-[450px] cursor-pointer group"
          >
            <div className="relative z-10 bg-secondary-surface/60 border border-white/10 p-6 sm:p-8 rounded-2xl sm:rounded-3xl overflow-hidden h-full flex flex-col gap-6 hover:border-accent-blue/30 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.08)]">
              <Quote size={32} className="text-white/10 flex-shrink-0" />
              <p className="text-sm sm:text-base font-light text-white leading-relaxed italic flex-grow line-clamp-5">
                &quot;{t.quote}&quot;
              </p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
                {t.imageUrl ? (
                  <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-accent-blue/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold text-sm uppercase flex-shrink-0">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-white font-semibold text-sm">{t.name}</h4>
                  <p className="text-accent-blue text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </HorizontalCarousel>

      {/* Preview Dialog */}
      {selectedTestimonial && (
        <PreviewDialog
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title={selectedTestimonial.name}
          description={selectedTestimonial.quote}
          meta={[{ label: "Role", value: selectedTestimonial.role }]}
        />
      )}
    </section>
  );
};
