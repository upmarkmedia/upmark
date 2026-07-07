"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/firestore";
import { R2UploadWidget } from "@/components/admin/R2UploadWidget";
import { revalidatePathAction } from "@/app/actions";
import {
  Save, Loader2, Globe, Image as ImageIcon, Link as LinkIcon, ChevronDown,
  UserPlus, Trash2, Plus, Phone, Mail, User, Briefcase,
} from "lucide-react";
import type { FooterContact } from "@/types";

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
  const [theme, setTheme] = useState<"v1" | "v2" | "v3" | "default" | "editorial">("v1");
  const [globalOgImageUrl, setGlobalOgImageUrl] = useState("");
  
  const [socialTwitter, setSocialTwitter] = useState("");
  const [socialLinkedin, setSocialLinkedin] = useState("");
  const [socialInstagram, setSocialInstagram] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [footerTagline, setFooterTagline] = useState("");
  const [footerHeadingServices, setFooterHeadingServices] = useState("");
  const [footerHeadingCompany, setFooterHeadingCompany] = useState("");
  const [footerHeadingConnect, setFooterHeadingConnect] = useState("");
  const [footerHeadingGetInTouch, setFooterHeadingGetInTouch] = useState("");
  const [footerContacts, setFooterContacts] = useState<FooterContact[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        if (data) {
          setGlobalLogoUrl(data.globalLogoUrl || "");
          setEditorialLogoUrl(data.editorialLogoUrl || "");
          setTheme(data.theme || "v1");
          setGlobalOgImageUrl(data.globalOgImageUrl || "");
          setSocialTwitter(data.socialTwitter || "");
          setSocialLinkedin(data.socialLinkedin || "");
          setSocialInstagram(data.socialInstagram || "");
          setContactEmail(data.contactEmail || "");
          setFooterTagline(data.footerTagline || "");
          setFooterHeadingServices(data.footerHeadingServices || "");
          setFooterHeadingCompany(data.footerHeadingCompany || "");
          setFooterHeadingConnect(data.footerHeadingConnect || "");
          setFooterHeadingGetInTouch(data.footerHeadingGetInTouch || "");
          setFooterContacts(data.footerContacts || []);
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
        footerTagline,
        footerHeadingServices,
        footerHeadingCompany,
        footerHeadingConnect,
        footerHeadingGetInTouch,
        footerContacts,
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
              onChange={(e) => setTheme(e.target.value as any)}
              className={inputClass}
            >
              <option value="v1">v1 - Dark Mode (Rich Black)</option>
              <option value="v2">v2 - Light Mode (Editorial Ivory)</option>
              <option value="v3">v3 - Hospitality (Warm Ivory & Signal Yellow)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-text mb-2">Global Logo (Default Theme)</label>
            <p className="text-sm text-muted-text mb-4">Upload the main logo used in the navbar, footer, and admin dashboard for the dark theme.</p>
            <R2UploadWidget onUpload={(url) => setGlobalLogoUrl(url)} currentUrl={globalLogoUrl} label="Logo Image" />
          </div>
          {theme === "editorial" && (
            <div>
              <label className="block text-sm font-medium text-primary-text mb-2">Editorial Logo</label>
              <p className="text-sm text-muted-text mb-4">Upload the logo specifically used when the Editorial theme is active.</p>
              <R2UploadWidget onUpload={(url) => setEditorialLogoUrl(url)} currentUrl={editorialLogoUrl} label="Editorial Logo Image" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-primary-text mb-2">Open Graph Image (Social Share Image)</label>
            <p className="text-sm text-muted-text mb-4">This image appears when you share the website link on platforms like iMessage, Twitter, and LinkedIn. (Recommended size: 1200x630px)</p>
            <R2UploadWidget onUpload={(url) => setGlobalOgImageUrl(url)} currentUrl={globalOgImageUrl} label="OG Image" />
          </div>
        </div>
      </Section>

      <Section title="Footer Connect Links" icon={LinkIcon} defaultOpen={true}>
        <div className="space-y-4">
          <p className="text-sm text-muted-text mb-4">Manage the social media links and contact email displayed in the footer.</p>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Footer Tagline</label>
            <input 
              value={footerTagline} 
              onChange={(e) => setFooterTagline(e.target.value)} 
              placeholder="Integrated marketing that moves markets." 
              className={inputClass} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Services Heading</label>
            <input 
              value={footerHeadingServices} 
              onChange={(e) => setFooterHeadingServices(e.target.value)} 
              placeholder="Services" 
              className={inputClass} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Company Heading</label>
            <input 
              value={footerHeadingCompany} 
              onChange={(e) => setFooterHeadingCompany(e.target.value)} 
              placeholder="Company" 
              className={inputClass} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Connect Heading</label>
            <input 
              value={footerHeadingConnect} 
              onChange={(e) => setFooterHeadingConnect(e.target.value)} 
              placeholder="Connect" 
              className={inputClass} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-text mb-1">Get In Touch Heading</label>
            <input 
              value={footerHeadingGetInTouch} 
              onChange={(e) => setFooterHeadingGetInTouch(e.target.value)} 
              placeholder="Get in touch" 
              className={inputClass} 
            />
          </div>

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

          <div className="pt-4 border-t border-primary-text/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-primary-text flex items-center gap-2">
                  <UserPlus size={16} className="text-accent-blue" /> Footer Contacts
                </p>
                <p className="text-xs text-muted-text mt-1">Add contact persons displayed in the footer Connect section.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newContact: FooterContact = {
                    id: Date.now().toString(),
                    name: "",
                    designation: "",
                    phone: "",
                    email: "",
                  };
                  setFooterContacts([...footerContacts, newContact]);
                }}
                className="flex items-center gap-1.5 text-xs text-accent-blue hover:text-accent-blue/80 transition-colors"
              >
                <Plus size={14} /> Add Contact
              </button>
            </div>

            {footerContacts.length === 0 && (
              <p className="text-xs text-muted-text italic">No contacts added yet. Click "Add Contact" to get started.</p>
            )}

            <div className="flex flex-col gap-4">
              {footerContacts.map((contact, index) => (
                <div key={contact.id || index} className="bg-primary-bg border border-primary-text/5 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-text font-medium">Contact {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => setFooterContacts(footerContacts.filter((_, i) => i !== index))}
                      className="text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-text flex items-center gap-1"><User size={12} /> Name</label>
                      <input
                        value={contact.name}
                        onChange={(e) => {
                          const updated = [...footerContacts];
                          updated[index] = { ...updated[index], name: e.target.value };
                          setFooterContacts(updated);
                        }}
                        placeholder="John Doe"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-text flex items-center gap-1"><Briefcase size={12} /> Designation</label>
                      <input
                        value={contact.designation}
                        onChange={(e) => {
                          const updated = [...footerContacts];
                          updated[index] = { ...updated[index], designation: e.target.value };
                          setFooterContacts(updated);
                        }}
                        placeholder="CEO"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-text flex items-center gap-1"><Phone size={12} /> Phone</label>
                      <input
                        value={contact.phone}
                        onChange={(e) => {
                          const updated = [...footerContacts];
                          updated[index] = { ...updated[index], phone: e.target.value };
                          setFooterContacts(updated);
                        }}
                        placeholder="+91 98765 43210"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-text flex items-center gap-1"><Mail size={12} /> Email</label>
                      <input
                        value={contact.email}
                        onChange={(e) => {
                          const updated = [...footerContacts];
                          updated[index] = { ...updated[index], email: e.target.value };
                          setFooterContacts(updated);
                        }}
                        placeholder="john@example.com"
                        className={inputClass}
                        type="email"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
