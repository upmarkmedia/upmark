"use client";

import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/firestore";
import { SeoSection } from "@/components/admin/ui/SeoSection";
import { revalidatePathAction } from "@/app/actions";
import { uploadToR2 } from "@/lib/upload";
import {
  Save, Loader2, ChevronDown, Plus, Trash2, Users, BadgeCheck,
  Info, GripVertical, FileText, Upload,
} from "lucide-react";
import type { TeamMember, Investor, SeoPageConfig, PageVisibility } from "@/types";

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
  const [aboutEyebrow, setAboutEyebrow] = useState("");
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutSubtitle, setAboutSubtitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [teamEyebrow, setTeamEyebrow] = useState("");
  const [teamTitle, setTeamTitle] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [investorsEyebrow, setInvestorsEyebrow] = useState("");
  const [investorsTitle, setInvestorsTitle] = useState("");
  const [investorsDescription, setInvestorsDescription] = useState("");
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaDescription, setCtaDescription] = useState("");
  const [seo, setSeo] = useState<SeoPageConfig>(ABOUT_SEO_DEFAULTS);
  const [visibility, setVisibility] = useState<PageVisibility>({});

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        if (data) {
          if (data.teamMembers?.length) setTeamMembers(data.teamMembers);
          if (data.investors?.length) setInvestors(data.investors);
          if (data.aboutEyebrow) setAboutEyebrow(data.aboutEyebrow);
          if (data.aboutTitle) setAboutTitle(data.aboutTitle);
          if (data.aboutSubtitle) setAboutSubtitle(data.aboutSubtitle);
          if (data.aboutDescription) setAboutDescription(data.aboutDescription);
          if (data.teamEyebrow) setTeamEyebrow(data.teamEyebrow);
          if (data.teamTitle) setTeamTitle(data.teamTitle);
          if (data.teamDescription) setTeamDescription(data.teamDescription);
          if (data.investorsEyebrow) setInvestorsEyebrow(data.investorsEyebrow);
          if (data.investorsTitle) setInvestorsTitle(data.investorsTitle);
          if (data.investorsDescription) setInvestorsDescription(data.investorsDescription);
          if (data.ctaTitle) setCtaTitle(data.ctaTitle);
          if (data.ctaDescription) setCtaDescription(data.ctaDescription);
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
        aboutEyebrow: aboutEyebrow || undefined,
        aboutTitle: aboutTitle || undefined,
        aboutSubtitle: aboutSubtitle || undefined,
        aboutDescription: aboutDescription || undefined,
        teamEyebrow: teamEyebrow || undefined,
        teamTitle: teamTitle || undefined,
        teamDescription: teamDescription || undefined,
        investorsEyebrow: investorsEyebrow || undefined,
        investorsTitle: investorsTitle || undefined,
        investorsDescription: investorsDescription || undefined,
        ctaTitle: ctaTitle || undefined,
        ctaDescription: ctaDescription || undefined,
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
            <Info className="text-accent-blue" size={28} /> About Page
          </h1>
          <p className="text-muted-text mt-2">Manage team members, investors, and page SEO.</p>
        </div>
        <div className="flex items-center gap-3">
          {successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save
          </button>
        </div>
      </div>

      {/* ─── Page Content ─── */}
      <Section title="Page Content" icon={FileText} defaultOpen={true}>
        <p className="text-sm text-muted-text mb-4">Edit the headings and text for each section on the About page.</p>
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-md font-semibold text-primary-text mb-3">About Section</h3>
            <div className="flex flex-col gap-3">
              <input value={aboutEyebrow} onChange={(e) => setAboutEyebrow(e.target.value)} placeholder='Eyebrow label (e.g. "ABOUT US")' className={inputClass} />
              <input value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} placeholder='Title (e.g. "Most agencies only...")' className={inputClass} />
              <p className="text-xs text-muted-text">Wrap text in **double asterisks** to highlight in yellow, e.g. **RUN ADS**</p>
              <input value={aboutSubtitle} onChange={(e) => setAboutSubtitle(e.target.value)} placeholder='Subtitle (e.g. "Upmark builds...")' className={inputClass} />
              <textarea value={aboutDescription} onChange={(e) => setAboutDescription(e.target.value)} placeholder="Description (separate paragraphs with a blank line)" className={`${inputClass} resize-none`} rows={4} />
            </div>
          </div>
          <div>
            <h3 className="text-md font-semibold text-primary-text mb-3">Team Section</h3>
            <div className="flex flex-col gap-3">
              <input value={teamEyebrow} onChange={(e) => setTeamEyebrow(e.target.value)} placeholder='Eyebrow label (e.g. "MEET THE TEAM")' className={inputClass} />
              <input value={teamTitle} onChange={(e) => setTeamTitle(e.target.value)} placeholder='Title (e.g. "The people behind the work")' className={inputClass} />
              <p className="text-xs text-muted-text">Wrap text in **double asterisks** to highlight in yellow</p>
              <textarea value={teamDescription} onChange={(e) => setTeamDescription(e.target.value)} placeholder="Section description" className={`${inputClass} resize-none`} rows={2} />
            </div>
          </div>
          <div>
            <h3 className="text-md font-semibold text-primary-text mb-3">Investors Section</h3>
            <div className="flex flex-col gap-3">
              <input value={investorsEyebrow} onChange={(e) => setInvestorsEyebrow(e.target.value)} placeholder='Eyebrow label (e.g. "OUR INVESTORS")' className={inputClass} />
              <input value={investorsTitle} onChange={(e) => setInvestorsTitle(e.target.value)} placeholder='Title (e.g. "Backed by visionaries")' className={inputClass} />
              <p className="text-xs text-muted-text">Wrap text in **double asterisks** to highlight in yellow</p>
              <textarea value={investorsDescription} onChange={(e) => setInvestorsDescription(e.target.value)} placeholder="Section description" className={`${inputClass} resize-none`} rows={2} />
            </div>
          </div>
          <div>
            <h3 className="text-md font-semibold text-primary-text mb-3">CTA Section</h3>
            <div className="flex flex-col gap-3">
              <input value={ctaTitle} onChange={(e) => setCtaTitle(e.target.value)} placeholder='Title (e.g. "Ready to build your marketing system?")' className={inputClass} />
              <textarea value={ctaDescription} onChange={(e) => setCtaDescription(e.target.value)} placeholder="CTA description" className={`${inputClass} resize-none`} rows={2} />
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Meet the Team ─── */}
      <Section title="Meet the Team" icon={Users} defaultOpen={true}>
        <p className="text-sm text-muted-text mb-4">Add and manage team members shown on the About page.</p>
        <div className="flex flex-col gap-6">
          {teamMembers.map((member, i) => {
            const updateMember = (field: keyof TeamMember, value: string) => {
              const arr = [...teamMembers];
              arr[i] = { ...arr[i], [field]: value };
              setTeamMembers(arr);
            };
            return (
              <div key={i} className="border border-primary-text/10 rounded-xl bg-primary-text/[0.02] overflow-hidden">
                <div className="flex justify-between items-center px-4 pt-4 pb-2">
                  <span className="text-sm font-semibold text-primary-text flex items-center gap-2">
                    <GripVertical size={14} className="text-muted-text" />
                    Team Member {i + 1}
                  </span>
                  <button type="button" onClick={() => setTeamMembers(teamMembers.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
                </div>
                <div className="flex flex-col lg:flex-row gap-0">
                  {/* ── Left: Live Card Preview ── */}
                  <div className="lg:w-[300px] flex-shrink-0 p-4">
                    <div className="relative w-full max-w-[280px] mx-auto">
                      <label className="text-xs font-medium text-muted-text mb-2 block">Card Preview</label>
                      <label
                        className="group relative bg-secondary-surface/40 border border-primary-text/10 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 aspect-[3/4] block"
                      >
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await uploadToR2(file);
                                updateMember("imageUrl", url);
                              } catch (err) {
                                console.error(err);
                                alert("Upload failed");
                              }
                            }
                          }}
                        />
                        {member.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={member.imageUrl}
                            alt={member.name || "Team member"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-accent-blue/10 to-accent-gold/5 gap-2">
                            <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center">
                              <Upload size={18} className="text-accent-blue" />
                            </div>
                            <span className="text-xs text-muted-text">Click to upload photo</span>
                          </div>
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {member.imageUrl ? (
                            <>
                              <span className="px-3 py-1.5 bg-accent-blue text-white text-xs font-medium rounded-lg">Replace</span>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); updateMember("imageUrl", ""); }}
                                className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                              >
                                <Trash2 size={12} />
                              </button>
                            </>
                          ) : (
                            <span className="px-3 py-1.5 bg-accent-blue text-white text-xs font-medium rounded-lg">Upload Photo</span>
                          )}
                        </div>
                        {/* Text overlay (matches public card) */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 z-10 bg-gradient-to-t from-black via-black/70 to-transparent">
                          {member.cardOverlayText && (
                            <p className="text-white/80 text-xs font-medium mb-0.5">{member.cardOverlayText}</p>
                          )}
                          <h3 className="text-sm font-bold text-white truncate">{member.name || "Name"}</h3>
                          <p className="text-xs font-semibold text-blue-400 truncate">{member.specialty || "Specialty"}</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* ── Right: Input Fields ── */}
                  <div className="flex-1 p-4 pt-2 lg:pt-4 flex flex-col gap-3 border-t lg:border-t-0 lg:border-l border-primary-text/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-text mb-1 block">Full Name</label>
                        <input value={member.name} onChange={(e) => updateMember("name", e.target.value)} placeholder="e.g. Anisha Kapoor" className={inputClass} />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-text mb-1 block">Specialty</label>
                        <input value={member.specialty} onChange={(e) => updateMember("specialty", e.target.value)} placeholder="e.g. Founder & CBO" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-text mb-1 block">Card Overlay Text</label>
                      <input value={member.cardOverlayText || ""} onChange={(e) => updateMember("cardOverlayText", e.target.value)} placeholder="e.g. Leadership Team" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-text mb-1 block">Description</label>
                      <textarea value={member.description} onChange={(e) => updateMember("description", e.target.value)} placeholder="Brief description about this team member" className={`${inputClass} resize-none`} rows={3} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <button type="button" onClick={() => setTeamMembers([...teamMembers, { name: "", specialty: "", description: "" }])} className="flex items-center gap-2 text-sm text-accent-blue hover:text-accent-blue/80 self-start">
            <Plus size={16} /> Add Team Member
          </button>
        </div>
      </Section>

      {/* ─── Meet the Investors ─── */}
      <Section title="Meet the Investors" icon={BadgeCheck}>
        <p className="text-sm text-muted-text mb-4">Add and manage investors shown on the About page.</p>
        <div className="flex flex-col gap-6">
          {investors.map((investor, i) => {
            const updateInvestor = (field: keyof Investor, value: string) => {
              const arr = [...investors];
              arr[i] = { ...arr[i], [field]: value };
              setInvestors(arr);
            };
            return (
              <div key={i} className="border border-primary-text/10 rounded-xl bg-primary-text/[0.02] overflow-hidden">
                <div className="flex justify-between items-center px-4 pt-4 pb-2">
                  <span className="text-sm font-semibold text-primary-text flex items-center gap-2">
                    <GripVertical size={14} className="text-muted-text" />
                    Investor {i + 1}
                  </span>
                  <button type="button" onClick={() => setInvestors(investors.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={14} /></button>
                </div>
                <div className="flex flex-col lg:flex-row gap-0">
                  {/* ── Left: Live Card Preview ── */}
                  <div className="lg:w-[300px] flex-shrink-0 p-4">
                    <div className="relative w-full max-w-[280px] mx-auto">
                      <label className="text-xs font-medium text-muted-text mb-2 block">Card Preview</label>
                      <label
                        className="group relative bg-secondary-surface/40 border border-primary-text/10 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 aspect-[3/4] block"
                      >
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await uploadToR2(file);
                                updateInvestor("imageUrl", url);
                              } catch (err) {
                                console.error(err);
                                alert("Upload failed");
                              }
                            }
                          }}
                        />
                        {investor.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={investor.imageUrl}
                            alt={investor.name || "Investor"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-accent-gold/10 to-accent-blue/5 gap-2">
                            <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center">
                              <Upload size={18} className="text-accent-gold" />
                            </div>
                            <span className="text-xs text-muted-text">Click to upload photo</span>
                          </div>
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {investor.imageUrl ? (
                            <>
                              <span className="px-3 py-1.5 bg-accent-blue text-white text-xs font-medium rounded-lg">Replace</span>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); updateInvestor("imageUrl", ""); }}
                                className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                              >
                                <Trash2 size={12} />
                              </button>
                            </>
                          ) : (
                            <span className="px-3 py-1.5 bg-accent-blue text-white text-xs font-medium rounded-lg">Upload Photo</span>
                          )}
                        </div>
                        {/* Text overlay (matches public card) */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 z-10 bg-gradient-to-t from-black via-black/70 to-transparent">
                          {investor.cardOverlayText && (
                            <p className="text-white/80 text-xs font-medium mb-0.5">{investor.cardOverlayText}</p>
                          )}
                          <h3 className="text-sm font-bold text-white truncate">{investor.name || "Name"}</h3>
                          <p className="text-xs font-semibold text-amber-400 truncate">{investor.specialty || "Specialty"}</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* ── Right: Input Fields ── */}
                  <div className="flex-1 p-4 pt-2 lg:pt-4 flex flex-col gap-3 border-t lg:border-t-0 lg:border-l border-primary-text/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-text mb-1 block">Full Name</label>
                        <input value={investor.name} onChange={(e) => updateInvestor("name", e.target.value)} placeholder="e.g. John Smith" className={inputClass} />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-text mb-1 block">Role / Background</label>
                        <input value={investor.specialty} onChange={(e) => updateInvestor("specialty", e.target.value)} placeholder="e.g. Angel Investor" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-text mb-1 block">Card Overlay Text</label>
                      <input value={investor.cardOverlayText || ""} onChange={(e) => updateInvestor("cardOverlayText", e.target.value)} placeholder="e.g. Early Backer" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-text mb-1 block">Description</label>
                      <textarea value={investor.description} onChange={(e) => updateInvestor("description", e.target.value)} placeholder="Brief description about this investor" className={`${inputClass} resize-none`} rows={3} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <button type="button" onClick={() => setInvestors([...investors, { name: "", specialty: "", description: "" }])} className="flex items-center gap-2 text-sm text-accent-blue hover:text-accent-blue/80 self-start">
            <Plus size={16} /> Add Investor
          </button>
        </div>
      </Section>

      {/* ─── Page & Section Visibility ────────────── */}
      <div className="bg-secondary-surface border border-primary-text/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent-blue" />
          <h2 className="text-lg font-semibold text-primary-text">Visibility</h2>
        </div>
        <p className="text-sm text-muted-text mb-4">Toggle sections on/off on the public About page.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { key: "about", label: "Page (entire about page)" },
            { key: "aboutTeam", label: "Meet the Team" },
            { key: "aboutInvestors", label: "Meet the Investors" },
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

      <SeoSection config={seo} onChange={handleSeoChange} path="/about" />

      <div className="flex items-center justify-between py-4">
        <div>{successMessage && <span className="text-emerald-400 text-sm">{successMessage}</span>}</div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save About Page Settings
        </button>
      </div>
    </div>
  );
}
