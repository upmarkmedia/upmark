"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings, getServices } from "@/lib/firestore";
import { R2UploadWidget } from "@/components/admin/R2UploadWidget";
import { SeoSection } from "@/components/admin/ui/SeoSection";
import { revalidatePathAction } from "@/app/actions";
import {
  Save, Loader2, PlaySquare, ChevronDown, Plus, Trash2, Lightbulb,
  ListOrdered, Film, Award, Home, Image as ImageIcon, ArrowUp, ArrowDown, Star,
} from "lucide-react";
import type { PhilosophyPointer, ProcessStep, ContentItem, BrandItem, SeoPageConfig, PageVisibility, Service } from "@/types";

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
  const [homeAboutImageUrl, setHomeAboutImageUrl] = useState("");
  const [homeAboutEyebrow, setHomeAboutEyebrow] = useState("ABOUT US");
  const [homeAboutTitle, setHomeAboutTitle] = useState("Most agencies only create content or run ads.");
  const [homeAboutSubtitle, setHomeAboutSubtitle] = useState("Upmark builds complete marketing systems.");
  const [homeAboutDescription, setHomeAboutDescription] = useState("Founded on the belief that modern marketing must be fast, precise and measurable, Upmark brings together strategists, creatives, producers and performance marketers who operate as one integrated team.\n\nWhen your strategist sits next to your editor, your performance data informs your creative, and your content team understands your media budget — the work gets sharper. We're not a collection of specialists working in parallel. We're a single, integrated team where every discipline makes every other one better. That's the Upmark advantage.");
  const [featuredServiceIds, setFeaturedServiceIds] = useState<string[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [philosophyPointers, setPhilosophyPointers] = useState<PhilosophyPointer[]>(DEFAULT_PHILOSOPHY_POINTERS);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(DEFAULT_PROCESS_ITEMS);
  const [contentItems, setContentItems] = useState<ContentItem[]>(DEFAULT_CONTENT_ITEMS);
  const [studioCapabilities, setStudioCapabilities] = useState<string[]>(DEFAULT_STUDIO_CAPABILITIES);
  const [brandCarouselItems, setBrandCarouselItems] = useState<BrandItem[]>([]);
  const [seo, setSeo] = useState<SeoPageConfig>(HOME_SEO_DEFAULTS);
  const [visibility, setVisibility] = useState<PageVisibility>({});

  useEffect(() => {
    async function load() {
      try {
        const [data, services] = await Promise.all([getSiteSettings(), getServices()]);
        setAllServices(services.sort((a, b) => (a.order || 0) - (b.order || 0)));
        if (data) {
          setHeroVideoUrl(data.heroVideoUrl || "");
          setHomeAboutImageUrl(data.homeAboutImageUrl || "");
          setHomeAboutEyebrow(data.homeAboutEyebrow || "ABOUT US");
          setHomeAboutTitle(data.homeAboutTitle || "Most agencies only create content or run ads.");
          setHomeAboutSubtitle(data.homeAboutSubtitle || "Upmark builds complete marketing systems.");
          setHomeAboutDescription(data.homeAboutDescription || "Founded on the belief that modern marketing must be fast, precise and measurable, Upmark brings together strategists, creatives, producers and performance marketers who operate as one integrated team.\n\nWhen your strategist sits next to your editor, your performance data informs your creative, and your content team understands your media budget — the work gets sharper. We're not a collection of specialists working in parallel. We're a single, integrated team where every discipline makes every other one better. That's the Upmark advantage.");
          if (data.featuredServiceIds?.length) setFeaturedServiceIds(data.featuredServiceIds);
          if (data.philosophyPointers?.length) setPhilosophyPointers(data.philosophyPointers);
          if (data.processSteps?.length) setProcessSteps(data.processSteps);
          if (data.contentItems?.length) setContentItems(data.contentItems);
          if (data.studioCapabilities?.length) setStudioCapabilities(data.studioCapabilities);
          if (data.brandCarouselItems?.length) setBrandCarouselItems(data.brandCarouselItems);
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
        homeAboutImageUrl,
        homeAboutEyebrow,
        homeAboutTitle,
        homeAboutSubtitle,
        homeAboutDescription,
        featuredServiceIds,
        philosophyPointers,
        processSteps,
        contentItems,
        studioCapabilities,
        brandCarouselItems,
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
          <p className="text-sm text-muted-text mb-4">Upload an MP4 or WebM video for the hero background.</p>
          <R2UploadWidget onUpload={(url) => setHeroVideoUrl(url)} currentUrl={heroVideoUrl} label="Hero Background Video" fit="cover" height="h-[28rem]" />
        </div>
      </Section>

      <Section title="About Us Section" icon={ImageIcon}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-text mb-2">Eyebrow Label</label>
            <input value={homeAboutEyebrow} onChange={(e) => setHomeAboutEyebrow(e.target.value)} placeholder="e.g. ABOUT US" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-text mb-2">Heading</label>
            <input value={homeAboutTitle} onChange={(e) => setHomeAboutTitle(e.target.value)} placeholder="Main heading" className={inputClass} />
            <p className="text-xs text-muted-text mt-1">Wrap text in **double asterisks** to apply gradient highlight, e.g. **create content**</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-text mb-2">Subheading</label>
            <input value={homeAboutSubtitle} onChange={(e) => setHomeAboutSubtitle(e.target.value)} placeholder="Subheading" className={inputClass} />
            <p className="text-xs text-muted-text mt-1">Wrap text in **double asterisks** to apply gold highlight, e.g. **complete marketing systems.**</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-text mb-2">Description</label>
            <textarea value={homeAboutDescription} onChange={(e) => setHomeAboutDescription(e.target.value)} placeholder="Body text (use blank lines for paragraph breaks)" className={`${inputClass} resize-none`} rows={5} />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-text mb-2">About Us Image</label>
            <p className="text-sm text-muted-text mb-4">Upload the image used in the Philosophy / About section on the homepage.</p>
            <R2UploadWidget onUpload={(url) => setHomeAboutImageUrl(url)} currentUrl={homeAboutImageUrl} label="About Us Image" />
          </div>
        </div>
      </Section>

      <Section title="Featured Services" icon={Star}>
        <p className="text-sm text-muted-text mb-4">Choose up to 4 services to feature on the homepage. Use arrows to reorder.</p>
        <div className="flex flex-col gap-2">
          {featuredServiceIds.map((id, i) => {
            const svc = allServices.find((s) => s.id === id);
            return (
              <div key={id} className="flex items-center gap-2 p-3 border border-primary-text/10 rounded-xl bg-primary-text/[0.02]">
                <div className="flex flex-col items-center gap-0.5">
                  <button
                    onClick={() => { const arr = [...featuredServiceIds]; [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; setFeaturedServiceIds(arr); }}
                    disabled={i === 0}
                    className="p-0.5 text-muted-text hover:text-primary-text disabled:opacity-20 transition-colors"
                    title="Move up"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={() => { const arr = [...featuredServiceIds]; [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; setFeaturedServiceIds(arr); }}
                    disabled={i === featuredServiceIds.length - 1}
                    className="p-0.5 text-muted-text hover:text-primary-text disabled:opacity-20 transition-colors"
                    title="Move down"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>
                <span className="text-sm font-bold text-muted-text w-6">{i + 1}.</span>
                <span className="flex-1 text-sm font-medium text-primary-text">{svc?.title || "Unknown service"}</span>
                <button
                  onClick={() => setFeaturedServiceIds(featuredServiceIds.filter((_, j) => j !== i))}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
          {featuredServiceIds.length < 4 && (
            <div className="flex items-center gap-2 mt-1">
              <select
                id="add-service-select"
                className={`${inputClass} flex-1`}
                defaultValue=""
              >
                <option value="" disabled>Select a service to add...</option>
                {allServices
                  .filter((s) => s.id && !featuredServiceIds.includes(s.id))
                  .map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  const sel = document.getElementById("add-service-select") as HTMLSelectElement;
                  if (sel?.value) {
                    setFeaturedServiceIds([...featuredServiceIds, sel.value]);
                    sel.value = "";
                  }
                }}
                className="flex items-center gap-2 text-sm text-accent-blue hover:text-accent-blue/80 px-3 py-2 border border-accent-blue/20 rounded-lg hover:bg-accent-blue/5 transition-colors"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          )}
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
                  <R2UploadWidget onUpload={(url) => { const arr = [...processSteps]; arr[i] = { ...arr[i], imageUrl: url }; setProcessSteps(arr); }} currentUrl={s.imageUrl} label="Upload Image" />
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

      <Section title="Brand Carousel" icon={Star}>
        <p className="text-sm text-muted-text mb-4">Add brand logos or names shown in the carousel below the hero video. If a logo URL is provided it will be displayed, otherwise the brand name is shown as text.</p>
        <div className="flex flex-col gap-3">
          {brandCarouselItems.map((brand, i) => (
            <div key={i} className="flex flex-col gap-2 p-4 border border-primary-text/10 rounded-xl bg-primary-text/[0.02]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-primary-text">Brand {i + 1}</span>
                <button type="button" onClick={() => setBrandCarouselItems(brandCarouselItems.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-text mb-1">Brand Name</label>
                  <input value={brand.name} onChange={(e) => { const arr = [...brandCarouselItems]; arr[i] = { ...arr[i], name: e.target.value }; setBrandCarouselItems(arr); }} placeholder="e.g. Google" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-muted-text mb-1">Logo (optional)</label>
                  <R2UploadWidget
                    onUpload={(url) => { const arr = [...brandCarouselItems]; arr[i] = { ...arr[i], logoUrl: url }; setBrandCarouselItems(arr); }}
                    currentUrl={brand.logoUrl}
                    label="Upload Logo"
                    fit="contain"
                    height="h-20"
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setBrandCarouselItems([...brandCarouselItems, { name: "", logoUrl: "" }])} className="flex items-center gap-2 text-sm text-accent-blue hover:text-accent-blue/80 self-start"><Plus size={16} /> Add Brand</button>
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
            { key: "homeBrandCarousel", label: "Brand Carousel" },
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
