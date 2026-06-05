"use client";

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

interface IdleContextValue {
  isIdle: boolean;
  isHeroVisible: boolean;
}

const IdleContext = createContext<IdleContextValue>({ isIdle: false, isHeroVisible: true });

const IDLE_TIMEOUT = 5_000;

export function IdleProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isIdle, setIsIdle] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isHome) {
      setIsIdle(false);
      setIsHeroVisible(true);
      return;
    }

    const resetTimer = () => {
      if (idleRef.current) {
        idleRef.current = false;
        setIsIdle(false);
      }
      clearTimeout(timerRef.current ?? undefined);
      timerRef.current = setTimeout(() => {
        idleRef.current = true;
        setIsIdle(true);
      }, IDLE_TIMEOUT);
    };

    const handleScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.85;
      setIsHeroVisible(!pastHero);
      if (!pastHero) resetTimer();
    };

    const events = ["mousemove", "touchstart", "touchmove", "keydown", "click"] as const;
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    window.addEventListener("scroll", handleScroll, { passive: true });

    resetTimer();

    return () => {
      clearTimeout(timerRef.current ?? undefined);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome]);

  return (
    <IdleContext.Provider value={{ isIdle, isHeroVisible }}>
      {children}
    </IdleContext.Provider>
  );
}

export function useIdle() {
  return useContext(IdleContext);
}
