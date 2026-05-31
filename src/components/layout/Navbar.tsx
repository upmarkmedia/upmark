"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIdle } from "@/contexts/IdleContext";
import { getSiteSettings } from "@/lib/firestore";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState("/upmark-wordmark.png");
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const { isIdle, isHeroVisible } = useIdle();

  const [visibility, setVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data?.theme === "editorial") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("theme-editorial");
        if (data?.editorialLogoUrl) setLogoUrl(data.editorialLogoUrl);
      } else {
        document.documentElement.classList.remove("theme-editorial");
        document.documentElement.classList.add("dark");
        if (data?.globalLogoUrl) setLogoUrl(data.globalLogoUrl);
      }
      if (data?.visibility) setVisibility(data.visibility as Record<string, boolean>);
    }).catch(console.error);
  }, []);

  const show = (key: string) => visibility[key] ?? true;

  // Handle scroll effect for dynamic glassmorphism on desktop
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrolled(currentScrollY > 20);

          if (window.innerWidth >= 1024) {
            if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
              setHidden(true);
            } else if (currentScrollY < lastScrollY.current || currentScrollY <= 50) {
              setHidden(false);
            }
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", show: show("home") },
    { name: "About Us", href: "/about", show: show("about") },
    {
      name: "Work",
      href: "/work",
      show: show("work"),
      dropdownItems: [
        { name: "Portfolio", href: "/work" },
        { name: "Testimonials", href: "/work#testimonials" },
      ],
    },
    { name: "Services", href: "/services", show: show("services") },
    { name: "Case Studies", href: "/case-studies", show: show("caseStudies") },
    { name: "Contact Us", href: "/contact", isCTA: true, show: show("contact") },
  ].filter(link => link.show);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileSubmenuOpen(null);
  }, [pathname]);

  return (
    <header className={`fixed top-0 w-full z-50 flex justify-center pt-3 sm:pt-6 px-3 sm:px-6 pointer-events-none transition-all duration-500 ${isIdle && isHeroVisible ? "opacity-0" : "opacity-100"} ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full max-w-6xl rounded-full transition-colors duration-300 pointer-events-auto flex justify-between items-center ${
          scrolled
            ? "bg-primary-bg/80 backdrop-blur-xl border border-primary-text/10 shadow-lg py-2.5 sm:py-3 px-4 sm:px-6 md:px-8"
            : "bg-transparent py-3 sm:py-4 px-4 sm:px-6 md:px-8"
        }`}
      >
        {/* Logo - Left Side */}
        <Link href="/" className="flex items-center shrink-0">
          <Image src={logoUrl} alt="Upmark" width={180} height={180} className="h-12 sm:h-14 w-auto object-contain" priority />
        </Link>

        {/* Desktop Nav - Right Side */}
        <nav className="hidden lg:flex items-center space-x-1 ml-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.dropdownItems && pathname.startsWith(link.href));

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
                  {link.dropdownItems && (
                    <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180 opacity-70" />
                  )}
                </Link>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent-blue rounded-t-full shadow-md"
                  />
                )}

                {/* Desktop Dropdown Menu */}
                {link.dropdownItems && (
                  <div className="absolute top-[120%] left-1/2 -translate-x-1/2 min-w-[220px] bg-primary-bg/95 backdrop-blur-xl border border-primary-text/10 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-full transition-[opacity,visibility,top] duration-200 p-2.5 flex flex-col gap-1 z-50">
                    <div className="absolute -top-4 left-0 right-0 h-6 bg-transparent" />
                    {link.dropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="px-4 py-2.5 hover:bg-primary-text/10 rounded-xl text-sm text-primary-text/70 hover:text-primary-text transition-colors duration-150 flex items-center justify-between group/item"
                      >
                        {item.name}
                        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-[opacity,transform] duration-150 text-accent-blue" />
                      </Link>
                    ))}
                  </div>
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

        {/* Mobile Subtle Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Invisible Click-away Overlay */}
              <div 
                className="fixed inset-[-2000px] z-30 cursor-default" 
                onClick={() => setIsOpen(false)} 
              />
              
              {/* Dropdown Container — solid bg, no blur for mobile perf */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-[110%] right-0 w-[280px] sm:w-[320px] rounded-bl-[40px] rounded-br-[20px] rounded-tl-[10px] z-40 overflow-hidden"
              >
                {/* Solid dark gradient — no backdrop-blur on mobile for perf */}
                <div className="absolute inset-0 bg-gradient-to-bl from-primary-bg/98 via-primary-bg/95 to-transparent -z-10" />
                
                {/* Links Container */}
                <div className="flex flex-col items-end pt-4 pb-10 pr-8 sm:pr-10 pl-10 gap-6">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 + 0.08, duration: 0.2 }}
                      className="w-full flex flex-col items-end"
                    >
                      {link.isCTA ? (
                        <div className="mt-3">
                          <Link
                            href={link.href}
                            className="inline-block px-6 py-2 rounded-full bg-accent-blue text-white text-[15px] font-medium shadow-md hover:shadow-lg transition-shadow"
                          >
                            {link.name}
                          </Link>
                        </div>
                      ) : (
                        <div className="w-full flex flex-col items-end">
                          {link.dropdownItems ? (
                            <>
                              <button
                                onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === link.name ? null : link.name)}
                                className="text-[17px] tracking-wide text-primary-text/90 hover:text-primary-text transition-colors flex items-center justify-end gap-1.5 w-full py-2"
                              >
                                {link.name}
                                <ChevronDown
                                  size={16}
                                  className={`transition-transform duration-200 opacity-70 ${
                                    mobileSubmenuOpen === link.name ? "rotate-180 text-accent-blue" : ""
                                  }`}
                                />
                              </button>
                              <AnimatePresence>
                                {mobileSubmenuOpen === link.name && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden w-full flex flex-col items-end mt-1"
                                  >
                                    <div className="flex flex-col items-end gap-2 pr-1 py-1 mr-1 border-r border-primary-text/10">
                                      {link.dropdownItems.map((item) => (
                                        <Link
                                          key={item.href}
                                          href={item.href}
                                          className="text-[14px] text-primary-text/50 hover:text-primary-text transition-colors pr-2 py-2"
                                        >
                                          {item.name}
                                        </Link>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          ) : (
                            <Link
                              href={link.href}
                              className={`text-[17px] tracking-wide transition-colors py-2 ${
                                pathname === link.href ? "text-primary-text font-semibold" : "text-primary-text/80 hover:text-primary-text"
                              }`}
                            >
                              {link.name}
                            </Link>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
};