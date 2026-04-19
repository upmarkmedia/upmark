"use client";

import { useEffect, useState } from "react";
import { getLeads, getCaseStudies, getServices, getTestimonials } from "@/lib/firestore";
import { Users, FileText, Briefcase, TrendingUp, MessageSquareQuote, Globe } from "lucide-react";
import Link from "next/link";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    leads: 0,
    caseStudies: 0,
    services: 0,
    testimonials: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [leads, caseStudies, services, testimonials] = await Promise.all([
          getLeads(),
          getCaseStudies(),
          getServices(),
          getTestimonials(),
        ]);
        setStats({
          leads: leads.length,
          caseStudies: caseStudies.length,
          services: services.length,
          testimonials: testimonials.length,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Leads",
      value: stats.leads,
      icon: Users,
      href: "/admin/leads",
      color: "#3B82F6",
    },
    {
      label: "Case Studies",
      value: stats.caseStudies,
      icon: FileText,
      href: "/admin/case-studies",
      color: "#22C55E",
    },
    {
      label: "Services",
      value: stats.services,
      icon: Briefcase,
      href: "/admin/services",
      color: "#F59E0B",
    },
    {
      label: "Testimonials",
      value: stats.testimonials,
      icon: MessageSquareQuote,
      href: "/admin/testimonials",
      color: "#A855F7",
    },
    {
      label: "SEO",
      value: "—",
      icon: Globe,
      href: "/admin/seo",
      color: "#10B981",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#F8FAFC]">Dashboard</h1>
        <p className="text-[#94A3B8] mt-1">
          Overview of your Upmark data.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group bg-[#1E293B] rounded-xl border border-white/5 p-6 hover:border-white/10 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#94A3B8] mb-1">{card.label}</p>
                {loading ? (
                  <div className="h-9 w-16 bg-white/5 rounded animate-pulse" />
                ) : (
                  <p className="text-4xl font-bold text-[#F8FAFC]">
                    {card.value}
                  </p>
                )}
              </div>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon size={22} style={{ color: card.color }} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm text-[#94A3B8] group-hover:text-[#3B82F6] transition-colors">
              <TrendingUp size={14} />
              View all →
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Info */}
      <div className="bg-[#1E293B] rounded-xl border border-white/5 p-6">
        <h2 className="text-lg font-semibold text-[#F8FAFC] mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/case-studies"
            className="flex items-center gap-3 px-4 py-3 bg-[#0F172A] rounded-lg border border-white/5 hover:border-[#3B82F6]/30 transition-colors"
          >
            <FileText size={18} className="text-[#3B82F6]" />
            <span className="text-sm text-[#F8FAFC]">Add Case Study</span>
          </Link>
          <Link
            href="/admin/services"
            className="flex items-center gap-3 px-4 py-3 bg-[#0F172A] rounded-lg border border-white/5 hover:border-[#3B82F6]/30 transition-colors"
          >
            <Briefcase size={18} className="text-[#22C55E]" />
            <span className="text-sm text-[#F8FAFC]">Manage Services</span>
          </Link>
          <Link
            href="/admin/testimonials"
            className="flex items-center gap-3 px-4 py-3 bg-[#0F172A] rounded-lg border border-white/5 hover:border-[#3B82F6]/30 transition-colors"
          >
            <MessageSquareQuote size={18} className="text-[#A855F7]" />
            <span className="text-sm text-[#F8FAFC]">Manage Testimonials</span>
          </Link>
          <Link
            href="/admin/leads"
            className="flex items-center gap-3 px-4 py-3 bg-[#0F172A] rounded-lg border border-white/5 hover:border-[#3B82F6]/30 transition-colors"
          >
            <Users size={18} className="text-[#F59E0B]" />
            <span className="text-sm text-[#F8FAFC]">Review Leads</span>
          </Link>
          <Link
            href="/admin/seo"
            className="flex items-center gap-3 px-4 py-3 bg-[#0F172A] rounded-lg border border-white/5 hover:border-[#3B82F6]/30 transition-colors"
          >
            <Globe size={18} className="text-[#10B981]" />
            <span className="text-sm text-[#F8FAFC]">Manage SEO</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
