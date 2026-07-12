"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

const SERVICES = [
  { id: "content-engine", label: "Content Engine" },
  { id: "marketing-strategy", label: "Marketing Strategy" },
  { id: "production-post", label: "Production & Post" },
  { id: "packaging-design", label: "Packaging Design" },
  { id: "performance-marketing", label: "Performance Marketing" },
  { id: "social-media", label: "Social Media Management" },
  { id: "seo-lead-gen", label: "SEO & Lead Generation" },
];

interface ContactFormProps {
  variant?: "default" | "yellow";
}

  const inputYellow = "bg-white/40 border-[#0A0A0A]/30 text-[#0A0A0A] placeholder-[#0A0A0A]/40 focus:border-[#0A0A0A] focus:ring-[#0A0A0A] font-medium";
const inputDefault = "bg-primary-text/5 border-primary-text/10 text-primary-text placeholder-primary-text/30 focus:border-accent-blue focus:ring-accent-blue";

export const ContactForm = ({ variant = "default" }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const isYellow = variant === "yellow";

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedServices.length === 0) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    data.services = JSON.stringify(selectedServices);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        console.error("Submission failed");
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={isYellow ? "bg-[#0A0A0A] border-white/10 border rounded-sm p-10 text-center" : "bg-secondary-surface/50 border border-primary-text/10 rounded-sm p-10 text-center"}>
        <div className="w-16 h-16 bg-accent-blue/20 rounded-sm flex items-center justify-center mx-auto mb-6">
          <Send className="text-accent-blue" size={32} />
        </div>
        <h3 className={isYellow ? "text-2xl font-bold mb-2 font-heading uppercase text-white" : "text-2xl font-bold text-primary-text mb-2 font-heading uppercase"}>Message Sent</h3>
        <p className={isYellow ? "text-white/60" : "text-muted-text"}>Thank you for reaching out. Our team will review your project and get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="bg-transparent w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-1.5 sm:gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
          <div className="flex flex-col gap-0.5">
            <label htmlFor="name" className={isYellow ? "text-[10px] sm:text-[11px] uppercase tracking-widest font-extrabold text-[#0A0A0A]" : "text-[10px] uppercase tracking-widest text-muted-text font-bold"}>Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Aditya"
              className={`${isYellow ? inputYellow : inputDefault} border-2 rounded-none px-4 py-3 sm:px-5 sm:py-3.5 text-sm focus:outline-none focus:ring-2 transition-[border-color,box-shadow]`}
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <label htmlFor="phone" className={isYellow ? "text-[10px] sm:text-[11px] uppercase tracking-widest font-extrabold text-[#0A0A0A]" : "text-[10px] uppercase tracking-widest text-muted-text font-bold"}>Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="+91 9891392912"
              className={`${isYellow ? inputYellow : inputDefault} border-2 rounded-none px-4 py-3 sm:px-5 sm:py-3.5 text-sm focus:outline-none focus:ring-2 transition-[border-color,box-shadow]`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <label htmlFor="email" className={isYellow ? "text-[10px] sm:text-[11px] uppercase tracking-widest font-extrabold text-[#0A0A0A]" : "text-[10px] uppercase tracking-widest text-muted-text font-bold"}>Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="you@email.com"
            className={`${isYellow ? inputYellow : inputDefault} border-2 rounded-none px-4 py-3 sm:px-5 sm:py-3.5 text-sm focus:outline-none focus:ring-2 transition-[border-color,box-shadow]`}
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <label htmlFor="company" className={isYellow ? "text-[10px] sm:text-[11px] uppercase tracking-widest font-extrabold text-[#0A0A0A]" : "text-[10px] uppercase tracking-widest text-muted-text font-bold"}>Company / Brand</label>
          <input
            type="text"
            id="company"
            name="company"
            placeholder="acaditya10"
            className={`${isYellow ? inputYellow : inputDefault} border-2 rounded-none px-4 py-3 sm:px-5 sm:py-3.5 text-sm focus:outline-none focus:ring-2 transition-[border-color,box-shadow]`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className={isYellow ? "text-[10px] sm:text-[11px] uppercase tracking-widest font-extrabold text-[#0A0A0A]" : "text-[10px] uppercase tracking-widest text-muted-text font-bold"}>Services Interested In *</label>
          <input type="hidden" name="services" value={JSON.stringify(selectedServices)} />
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {SERVICES.map((svc) => {
              const isSelected = selectedServices.includes(svc.id);
              let btnClass = "px-3 py-2 sm:px-5 sm:py-2.5 rounded-none text-xs sm:text-sm font-bold transition-all ";
              if (isSelected) {
                btnClass += isYellow ? "bg-[#0A0A0A] text-white shadow-lg" : "bg-accent-blue text-white";
              } else if (isYellow) {
                btnClass += "bg-white/30 border border-[#0A0A0A]/30 text-[#0A0A0A] hover:bg-[#0A0A0A]/10 hover:border-[#0A0A0A]/50";
              } else {
                btnClass += "bg-primary-text/5 border border-primary-text/10 text-muted-text hover:border-accent-blue/40 hover:text-accent-blue";
              }
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => toggleService(svc.id)}
                  className={btnClass}
                >
                  {svc.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || selectedServices.length === 0}
          className={isYellow
            ? "w-full bg-[#0A0A0A] hover:bg-[#0A0A0A]/80 transition-all text-white font-extrabold text-sm sm:text-base py-2.5 sm:py-3.5 rounded-none flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99]"
            : "w-full bg-accent-blue hover:bg-amber-500 transition-colors text-white font-bold py-3 sm:py-4 rounded-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          }
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Start a Conversation <Send size={18} />
            </>
          )}
        </button>
        <p className={isYellow ? "text-center text-[10px] text-[#0A0A0A]/50 font-medium" : "text-center text-[10px] text-muted-text/60"}>No spam. Your data is kept private and never shared.</p>
      </form>
    </div>
  );
};
