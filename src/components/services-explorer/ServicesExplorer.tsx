"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

interface Service {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

const SERVICES: Service[] = [
  {
    id: "content-engine",
    number: "01",
    title: "Content Engine",
    subtitle: "Creative Studio",
    description:
      "Great content doesn't happen in a vacuum — it happens when the people making it understand the strategy behind it. Our in-house production team works across every format: short-form reels, brand films, product photography, social graphics and editorial content. Working from ideation through production and post to the final product, with cinema-grade equipment, kept entirely in-house. Because when production sits inside the same team as strategy and media, what gets made is built to perform — not just to look good.",
  },
  {
    id: "marketing-strategy",
    number: "02",
    title: "Marketing Strategy",
    subtitle: "Foundation",
    description:
      "Strategy isn't a document we hand you at the start and revisit at the end. It's the thinking that runs through everything we make. We define your positioning, map your audience, decode the competitive landscape, and build a channel roadmap that reflects how your customers actually behave — not how we wish they did. Because our strategists work alongside the people who will execute the plan, what you get isn't a presentation. It's a blueprint built to be used.",
  },
  {
    id: "production-post",
    number: "03",
    title: "Production & Post",
    subtitle: "Execution",
    description:
      "Some briefs don't need a full creative team — they need sharp hands behind the camera and in the edit suite. When you come to us with a script, a storyboard, or even just a shoot date, we take it from there. We handle end-to-end production and post-production: cinematography, lighting, direction on the day, and everything in the edit — colour, sound, motion graphics, delivery. No ideation, no strategy layer, no overhead you don't need. Just high-quality execution, with the same cinema-grade standards we bring to every project we touch.",
  },
  {
    id: "packaging-design",
    number: "04",
    title: "Packaging Design",
    subtitle: "Brand Identity",
    description:
      "Your packaging is your first salesperson — and in a quick-commerce world, it has less than a second to earn its place in a cart. We design packaging that works: visually distinctive, shelf-ready, and built around what your customer needs to understand and feel at the point of decision. From full product-line redesigns to seasonal gifting editions, we handle everything from structural concept through to print-ready artwork. Because good packaging isn't just about looking premium — it's about communicating the right thing, to the right person, at exactly the right moment.",
  },
  {
    id: "performance-marketing",
    number: "05",
    title: "Performance Marketing",
    subtitle: "Paid Media",
    description:
      "Paid media only performs when the strategy is sound, the creative is sharp, and the targeting is precise. We run campaigns across Meta, Google, LinkedIn and programmatic networks — but what sets our work apart is that our media buyers and our creative team are the same team. We don't wait on a brief. When performance data tells a story, we respond in real time: shifting budgets, refreshing creatives, and doubling down on what's converting.",
  },
  {
    id: "social-media",
    number: "06",
    title: "Social Media Management",
    subtitle: "Always On",
    description:
      "Showing up on socials consistently is the floor, not the ceiling. We manage your presence end-to-end — content calendars, community engagement, influencer partnerships and real-time activations — but we build it all on a strategic foundation. Every format, every platform, every moment of engagement is considered in context of the larger brand you're building. Systematic in execution. Intentional in voice.",
  },
  {
    id: "seo-lead-gen",
    number: "07",
    title: "SEO & Lead Generation",
    subtitle: "Organic Growth",
    description:
      "Paid media gets you in the room. Organic growth keeps you there. We build SEO strategies that go beyond rankings — combining technical audits, content architecture and backlink development into a full-funnel system that compounds over time. Because our SEO team works alongside our content and strategy teams, what we produce isn't just optimised for search. It's built to convert.",
  },
];

const INTERVAL = 6000;

const contentVariants: Variants = {
  enter: { opacity: 0, y: 28, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, y: -18, filter: "blur(4px)", transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } },
};

const staggerVariants: Variants = {
  enter: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const lineVariant: Variants = {
  enter: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0 },
};

export function ServicesExplorer() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const startRef = useRef(Date.now());
  const pausedRef = useRef(false);

  pausedRef.current = paused;

  const goTo = useCallback((index: number, manual = false) => {
    setActive(index);
    setProgress(0);
    startRef.current = Date.now();
    if (manual) setPaused(true);
  }, []);

  // Auto-advance + progress ticker
  useEffect(() => {
    const tick = setInterval(() => {
      if (pausedRef.current) return;
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / INTERVAL) * 100, 100);
      setProgress(pct);
      if (elapsed >= INTERVAL) {
        setActive((prev) => {
          const next = (prev + 1) % SERVICES.length;
          return next;
        });
        setProgress(0);
        startRef.current = Date.now();
      }
    }, 40);
    return () => clearInterval(tick);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goTo((active + 1) % SERVICES.length, true);
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goTo((active - 1 + SERVICES.length) % SERVICES.length, true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  const current = SERVICES[active];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Desktop layout ── */}
      <div className="hidden md:flex gap-0 min-h-[560px] relative">

        {/* Left: service list */}
        <nav className="w-64 lg:w-72 flex-shrink-0 flex flex-col justify-center gap-0 relative">
          {/* Vertical connector line */}
          <div className="absolute left-0 top-6 bottom-6 w-[1px] bg-white/8" />

          {SERVICES.map((svc, i) => {
            const isActive = active === i;
            return (
              <button
                key={svc.id}
                onClick={() => goTo(i, true)}
                className="group relative flex items-center gap-4 py-3.5 pl-5 pr-4 text-left focus-visible:outline-none"
                aria-current={isActive ? "true" : undefined}
              >
                {/* Left rail indicator */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] overflow-hidden rounded-full">
                  <div
                    className={`absolute inset-0 transition-colors duration-300 ${
                      isActive ? "bg-accent-blue" : "bg-transparent"
                    }`}
                  />
                  {isActive && !paused && (
                    <motion.div
                      className="absolute top-0 left-0 right-0 bg-white/70"
                      style={{ height: `${progress}%` }}
                    />
                  )}
                </div>

                <span
                  className={`font-mono text-[11px] font-bold tracking-widest transition-colors duration-300 w-6 flex-shrink-0 ${
                    isActive ? "text-accent-blue" : "text-white/25 group-hover:text-white/40"
                  }`}
                >
                  {svc.number}
                </span>

                <span
                  className={`text-sm lg:text-base font-medium font-heading leading-snug transition-all duration-300 ${
                    isActive
                      ? "text-white"
                      : "text-white/40 group-hover:text-white/65"
                  }`}
                >
                  {svc.title}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right: animated content panel */}
        <div className="flex-1 pl-12 lg:pl-20 relative overflow-hidden flex items-center">
          {/* Decorative large number */}
          <AnimatePresence mode="wait">
            <motion.span
              key={`num-${active}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
              exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.25 } }}
              className="absolute -top-4 right-0 text-[11rem] lg:text-[14rem] font-black text-accent-blue/[0.04] leading-none select-none pointer-events-none font-heading"
              aria-hidden
            >
              {current.number}
            </motion.span>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              variants={contentVariants}
              initial="enter"
              animate="visible"
              exit="exit"
              className="relative z-10 max-w-2xl"
            >
              <motion.div variants={staggerVariants} initial="enter" animate="visible">
                <motion.div variants={lineVariant} className="mb-5">
                  <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs border border-accent-blue/30 px-3 py-1 rounded-full bg-accent-blue/5">
                    {current.subtitle}
                  </span>
                </motion.div>

                <motion.h3
                  variants={lineVariant}
                  className="text-4xl lg:text-5xl xl:text-6xl font-black font-heading text-white mb-6 leading-[1.05] tracking-tight"
                >
                  {current.title}
                </motion.h3>

                <motion.p
                  variants={lineVariant}
                  className="text-base lg:text-lg text-muted-text leading-relaxed font-light mb-8"
                >
                  {current.description}
                </motion.p>

                <motion.div variants={lineVariant}>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-accent-blue transition-colors duration-200 group"
                  >
                    <span>Discuss this service</span>
                    <ArrowRight
                      size={15}
                      className="group-hover:translate-x-1 transition-transform duration-200"
                    />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile layout: accordion ── */}
      <div className="flex md:hidden flex-col divide-y divide-white/8 border border-white/10 rounded-2xl overflow-hidden">
        {SERVICES.map((svc, i) => {
          const isActive = active === i;
          return (
            <div key={svc.id}>
              <button
                onClick={() => goTo(i, true)}
                className={`w-full flex items-center justify-between gap-3 px-5 py-4 text-left transition-colors duration-200 ${
                  isActive ? "bg-accent-blue/10" : "bg-transparent hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`font-mono text-[10px] font-bold tracking-widest flex-shrink-0 ${
                      isActive ? "text-accent-blue" : "text-white/25"
                    }`}
                  >
                    {svc.number}
                  </span>
                  <span
                    className={`text-sm font-semibold font-heading truncate ${
                      isActive ? "text-white" : "text-white/55"
                    }`}
                  >
                    {svc.title}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isActive ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <Plus size={14} className={isActive ? "text-accent-blue" : "text-white/30"} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
                    exit={{ height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-6 pt-2">
                      <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-[10px] border border-accent-blue/30 px-2.5 py-0.5 rounded-full bg-accent-blue/5 mb-3 inline-block">
                        {svc.subtitle}
                      </span>
                      <p className="text-sm text-muted-text leading-relaxed mb-4">{svc.description}</p>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-accent-blue transition-colors group"
                      >
                        <span>Discuss this service</span>
                        <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
