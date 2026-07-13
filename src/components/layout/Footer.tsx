"use client";

import Image from "next/image";
import Link from "next/link";
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

const marqueeText = "Content. Strategy. Momentum. ";

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

  return (
    <>
    <footer className="border-t border-white/5 bg-contrast-bg relative">
      {/* Marquee Accent Strip — subtle background texture */}
      <div className="relative overflow-hidden py-4 border-b border-white/5">
        <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite]" style={{ willChange: "transform", width: "max-content" }}>
          <div className="flex whitespace-nowrap">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="text-[13px] uppercase tracking-[0.3em] text-accent-gold font-heading font-black mx-4">
                {marqueeText}
              </span>
            ))}
          </div>
          <div className="flex whitespace-nowrap" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="text-[13px] uppercase tracking-[0.3em] text-accent-gold font-heading font-black mx-4">
                {marqueeText}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto pl-10 pr-4 sm:px-8 pt-8 sm:pt-10 pb-6 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-4 sm:mb-6 inline-block">
              <Image src={settings?.globalLogoUrl || "/upmark-wordmark.png"} alt="Upmark" width={200} height={200} className="h-12 sm:h-14 w-auto object-contain" />
            </Link>
            <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-xs">
              {settings?.footerTagline || "Integrated marketing that moves markets."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:col-span-2">
            <div>
              <h4 className="text-neutral-100 font-bold font-heading mb-3 uppercase text-xs tracking-[0.2em]">{settings?.footerHeadingServices || "Services"}</h4>
              <ul className="flex flex-col space-y-2">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link href={`/services#${service.id}`} className="text-neutral-400 hover:text-white transition-colors duration-300 text-xs sm:text-sm">
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-neutral-100 font-bold font-heading mb-3 uppercase text-xs tracking-[0.2em]">{settings?.footerHeadingCompany || "Company"}</h4>
              <ul className="flex flex-col space-y-2">
                {show("about") && <li><Link href="/about" className="text-neutral-400 hover:text-white transition-colors duration-300 text-xs sm:text-sm">About Us</Link></li>}
                {show("work") && <li><Link href="/work" className="text-neutral-400 hover:text-white transition-colors duration-300 text-xs sm:text-sm">Portfolio</Link></li>}
                {show("caseStudies") && <li><Link href="/case-studies" className="text-neutral-400 hover:text-white transition-colors duration-300 text-xs sm:text-sm">Case Studies</Link></li>}
                {show("work") && <li><Link href="/work#testimonials" className="text-neutral-400 hover:text-white transition-colors duration-300 text-xs sm:text-sm">Testimonials</Link></li>}
                {show("contact") && <li><Link href="/contact" className="text-neutral-400 hover:text-white transition-colors duration-300 text-xs sm:text-sm">Contact</Link></li>}
                <li><Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors duration-300 text-xs sm:text-sm">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div>
              <h4 className="text-neutral-100 font-bold font-heading mb-3 uppercase text-xs tracking-[0.2em]">{settings?.footerHeadingConnect || "Connect"}</h4>
            <ul className="flex flex-col space-y-2">
              {(settings?.socialTwitter || !settings) && (
                <li>
                  <a href={settings?.socialTwitter || "https://x.com/upmarkmedia"} target="_blank" rel="noopener noreferrer" className="group/social flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-300 text-sm">
                    <span className="p-1.5 rounded-sm bg-transparent group-hover/social:bg-accent-blue/10 transition-colors duration-300">
                      <TwitterIcon size={16} />
                    </span>
                    Twitter / X
                  </a>
                </li>
              )}
              {(settings?.socialLinkedin || !settings) && (
                <li>
                  <a href={settings?.socialLinkedin || "https://linkedin.com/company/upmark"} target="_blank" rel="noopener noreferrer" className="group/social flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-300 text-sm">
                    <span className="p-1.5 rounded-sm bg-transparent group-hover/social:bg-accent-blue/10 transition-colors duration-300">
                      <LinkedinIcon size={16} />
                    </span>
                    LinkedIn
                  </a>
                </li>
              )}
              {(settings?.socialInstagram || !settings) && (
                <li>
                  <a href={settings?.socialInstagram || "https://www.instagram.com/upmarkmedia.in"} target="_blank" rel="noopener noreferrer" className="group/social flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-300 text-sm">
                    <span className="p-1.5 rounded-sm bg-transparent group-hover/social:bg-accent-blue/10 transition-colors duration-300">
                      <InstagramIcon size={16} />
                    </span>
                    Instagram
                  </a>
                </li>
              )}
              {(settings?.footerContacts && settings.footerContacts.length > 0 || settings?.contactEmail || !settings) && (
                <li className="pt-3 mt-3 border-t border-white/10">
                  <p className="text-neutral-100 font-bold font-heading uppercase text-xs tracking-[0.2em] mb-3">{settings?.footerHeadingGetInTouch || "Get in touch"}</p>
                  {settings?.footerContacts && settings.footerContacts.length > 0 && (
                    <div className="flex flex-col gap-3 mb-3">
                      {settings.footerContacts.map((contact, i) => (
                        <div key={contact.id || i} className="flex flex-col gap-1">
                          <p className="text-neutral-100 font-bold text-sm">{contact.name}</p>
                          {contact.designation && <p className="text-neutral-500 text-xs">{contact.designation}</p>}
                          {contact.phone && (
                            <a href={`tel:${contact.phone}`} className="text-neutral-400 hover:text-white transition-colors duration-300 text-xs">
                              {contact.phone}
                            </a>
                          )}
                          {contact.email && (
                            <a href={`mailto:${contact.email}`} className="text-neutral-400 hover:text-white transition-colors duration-300 text-xs">
                              {contact.email}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {(settings?.contactEmail || !settings) && (
                    <a href={`mailto:${settings?.contactEmail || "connect@upmarkmedia.in"}`} className="text-neutral-400 hover:text-white hover:underline hover:underline-offset-4 transition-colors duration-300 text-sm font-medium">
                      {settings?.contactEmail || "connect@upmarkmedia.in"}
                    </a>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="pt-4 sm:pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 safe-bottom">
          <p className="text-neutral-500 text-xs text-center md:text-left">
            © 2026 Upmark. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-neutral-500 hover:text-white transition-colors duration-300 text-xs">Privacy Policy</Link>
            <Link href="/terms" className="text-neutral-500 hover:text-white transition-colors duration-300 text-xs">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};
