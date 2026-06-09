"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Lightbulb, Target, PenTool, Rocket, Settings, TrendingUp } from "lucide-react";
import { PROCESS_DATA } from "./services-data";
import { getSiteSettings } from "@/lib/firestore";
import { useMobileAutoplayPause } from "./useMobileAutoplayPause";

const DEFAULT_ICONS = [Lightbulb, Target, PenTool, Rocket, Settings, TrendingUp];

interface ProcessOrbitalItem {
  title: string;
  description: string;
  imageUrl?: string;
}

interface ProcessDataItem {
  id: string;
  num: string;
  title: string;
  description: string;
  icon: React.ElementType;
  imageUrl?: string;
}

export function ProcessOrbital({ items }: { items?: ProcessOrbitalItem[] }) {
  const processData: ProcessDataItem[] = useMemo(() => {
    if (!items?.length) {
      return PROCESS_DATA.map((p, i) => ({ ...p, icon: DEFAULT_ICONS[i % DEFAULT_ICONS.length] }));
    }
    return items.map((item, i) => ({
      id: `step-${i + 1}`,
      num: String(i + 1).padStart(2, "0"),
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl || PROCESS_DATA[i % PROCESS_DATA.length].imageUrl,
      icon: DEFAULT_ICONS[i % DEFAULT_ICONS.length],
    }));
  }, [items]);

  const [activeNode, setActiveNode] = useState(processData[0].id);
  const hoverCountRef = useRef(1);
  const [hoverHistory, setHoverHistory] = useState<{ id: string; key: number }[]>([
    { id: processData[0].id, key: 0 }
  ]);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const [showServices, setShowServices] = useState(true);
  const [showWork, setShowWork] = useState(true);
  const { isMobile, isPaused, pauseAutoplay } = useMobileAutoplayPause();

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data?.visibility) {
        if (data.visibility.services !== undefined) setShowServices(data.visibility.services);
        if (data.visibility.work !== undefined) setShowWork(data.visibility.work);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    let idleTimeout: NodeJS.Timeout;
    let autoplayInterval: NodeJS.Timeout;

    const startAutoplay = () => {
      autoplayInterval = setInterval(() => {
        setActiveNode(prev => {
          const currentIndex = processData.findIndex(p => p.id === prev);
          const nextIndex = (currentIndex + 1) % processData.length;
          const nextId = processData[nextIndex].id;

          setHoverHistory((history) => {
            if (history[history.length - 1]?.id === nextId) return history;
            const newKey = hoverCountRef.current++;
            return [...history, { id: nextId, key: newKey }].slice(-3);
          });

          return nextId;
        });
      }, 3000);
    };

    if (!isPaused) {
      idleTimeout = setTimeout(() => {
        startAutoplay();
      }, 5000);
    }

    return () => {
      clearInterval(autoplayInterval);
      clearTimeout(idleTimeout);
    };
  }, [lastInteractionTime, processData, isPaused]);

  const handleNodeHover = useCallback((id: string) => {
    setLastInteractionTime(Date.now());
    pauseAutoplay();
    setActiveNode(id);
    setHoverHistory((prev) => {
      if (prev[prev.length - 1]?.id === id) return prev;
      const newKey = hoverCountRef.current++;
      return [...prev, { id, key: newKey }].slice(-3);
    });
  }, [pauseAutoplay]);

  const activeIndex = processData.findIndex((p) => p.id === activeNode);
  const activeData = processData[activeIndex !== -1 ? activeIndex : 0];

  const getPositionStyles = (index: number, total: number) => {
    // Start from top (-90 degrees)
    const angle = (index * (360 / total) - 90) * (Math.PI / 180);
    // Radius is ~32% of the container width to fit perfectly
    const xPct = Math.cos(angle) * 32;
    const yPct = Math.sin(angle) * 32;
    return {
      left: `calc(50% + ${xPct}%)`,
      top: `calc(50% + ${yPct}%)`,
      transform: "translate(-50%, -50%)",
    };
  };

  return (
    <div className="w-full relative">
      <div className="text-center mb-0">
        <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs mb-4 flex items-center justify-center gap-4">
          <span className="w-8 h-[1px] bg-accent-blue"></span>
          HOW WE WORK
          <span className="w-8 h-[1px] bg-accent-blue"></span>
        </span>
        <h2 className="text-3xl md:text-5xl font-black font-heading text-primary-text">
          Our <span className="text-accent-gold">6-Step Process</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-2 items-center pb-6 md:pb-10 -mt-8 lg:-mt-16">

        {/* Left Column: Orbital Layout */}
        <div className="flex flex-col items-center justify-center overflow-visible relative">
          <div className="relative w-[420px] h-[420px] sm:w-[500px] sm:h-[500px] lg:w-[700px] lg:h-[700px] flex items-center justify-center">

            {/* Orbital rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[62%] h-[62%] rounded-full border border-primary-text/15" />
              <div className="absolute w-[74%] h-[74%] rounded-full border border-primary-text/15 border-dashed animate-[spin_60s_linear_infinite]" />
            </div>

            {/* SVG Connection Paths (Center to Nodes) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
              {processData.map((item, i) => {
                const angle = (i * (360 / processData.length) - 90) * (Math.PI / 180);
                const xPct = Math.cos(angle) * 32;
                const yPct = Math.sin(angle) * 32;
                const isActive = activeNode === item.id;
                return (
                  <motion.line
                    key={`process-line-${item.id}`}
                    x1="50"
                    y1="50"
                    x2={50 + xPct}
                    y2={50 + yPct}
                    stroke={isActive ? "var(--color-accent-gold-var)" : "currentColor"}
                    strokeWidth={isActive ? 0.3 : 0.15}
                    className={`transition-colors duration-500 ${isActive ? "opacity-60" : "text-primary-text/10"}`}
                  />
                );
              })}

              {/* Background path for the nodes */}
              <circle
                cx="50"
                cy="50"
                r="32"
                fill="none"
                stroke="currentColor"
                className="text-primary-text/10"
                strokeWidth="0.15"
              />

              {/* Circular progress ring connecting the nodes */}
              <motion.circle
                cx="50"
                cy="50"
                r="32"
                fill="none"
                stroke="var(--color-accent-gold-var)"
                strokeWidth="0.4"
                className="opacity-80"
                style={{ filter: "drop-shadow(0 0 8px rgba(var(--color-accent-gold-rgb), 0.5))" }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: activeIndex / processData.length }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                transform="rotate(-90 50 50)"
              />
            </svg>

            {/* Central Information Core */}
            <div className="absolute z-10 w-[35%] h-[35%] rounded-full border border-primary-text/10 bg-secondary-surface/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 text-center overflow-hidden" style={{ boxShadow: "0 0 50px rgba(var(--color-accent-gold-rgb), 0.1)" }}>
              <div className="absolute inset-0 bg-gradient-to-b from-accent-gold/5 to-transparent pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center w-full h-full"
                >
                  <activeData.icon
                    className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-accent-gold mb-2 sm:mb-4 opacity-80"
                    strokeWidth={1.5}
                  />
                  <p className="hidden md:block text-xs lg:text-sm text-muted-text font-light leading-relaxed px-2">
                    {activeData.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Process Nodes */}
            {processData.map((item, i) => {
              const isActive = activeNode === item.id;

              return (
                <div
                  key={item.id}
                  className="absolute z-20"
                  style={getPositionStyles(i, processData.length)}
                  onMouseEnter={() => handleNodeHover(item.id)}
                  onClick={() => handleNodeHover(item.id)}
                >
                  <motion.button
                    className={`w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border flex items-center justify-center transition-colors duration-300 relative group
                    ${isActive
                        ? "bg-accent-gold/10 border-accent-gold shadow-glow-gold"
                        : "bg-secondary-surface border-primary-text/10 hover:border-primary-text/30"}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={`font-bold font-heading text-sm sm:text-base lg:text-lg ${isActive ? "text-accent-gold" : "text-primary-text/60"}`}>
                      {item.num}
                    </span>

                    {/* Floating Title (always visible, or visible on hover/active) */}
                    <div className={`absolute top-full mt-2 sm:mt-4 flex flex-col items-center text-[9px] sm:text-xs lg:text-sm font-bold tracking-wider uppercase transition-[opacity,transform] duration-300 rounded-lg px-2.5 py-1 bg-primary-bg/80 shadow-[0_2px_12px_rgba(0,0,0,0.15)]
                    ${isActive ? "text-primary-text opacity-100 translate-y-0" : "text-muted-text opacity-70 group-hover:opacity-100 -translate-y-1"}`}>
                      {item.title.split(" ").map((word, i) => (
                        <span key={i}>{word}</span>
                      ))}
                    </div>

                  </motion.button>
                </div>
              );
            })}
          </div>

          {/* Mobile Description Box (Hidden on Desktop) */}
          <div className="md:hidden mt-16 px-6 max-w-sm text-center min-h-[120px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-bold text-accent-gold mb-2">{activeData.title}</h3>
                <p className="text-sm text-muted-text leading-relaxed">{activeData.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Stacked Images and CTA */}
        <div className="flex flex-col justify-center items-center space-y-12 w-full max-w-lg mx-auto lg:mt-32">
          <div className="hidden md:block relative w-full aspect-square max-w-[350px] lg:max-w-[400px]">
            <AnimatePresence>
              {hoverHistory.map((historyItem, index) => {
                const nodeData = processData.find(p => p.id === historyItem.id);
                if (!nodeData) return null;

                const depth = hoverHistory.length - 1 - index;
                const rotations = [-4, 2, -2, 3];
                const rotation = rotations[historyItem.key % rotations.length];

                return (
                  <motion.div
                    key={historyItem.key}
                    initial={{ opacity: 0, scale: 0.9, x: -20, y: 20, rotate: rotation - 5 }}
                    animate={{
                      opacity: 1,
                      scale: 1 - (depth * 0.05),
                      x: depth * 25,
                      y: depth * -25,
                      rotate: rotation,
                      zIndex: hoverHistory.length - depth
                    }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)", transition: { duration: 0.3 } }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                    className="absolute inset-0 rounded-2xl overflow-hidden border border-primary-text/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-secondary-surface"
                  >
                    {nodeData.imageUrl && (
                      <Image
                        src={nodeData.imageUrl}
                        alt={nodeData.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    {depth > 0 && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-all duration-300" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-row items-center justify-center gap-3 w-full">
            {showServices && (
              <Link href="/services" className="group relative flex items-center justify-center gap-3 bg-accent-blue text-white px-5 py-3 rounded-lg font-semibold text-sm overflow-hidden transition-[transform] hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_-10px_rgba(59,130,246,0.6)]">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">Our Services</span>
              </Link>
            )}

            {showWork && (
              <Link href="/work" className="group flex items-center justify-center px-5 py-3 rounded-lg font-semibold text-sm text-primary-text bg-primary-text/5 border border-primary-text/10 hover:bg-primary-text/10 hover:border-primary-text/20 transition-colors duration-200">
                View our work
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
