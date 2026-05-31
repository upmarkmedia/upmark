"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getSiteSettings } from "@/lib/firestore";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  LogOut,
  Menu,
  X,
  MessageSquareQuote,
  ChevronDown,
  Home,
  PenTool,
  Mail,
  Globe,
  Info,
} from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";

const pageNavItems = [
  { href: "/admin/pages/home", label: "Home", icon: Home },
  { href: "/admin/pages/about", label: "About", icon: Info },
  { href: "/admin/pages/work", label: "Work", icon: PenTool },
  { href: "/admin/pages/services", label: "Services", icon: Briefcase },
  { href: "/admin/pages/case-studies", label: "Case Studies", icon: FileText },
  { href: "/admin/pages/contact", label: "Contact", icon: Mail },
  { href: "/admin/pages/settings", label: "Global Settings", icon: Globe },
];

const dataNavItems = [
  { href: "/admin/leads", label: "Leads", icon: Users, exact: false },
];

let _setSidebarOpen: (v: boolean) => void = () => {};

function PagesNavGroup() {
  const pathname = usePathname();
  const isOnPages = pathname.startsWith("/admin/pages");
  const currentPage = pathname.split("/").pop() || "";
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-[background-color,color,border-color] duration-200 border ${
          isOnPages
            ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20"
            : "text-muted-text hover:bg-primary-text/5 hover:text-primary-text border-transparent"
        }`}
      >
        <Globe size={18} />
        <span className="flex-1 text-left">Pages</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
        />
      </button>
      {open && (
        <div className="ml-3 mt-1 space-y-0.5 border-l border-primary-text/10 pl-2">
          {pageNavItems.map((page) => {
            const pageSlug = page.href.split("/").pop();
            const active = isOnPages && currentPage === pageSlug;
            return (
              <Link
                key={page.href}
                href={page.href}
                onClick={() => _setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-[background-color,color,border-color] duration-200 border ${
                  active
                    ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20"
                    : "text-muted-text hover:bg-primary-text/5 hover:text-primary-text border-transparent"
                }`}
              >
                <page.icon size={15} />
                {page.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/upmark-wordmark.png");
  _setSidebarOpen = setSidebarOpen;

  useEffect(() => {
    getSiteSettings()
      .then(settings => {
        if (settings?.theme === "editorial") {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("theme-editorial");
          if (settings?.editorialLogoUrl) setLogoUrl(settings.editorialLogoUrl);
        } else {
          document.documentElement.classList.remove("theme-editorial");
          document.documentElement.classList.add("dark");
          if (settings?.globalLogoUrl) setLogoUrl(settings.globalLogoUrl);
        }
      })
      .catch(console.error);
  }, []);

  function isActive(href: string, exact: boolean) {
    if (href === "/admin") return exact ? pathname === href : pathname.startsWith(href);
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-primary-bg flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-secondary-surface border-r border-primary-text/5
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-primary-text/5">
          <Link href="/admin">
            <Image src={logoUrl} alt="Upmark" width={160} height={160} className="h-11 w-auto object-contain" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted-text hover:text-primary-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <Link
            href="/admin"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-[background-color,color,border-color] duration-200 border ${
              pathname === "/admin"
                ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20"
                : "text-muted-text hover:bg-primary-text/5 hover:text-primary-text border-transparent"
            }`}
          >
            <LayoutDashboard size={18} />
            Overview
          </Link>

          {/* Pages nav group */}
          <PagesNavGroup />

          {/* Section divider */}
          <div className="pt-4 pb-1 px-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-text/50">Data</p>
          </div>

          {dataNavItems.map((item) => {
            const active = isActive(item.href, item.exact!);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-[background-color,color,border-color] duration-200 border ${
                  active
                    ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20"
                    : "text-muted-text hover:bg-primary-text/5 hover:text-primary-text border-transparent"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="px-3 py-4 border-t border-primary-text/5">
          <div className="px-4 py-2 mb-2">
            <p className="text-xs text-muted-text truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-[background-color,color,border-color] duration-200 border border-transparent hover:border-red-500/20"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center h-16 px-4 bg-secondary-surface border-b border-primary-text/5 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-text hover:text-primary-text transition-colors"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4">
            <Image src={logoUrl} alt="Upmark" width={140} height={140} className="h-10 w-auto object-contain" />
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
