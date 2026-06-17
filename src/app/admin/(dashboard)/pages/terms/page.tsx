"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/firestore";
import { revalidatePathAction } from "@/app/actions";
import {
  Save, Loader2, Plus, Trash2, Scale, GripVertical, FileText,
} from "lucide-react";
import type { LegalPageSection } from "@/types";

const inputClass = "w-full bg-primary-bg border border-primary-text/10 rounded-lg px-4 py-3 text-primary-text placeholder-primary-text/30 focus:outline-none focus:border-accent-blue transition-colors text-sm";

const DEFAULT_TERMS_SECTIONS: LegalPageSection[] = [
  { title: "1. Acceptance of Terms", content: "By accessing or using the Upmark Media website (\"Site\") or engaging our services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should not use our Site or services. These terms apply to all visitors, users and clients." },
  { title: "2. Services", content: "Upmark Media provides integrated marketing services including, but not limited to, marketing strategy, performance marketing, content production, social media management and SEO. The specific scope, deliverables and timelines of services are defined in individual project proposals and agreements signed between Upmark and the client." },
  { title: "3. Intellectual Property", content: "All content on this website — including text, graphics, logos, images, videos, animations and software — is the property of Upmark Media or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, modify or create derivative works from any content on this Site without our express written permission.\n\nFor client work, intellectual property rights and ownership of deliverables are governed by the individual service agreement between Upmark and the client. Upon full payment, clients typically receive full ownership of the deliverables created for them." },
  { title: "4. Client Responsibilities", content: "When engaging our services, clients agree to:\n\n• Provide accurate and timely information, materials and feedback required for project execution\n• Make payments according to the agreed schedule outlined in the project proposal\n• Review and approve deliverables within the timelines specified in the agreement\n• Ensure they have the legal right to use any materials (logos, images, copy) provided to Upmark" },
  { title: "5. Payment Terms", content: "Payment terms are specified in individual project proposals. Unless otherwise agreed, invoices are payable within 14 days of issue. Late payments may incur interest charges at 2% per month on the outstanding balance. Upmark reserves the right to suspend services for overdue accounts." },
  { title: "6. Confidentiality", content: "Both parties agree to maintain the confidentiality of any proprietary or sensitive information shared during the course of the engagement. This includes business strategies, financial data, campaign performance metrics and any other information designated as confidential. This obligation survives the termination of any agreement." },
  { title: "7. Limitation of Liability", content: "To the maximum extent permitted by law, Upmark Media shall not be liable for any indirect, incidental, special, consequential or punitive damages arising from or related to your use of our Site or services. Our total liability for any claim shall not exceed the total fees paid by the client for the specific service giving rise to the claim." },
  { title: "8. Termination", content: "Either party may terminate a service engagement by providing 30 days written notice. Upon termination, the client shall pay for all work completed up to the termination date. Any pre-paid fees for undelivered work will be refunded on a pro-rata basis. Upmark reserves the right to terminate services immediately in case of material breach by the client." },
  { title: "9. Website Use", content: "You agree not to:\n\n• Use our Site for any unlawful purpose or in violation of any applicable laws\n• Attempt to gain unauthorised access to any part of the Site or its systems\n• Interfere with or disrupt the integrity or performance of the Site\n• Use automated systems (bots, scrapers) to access the Site without our written consent" },
  { title: "10. Governing Law", content: "These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising from or related to these terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra." },
  { title: "11. Changes to Terms", content: "Upmark reserves the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to this page. Your continued use of the Site after any changes constitutes acceptance of the updated terms." },
];

export default function TermsPageSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [lastUpdated, setLastUpdated] = useState("April 15, 2026");
  const [sections, setSections] = useState<LegalPageSection[]>(DEFAULT_TERMS_SECTIONS);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        if (data?.termsContent) {
          if (data.termsContent.lastUpdated) setLastUpdated(data.termsContent.lastUpdated);
          if (data.termsContent.sections?.length) setSections(data.termsContent.sections);
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
        termsContent: { lastUpdated, sections },
      });
      await revalidatePathAction("/terms");
      setSuccessMessage("Terms of service saved.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save terms of service.");
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
            <Scale className="text-accent-blue" size={28} /> Terms of Service
          </h1>
          <p className="text-muted-text mt-2">Edit the terms of service content shown on the public site.</p>
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
                    placeholder='e.g. 1. Acceptance of Terms'
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
          Save Terms of Service
        </button>
      </div>
    </div>
  );
}
