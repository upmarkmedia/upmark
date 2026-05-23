"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
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
} from "lucide-react";
import { useState, type ReactNode } from "react";

const pageNavItems = [
  { href: "/admin/pages/home", label: "Home", icon: Home },
  { href: "/admin/pages/work", label: "Work", icon: PenTool },
  { href: "/admin/pages/services", label: "Services", icon: Briefcase },
  { href: "/admin/pages/case-studies", label: "Case Studies", icon: FileText },
  { href: "/admin/pages/contact", label: "Contact", icon: Mail },
];

const dataNavItems = [
  { href: "/admin/leads", label: "Leads", icon: Users, exact: false },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote, exact: false },
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
            ? "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20"
            : "text-[#94A3B8] hover:bg-white/5 hover:text-white border-transparent"
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
        <div className="ml-3 mt-1 space-y-0.5 border-l border-white/10 pl-2">
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
                    ? "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20"
                    : "text-[#94A3B8] hover:bg-white/5 hover:text-white border-transparent"
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
  _setSidebarOpen = setSidebarOpen;

  function isActive(href: string, exact: boolean) {
    if (href === "/admin") return exact ? pathname === href : pathname.startsWith(href);
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex">
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
          fixed inset-y-0 left-0 z-40 w-64 bg-[#1E293B] border-r border-white/5
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/5">
          <Link href="/admin" className="text-xl font-bold text-[#F8FAFC]">
            Up<span className="text-[#3B82F6]">mark</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#94A3B8] hover:text-white transition-colors"
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
                ? "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20"
                : "text-[#94A3B8] hover:bg-white/5 hover:text-white border-transparent"
            }`}
          >
            <LayoutDashboard size={18} />
            Overview
          </Link>

          {/* Pages nav group */}
          <PagesNavGroup />

          {/* Section divider */}
          <div className="pt-4 pb-1 px-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]/50">Data</p>
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
                    ? "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20"
                    : "text-[#94A3B8] hover:bg-white/5 hover:text-white border-transparent"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <div className="px-4 py-2 mb-2">
            <p className="text-xs text-[#94A3B8] truncate">{user?.email}</p>
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
        <header className="lg:hidden flex items-center h-16 px-4 bg-[#1E293B] border-b border-white/5 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#94A3B8] hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 text-lg font-bold text-[#F8FAFC]">
            Up<span className="text-[#3B82F6]">mark</span>
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
