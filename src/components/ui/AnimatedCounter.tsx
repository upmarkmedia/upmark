"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}

export const AnimatedCounter = ({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
  className = "",
  decimals = 0,
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const displayRef = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!isInView || animatedRef.current) return;
    animatedRef.current = true;

    const startTime = performance.now();
    const startVal = 0;
    const diff = target - startVal;

    const format = (v: number) => {
      if (decimals > 0) return v.toFixed(decimals);
      return Math.round(v).toString();
    };

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    let rafId: number;
    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = startVal + diff * eased;

      if (displayRef.current) {
        displayRef.current.textContent = `${prefix}${format(current)}${suffix}`;
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else if (displayRef.current) {
        displayRef.current.textContent = `${prefix}${format(target)}${suffix}`;
      }
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [isInView, target, duration, decimals, prefix, suffix]);

  return (
    <span
      ref={(node) => {
        ref.current = node;
        displayRef.current = node;
      }}
      className={className}
      style={{ opacity: isInView ? 1 : 0, transform: isInView ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.5s, transform 0.5s" }}
    >
      {prefix}0{suffix}
    </span>
  );
};
