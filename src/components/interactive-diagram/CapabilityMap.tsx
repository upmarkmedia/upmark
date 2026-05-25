"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CAPABILITIES_DATA } from "./services-data";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CapabilityMap() {
  const [activeId, setActiveId] = useState(CAPABILITIES_DATA[0].id);

  const activeIndex = CAPABILITIES_DATA.findIndex((s) => s.id === activeId);
  const active = CAPABILITIES_DATA[activeIndex];

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
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.2"
              />
            ))}

            {/* Connector lines */}
            {CAPABILITIES_DATA.map((svc, i) => {
              const pos = getSvgPos(i, CAPABILITIES_DATA.length);
              const isActive = svc.id === activeId;
              return (
                <motion.line
                  key={`line-${svc.id}`}
                  x1="50"
                  y1="50"
                  x2={pos.x}
                  y2={pos.y}
                  stroke={isActive ? "url(#line-active)" : "rgba(255,255,255,0.07)"}
                  strokeWidth={isActive ? 0.3 : 0.2}
                  strokeDasharray={isActive ? "none" : "1 1.5"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="transition-colors duration-500"
                />
              );
            })}

            {/* Active node glow pulse */}
            <motion.circle
              key={`pulse-${activeId}`}
              cx={getSvgPos(activeIndex, CAPABILITIES_DATA.length).x}
              cy={getSvgPos(activeIndex, CAPABILITIES_DATA.length).y}
              r="8"
              fill="rgba(59,130,246,0.12)"
              animate={{ r: [8, 12, 8], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>

          {/* Center hub */}
          <div className="absolute z-10 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-[#080d17]/90 border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.1)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 rounded-full border border-accent-blue/20 animate-[spin_14s_linear_infinite]"
              style={{ borderTopColor: "transparent", borderRightColor: "transparent" }} />
            <Image src="/upmark-wordmark.png" alt="Upmark" width={60} height={60} className="w-10 lg:w-14 h-auto z-10" />
          </div>

          {/* Nodes */}
          {CAPABILITIES_DATA.map((svc, i) => {
            const isActive = svc.id === activeId;
            const Icon = svc.icon;

            return (
              <div
                key={svc.id}
                className="absolute z-20"
                style={getPosStyles(i, CAPABILITIES_DATA.length)}
                onMouseEnter={() => setActiveId(svc.id)}
                onClick={() => setActiveId(svc.id)}
              >
                <motion.button
                  className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border flex flex-col items-center justify-center gap-0.5 transition-colors duration-300 cursor-pointer focus-visible:outline-none
                    ${isActive
                      ? "bg-[#0d1525] border-accent-blue shadow-[0_0_28px_rgba(59,130,246,0.45)]"
                      : "bg-[#080d17] border-white/10 hover:border-white/30 hover:bg-white/5"
                    }`}
                  whileHover={{ scale: 1.14 }}
                  whileTap={{ scale: 0.94 }}
                  aria-label={svc.title}
                  aria-pressed={isActive}
                >
                  <Icon
                    size={14}
                    className={`lg:w-4 lg:h-4 transition-colors duration-300 ${isActive ? "text-accent-blue" : "text-white/35"}`}
                  />
                  <span
                    className={`text-[7px] lg:text-[9px] font-bold tracking-wider uppercase text-center leading-tight px-1 transition-colors duration-300 ${
                      isActive ? "text-white" : "text-white/35"
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
              className="relative rounded-2xl lg:rounded-3xl border border-white/10 bg-secondary-surface/40 backdrop-blur-xl p-6 sm:p-8 lg:p-10 overflow-hidden shadow-2xl"
            >
              {/* Glass sheen */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
              {/* Blue top accent */}
              <div className="absolute top-0 left-6 right-6 lg:left-8 lg:right-8 h-[1px] bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent" />

              {/* Decorative number */}
              <span className="absolute top-2 right-4 text-[6rem] lg:text-[8rem] font-black text-accent-blue/[0.05] leading-none select-none pointer-events-none font-heading">
                {active.number}
              </span>

              <div className="relative z-10">
                <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-[10px] lg:text-xs border border-accent-blue/30 px-3 py-1 rounded-full bg-accent-blue/5 mb-4 lg:mb-5 inline-block">
                  {active.subtitle}
                </span>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-heading mb-4 lg:mb-5 leading-tight">
                  {active.title}
                </h3>

                <p className="text-muted-text font-light text-sm sm:text-base lg:text-[17px] leading-relaxed mb-6 lg:mb-7">
                  {active.description}
                </p>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-xs lg:text-sm font-semibold text-white/65 hover:text-accent-blue transition-colors duration-200 group"
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
            {CAPABILITIES_DATA.map((svc) => (
              <button
                key={svc.id}
                onClick={() => setActiveId(svc.id)}
                className={`rounded-full transition-[width] duration-300 focus-visible:outline-none ${
                  svc.id === activeId
                    ? "w-6 h-2 bg-accent-blue"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
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
