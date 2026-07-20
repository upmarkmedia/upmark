import Link from "next/link";
import { StoryLayoutProps } from "./types";

export function StorySection({
  eyebrow,
  subtitle,
  descriptionHtml,
  imageUrl,
  showServices,
  showContact,
}: StoryLayoutProps) {
  return (
    <div className="w-full relative">
      {/* Decorative large background text */}
      <div className="absolute top-0 right-0 -z-10 opacity-[0.02] text-[15rem] leading-none font-black uppercase overflow-hidden whitespace-nowrap pointer-events-none select-none">
        {eyebrow}
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start relative z-10">
        {/* Left Column - Large Editorial Title & Columns */}
        <div className="lg:w-7/12 w-full lg:-mt-10">
          {/* Eyebrow & Title */}
          <span className="text-secondary-surface-dark font-extrabold tracking-[0.2em] uppercase text-xl mb-3 block">
            {eyebrow}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-primary-text tracking-tight leading-tight mb-4 uppercase">
            The Story of <span className="text-accent-gold">Upmark</span>
          </h1>

          {/* Subtitle / Pull Quote */}
          <h2
            className="text-lg sm:text-xl md:text-2xl font-light italic text-muted-text mb-6 sm:mb-8"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />

          {/* Editorial Content */}
          <div
            className="gap-8 sm:gap-12 
              [&>p]:mb-4 [&>p]:text-muted-text [&>p]:leading-relaxed [&>p]:font-light [&>p]:text-sm sm:[&>p]:text-base [&>p]:text-justify
              [&>p:first-of-type]:text-xl [&>p:first-of-type]:font-medium [&>p:first-of-type]:text-primary-text [&>p:first-of-type]:tracking-wide [&>p:first-of-type]:leading-snug
              [&>ul]:my-4 [&>ul]:border-y [&>ul]:border-primary-text/10 [&>ul]:py-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:text-primary-text [&>ul>li]:font-semibold [&>ul>li]:text-base sm:[&>ul>li]:text-lg [&>ul>li]:mb-4 [&>ul>li:last-child]:mb-0 [&>ul>li::marker]:text-accent-gold
              [&>p:last-child]:text-lg sm:[&>p:last-child]:text-xl [&>p:last-child]:font-bold [&>p:last-child]:text-accent-gold [&>p:last-child]:uppercase [&>p:last-child]:mt-6 [&>p:last-child]:break-inside-avoid"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />

          {/* CTA Buttons */}
          <div className="flex lg:hidden flex-row flex-wrap items-center justify-start gap-4 sm:gap-6 mt-12 sm:mt-16 pt-8 border-t border-primary-text/10">
            {showServices && (
              <Link
                href="/services"
                className="group relative flex items-center justify-center gap-3 bg-primary-text text-primary-bg px-8 py-4 rounded-sm font-semibold text-sm sm:text-base overflow-hidden transition-[transform] hover:scale-[1.02] active:scale-95"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-neutral-800 to-black opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">Our Services</span>
              </Link>
            )}
            {showContact && (
              <Link
                href="/contact"
                className="group flex items-center justify-center px-8 py-4 rounded-sm font-semibold text-sm sm:text-base text-primary-text bg-transparent border border-primary-text hover:bg-primary-text hover:text-primary-bg transition-colors duration-300"
              >
                Get in touch
              </Link>
            )}
          </div>
        </div>

        {/* Right Column - Tall Editorial Image/Video */}
        <div className="hidden lg:block lg:w-5/12 w-full mt-8 lg:mt-0 lg:sticky lg:top-32">
          <div className="relative aspect-square w-full rounded-sm overflow-hidden transition-all duration-1000 border border-primary-text/10 shadow-2xl group">
            {imageUrl.match(/\.(mp4|webm|mov)$/i) ? (
              <video
                src={imageUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={imageUrl}
                alt="Upmark story"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
            )}
            
            {/* Elegant overlay caption */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <span className="text-white text-sm tracking-widest uppercase font-semibold">Our Story</span>
            </div>
          </div>

          {/* CTA Buttons - Desktop (Below Video) */}
          <div className="hidden lg:flex w-full flex-row items-center justify-end gap-3 mt-6">
            {showServices && (
              <Link
                href="/services"
                className="group relative flex items-center justify-center gap-3 bg-primary-text text-primary-bg px-6 py-3 rounded-sm font-semibold text-sm overflow-hidden transition-[transform] hover:scale-[1.02] active:scale-95"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-neutral-800 to-black opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">Our Services</span>
              </Link>
            )}
            {showContact && (
              <Link
                href="/contact"
                className="group flex items-center justify-center px-6 py-3 rounded-sm font-semibold text-sm text-primary-text bg-transparent border border-primary-text hover:bg-primary-text hover:text-primary-bg transition-colors duration-300"
              >
                Get in touch
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
