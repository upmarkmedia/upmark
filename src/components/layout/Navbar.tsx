"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const pathname = usePathname();

  // Handle scroll effect for dynamic glassmorphism on desktop
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/#about" },
    {
      name: "Work",
      href: "/work",
      dropdownItems: [
        { name: "Portfolio", href: "/work" },
        { name: "Testimonials", href: "/work#testimonials" },
      ],
    },
    { name: "Services", href: "/services" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Contact Us", href: "/contact", isCTA: true },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileSubmenuOpen(null);
  }, [pathname]);

  return (
    <header className="fixed top-0 w-full z-50 flex justify-center pt-3 sm:pt-6 px-3 sm:px-6 pointer-events-none">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full max-w-6xl rounded-full transition-colors duration-300 pointer-events-auto flex justify-between items-center ${
          scrolled
            ? "bg-black/50 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-2.5 sm:py-3 px-4 sm:px-6 md:px-8"
            : "bg-transparent py-3 sm:py-4 px-4 sm:px-6 md:px-8"
        }`}
      >
        {/* Logo - Left Side */}
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/upmark-wordmark.png" alt="Upmark" width={100} height={100} className="h-7 sm:h-8 w-auto" priority />
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
                    className="group relative inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 text-white text-sm font-medium overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] border border-white/10"
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
                    isActive ? "text-white" : "text-white/70 hover:text-white"
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
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-blue-500 rounded-t-full shadow-[0_-2px_8px_rgba(59,130,246,0.6)]"
                  />
                )}

                {/* Desktop Dropdown Menu */}
                {link.dropdownItems && (
                  <div className="absolute top-[120%] left-1/2 -translate-x-1/2 min-w-[220px] bg-black/85 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-full transition-[opacity,visibility,top] duration-200 p-2.5 flex flex-col gap-1 z-50">
                    <div className="absolute -top-4 left-0 right-0 h-6 bg-transparent" />
                    {link.dropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="px-4 py-2.5 hover:bg-white/10 rounded-xl text-sm text-white/70 hover:text-white transition-colors duration-150 flex items-center justify-between group/item"
                      >
                        {item.name}
                        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-[opacity,transform] duration-150 text-blue-400" />
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
          className="lg:hidden text-white hover:text-white/80 p-3 ml-auto rounded-full transition-colors focus:outline-none relative z-50"
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
                <div className="absolute inset-0 bg-gradient-to-bl from-[#0a0f1e]/98 via-[#0a0f1e]/90 to-transparent -z-10" />
                
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
                            className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 text-white text-[15px] font-medium shadow-[0_4px_15px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.5)] transition-shadow"
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
                                className="text-[17px] tracking-wide text-white/90 hover:text-white transition-colors flex items-center justify-end gap-1.5 w-full py-2"
                              >
                                {link.name}
                                <ChevronDown
                                  size={16}
                                  className={`transition-transform duration-200 opacity-70 ${
                                    mobileSubmenuOpen === link.name ? "rotate-180 text-cyan-400" : ""
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
                                    <div className="flex flex-col items-end gap-2 pr-1 py-1 mr-1 border-r border-white/10">
                                      {link.dropdownItems.map((item) => (
                                        <Link
                                          key={item.href}
                                          href={item.href}
                                          className="text-[14px] text-white/50 hover:text-white transition-colors pr-2 py-2"
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
                                pathname === link.href ? "text-white font-semibold" : "text-white/80 hover:text-white"
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