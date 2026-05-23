"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create FormData
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        // Handle error (omitted for brevity)
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
        <h3 className="text-2xl font-bold text-white mb-2 font-heading">Message Sent successfully</h3>
        <p className="text-muted-text">Thank you for reaching out. Our team will review your project and get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="bg-primary-bg/70 border border-white/10 rounded-2xl p-6 md:p-8 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-[10px] uppercase tracking-widest text-muted-text font-bold">Full Name *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              placeholder="Jane Smith"
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-[border-color,box-shadow]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-text font-bold">Email Address *</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              placeholder="jane@company.com"
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-[border-color,box-shadow]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="company" className="text-[10px] uppercase tracking-widest text-muted-text font-bold">Company / Brand</label>
            <input 
              type="text" 
              id="company" 
              name="company" 
              placeholder="Acme Corp"
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-[border-color,box-shadow]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="service" className="text-[10px] uppercase tracking-widest text-muted-text font-bold">Service Interest</label>
            <select 
              id="service" 
              name="service" 
              required
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-[border-color,box-shadow] appearance-none cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled className="text-black">Select a service...</option>
              <option value="marketing_strategy" className="text-black">Marketing Strategy</option>
              <option value="paid_media" className="text-black">Performance Marketing</option>
              <option value="content_production" className="text-black">Content Production</option>
              <option value="seo" className="text-black">SEO & Lead Gen</option>
              <option value="other" className="text-black">Other</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1 h-full">
          <label htmlFor="project" className="text-[10px] uppercase tracking-widest text-muted-text font-bold">Tell us about your project *</label>
          <textarea 
            id="project" 
            name="project" 
            required 
            placeholder="Share your goals, current challenges and any relevant context..."
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-[border-color,box-shadow] min-h-[120px] resize-none h-full"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-accent-blue hover:bg-blue-600 transition-colors text-white font-bold py-4 rounded-lg shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
