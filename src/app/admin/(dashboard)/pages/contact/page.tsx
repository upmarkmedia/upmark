"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/firestore";
import { SeoSection } from "@/components/admin/ui/SeoSection";
import { revalidatePathAction } from "@/app/actions";
import {
  Save, Loader2, Mail, Phone, MapPin, Mail as MailIcon,
} from "lucide-react";
import type { SeoPageConfig } from "@/types";

const inputClass = "w-full bg-[#0F172A] border border-white/10 rounded-lg px-4 py-3 text-[#F8FAFC] placeholder-white/30 focus:outline-none focus:border-[#3B82F6] transition-colors text-sm";

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

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        if (data) {
          if (data.contactEmail) setContactEmail(data.contactEmail);
          if (data.contactPhone) setContactPhone(data.contactPhone);
          if (data.contactAddress) setContactAddress(data.contactAddress);
          if (data.seo?.contact) setSeo({ ...CONTACT_SEO_DEFAULTS, ...data.seo.contact });
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
            <MailIcon className="text-[#3B82F6]" size={28} /> Contact Page
          </h1>
          <p className="text-[#94A3B8] mt-2">Configure contact details shown on the contact page, footer, and SEO.</p>
        </div>
        <div className="flex items-center gap-3">
          {successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save
          </button>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <Mail size={20} className="text-[#3B82F6]" /> Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2"><Mail size={14} className="text-[#3B82F6]" /> Email</label>
            <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="hello@upmark.co" className={inputClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2"><Phone size={14} className="text-[#3B82F6]" /> Phone</label>
            <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+44 (0) 20 0000 0000" className={inputClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#F8FAFC] flex items-center gap-2"><MapPin size={14} className="text-[#3B82F6]" /> Address</label>
            <input value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} placeholder="London, United Kingdom" className={inputClass} />
          </div>
        </div>
      </div>

      <SeoSection config={seo} onChange={handleSeoChange} path="/contact" />

      <div className="flex items-center justify-between py-4">
        <div>{successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}</div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Contact Page Settings
        </button>
      </div>
    </div>
  );
}
