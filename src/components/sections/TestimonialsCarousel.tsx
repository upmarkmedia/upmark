"use client";

import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Testimonial, WorkSection } from "@/types";

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "default-1",
    quote: "Upmark didn't just run our ads — they rebuilt our entire marketing system from the ground up. Within six months, our qualified leads tripled and our cost per acquisition dropped by 40%. They think like a partner, not a vendor.",
    name: "Arjun Mehta",
    role: "Head of Growth, Luxe Stays",
  },
  {
    id: "default-2",
    quote: "We tried four agencies before Upmark. The difference? They actually understand how content, performance and brand work together. Our eCommerce revenue is up 340% and for the first time, we can trace every rupee back to a specific channel.",
    name: "Priya Sharma",
    role: "Founder, Bloom Retail",
  },
  {
    id: "default-3",
    quote: "The production quality is outstanding, but what really sets Upmark apart is their speed. They went from strategy to a full campaign launch in two weeks — something our previous agency took two months to deliver.",
    name: "Rohan Kapoor",
    role: "CMO, Vertex Corp",
  },
  {
    id: "default-4",
    quote: "We needed a team that could handle everything — brand, content, social, performance — without us managing five different agencies. Upmark became that single integrated team, and our reservation bookings are up 290% as a result.",
    name: "Neha Desai",
    role: "Director of Marketing, The Grove Kitchen",
  },
];

interface TestimonialsCarouselProps {
  testimonials?: Testimonial[];
  maxItems?: number;
  section?: WorkSection;
  invertHeader?: boolean;
  noSectionPadding?: boolean;
}

function TestimonialModal({
  testimonial,
  onClose,
}: {
  testimonial: Testimonial;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-[#1a1a1a] rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-8 sm:p-10 border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <X size={16} />
        </button>

        <Quote size={32} className="text-accent-gold/40 mb-4" />

        <p className="text-white/80 text-base leading-relaxed mb-6 italic">
          &quot;{testimonial.quote}&quot;
        </p>

        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center gap-3">
            {testimonial.imageUrl ? (
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10">
                {testimonial.profileUrl ? (
                  <a href={testimonial.profileUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="block w-full h-full">
                    <img
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ) : (
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ) : testimonial.profileUrl ? (
              <a href={testimonial.profileUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold font-bold text-sm uppercase">
                {testimonial.name.charAt(0)}
              </a>
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold font-bold text-sm uppercase">
                {testimonial.name.charAt(0)}
              </div>
            )}
            <div>
              <h4 className="text-white font-semibold text-sm">
                {testimonial.name}
              </h4>
              <p className="text-accent-gold text-xs">{testimonial.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const TestimonialsCarousel = ({
  testimonials,
  maxItems = 10,
  section,
  invertHeader = false,
  noSectionPadding = false,
}: TestimonialsCarouselProps) => {
  const allTestimonials =
    testimonials && testimonials.length > 0
      ? testimonials
      : DEFAULT_TESTIMONIALS;
  const displayTestimonials = allTestimonials.slice(0, maxItems);

  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);

  const openModal = (t: Testimonial) => {
    setSelectedTestimonial(t);
  };

  const sectionLabel = section?.label || "CLIENT STORIES";
  const sectionTitle = section?.title || "Don't just take our word for it.";
  const sectionSubtitle = section?.subtitle || "";

  return (
    <section className={`${noSectionPadding ? "" : "py-16 sm:py-20 md:py-28"} relative z-10 overflow-hidden`}>
      <div className="container mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <div className="text-center flex flex-col items-center">
          <span className={`font-extrabold tracking-[0.2em] uppercase text-lg sm:text-xl mb-2 block ${invertHeader ? "text-black/50" : "text-secondary-surface-dark"}`}>
            {sectionLabel}
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-tight uppercase max-w-3xl ${invertHeader ? "text-black" : "text-primary-text"}`}>
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className={`text-base sm:text-lg mt-3 max-w-xl font-light ${invertHeader ? "text-black/50" : "text-muted-text"}`}>
              {sectionSubtitle}
            </p>
          )}
        </div>
      </div>

      <div className="relative group px-6 sm:px-10 lg:px-20">
        {/* Navigation Arrows */}
        <button
          id="testimonial-prev"
          className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-black hover:border-accent-gold/50 shadow-lg"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          id="testimonial-next"
          className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all duration-300 hover:bg-black hover:border-accent-gold/50 shadow-lg"
        >
          <ChevronRight size={20} />
        </button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          speed={800}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            prevEl: "#testimonial-prev",
            nextEl: "#testimonial-next",
          }}
          pagination={{
            clickable: true,
            el: ".testimonial-pagination",
          }}
          breakpoints={{
            640: { slidesPerView: 1.3, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 2.5, spaceBetween: 24 },
          }}
          className="testimonial-swiper pb-14"
        >
          {displayTestimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <div
                onClick={() => openModal(t)}
                className="cursor-pointer h-full"
              >
                <div className="bg-[#1a1a1a] border border-white/5 p-6 sm:p-8 rounded-lg h-full flex flex-col hover:border-accent-gold/30 transition-[border-color] duration-300 min-h-[300px] sm:min-h-[340px]">
                  <Quote
                    size={24}
                    className="text-accent-gold/50 flex-shrink-0 mb-4"
                  />
                  <p className="text-sm sm:text-[15px] font-light text-white/80 leading-relaxed italic flex-grow line-clamp-5">
                    &quot;{t.quote}&quot;
                  </p>
                  <div className="flex items-center gap-3 mt-auto pt-5 border-t border-white/10">
                    {t.imageUrl ? (
                      <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-white/10">
                        {t.profileUrl ? (
                          <a href={t.profileUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="block w-full h-full">
                            <img
                              src={t.imageUrl}
                              alt={t.name}
                              className="w-full h-full object-cover"
                            />
                          </a>
                        ) : (
                          <img
                            src={t.imageUrl}
                            alt={t.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ) : t.profileUrl ? (
                      <a href={t.profileUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold font-bold text-sm uppercase flex-shrink-0">
                        {t.name.charAt(0)}
                      </a>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold font-bold text-sm uppercase flex-shrink-0">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-white font-semibold text-sm">
                        {t.name}
                      </h4>
                      <p className="text-accent-gold text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="testimonial-pagination !w-auto flex justify-center gap-2 mt-8" />
      </div>

      {/* Read More Modal */}
      {selectedTestimonial && (
        <TestimonialModal
          testimonial={selectedTestimonial}
          onClose={() => setSelectedTestimonial(null)}
        />
      )}
    </section>
  );
};
