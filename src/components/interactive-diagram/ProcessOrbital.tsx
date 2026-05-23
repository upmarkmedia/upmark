"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROCESS_DATA } from "./services-data";

export function ProcessOrbital() {
  const [activeNode, setActiveNode] = useState(PROCESS_DATA[0].id);

  const activeData = PROCESS_DATA.find((p) => p.id === activeNode) || PROCESS_DATA[0];

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
      {/* Orbital Layout */}
      <div className="flex flex-col items-center justify-center py-6 md:py-10 overflow-visible">
        
        <div className="text-center mb-8 md:mb-12">
          <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs mb-4 flex items-center justify-center gap-4">
            <span className="w-8 h-[1px] bg-accent-blue"></span>
            HOW WE WORK
            <span className="w-8 h-[1px] bg-accent-blue"></span>
          </span>
          <h2 className="text-3xl md:text-5xl font-black font-heading text-white">
            Our <span className="text-accent-gold">6-Step Process</span>
          </h2>
        </div>

        <div className="relative w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] lg:w-[700px] lg:h-[700px] flex items-center justify-center mt-2 md:mt-6">
          
          {/* Orbital rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[62%] h-[62%] rounded-full border border-white/5" />
            <div className="absolute w-[74%] h-[74%] rounded-full border border-white/5 border-dashed animate-[spin_60s_linear_infinite]" />
          </div>

          {/* SVG Connection Paths (Center to Nodes) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            {PROCESS_DATA.map((item, i) => {
              const angle = (i * (360 / PROCESS_DATA.length) - 90) * (Math.PI / 180);
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
                  stroke={isActive ? "rgba(212, 175, 55, 0.5)" : "rgba(255, 255, 255, 0.05)"}
                  strokeWidth={isActive ? 0.3 : 0.15}
                  className="transition-colors duration-500"
                />
              );
            })}
            
            {/* Circular progress highlight representing flow */}
            <motion.circle
              cx="50"
              cy="50"
              r="32"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.15"
            />
          </svg>

          {/* Central Information Core */}
          <div className="absolute z-10 w-[45%] h-[45%] rounded-full border border-white/10 bg-[#0a0f1c]/90 backdrop-blur-xl flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.1)] p-4 sm:p-8 text-center overflow-hidden">
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
                <span className="text-accent-gold font-black text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2 opacity-50 font-heading">
                  {activeData.num}
                </span>
                <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white mb-1 sm:mb-3">
                  {activeData.title}
                </h3>
                <p className="hidden md:block text-xs lg:text-sm text-muted-text font-light leading-relaxed px-2">
                  {activeData.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Process Nodes */}
          {PROCESS_DATA.map((item, i) => {
            const isActive = activeNode === item.id;

            return (
              <div
                key={item.id}
                className="absolute z-20"
                style={getPositionStyles(i, PROCESS_DATA.length)}
                onMouseEnter={() => setActiveNode(item.id)}
                onClick={() => setActiveNode(item.id)}
              >
                <motion.button
                  className={`w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border flex items-center justify-center transition-colors duration-300 relative group
                    ${isActive 
                      ? "bg-accent-gold/10 border-accent-gold shadow-[0_0_30px_rgba(212,175,55,0.3)]" 
                      : "bg-[#0a0f1c] border-white/10 hover:border-white/30"}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className={`font-bold font-heading text-sm sm:text-base lg:text-lg ${isActive ? "text-accent-gold" : "text-white/50"}`}>
                    {item.num}
                  </span>
                  
                  {/* Floating Title (always visible, or visible on hover/active) */}
                  <div className={`absolute top-full mt-2 sm:mt-4 whitespace-nowrap text-[9px] sm:text-xs lg:text-sm font-bold tracking-wider uppercase transition-[opacity,transform] duration-300
                    ${isActive ? "text-white opacity-100 translate-y-0" : "text-white/30 opacity-50 group-hover:opacity-100 -translate-y-1"}`}>
                    {item.title}
                  </div>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="processActiveDot"
                      className="absolute inset-0 border-2 border-accent-gold rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1.2 }}
                      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                    />
                  )}
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* Mobile Description Box (Hidden on Desktop) */}
        <div className="md:hidden mt-12 px-6 max-w-sm text-center min-h-[120px]">
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

    </div>
  );
}
