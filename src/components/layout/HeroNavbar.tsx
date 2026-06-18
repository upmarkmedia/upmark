"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSiteSettings } from "@/lib/firestore";

export const HeroNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/upmark-wordmark.png");
  const [isLight, setIsLight] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const pathname = usePathname();

  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data?.theme === "editorial") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("theme-editorial");
        setIsLight(true);
        if (data?.editorialLogoUrl) setLogoUrl(data.editorialLogoUrl);
      } else {
        document.documentElement.classList.remove("theme-editorial");
        document.documentElement.classList.add("dark");
        setIsLight(false);
        if (data?.globalLogoUrl) setLogoUrl(data.globalLogoUrl);
      }
      if (data?.visibility) setVisibility(data.visibility as Record<string, boolean>);
    }).catch(console.error).finally(() => setSettingsLoaded(true));
  }, []);

  const show = (key: string) => visibility[key] ?? true;

  const navLinks = [
    { name: "Home", href: "/", show: show("home") },
    { name: "About Us", href: "/about", show: show("about") },
    { name: "Work", href: "/work", show: show("work") },
    { name: "Services", href: "/services", show: show("services") },
    { name: "Case Studies", href: "/case-studies", show: show("caseStudies") },
    { name: "Contact Us", href: "/contact", isCTA: true, show: show("contact") },
  ].filter(link => link.show);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className={`w-full relative z-30 transition-opacity duration-0 ${settingsLoaded ? "opacity-100" : "opacity-0"}`}>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full transition-colors duration-300 flex justify-between items-center ${
          isLight
            ? "bg-primary-bg/85 backdrop-blur-md border-b border-primary-text/10 shadow-md py-1.5 px-4 sm:px-6 md:px-10"
            : "bg-transparent py-1.5 px-4 sm:px-6 md:px-10"
        }`}
      >
        {/* Logo - Left Side */}
        <Link href="/" className="flex items-center shrink-0">
          <Image src={logoUrl} alt="Upmark" width={180} height={180} className="h-12 sm:h-14 w-auto object-contain" priority />
        </Link>

        {/* Desktop Nav - Right Side */}
        <nav className="hidden lg:flex items-center space-x-1 ml-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.isCTA) {
              return (
                <div key={link.href} className="pl-4 ml-2">
                  <Link
                    href={link.href}
                    className="group relative inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-accent-blue text-white text-sm font-medium overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-lg border border-primary-text/10"
                  >
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                </div>
              );
            }

            return (
              <div key={link.href} className="relative group px-3 py-2">
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
                    isActive ? "text-primary-text" : "text-primary-text/70 hover:text-primary-text"
                  }`}
                >
                  {link.name}
                </Link>

                {isActive && (
                  <motion.div
                    layoutId="hero-active-nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent-blue rounded-t-full shadow-md"
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="lg:hidden text-primary-text hover:text-primary-text/80 p-3 ml-auto rounded-full transition-colors focus:outline-none relative z-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.12 }}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Mobile Neon Glow Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-[-2000px] z-30 cursor-default"
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute top-[110%] right-0 w-[260px] sm:w-[300px] z-40 pt-2 pb-4 flex flex-col items-end gap-3"
              >
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: i * 0.04 + 0.08,
                      duration: 0.3,
                      ease: [0.25, 0.4, 0, 1],
                    }}
                    className="w-auto flex flex-col items-end"
                  >
                    {link.isCTA ? (
                      <Link
                        href={link.href}
                        className="inline-flex items-center px-7 py-2.5 rounded-full bg-gradient-to-r from-accent-blue to-blue-500 text-white text-[15px] font-medium transition-all duration-300 shadow-[0_2px_12px_rgba(59,130,246,0.35),0_0_20px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.5),0_0_30px_rgba(59,130,246,0.25)]"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <Link
                        href={link.href}
                        className={`inline-flex items-center px-5 py-2.5 rounded-full border text-[16px] tracking-wide transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)] ${
                          pathname === link.href
                            ? "border-primary-text/15 bg-primary-bg/90 text-primary-text font-semibold ring-2 ring-inset ring-accent-blue/60 shadow-[0_2px_14px_rgba(59,130,246,0.15)]"
                            : "border-primary-text/15 bg-primary-bg/90 text-primary-text/80 hover:text-accent-blue hover:border-accent-blue/40"
                        }`}
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
