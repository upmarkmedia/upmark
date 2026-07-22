"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { getSiteSettings } from "@/lib/firestore";
import type { Service } from "@/types";
import { useMobileAutoplayPause } from "./useMobileAutoplayPause";

export function CapabilityMap({ services = [] }: { services?: Service[] }) {
  const data = services.length > 0 ? services : [];

  const [activeId, setActiveId] = useState(data[0]?.id || "");
  const [logoUrl, setLogoUrl] = useState("https://pub-a71a6003788f4fc991bb79126b750fc0.r2.dev/uploads/e964a5b7-b0e4-40c4-9d06-c02c79401a2f-UpmarkLogoRGB-07Transparent.png");

  useEffect(() => {
    getSiteSettings().then(data => {
      setLogoUrl(data?.navbarLogoV3 || data?.editorialLogoUrl || "https://pub-a71a6003788f4fc991bb79126b750fc0.r2.dev/uploads/e964a5b7-b0e4-40c4-9d06-c02c79401a2f-UpmarkLogoRGB-07Transparent.png");
    }).catch(console.error);

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && data.some(s => s.id === hash)) {
        setActiveId(hash);
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);

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

  const lastInteractionTime = useRef(Date.now());
  const { isMobile, isPaused, pauseAutoplay } = useMobileAutoplayPause();

  const handleInteraction = useCallback(() => {
    lastInteractionTime.current = Date.now();
    pauseAutoplay();
  }, [pauseAutoplay]);

  useEffect(() => {
    if (data.length === 0) return;

    let idleTimeout: NodeJS.Timeout | null = null;
    let autoplayInterval: NodeJS.Timeout | null = null;

    const startAutoplay = () => {
      autoplayInterval = setInterval(() => {
        setActiveId(prev => {
          const currentIndex = data.findIndex(s => s.id === prev);
          const nextIndex = (currentIndex + 1) % data.length;
          return data[nextIndex].id || "";
        });
      }, 3000);
    };

    const resetAutoplay = () => {
      if (autoplayInterval) clearInterval(autoplayInterval);
      if (idleTimeout) clearTimeout(idleTimeout);
      idleTimeout = setTimeout(startAutoplay, 5000);
    };

    if (!isPaused) {
      resetAutoplay();
    } else {
      if (autoplayInterval) clearInterval(autoplayInterval);
      if (idleTimeout) clearTimeout(idleTimeout);
    }

    return () => {
      if (autoplayInterval) clearInterval(autoplayInterval);
      if (idleTimeout) clearTimeout(idleTimeout);
    };
  }, [data, isPaused]);

  const activeIndex = data.findIndex((s) => s.id === activeId);
  const active = data[activeIndex] || data[0];

  if (!active) return null;

  const getPosStyles = (i: number, total: number) => {
    const angle = -Math.PI / 2 + (i / total) * 2 * Math.PI;
    const rPct = 37;
    return {
      left: `calc(50% + ${Math.cos(angle) * rPct}%)`,
      top: `calc(50% + ${Math.sin(angle) * rPct}%)`,
      transform: 'translate(-50%, -55%)'
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
        <div className="relative w-[380px] h-[380px] sm:w-[450px] sm:h-[450px] lg:w-[500px] lg:h-[500px] flex-shrink-0">
          {/* Ambient glow — radial gradient, zero GPU cost */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(var(--color-accent-gold-rgb), 0.06) 0%, transparent 70%)"
            }}
          />

          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            style={{ zIndex: 0 }}
          >
            <defs>
              <linearGradient id="line-active" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(var(--color-accent-gold-rgb),0)" />
                <stop offset="60%" stopColor="rgba(var(--color-accent-gold-rgb),0.7)" />
                <stop offset="100%" stopColor="rgba(var(--color-accent-gold-rgb),0.9)" />
              </linearGradient>
            </defs>

            {/* Decorative rings */}
            {[16.65, 27.75, 37].map((r, i) => (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke="currentColor"
                className="text-accent-gold/15"
                strokeWidth="0.25"
              />
            ))}

            {/* Connector lines — plain SVG, CSS transition for opacity */}
            {data.map((svc, i) => {
              const pos = getSvgPos(i, data.length);
              const isActive = svc.id === activeId;
              return (
                <line
                  key={`line-${svc.id}`}
                  x1="50"
                  y1="50"
                  x2={pos.x}
                  y2={pos.y}
                  stroke={isActive ? "url(#line-active)" : "currentColor"}
                  strokeWidth={isActive ? 0.3 : 0.2}
                  strokeDasharray={isActive ? "none" : "1 1.5"}
                  className={`transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-60 text-accent-gold/25"}`}
                />
              );
            })}
          </svg>

          {/* Center Logo — no backdrop-blur, no spinning rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 lg:w-44 lg:h-44 rounded-full bg-[#F5F1EB] border border-accent-gold/15 flex items-center justify-center shadow-[0_4px_40px_rgba(0,0,0,0.1)] z-10">
            <Image src={logoUrl} alt="Upmark" width={100} height={100} className="w-20 lg:w-28 h-auto z-10 object-contain" />
          </div>

          {/* Nodes — plain buttons with CSS hover */}
          {data.map((svc, i) => {
            const isActive = svc.id === activeId;
            const IconComponent = (svc.icon_name && (LucideIcons as any)[svc.icon_name]) || LucideIcons.Check;

            return (
              <div
                key={svc.id}
                className="absolute z-20 flex flex-col items-center"
                style={getPosStyles(i, data.length)}
                onMouseEnter={() => { handleInteraction(); setActiveId(svc.id || ""); }}
                onClick={() => { handleInteraction(); setActiveId(svc.id || ""); }}
              >
                <button
                  className={`w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer focus-visible:outline-none hover:scale-110 active:scale-95
                    ${isActive
                      ? "bg-[#1a1a1a] border-accent-gold shadow-[0_0_0_4px_rgba(var(--color-accent-gold-rgb),0.2),0_0_28px_rgba(0,0,0,0.3)]"
                      : "bg-accent-gold border-accent-gold/30 shadow-[0_2px_12px_rgba(var(--color-accent-gold-rgb),0.15)] hover:border-accent-gold hover:shadow-glow-gold"
                    }`}
                  aria-label={svc.title}
                  aria-pressed={isActive}
                >
                  {svc.icon_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={svc.icon_url}
                      alt={svc.title}
                      className={`w-7 h-7 lg:w-10 lg:h-10 object-contain transition-all duration-300 ${isActive ? "opacity-100 grayscale" : "opacity-70 grayscale"}`}
                    />
                  ) : (
                    <IconComponent
                      size={24}
                      className={`transition-colors duration-300 ${isActive ? "text-accent-gold" : "text-black/70"}`}
                    />
                  )}
                </button>
                <span className={`mt-2 text-[8px] lg:text-[10px] font-bold tracking-wider uppercase text-center leading-tight transition-colors duration-300 ${isActive ? "text-[#1a1a1a]" : "text-black/50"}`}>
                  {svc.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Info panel — plain div with CSS opacity transition */}
        <div className="flex-1 w-full lg:w-auto min-w-0">
          <div
            key={activeId}
            className="relative rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 sm:p-8 lg:p-10 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] animate-[fadeInUp_0.3s_ease-out]"
          >
            {/* Gold top accent */}
            <div className="absolute top-0 left-6 right-6 lg:left-8 lg:right-8 h-[1px] bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />

            {/* Decorative number */}
            <span className="absolute top-2 right-4 text-[6rem] lg:text-[8rem] font-black text-accent-gold/[0.08] leading-none select-none pointer-events-none font-heading">
              {String(activeIndex + 1).padStart(2, '0')}
            </span>

            <div className="relative z-10">
              <span className="text-accent-gold font-bold tracking-[0.2em] uppercase text-[10px] lg:text-xs border border-accent-gold/30 px-3 py-1 rounded-full bg-accent-gold/10 mb-4 lg:mb-5 inline-block">
                {active.subtitle}
              </span>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-heading mb-4 lg:mb-5 leading-tight">
                {active.title}
              </h3>

              <p className="text-white/60 font-light text-sm sm:text-base lg:text-[17px] leading-relaxed mb-6 lg:mb-7">
                {active.description}
              </p>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs lg:text-sm font-semibold text-white/50 hover:text-accent-gold transition-colors duration-200 group"
              >
                <span>Discuss this service</span>
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </Link>
            </div>
          </div>

          {/* Mobile arrow navigation */}
          <div className="flex items-center justify-center gap-4 mt-5 lg:hidden">
            <button
              onClick={() => {
                handleInteraction();
                const prevIndex = activeIndex > 0 ? activeIndex - 1 : data.length - 1;
                setActiveId(data[prevIndex].id || "");
              }}
              className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center hover:bg-black/10 transition-colors"
              aria-label="Previous service"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="text-sm text-black/50 font-medium">
              {activeIndex + 1} / {data.length}
            </span>
            <button
              onClick={() => {
                handleInteraction();
                const nextIndex = (activeIndex + 1) % data.length;
                setActiveId(data[nextIndex].id || "");
              }}
              className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center hover:bg-black/10 transition-colors"
              aria-label="Next service"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Service dots navigation — desktop only */}
          <div className="hidden lg:flex items-center justify-start gap-2 mt-5 lg:pl-1">
            {data.map((svc) => (
              <button
                key={svc.id}
                onClick={() => { handleInteraction(); setActiveId(svc.id || ""); }}
                className={`rounded-full transition-[width] duration-300 focus-visible:outline-none ${svc.id === activeId
                  ? "w-6 h-2 bg-accent-gold"
                  : "w-2 h-2 bg-black/20 hover:bg-black/40"
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
