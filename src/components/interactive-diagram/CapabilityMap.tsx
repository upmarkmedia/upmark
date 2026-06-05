"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CAPABILITIES_DATA } from "./services-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { getSiteSettings } from "@/lib/firestore";
import type { Service } from "@/types";

export function CapabilityMap({ services = [] }: { services?: Service[] }) {
  // Use provided services or fallback to empty state
  const data = services.length > 0 ? services : [];
  
  const [activeId, setActiveId] = useState(data[0]?.id || "");
  const [logoUrl, setLogoUrl] = useState("/upmark-wordmark.png");

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data?.globalLogoUrl) setLogoUrl(data.globalLogoUrl);
    }).catch(console.error);

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && data.some(s => s.id === hash)) {
        setActiveId(hash);
      }
    };

    // Check on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Fallback for Next.js soft navigation (in case hashchange doesn't fire)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleHashChange();
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      handleHashChange();
    };

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [data]);

  const activeIndex = data.findIndex((s) => s.id === activeId);
  const active = data[activeIndex] || data[0];
  
  if (!active) return null;

  const getPosStyles = (i: number, total: number) => {
    const angle = -Math.PI / 2 + (i / total) * 2 * Math.PI;
    const rPct = 37; // 185/500 is 37%
    return {
      left: `calc(50% + ${Math.cos(angle) * rPct}%)`,
      top: `calc(50% + ${Math.sin(angle) * rPct}%)`,
      transform: 'translate(-50%, -50%)'
    };
  };

  const getSvgPos = (i: number, total: number) => {
    const angle = -Math.PI / 2 + (i / total) * 2 * Math.PI;
    return {
      x: 50 + Math.cos(angle) * 37,
      y: 50 + Math.sin(angle) * 37,
    };
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 max-w-6xl mx-auto px-4 sm:px-0">

        {/* Orbital */}
        <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px] flex-shrink-0">
          {/* Ambient glow */}
          <div className="absolute inset-0 rounded-full bg-accent-blue/5 blur-[90px] pointer-events-none" />

          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            style={{ zIndex: 0 }}
          >
            <defs>
              <linearGradient id="line-active" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(59,130,246,0)" />
                <stop offset="60%" stopColor="rgba(59,130,246,0.7)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0.9)" />
              </linearGradient>
            </defs>

            {/* Decorative rings (radii: 45%, 75%, 100% of 37 => 16.65, 27.75, 37) */}
            {[16.65, 27.75, 37].map((r, i) => (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke="currentColor"
                className="text-primary-text/5"
                strokeWidth="0.2"
              />
            ))}

            {/* Connector lines */}
            {data.map((svc, i) => {
              const pos = getSvgPos(i, data.length);
              const isActive = svc.id === activeId;
              return (
                <motion.line
                  key={`line-${svc.id}`}
                  x1="50"
                  y1="50"
                  x2={pos.x}
                  y2={pos.y}
                  stroke={isActive ? "url(#line-active)" : "currentColor"}
                  strokeWidth={isActive ? 0.3 : 0.2}
                  strokeDasharray={isActive ? "none" : "1 1.5"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className={`transition-colors duration-500 ${isActive ? "" : "text-primary-text/5"}`}
                />
              );
            })}

            {/* Active node glow pulse */}
            <motion.circle
              key={`pulse-${activeId}`}
              cx={getSvgPos(activeIndex !== -1 ? activeIndex : 0, data.length).x}
              cy={getSvgPos(activeIndex !== -1 ? activeIndex : 0, data.length).y}
              r="8"
              fill="rgba(59,130,246,0.12)"
              animate={{ r: [8, 12, 8], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>

          {/* Center Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 lg:w-44 lg:h-44 rounded-full bg-[#03060c]/80 border border-white/5 backdrop-blur-md flex items-center justify-center shadow-[0_0_80px_rgba(59,130,246,0.15)] z-10">
            <div className="absolute inset-0 rounded-full border border-accent-blue/10 animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]" />
            <Image src={logoUrl} alt="Upmark" width={100} height={100} className="w-20 lg:w-28 h-auto z-10 object-contain" />
          </div>

          {/* Nodes */}
          {data.map((svc, i) => {
            const isActive = svc.id === activeId;
            const IconComponent = (svc.icon_name && (LucideIcons as any)[svc.icon_name]) || LucideIcons.Check;

            return (
              <div
                key={svc.id}
                className="absolute z-20"
                style={getPosStyles(i, data.length)}
                onMouseEnter={() => setActiveId(svc.id || "")}
                onClick={() => setActiveId(svc.id || "")}
              >
                <motion.button
                  className={`w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full border flex flex-col items-center justify-center gap-0.5 transition-colors duration-300 cursor-pointer focus-visible:outline-none
                    ${isActive
                      ? "bg-[#0d1525] border-accent-blue shadow-[0_0_28px_rgba(59,130,246,0.45)]"
                      : "bg-[#080d17] border-white/10 hover:border-white/30 hover:bg-white/5"
                    }`}
                  whileHover={{ scale: 1.14 }}
                  whileTap={{ scale: 0.94 }}
                  aria-label={svc.title}
                  aria-pressed={isActive}
                >
                  {svc.icon_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={svc.icon_url} 
                      alt={svc.title} 
                      className={`w-4 h-4 lg:w-6 lg:h-6 object-contain transition-all duration-300 ${isActive ? "opacity-100" : "opacity-40"}`} 
                    />
                  ) : (
                    <IconComponent
                      size={14}
                      className={`lg:w-6 lg:h-6 transition-colors duration-300 ${isActive ? "text-accent-blue" : "text-white/35"}`}
                    />
                  )}
                  <span
                    className={`text-[7px] lg:text-[9px] font-bold tracking-wider uppercase text-center leading-tight px-1 transition-colors duration-300 ${isActive ? "text-white" : "text-white/35"
                      }`}
                  >
                    {svc.label}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="activeCapabilityDot"
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-accent-blue rounded-full shadow-[0_0_10px_rgba(59,130,246,0.9)]"
                    />
                  )}
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* Info panel */}
        <div className="flex-1 w-full lg:w-auto min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative rounded-2xl lg:rounded-3xl border border-primary-text/10 bg-secondary-surface/40 backdrop-blur-xl p-6 sm:p-8 lg:p-10 overflow-hidden shadow-2xl"
            >
              {/* Glass sheen */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-text/[0.04] to-transparent pointer-events-none" />
              {/* Blue top accent */}
              <div className="absolute top-0 left-6 right-6 lg:left-8 lg:right-8 h-[1px] bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent" />

              {/* Decorative number */}
              <span className="absolute top-2 right-4 text-[6rem] lg:text-[8rem] font-black text-accent-blue/[0.05] leading-none select-none pointer-events-none font-heading">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>

              <div className="relative z-10">
                <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-[10px] lg:text-xs border border-accent-blue/30 px-3 py-1 rounded-full bg-accent-blue/5 mb-4 lg:mb-5 inline-block">
                  {active.subtitle}
                </span>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary-text font-heading mb-4 lg:mb-5 leading-tight">
                  {active.title}
                </h3>

                <p className="text-muted-text font-light text-sm sm:text-base lg:text-[17px] leading-relaxed mb-6 lg:mb-7">
                  {active.description}
                </p>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-xs lg:text-sm font-semibold text-primary-text/65 hover:text-accent-blue transition-colors duration-200 group"
                >
                  <span>Discuss this service</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Service dots navigation */}
          <div className="flex items-center justify-center lg:justify-start gap-2 mt-5 lg:pl-1">
            {data.map((svc) => (
              <button
                key={svc.id}
                onClick={() => setActiveId(svc.id || "")}
                className={`rounded-full transition-[width] duration-300 focus-visible:outline-none ${svc.id === activeId
                  ? "w-6 h-2 bg-accent-blue"
                  : "w-2 h-2 bg-primary-text/20 hover:bg-primary-text/40"
                  }`}
                aria-label={svc.title}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
