"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface ProcessStep {
  id: number;
  title: string;
  description: string;
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

const stepIcons: Record<number, string> = {
  1: "🔍",
  2: "🧭",
  3: "🎬",
  4: "🚀",
  5: "⚡",
  6: "📈",
};

export const ProcessTimeline = ({ steps }: ProcessTimelineProps) => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start w-full">
      {/* Left: Interactive Steps */}
      <div className="lg:w-7/12 w-full relative">
        {/* Vertical connector line */}
        <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-primary-text/10 hidden md:block" />

        {/* Animated progress fill */}
        <motion.div
          className="absolute left-5 top-0 w-[2px] bg-gradient-to-b from-accent-blue to-accent-blue/20 hidden md:block origin-top"
          animate={{
            height: `${((activeStep + 1) / steps.length) * 100}%`,
          }}
          transition={{ duration: 0.4, ease: [0.25, 0.4, 0, 1] }}
        />

        <div className="flex flex-col gap-3">
          {steps.map((step, index) => {
            const isActive = activeStep === index;

            return (
              <ScrollReveal key={step.id} delay={index * 0.05}>
                <button
                  onClick={() => setActiveStep(index)}
                  className={`group w-full text-left flex items-start gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-5 rounded-2xl transition-colors duration-300 relative ${
                    isActive
                      ? "bg-accent-blue/8 border border-accent-blue/20"
                      : "bg-transparent border border-transparent hover:bg-primary-text/[0.02] hover:border-primary-text/5"
                  }`}
                >
                  {/* Step Number Circle */}
                  <div
                    className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-heading font-black text-sm transition-colors duration-300 ${
                      isActive
                        ? "bg-accent-blue text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                        : "bg-secondary-surface border border-primary-text/10 text-primary-text/40 group-hover:text-primary-text/70 group-hover:border-primary-text/20"
                    }`}
                  >
                    {step.id}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-lg md:text-xl font-bold font-heading transition-colors duration-200 ${
                        isActive ? "text-primary-text" : "text-primary-text/60 group-hover:text-primary-text/80"
                      }`}
                    >
                      {step.title}
                    </h3>

                    <AnimatePresence>
                      {isActive && (
                        <motion.p
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.4, 0, 1] }}
                          className="text-muted-text text-sm md:text-base font-light leading-relaxed overflow-hidden"
                        >
                          {step.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="active-step-bar"
                      className="absolute right-0 top-4 bottom-4 w-[3px] rounded-full bg-accent-blue"
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  )}
                </button>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Right: Dynamic Detail Panel */}
      <div className="lg:w-5/12 w-full lg:sticky lg:top-32">
        <div className="relative w-full aspect-[4/3] sm:aspect-[4/5] rounded-[1.5rem] sm:rounded-[2rem] border border-primary-text/10 bg-secondary-surface/30 overflow-hidden">
          {/* Background glow — reduced blur radii */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-blue/10 rounded-full blur-[50px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-gold/5 rounded-full blur-[50px] pointer-events-none" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: [0.25, 0.4, 0, 1] }}
                className="text-center flex flex-col items-center gap-6"
              >
                {/* Large Step Icon */}
                <div className="text-4xl sm:text-6xl md:text-7xl">
                  {stepIcons[steps[activeStep]?.id] || "📌"}
                </div>

                {/* Step Number */}
                <div className="text-5xl sm:text-7xl md:text-8xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-b from-primary-text/15 to-primary-text/5">
                  0{steps[activeStep]?.id}
                </div>

                {/* Step Title */}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-primary-text">
                  {steps[activeStep]?.title}
                </h3>

                {/* Step Description */}
                <p className="text-muted-text text-sm md:text-base font-light leading-relaxed max-w-xs">
                  {steps[activeStep]?.description}
                </p>

                {/* Progress Indicator */}
                <div className="flex gap-2 mt-4">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={`h-1.5 rounded-full transition-[width] duration-300 ${
                        i === activeStep
                          ? "w-8 bg-accent-blue"
                          : i < activeStep
                          ? "w-3 bg-accent-blue/40"
                          : "w-3 bg-primary-text/10"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
