"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight custom cursor that:
 * - Disables itself on touch/coarse-pointer devices
 * - Disables itself when prefers-reduced-motion is set
 * - Uses a single rAF loop with early-exit when idle
 * - Uses transform3d for GPU compositing (no layout thrash)
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const dotInnerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    // Disable when reduced motion is preferred
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setIsVisible(true);

    let mouseX = -100;
    let mouseY = -100;
    let circleX = -100;
    let circleY = -100;
    let idleFrames = 0;
    let isPageVisible = true;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      idleFrames = 0;
    };

    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) {
        idleFrames = 0;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    const style = document.createElement("style");
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);

    let animationFrameId: number;

    const render = () => {
      if (!isPageVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      idleFrames++;

      if (idleFrames < 120) {
        circleX += (mouseX - circleX) * 0.15;
        circleY += (mouseY - circleY) * 0.15;

        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
        }
        if (outerRef.current) {
          outerRef.current.style.transform = `translate3d(calc(${circleX}px - 50%), calc(${circleY}px - 50%), 0)`;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select, [role='button']")) {
        circleRef.current?.classList.add("scale-[1.5]", "bg-white/10", "border-white/30");
        dotInnerRef.current?.classList.add("opacity-50", "scale-75");
      }
    };
    
    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select, [role='button']")) {
        circleRef.current?.classList.remove("scale-[1.5]", "bg-white/10", "border-white/30");
        dotInnerRef.current?.classList.remove("opacity-50", "scale-75");
      }
    };

    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(animationFrameId);
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer ring – GPU-composited translation */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9998] will-change-transform"
        style={{ transform: "translate3d(-100px, -100px, 0)", contain: "layout style" }}
      >
        <div 
          ref={circleRef}
          className="w-full h-full border-2 border-muted-text/50 rounded-full transition-transform duration-200 ease-out"
        />
      </div>

      {/* Inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 pointer-events-none z-[9999] will-change-transform"
        style={{ transform: "translate3d(-100px, -100px, 0)", contain: "layout style" }}
      >
        <div
          ref={dotInnerRef}
          className="w-full h-full bg-white rounded-full transition-transform duration-200 ease-out"
        />
      </div>
    </>
  );
}
