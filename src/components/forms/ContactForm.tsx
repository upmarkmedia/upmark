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

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

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
      <div className="bg-secondary-surface/50 border border-accent-blue/30 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 bg-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="text-accent-blue" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-primary-text mb-2 font-heading">Message Sent successfully</h3>
        <p className="text-muted-text">Thank you for reaching out. Our team will review your project and get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="bg-primary-bg/70 border border-primary-text/10 rounded-2xl p-4 sm:p-6 md:p-8 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-[10px] uppercase tracking-widest text-muted-text font-bold">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Aditya"
              className="bg-primary-text/5 border border-primary-text/10 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-primary-text placeholder-primary-text/30 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-[border-color,box-shadow]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-text font-bold">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@email.com"
              className="bg-primary-text/5 border border-primary-text/10 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-primary-text placeholder-primary-text/30 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-[border-color,box-shadow]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="company" className="text-[10px] uppercase tracking-widest text-muted-text font-bold">Company / Brand</label>
          <input
            type="text"
            id="company"
            name="company"
            placeholder="acaditya10"
            className="bg-primary-text/5 border border-primary-text/10 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-primary-text placeholder-primary-text/30 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-[border-color,box-shadow]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-widest text-muted-text font-bold">Services Interested In *</label>
          <input type="hidden" name="services" value={JSON.stringify(selectedServices)} />
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {SERVICES.map((svc) => {
              const isSelected = selectedServices.includes(svc.id);
              return (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => toggleService(svc.id)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-accent-blue text-white shadow-sm"
                      : "bg-primary-text/5 border border-primary-text/10 text-muted-text hover:border-accent-blue/40 hover:text-accent-blue"
                  }`}
                >
                  {svc.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="project" className="text-[10px] uppercase tracking-widest text-muted-text font-bold">Project Details *</label>
          <textarea
            id="project"
            name="project"
            required
            placeholder="Goals, challenges, context..."
            className="bg-primary-text/5 border border-primary-text/10 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-primary-text placeholder-primary-text/30 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-[border-color,box-shadow] min-h-[80px] sm:min-h-[120px] resize-none h-full"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || selectedServices.length === 0}
          className="w-full bg-accent-blue hover:bg-blue-600 transition-colors text-white font-bold py-3 sm:py-4 rounded-lg shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Start a Conversation <Send size={16} />
            </>
          )}
        </button>
        <p className="text-center text-[10px] text-muted-text/60">No spam. Your data is kept private and never shared.</p>
      </form>
    </div>
  );
};
