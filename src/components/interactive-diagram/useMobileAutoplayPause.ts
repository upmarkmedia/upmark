"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const MOBILE_BREAKPOINT = 1024; // lg breakpoint
const PAUSE_DURATION = 30000; // 30 seconds

export function useMobileAutoplayPause() {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    setIsMobile(mql.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const pauseAutoplay = useCallback(() => {
    if (!isMobile) return;

    setIsPaused(true);

    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }

    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
      pauseTimerRef.current = null;
    }, PAUSE_DURATION);
  }, [isMobile]);

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, []);

  return { isMobile, isPaused, pauseAutoplay };
}
