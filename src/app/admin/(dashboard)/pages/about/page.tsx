"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/firestore";
import { CloudinaryUploadWidget } from "@/components/admin/CloudinaryUploadWidget";
import { SeoSection } from "@/components/admin/ui/SeoSection";
import { revalidatePathAction } from "@/app/actions";
import {
  Save, Loader2, ChevronDown, Plus, Trash2, Users, BadgeCheck,
  Info, GripVertical,
} from "lucide-react";
import type { TeamMember, Investor, SeoPageConfig, PageVisibility } from "@/types";

function Section({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#1E293B] border border-white/10 rounded-2xl overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-3">
          <Icon size={20} className="text-[#3B82F6]" />
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <ChevronDown size={18} className={`text-[#94A3B8] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-6 pb-6 border-t border-white/5 pt-6">{children}</div>}
    </div>
  );
}

const inputClass = "w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-3 text-[#F8FAFC] placeholder-white/30 focus:outline-none focus:border-[#3B82F6] transition-colors text-sm";

const ABOUT_SEO_DEFAULTS: SeoPageConfig = {
  title: "About Us | Upmark",
  description: "Upmark builds complete marketing systems. Meet our team of strategists, creatives, producers and performance marketers.",
  keywords: "about upmark, marketing team, integrated marketing agency",
};

export default function AboutPageSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [seo, setSeo] = useState<SeoPageConfig>(ABOUT_SEO_DEFAULTS);
  const [visibility, setVisibility] = useState<PageVisibility>({});

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        if (data) {
          if (data.teamMembers?.length) setTeamMembers(data.teamMembers);
          if (data.investors?.length) setInvestors(data.investors);
          if (data.seo?.about) setSeo({ ...ABOUT_SEO_DEFAULTS, ...data.seo.about });
          if (data.visibility) setVisibility(data.visibility);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSeoChange = (field: keyof SeoPageConfig, value: string) => {
    setSeo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage("");
    try {
      await updateSiteSettings({
        teamMembers,
        investors,
        visibility,
        seo: { about: seo },
      });
      await Promise.all([
        revalidatePathAction("/about"),
        revalidatePathAction("/"),
      ]);
      setSuccessMessage("About page settings saved.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-[#94A3B8]">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#F8FAFC] flex items-center gap-3">
            <Info className="text-[#3B82F6]" size={28} /> About Page
          </h1>
          <p className="text-[#94A3B8] mt-2">Manage team members, investors, and page SEO.</p>
        </div>
        <div className="flex items-center gap-3">
          {successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save
          </button>
        </div>
      </div>

      {/* ─── Meet the Team ─── */}
      <Section title="Meet the Team" icon={Users} defaultOpen={true}>
        <p className="text-sm text-[#94A3B8] mb-4">Add and manage team members shown on the About page.</p>
        <div className="flex flex-col gap-4">
          {teamMembers.map((member, i) => (
            <div key={i} className="flex flex-col gap-3 p-4 border border-white/10 rounded-xl bg-white/[0.02]">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
                  <GripVertical size={14} className="text-[#94A3B8]" />
                  Team Member {i + 1}
                </span>
                <button type="button" onClick={() => setTeamMembers(teamMembers.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={member.name} onChange={(e) => { const arr = [...teamMembers]; arr[i] = { ...arr[i], name: e.target.value }; setTeamMembers(arr); }} placeholder="Full name" className={inputClass} />
                <input value={member.specialty} onChange={(e) => { const arr = [...teamMembers]; arr[i] = { ...arr[i], specialty: e.target.value }; setTeamMembers(arr); }} placeholder="Specialty (e.g. Creative Director)" className={inputClass} />
              </div>
              <textarea value={member.description} onChange={(e) => { const arr = [...teamMembers]; arr[i] = { ...arr[i], description: e.target.value }; setTeamMembers(arr); }} placeholder="Brief description about this team member" className={`${inputClass} resize-none`} rows={2} />
              <div>
                <CloudinaryUploadWidget
                  onUpload={(url) => { const arr = [...teamMembers]; arr[i] = { ...arr[i], imageUrl: url }; setTeamMembers(arr); }}
                  currentUrl={member.imageUrl}
                  label="Team Member Photo"
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setTeamMembers([...teamMembers, { name: "", specialty: "", description: "" }])} className="flex items-center gap-2 text-sm text-[#3B82F6] hover:text-blue-400 self-start">
            <Plus size={16} /> Add Team Member
          </button>
        </div>
      </Section>

      {/* ─── Meet the Investors ─── */}
      <Section title="Meet the Investors" icon={BadgeCheck}>
        <p className="text-sm text-[#94A3B8] mb-4">Add and manage investors shown on the About page.</p>
        <div className="flex flex-col gap-4">
          {investors.map((investor, i) => (
            <div key={i} className="flex flex-col gap-3 p-4 border border-white/10 rounded-xl bg-white/[0.02]">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
                  <GripVertical size={14} className="text-[#94A3B8]" />
                  Investor {i + 1}
                </span>
                <button type="button" onClick={() => setInvestors(investors.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={investor.name} onChange={(e) => { const arr = [...investors]; arr[i] = { ...arr[i], name: e.target.value }; setInvestors(arr); }} placeholder="Full name" className={inputClass} />
                <input value={investor.specialty} onChange={(e) => { const arr = [...investors]; arr[i] = { ...arr[i], specialty: e.target.value }; setInvestors(arr); }} placeholder="Role / background (e.g. Angel Investor)" className={inputClass} />
              </div>
              <textarea value={investor.description} onChange={(e) => { const arr = [...investors]; arr[i] = { ...arr[i], description: e.target.value }; setInvestors(arr); }} placeholder="Brief description about this investor" className={`${inputClass} resize-none`} rows={2} />
              <div>
                <CloudinaryUploadWidget
                  onUpload={(url) => { const arr = [...investors]; arr[i] = { ...arr[i], imageUrl: url }; setInvestors(arr); }}
                  currentUrl={investor.imageUrl}
                  label="Investor Photo"
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setInvestors([...investors, { name: "", specialty: "", description: "" }])} className="flex items-center gap-2 text-sm text-[#3B82F6] hover:text-blue-400 self-start">
            <Plus size={16} /> Add Investor
          </button>
        </div>
      </Section>

      {/* ─── Page & Section Visibility ────────────── */}
      <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
          <h2 className="text-lg font-semibold text-white">Visibility</h2>
        </div>
        <p className="text-sm text-[#94A3B8] mb-4">Toggle sections on/off on the public About page.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { key: "about", label: "Page (entire about page)" },
            { key: "aboutTeam", label: "Meet the Team" },
            { key: "aboutInvestors", label: "Meet the Investors" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 p-3 rounded-lg bg-[#0F172A] border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
              <input
                type="checkbox"
                checked={visibility[key as keyof PageVisibility] ?? true}
                onChange={(e) => setVisibility((prev) => ({ ...prev, [key]: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/10 rounded-full peer-checked:bg-[#3B82F6] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative flex-shrink-0"></div>
              <span className="text-sm text-[#F8FAFC]">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <SeoSection config={seo} onChange={handleSeoChange} path="/about" />

      <div className="flex items-center justify-between py-4">
        <div>{successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}</div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save About Page Settings
        </button>
      </div>
    </div>
  );
}
