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
  Settings,
  MessageSquareQuote,
  Globe,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Users, exact: false },
  {
    href: "/admin/case-studies",
    label: "Case Studies",
    icon: FileText,
    exact: false,
  },
  {
    href: "/admin/services",
    label: "Services",
    icon: Briefcase,
    exact: false,
  },
  {
    href: "/admin/testimonials",
    label: "Testimonials",
    icon: MessageSquareQuote,
    exact: false,
  },
  {
    href: "/admin/seo",
    label: "SEO",
    icon: Globe,
    exact: false,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    exact: false,
  },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function isActive(href: string, exact: boolean) {
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
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20"
                      : "text-[#94A3B8] hover:bg-white/5 hover:text-white border border-transparent"
                  }
                `}
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 border border-transparent hover:border-red-500/20"
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
