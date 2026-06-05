"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/firestore";
import { CloudinaryUploadWidget } from "@/components/admin/CloudinaryUploadWidget";
import { revalidatePathAction } from "@/app/actions";
import {
  Save, Loader2, Globe, Image as ImageIcon, Link as LinkIcon, ChevronDown
} from "lucide-react";

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

export default function GlobalSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [globalLogoUrl, setGlobalLogoUrl] = useState("");
  const [editorialLogoUrl, setEditorialLogoUrl] = useState("");
  const [theme, setTheme] = useState<"default" | "editorial">("default");
  const [globalOgImageUrl, setGlobalOgImageUrl] = useState("");
  
  const [socialTwitter, setSocialTwitter] = useState("");
  const [socialLinkedin, setSocialLinkedin] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        if (data) {
          setGlobalLogoUrl(data.globalLogoUrl || "");
          setEditorialLogoUrl(data.editorialLogoUrl || "");
          setTheme(data.theme || "default");
          setGlobalOgImageUrl(data.globalOgImageUrl || "");
          setSocialTwitter(data.socialTwitter || "");
          setSocialLinkedin(data.socialLinkedin || "");
          setSocialInstagram(data.socialInstagram || "");
          setContactEmail(data.contactEmail || "");
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage("");
    try {
      await updateSiteSettings({
        theme,
        globalLogoUrl,
        editorialLogoUrl,
        globalOgImageUrl,
        socialTwitter,
        socialLinkedin,
        socialInstagram,
        contactEmail,
      });
      await revalidatePathAction("/");
      setSuccessMessage("Global settings saved.");
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
            <Globe className="text-accent-blue" size={28} /> Global Settings
          </h1>
          <p className="text-muted-text mt-2">Manage your brand assets and footer contact links across the site.</p>
        </div>
        <div className="flex items-center gap-3">
          {successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save
          </button>
        </div>
      </div>

      <Section title="Brand Assets" icon={ImageIcon} defaultOpen={true}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary-text mb-2">Global Theme</label>
            <p className="text-sm text-muted-text mb-4">Choose the primary visual theme for the public website and admin dashboard.</p>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as "default" | "editorial")}
              className={inputClass}
            >
              <option value="default">Default Dark Tech</option>
              <option value="editorial">Editorial (Light)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-text mb-2">Global Logo (Default Theme)</label>
            <p className="text-sm text-muted-text mb-4">Upload the main logo used in the navbar, footer, and admin dashboard for the dark theme.</p>
            <CloudinaryUploadWidget onUpload={(url) => setGlobalLogoUrl(url)} currentUrl={globalLogoUrl} label="Logo Image" />
          </div>
          {theme === "editorial" && (
            <div>
              <label className="block text-sm font-medium text-primary-text mb-2">Editorial Logo</label>
              <p className="text-sm text-muted-text mb-4">Upload the logo specifically used when the Editorial theme is active.</p>
              <CloudinaryUploadWidget onUpload={(url) => setEditorialLogoUrl(url)} currentUrl={editorialLogoUrl} label="Editorial Logo Image" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-primary-text mb-2">Open Graph Image (Social Share Image)</label>
            <p className="text-sm text-muted-text mb-4">This image appears when you share the website link on platforms like iMessage, Twitter, and LinkedIn. (Recommended size: 1200x630px)</p>
            <CloudinaryUploadWidget onUpload={(url) => setGlobalOgImageUrl(url)} currentUrl={globalOgImageUrl} label="OG Image" />
          </div>
        </div>
      </Section>

      <Section title="Footer Connect Links" icon={LinkIcon} defaultOpen={true}>
        <div className="space-y-4">
          <p className="text-sm text-muted-text mb-4">Manage the social media links and contact email displayed in the footer.</p>
          
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Twitter / X URL</label>
            <input 
              value={socialTwitter} 
              onChange={(e) => setSocialTwitter(e.target.value)} 
              placeholder="https://x.com/yourbrand" 
              className={inputClass} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">LinkedIn URL</label>
            <input 
              value={socialLinkedin} 
              onChange={(e) => setSocialLinkedin(e.target.value)} 
              placeholder="https://linkedin.com/company/yourbrand" 
              className={inputClass} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Instagram URL</label>
            <input 
              value={socialInstagram} 
              onChange={(e) => setSocialInstagram(e.target.value)} 
              placeholder="https://instagram.com/yourbrand" 
              className={inputClass} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Contact Email</label>
            <input 
              value={contactEmail} 
              onChange={(e) => setContactEmail(e.target.value)} 
              placeholder="connect@yourbrand.com" 
              className={inputClass} 
              type="email"
            />
          </div>
        </div>
      </Section>

      <div className="flex items-center justify-between py-4">
        <div>{successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}</div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Global Settings
        </button>
      </div>
    </div>
  );
}
