"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getSiteSettings } from "@/lib/firestore";
import { useIdle } from "@/contexts/IdleContext";

export const FloatingCTA = () => {
  const pathname = usePathname();
  const { isIdle, isHeroVisible } = useIdle();
  const [showContact, setShowContact] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data?.visibility && data.visibility.contact !== undefined) {
        setShowContact(data.visibility.contact);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const check = () => {
      const footer = document.querySelector("footer");
      if (!footer) return;
      setFooterVisible(footer.getBoundingClientRect().top < window.innerHeight);
    };

    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, []);
  
  // Don't show CTA on contact page since they are already there, or if contact page is hidden
  if (pathname === "/contact" || !showContact) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: isIdle && isHeroVisible || footerVisible ? 0 : 1, y: 0 }}
      transition={{ delay: isIdle && isHeroVisible ? 0 : 1, duration: 0.7 }}
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 safe-bottom ${(isIdle && isHeroVisible) || footerVisible ? "pointer-events-none" : "pointer-events-auto"}`}
      style={{ contain: "layout style" }}
    >
      <Link href="/contact" className="group">
        <div className="relative bg-accent-blue text-primary-text font-semibold px-5 py-4 sm:px-8 sm:py-4 rounded-sm flex items-center gap-2 sm:gap-3 overflow-hidden transition-transform duration-200 group-hover:scale-[1.03]">
          <Rocket size={18} className="relative z-10 sm:w-5 sm:h-5" />
          <span className="relative z-10 text-sm sm:text-base">Get started!</span>
          <svg className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </div>
      </Link>
    </motion.div>
  );
};
