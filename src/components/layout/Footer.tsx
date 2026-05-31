"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getServices, getSiteSettings } from "@/lib/firestore";
import type { Service, SiteSettings } from "@/types";
const TwitterIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const marqueeText = "Strategy · Production · Distribution · Unified · ";

export const Footer = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    Promise.all([
      getServices(),
      getSiteSettings(),
    ])
      .then(([servicesData, settingsData]) => {
        setServices(servicesData.sort((a, b) => (a.order || 0) - (b.order || 0)));
        setSettings(settingsData);
      })
      .catch(console.error);
  }, []);

  const show = (key: string) => settings?.visibility?.[key as keyof typeof settings.visibility] ?? true;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-primary-text/5 bg-primary-bg relative overflow-hidden">
      {/* Marquee Accent Strip — reduced duplicates from 6 → 4 */}
      <div className="relative overflow-hidden py-4 border-b border-primary-text/5">
        <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite]" style={{ willChange: "transform" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="text-[11px] uppercase tracking-[0.3em] text-primary-text/[0.06] font-heading font-black mx-4">
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-6 sm:pb-10 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-16">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 sm:mb-6 inline-block">
              <Image src={(settings?.theme === "editorial" && settings?.editorialLogoUrl) ? settings.editorialLogoUrl : (settings?.globalLogoUrl || "/upmark-wordmark.png")} alt="Upmark" width={200} height={200} className="h-12 sm:h-14 w-auto object-contain" />
            </Link>
            <p className="text-muted-text/80 text-xs sm:text-sm leading-relaxed max-w-xs">
              Integrated marketing that moves markets.
            </p>
          </div>
          
          <div>
            <h4 className="text-primary-text font-bold font-heading mb-4 sm:mb-6 tracking-wide text-sm sm:text-base">Services</h4>
            <ul className="flex flex-col gap-2 sm:gap-3">
              {services.map((service) => (
                <li key={service.id}>
                  <Link href={`/services#${service.id}`} className="text-muted-text hover:text-accent-blue transition-colors text-xs sm:text-sm">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-primary-text font-bold font-heading mb-4 sm:mb-6 tracking-wide text-sm sm:text-base">Company</h4>
            <ul className="flex flex-col gap-2 sm:gap-3">
              {show("about") && <li><Link href="/about" className="text-muted-text hover:text-accent-blue transition-colors text-xs sm:text-sm">About Us</Link></li>}
              {show("work") && <li><Link href="/work" className="text-muted-text hover:text-accent-blue transition-colors text-xs sm:text-sm">Portfolio</Link></li>}
              {show("caseStudies") && <li><Link href="/case-studies" className="text-muted-text hover:text-accent-blue transition-colors text-xs sm:text-sm">Case Studies</Link></li>}
              {show("work") && <li><Link href="/work#testimonials" className="text-muted-text hover:text-accent-blue transition-colors text-xs sm:text-sm">Testimonials</Link></li>}
              {show("contact") && <li><Link href="/contact" className="text-muted-text hover:text-accent-blue transition-colors text-xs sm:text-sm">Contact</Link></li>}
              <li><Link href="/privacy" className="text-muted-text hover:text-accent-blue transition-colors text-xs sm:text-sm">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-primary-text font-bold font-heading mb-4 sm:mb-6 tracking-wide text-sm sm:text-base">Connect</h4>
            <ul className="flex flex-col gap-2 sm:gap-3">
              {(settings?.socialTwitter || !settings) && (
                <li>
                  <a href={settings?.socialTwitter || "https://x.com/upmarkmedia"} target="_blank" rel="noopener noreferrer" className="group/social flex items-center gap-2 text-muted-text hover:text-accent-blue transition-colors text-sm duration-200">
                    <span className="p-1.5 rounded-lg bg-transparent group-hover/social:bg-accent-blue/10 transition-colors duration-200">
                      <TwitterIcon size={16} />
                    </span>
                    Twitter / X
                  </a>
                </li>
              )}
              {(settings?.socialLinkedin || !settings) && (
                <li>
                  <a href={settings?.socialLinkedin || "https://linkedin.com/company/upmark"} target="_blank" rel="noopener noreferrer" className="group/social flex items-center gap-2 text-muted-text hover:text-accent-blue transition-colors text-sm duration-200">
                    <span className="p-1.5 rounded-lg bg-transparent group-hover/social:bg-accent-blue/10 transition-colors duration-200">
                      <LinkedinIcon size={16} />
                    </span>
                    LinkedIn
                  </a>
                </li>
              )}
              {(settings?.socialInstagram || !settings) && (
                <li>
                  <a href={settings?.socialInstagram || "https://www.instagram.com/upmarkmedia.in"} target="_blank" rel="noopener noreferrer" className="group/social flex items-center gap-2 text-muted-text hover:text-accent-blue transition-colors text-sm duration-200">
                    <span className="p-1.5 rounded-lg bg-transparent group-hover/social:bg-accent-blue/10 transition-colors duration-200">
                      <InstagramIcon size={16} />
                    </span>
                    Instagram
                  </a>
                </li>
              )}
              {(settings?.contactEmail || !settings) && (
                <li className="pt-2 mt-2 border-t border-primary-text/5">
                  <a href={`mailto:${settings?.contactEmail || "connect@upmarkmedia.in"}`} className="text-muted-text hover:text-accent-blue transition-colors text-sm font-medium">
                    {settings?.contactEmail || "connect@upmarkmedia.in"}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="pt-6 sm:pt-8 border-t border-primary-text/5 flex flex-col sm:flex-row justify-between items-center gap-4 safe-bottom">
          <p className="text-muted-text/60 text-xs text-center md:text-left">
            © 2026 Upmark. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-muted-text/60 hover:text-primary-text transition-colors text-xs">Privacy Policy</Link>
            <Link href="/terms" className="text-muted-text/60 hover:text-primary-text transition-colors text-xs">Terms of Service</Link>
            
            {/* Scroll to Top Button — plain button, no framer-motion for perf */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full border border-primary-text/10 hover:border-accent-blue/50 bg-primary-text/5 hover:bg-accent-blue/10 flex items-center justify-center text-muted-text hover:text-accent-blue transition-colors duration-200 active:scale-95"
              aria-label="Scroll to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
