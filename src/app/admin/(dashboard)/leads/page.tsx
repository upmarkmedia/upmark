"use client";

import { useEffect, useState } from "react";
import { getLeads } from "@/lib/firestore";
import type { Lead } from "@/types";
import {
  Users,
  Mail,
  Building2,
  Calendar,
  Briefcase,
  RefreshCw,
  Search,
} from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchLeads() {
    setLoading(true);
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function formatDate(timestamp: Lead["createdAt"]) {
    if (!timestamp) return "—";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp as unknown as string);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-text">Leads</h1>
          <p className="text-muted-text text-sm mt-1">
            Contact form submissions from the website.
          </p>
        </div>
        <button
          onClick={fetchLeads}
          className="self-start flex items-center gap-2 px-4 py-2 bg-primary-text/5 hover:bg-primary-text/10 text-muted-text hover:text-primary-text text-sm rounded-lg border border-primary-text/5 transition-all"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
        />
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-secondary-surface border border-primary-text/5 rounded-lg pl-11 pr-4 py-3 text-primary-text placeholder-primary-text/30 focus:outline-none focus:border-accent-blue transition-colors text-sm"
        />
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-secondary-surface rounded-xl border border-primary-text/5 p-6 animate-pulse"
            >
              <div className="h-5 w-40 bg-primary-text/5 rounded mb-4" />
              <div className="h-4 w-60 bg-primary-text/5 rounded mb-2" />
              <div className="h-4 w-full bg-primary-text/5 rounded" />
            </div>
          ))}
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-secondary-surface rounded-xl border border-primary-text/5 p-12 text-center">
          <Users size={40} className="text-muted-text/30 mx-auto mb-4" />
          <p className="text-muted-text">
            {searchQuery
              ? "No leads match your search."
              : "No leads yet. They'll appear here when someone submits the contact form."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-secondary-surface rounded-xl border border-primary-text/5 p-6 hover:border-primary-text/10 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-primary-text mb-3">
                    {lead.name}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-text">
                      <Mail size={14} className="shrink-0 text-accent-blue" />
                      <a
                        href={`mailto:${lead.email}`}
                        className="hover:text-accent-blue transition-colors truncate"
                      >
                        {lead.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-muted-text">
                      <Building2 size={14} className="shrink-0 text-accent-blue" />
                      <span className="truncate">
                        {lead.company || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-text">
                      <Briefcase size={14} className="shrink-0 text-accent-gold" />
                      <span className="truncate">{(lead.services || []).join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-text">
                      <Calendar size={14} className="shrink-0 text-muted-text" />
                      <span>{formatDate(lead.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              {lead.projectDetails && (
                <div className="mt-4 pt-4 border-t border-primary-text/5">
                  <p className="text-sm text-muted-text leading-relaxed whitespace-pre-wrap">
                    {lead.projectDetails}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Count */}
      {!loading && filteredLeads.length > 0 && (
        <p className="text-xs text-muted-text text-center">
          Showing {filteredLeads.length} of {leads.length} leads
        </p>
      )}
    </div>
  );
}
