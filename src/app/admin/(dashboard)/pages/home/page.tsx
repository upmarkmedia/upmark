"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/firestore";
import { CloudinaryUploadWidget } from "@/components/admin/CloudinaryUploadWidget";
import { SeoSection } from "@/components/admin/ui/SeoSection";
import { revalidatePathAction } from "@/app/actions";
import {
  Save, Loader2, PlaySquare, ChevronDown, Plus, Trash2, Lightbulb,
  ListOrdered, Film, Award, Home, Image as ImageIcon,
} from "lucide-react";
import type { PhilosophyPointer, ProcessStep, ContentItem, SeoPageConfig, PageVisibility } from "@/types";

function Section({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-secondary-surface border border-primary-text/10 rounded-2xl overflow-hidden">
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left hover:bg-primary-text/[0.02] transition-colors">
        <div className="flex items-center gap-3">
          <Icon size={20} className="text-accent-blue" />
          <h2 className="text-lg font-semibold text-primary-text">{title}</h2>
        </div>
        <ChevronDown size={18} className={`text-muted-text transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-6 pb-6 border-t border-primary-text/5 pt-6">{children}</div>}
    </div>
  );
}

const inputClass = "w-full bg-primary-bg border border-primary-text/10 rounded-lg px-4 py-3 text-primary-text placeholder-primary-text/30 focus:outline-none focus:border-accent-blue transition-colors text-sm";

const HOME_SEO_DEFAULTS: SeoPageConfig = {
  title: "Upmark — Integrated Marketing That Moves Markets",
  description: "Strategy, performance marketing, content and execution — unified. We build complete marketing systems that scale.",
  keywords: "marketing agency, integrated marketing, digital marketing, content production",
};

const DEFAULT_PHILOSOPHY_POINTERS: PhilosophyPointer[] = [
  { title: "Strategy First", desc: "Every campaign starts with insight-driven strategy. We define your positioning before we produce a single asset." },
  { title: "Full Execution", desc: "From concept to live campaign — creative direction, production, distribution and optimization, all under one roof." },
  { title: "Systematic Thinking", desc: "We don't build one-off ads. We architect marketing systems that compound over time and generate predictable growth." },
  { title: "Measurable Results", desc: "Every deliverable is tied to a business outcome. We track, report and relentlessly optimise for what matters." },
];

const DEFAULT_PROCESS_ITEMS: ProcessStep[] = [
  { title: "Insight", description: "Deep-dive into your market, audience, competitors and brand. We surface the insights that define your edge." },
  { title: "Strategy", description: "We translate insight into a precise strategy — positioning, messaging, channels and a roadmap for execution." },
  { title: "Creative Production", description: "Our in-house team produces every asset — video, design, copy and content — aligned to the strategy." },
  { title: "Campaign Launch", description: "Orchestrated rollout across paid, owned and earned channels with precision timing and audience targeting." },
  { title: "Optimisation", description: "Real-time monitoring and rapid iteration. We cut what doesn't work and double down on what does." },
  { title: "Growth", description: "We systematically compound results — scaling budgets, expanding channels and building long-term growth loops." },
];

const DEFAULT_CONTENT_ITEMS: ContentItem[] = [
  { title: "Short-form", subtitle: "Reels & Shorts", description: "Vertical-first content engineered for algorithm performance and share velocity." },
  { title: "Paid Creative", subtitle: "Campaign Ads", description: "Static, animated and video ad creatives across Meta, Google and programmatic networks." },
  { title: "Long-form", subtitle: "Brand Films", description: "Cinematic brand storytelling that defines identity and creates emotional connection." },
  { title: "Photography", subtitle: "Product Shoots", description: "Studio and lifestyle product photography optimised for eCommerce and social." },
  { title: "Ongoing", subtitle: "Social Media Content", description: "Ongoing weekly content production — graphics, carousels, captions and stories." },
  { title: "Video", subtitle: "YouTube & Long-form", description: "Full-length branded content, tutorials and documentaries that build authority." },
];

const DEFAULT_STUDIO_CAPABILITIES: string[] = [
  "In-house production team", "Director + DP on every shoot", "4K / cinema-grade equipment",
  "Same-day turnaround available", "Licensed music library", "Motion graphics included",
  "Platform-native formatting", "Raw footage delivery",
];

export default function HomePageSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [heroMobileVideoUrl, setHeroMobileVideoUrl] = useState("");
  const [homeAboutImageUrl, setHomeAboutImageUrl] = useState("");
  const [philosophyPointers, setPhilosophyPointers] = useState<PhilosophyPointer[]>(DEFAULT_PHILOSOPHY_POINTERS);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(DEFAULT_PROCESS_ITEMS);
  const [contentItems, setContentItems] = useState<ContentItem[]>(DEFAULT_CONTENT_ITEMS);
  const [studioCapabilities, setStudioCapabilities] = useState<string[]>(DEFAULT_STUDIO_CAPABILITIES);
  const [seo, setSeo] = useState<SeoPageConfig>(HOME_SEO_DEFAULTS);
  const [visibility, setVisibility] = useState<PageVisibility>({});

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        if (data) {
          setHeroVideoUrl(data.heroVideoUrl || "");
          setHeroMobileVideoUrl(data.heroMobileVideoUrl || "");
          setHomeAboutImageUrl(data.homeAboutImageUrl || "");
          if (data.philosophyPointers?.length) setPhilosophyPointers(data.philosophyPointers);
          if (data.processSteps?.length) setProcessSteps(data.processSteps);
          if (data.contentItems?.length) setContentItems(data.contentItems);
          if (data.studioCapabilities?.length) setStudioCapabilities(data.studioCapabilities);
          if (data.seo?.home) setSeo({ ...HOME_SEO_DEFAULTS, ...data.seo.home });
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
        heroVideoUrl,
        heroMobileVideoUrl,
        homeAboutImageUrl,
        philosophyPointers,
        processSteps,
        contentItems,
        studioCapabilities,
        visibility,
        seo: { home: seo },
      });
      await revalidatePathAction("/");
      setSuccessMessage("Home page settings saved.");
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
      <div className="flex h-[50vh] items-center justify-center text-muted-text">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-text flex items-center gap-3">
            <Home className="text-accent-blue" size={28} /> Home Page
          </h1>
          <p className="text-muted-text mt-2">Configure homepage content, sections, and SEO.</p>
        </div>
        <div className="flex items-center gap-3">
          {successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save
          </button>
        </div>
      </div>

      <Section title="Hero Section" icon={PlaySquare} defaultOpen={true}>
        <div>
          <label className="block text-sm font-medium text-primary-text mb-2">Background Video</label>
          <p className="text-sm text-muted-text mb-4">Upload an MP4 or WebM video for the hero background. The desktop video is shown in landscape and the mobile video in portrait, side by side.</p>
          <div className="flex flex-col md:flex-row md:items-stretch gap-4">
            <div className="flex-[2] min-w-0">
              <CloudinaryUploadWidget onUpload={(url) => setHeroVideoUrl(url)} currentUrl={heroVideoUrl} label="Hero Background Video (Desktop)" fit="cover" height="h-[28rem]" />
            </div>
            <div className="flex-1 min-w-0 md:max-w-[280px]">
              <CloudinaryUploadWidget onUpload={(url) => setHeroMobileVideoUrl(url)} currentUrl={heroMobileVideoUrl} label="Hero Background Video (Mobile)" fit="cover" height="h-[28rem]" />
            </div>
          </div>
        </div>
      </Section>

      <Section title="About Us Section" icon={ImageIcon}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-text mb-2">About Us Image</label>
            <p className="text-sm text-muted-text mb-4">Upload the image used in the Philosophy / About section on the homepage.</p>
            <CloudinaryUploadWidget onUpload={(url) => setHomeAboutImageUrl(url)} currentUrl={homeAboutImageUrl} label="About Us Image" />
          </div>
        </div>
      </Section>

      <Section title="Philosophy Pointers" icon={Lightbulb}>
        <p className="text-sm text-muted-text mb-4">Edit the 4 philosophy pointer cards on the homepage.</p>
        <div className="flex flex-col gap-3">
          {philosophyPointers.map((p, i) => (
            <div key={i} className="grid grid-cols-[200px_1fr_auto] gap-2 items-start">
              <input value={p.title} onChange={(e) => { const arr = [...philosophyPointers]; arr[i] = { ...arr[i], title: e.target.value }; setPhilosophyPointers(arr); }} placeholder="Title" className={inputClass} />
              <textarea value={p.desc} onChange={(e) => { const arr = [...philosophyPointers]; arr[i] = { ...arr[i], desc: e.target.value }; setPhilosophyPointers(arr); }} placeholder="Description" className={`${inputClass} resize-none`} rows={2} />
              <button type="button" onClick={() => setPhilosophyPointers(philosophyPointers.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg mt-1"><Trash2 size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={() => setPhilosophyPointers([...philosophyPointers, { title: "", desc: "" }])} className="flex items-center gap-2 text-sm text-accent-blue hover:text-accent-blue/80 self-start"><Plus size={16} /> Add Pointer</button>
        </div>
      </Section>

      <Section title="Process Steps" icon={ListOrdered}>
        <p className="text-sm text-muted-text mb-4">Edit the 6-step process on the homepage.</p>
        <div className="flex flex-col gap-3">
          {processSteps.map((s, i) => (
            <div key={i} className="flex flex-col gap-2 p-4 border border-primary-text/10 rounded-xl bg-primary-text/[0.02]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-primary-text">Step {i + 1}</span>
                <button type="button" onClick={() => setProcessSteps(processSteps.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <input value={s.title} onChange={(e) => { const arr = [...processSteps]; arr[i] = { ...arr[i], title: e.target.value }; setProcessSteps(arr); }} placeholder="Step title" className={inputClass} />
                  <textarea value={s.description} onChange={(e) => { const arr = [...processSteps]; arr[i] = { ...arr[i], description: e.target.value }; setProcessSteps(arr); }} placeholder="Step description" className={`${inputClass} resize-none`} rows={3} />
                </div>
                <div>
                  <label className="block text-xs text-muted-text mb-2">Step Image</label>
                  <CloudinaryUploadWidget onUpload={(url) => { const arr = [...processSteps]; arr[i] = { ...arr[i], imageUrl: url }; setProcessSteps(arr); }} currentUrl={s.imageUrl} label="Upload Image" />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setProcessSteps([...processSteps, { title: "", description: "" }])} className="flex items-center gap-2 text-sm text-accent-blue hover:text-accent-blue/80 self-start"><Plus size={16} /> Add Step</button>
        </div>
      </Section>

      <Section title="Content Studio Items" icon={Film}>
        <p className="text-sm text-muted-text mb-4">Edit the content studio grid on the homepage.</p>
        <div className="flex flex-col gap-3">
          {contentItems.map((c, i) => (
            <div key={i} className="grid grid-cols-[150px_150px_1fr_auto] gap-2 items-start">
              <input value={c.title} onChange={(e) => { const arr = [...contentItems]; arr[i] = { ...arr[i], title: e.target.value }; setContentItems(arr); }} placeholder="Title" className={inputClass} />
              <input value={c.subtitle} onChange={(e) => { const arr = [...contentItems]; arr[i] = { ...arr[i], subtitle: e.target.value }; setContentItems(arr); }} placeholder="Subtitle" className={inputClass} />
              <textarea value={c.description} onChange={(e) => { const arr = [...contentItems]; arr[i] = { ...arr[i], description: e.target.value }; setContentItems(arr); }} placeholder="Description" className={`${inputClass} resize-none`} rows={2} />
              <button type="button" onClick={() => setContentItems(contentItems.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg mt-1"><Trash2 size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={() => setContentItems([...contentItems, { title: "", subtitle: "", description: "" }])} className="flex items-center gap-2 text-sm text-accent-blue hover:text-accent-blue/80 self-start"><Plus size={16} /> Add Item</button>
        </div>
      </Section>

      <Section title="Studio Capabilities" icon={Award}>
        <p className="text-sm text-muted-text mb-4">Edit the studio capabilities list.</p>
        <div className="flex flex-col gap-2">
          {studioCapabilities.map((cap, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={cap} onChange={(e) => { const arr = [...studioCapabilities]; arr[i] = e.target.value; setStudioCapabilities(arr); }} placeholder="Capability" className={`${inputClass} flex-1`} />
              <button type="button" onClick={() => setStudioCapabilities(studioCapabilities.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={() => setStudioCapabilities([...studioCapabilities, ""])} className="flex items-center gap-2 text-sm text-accent-blue hover:text-accent-blue/80 self-start"><Plus size={16} /> Add Capability</button>
        </div>
      </Section>

      {/* ─── Page & Section Visibility ────────────── */}
      <div className="bg-secondary-surface border border-primary-text/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent-blue" />
          <h2 className="text-lg font-semibold text-primary-text">Visibility</h2>
        </div>
        <p className="text-sm text-muted-text mb-4">Toggle sections on/off on the public homepage.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { key: "home", label: "Page (entire home page)" },
            { key: "homeHero", label: "Hero" },
            { key: "homeAbout", label: "About Us" },
            { key: "homePhilosophy", label: "Philosophy Pointers" },
            { key: "homeProcess", label: "Process" },
            { key: "homeContentStudio", label: "Content Studio" },
            { key: "homeStudioCapabilities", label: "Studio Capabilities" },
            { key: "homeTestimonials", label: "Testimonials" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 p-3 rounded-lg bg-primary-bg border border-primary-text/5 cursor-pointer hover:border-primary-text/10 transition-colors">
              <input
                type="checkbox"
                checked={visibility[key as keyof PageVisibility] ?? true}
                onChange={(e) => setVisibility((prev) => ({ ...prev, [key]: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/10 rounded-full peer-checked:bg-accent-blue peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative flex-shrink-0"></div>
              <span className="text-sm text-primary-text">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <SeoSection config={seo} onChange={handleSeoChange} path="/" />

      <div className="flex items-center justify-between py-4">
        <div>{successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}</div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Home Page Settings
        </button>
      </div>
    </div>
  );
}
