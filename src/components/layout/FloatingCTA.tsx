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

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data?.visibility && data.visibility.contact !== undefined) {
        setShowContact(data.visibility.contact);
      }
    }).catch(console.error);
  }, []);
  
  // Don't show CTA on contact page since they are already there, or if contact page is hidden
  if (pathname === "/contact" || !showContact) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: isIdle && isHeroVisible ? 0 : 1, y: 0 }}
      transition={{ delay: isIdle && isHeroVisible ? 0 : 1, duration: 0.7 }}
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 safe-bottom ${isIdle && isHeroVisible ? "pointer-events-none" : "pointer-events-auto"}`}
      style={{ contain: "layout style" }}
    >
      <Link href="/contact" className="group">
        <div className="relative bg-gradient-to-r from-accent-blue via-blue-500 to-indigo-500 text-white font-semibold px-5 py-4 sm:px-8 sm:py-4 rounded-full flex items-center gap-2 sm:gap-3 overflow-hidden shadow-[0_8px_30px_-10px_rgba(59,130,246,0.7)] border border-white/20 transition-transform duration-200 group-hover:scale-[1.03]">
          <Rocket size={18} className="relative z-10 sm:w-5 sm:h-5" />
          <span className="relative z-10 text-sm sm:text-base">Get started!</span>
        </div>
      </Link>
    </motion.div>
  );
};
