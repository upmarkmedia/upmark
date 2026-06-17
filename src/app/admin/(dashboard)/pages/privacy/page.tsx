"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/firestore";
import { revalidatePathAction } from "@/app/actions";
import {
  Save, Loader2, Plus, Trash2, Shield, GripVertical, FileText,
} from "lucide-react";
import type { LegalPageSection } from "@/types";

const inputClass = "w-full bg-primary-bg border border-primary-text/10 rounded-lg px-4 py-3 text-primary-text placeholder-primary-text/30 focus:outline-none focus:border-accent-blue transition-colors text-sm";

const DEFAULT_PRIVACY_SECTIONS: LegalPageSection[] = [
  { title: "1. Introduction", content: "Upmark Media (\"Upmark\", \"we\", \"us\", or \"our\") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, store and share your personal information when you visit our website, use our services, or interact with us in any way." },
  { title: "2. Information We Collect", content: "We may collect the following types of information:\n\n• Contact Information: Name, email address, phone number and company name when you submit our contact form or reach out to us directly.\n• Project Details: Information about your business, marketing goals and project requirements that you share with us during consultations.\n• Usage Data: Information about how you interact with our website, including pages visited, time spent, referring URLs, browser type and device information.\n• Cookies & Analytics: We use cookies and similar tracking technologies to improve your browsing experience and understand site performance." },
  { title: "3. How We Use Your Information", content: "We use your personal information for the following purposes:\n\n• To respond to your enquiries and provide our marketing services\n• To send you relevant communications, proposals and project updates\n• To improve our website, services and user experience\n• To analyse website traffic and usage patterns\n• To comply with legal obligations" },
  { title: "4. Data Sharing", content: "We do not sell, trade or rent your personal information to third parties. We may share data with trusted service providers (such as hosting platforms, analytics tools and email services) who assist us in operating our business. These providers are contractually obligated to protect your data and use it only for the purposes we specify." },
  { title: "5. Data Security", content: "We implement industry-standard security measures to protect your personal information, including encrypted data transmission (SSL/TLS), secure cloud infrastructure and access controls. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security." },
  { title: "6. Data Retention", content: "We retain your personal information only for as long as necessary to fulfil the purposes outlined in this policy, or as required by applicable law. Lead enquiry data is retained for up to 24 months. You may request deletion of your data at any time." },
  { title: "7. Your Rights", content: "You have the right to:\n\n• Access the personal data we hold about you\n• Request correction of inaccurate data\n• Request deletion of your personal data\n• Object to processing of your data\n• Withdraw consent at any time" },
  { title: "8. Cookies", content: "Our website uses essential cookies to ensure proper functionality and analytics cookies (such as Google Analytics) to understand how visitors use our site. You can control cookie preferences through your browser settings. Disabling cookies may affect certain features of the website." },
  { title: "9. Third-Party Links", content: "Our website may contain links to external websites. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review the privacy policies of any external sites you visit." },
  { title: "10. Changes to This Policy", content: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated \"Last updated\" date. We encourage you to review this policy periodically." },
];

export default function PrivacyPageSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [lastUpdated, setLastUpdated] = useState("April 15, 2026");
  const [sections, setSections] = useState<LegalPageSection[]>(DEFAULT_PRIVACY_SECTIONS);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        if (data?.privacyContent) {
          if (data.privacyContent.lastUpdated) setLastUpdated(data.privacyContent.lastUpdated);
          if (data.privacyContent.sections?.length) setSections(data.privacyContent.sections);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const updateSection = (index: number, field: keyof LegalPageSection, value: string) => {
    const arr = [...sections];
    arr[index] = { ...arr[index], [field]: value };
    setSections(arr);
  };

  const addSection = () => {
    setSections([...sections, { title: "", content: "" }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const arr = [...sections];
    const [item] = arr.splice(index, 1);
    arr.splice(newIndex, 0, item);
    setSections(arr);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage("");
    try {
      await updateSiteSettings({
        privacyContent: { lastUpdated, sections },
      });
      await revalidatePathAction("/privacy");
      setSuccessMessage("Privacy policy saved.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save privacy policy.");
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
            <Shield className="text-accent-blue" size={28} /> Privacy Policy
          </h1>
          <p className="text-muted-text mt-2">Edit the privacy policy content shown on the public site.</p>
        </div>
        <div className="flex items-center gap-3">
          {successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save
          </button>
        </div>
      </div>

      {/* ─── Page Header ─── */}
      <div className="bg-secondary-surface border border-primary-text/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText size={20} className="text-accent-blue" />
          <h2 className="text-lg font-semibold text-primary-text">Page Header</h2>
        </div>
        <div>
          <label className="text-sm font-medium text-primary-text mb-1 block">Last Updated Date</label>
          <input
            value={lastUpdated}
            onChange={(e) => setLastUpdated(e.target.value)}
            placeholder="e.g. April 15, 2026"
            className={inputClass}
          />
        </div>
      </div>

      {/* ─── Sections ─── */}
      <div className="bg-secondary-surface border border-primary-text/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-accent-blue" />
            <h2 className="text-lg font-semibold text-primary-text">Sections</h2>
          </div>
          <button onClick={addSection} className="flex items-center gap-2 text-sm text-accent-blue hover:text-accent-blue/80">
            <Plus size={16} /> Add Section
          </button>
        </div>
        <p className="text-sm text-muted-text mb-4">Add, edit, reorder, or remove sections. Use blank lines to separate paragraphs.</p>
        <div className="flex flex-col gap-4">
          {sections.map((section, i) => (
            <div key={i} className="border border-primary-text/10 rounded-xl bg-primary-text/[0.02] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-primary-text/5">
                <span className="text-sm font-semibold text-primary-text flex items-center gap-2">
                  <GripVertical size={14} className="text-muted-text cursor-grab" />
                  Section {i + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveSection(i, -1)}
                    disabled={i === 0}
                    className="p-1.5 text-muted-text hover:text-primary-text hover:bg-primary-text/5 rounded-lg disabled:opacity-30 text-xs"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveSection(i, 1)}
                    disabled={i === sections.length - 1}
                    className="p-1.5 text-muted-text hover:text-primary-text hover:bg-primary-text/5 rounded-lg disabled:opacity-30 text-xs"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeSection(i)}
                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-text mb-1 block">Section Title</label>
                  <input
                    value={section.title}
                    onChange={(e) => updateSection(i, "title", e.target.value)}
                    placeholder='e.g. 1. Introduction'
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-text mb-1 block">Section Content</label>
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(i, "content", e.target.value)}
                    placeholder="Section content. Use blank lines to separate paragraphs."
                    className={`${inputClass} resize-none`}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between py-4">
        <div>{successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}</div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Privacy Policy
        </button>
      </div>
    </div>
  );
}
