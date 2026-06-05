"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/firestore";
import { SeoSection } from "@/components/admin/ui/SeoSection";
import { revalidatePathAction } from "@/app/actions";
import {
  Save, Loader2, Mail, Phone, MapPin, Mail as MailIcon,
} from "lucide-react";
import type { SeoPageConfig, PageVisibility } from "@/types";

const inputClass = "w-full bg-primary-bg border border-primary-text/10 rounded-lg px-4 py-3 text-primary-text placeholder-primary-text/30 focus:outline-none focus:border-accent-blue transition-colors text-sm";

const CONTACT_SEO_DEFAULTS: SeoPageConfig = {
  title: "Contact Us | Upmark",
  description: "Ready to scale? Get in touch with Upmark to discuss your marketing strategy and start a project.",
  keywords: "contact upmark, marketing agency contact",
};

export default function ContactPageSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [contactEmail, setContactEmail] = useState("hello@upmark.co");
  const [contactPhone, setContactPhone] = useState("+91 98765 43210");
  const [contactAddress, setContactAddress] = useState("WeWork, BKC, Mumbai 400051, India");
  const [seo, setSeo] = useState<SeoPageConfig>(CONTACT_SEO_DEFAULTS);
  const [visibility, setVisibility] = useState<PageVisibility>({});

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        if (data) {
          if (data.contactEmail) setContactEmail(data.contactEmail);
          if (data.contactPhone) setContactPhone(data.contactPhone);
          if (data.contactAddress) setContactAddress(data.contactAddress);
          if (data.seo?.contact) setSeo({ ...CONTACT_SEO_DEFAULTS, ...data.seo.contact });
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
        contactEmail,
        contactPhone,
        contactAddress,
        visibility,
        seo: { contact: seo },
      });
      await Promise.all([
        revalidatePathAction("/contact"),
        revalidatePathAction("/"),
      ]);
      setSuccessMessage("Contact page settings saved.");
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
            <MailIcon className="text-accent-blue" size={28} /> Contact Page
          </h1>
          <p className="text-muted-text mt-2">Configure contact details shown on the contact page, footer, and SEO.</p>
        </div>
        <div className="flex items-center gap-3">
          {successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save
          </button>
        </div>
      </div>

      <div className="bg-secondary-surface border border-primary-text/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-primary-text flex items-center gap-2 mb-4">
          <Mail size={20} className="text-accent-blue" /> Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-primary-text flex items-center gap-2"><Mail size={14} className="text-accent-blue" /> Email</label>
            <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="hello@upmark.co" className={inputClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-primary-text flex items-center gap-2"><Phone size={14} className="text-accent-blue" /> Phone</label>
            <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+44 (0) 20 0000 0000" className={inputClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-primary-text flex items-center gap-2"><MapPin size={14} className="text-accent-blue" /> Address</label>
            <input value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} placeholder="London, United Kingdom" className={inputClass} />
          </div>
        </div>
      </div>

      {/* ─── Page & Section Visibility ────────────── */}
      <div className="bg-secondary-surface border border-primary-text/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent-blue" />
          <h2 className="text-lg font-semibold text-primary-text">Visibility</h2>
        </div>
        <p className="text-sm text-muted-text mb-4">Toggle sections on/off on the public contact page.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { key: "contact", label: "Page (entire contact page)" },
            { key: "contactInfo", label: "Contact Info" },
            { key: "contactForm", label: "Contact Form" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 p-3 rounded-lg bg-primary-bg border border-primary-text/5 cursor-pointer hover:border-primary-text/10 transition-colors">
              <input
                type="checkbox"
                checked={visibility[key as keyof PageVisibility] ?? true}
                onChange={(e) => setVisibility((prev) => ({ ...prev, [key]: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-primary-text/10 rounded-full peer-checked:bg-accent-blue peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all relative flex-shrink-0"></div>
              <span className="text-sm text-primary-text">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <SeoSection config={seo} onChange={handleSeoChange} path="/contact" />

      <div className="flex items-center justify-between py-4">
        <div>{successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}</div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Contact Page Settings
        </button>
      </div>
    </div>
  );
}
