"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingCTA } from "@/components/layout/FloatingCTA";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { IdleProvider } from "@/contexts/IdleContext";
import type { ReactNode } from "react";

export function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin pages render with their own layout — no Navbar or CTA
    return (
      <>
        <CustomCursor />
        {children}
      </>
    );
  }

  return (
    <IdleProvider>
      <CustomCursor />
      <Navbar />
      <main className="flex-grow">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <FloatingCTA />
    </IdleProvider>
  );
}
