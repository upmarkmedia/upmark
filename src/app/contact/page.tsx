import { ContactForm } from "@/components/forms/ContactForm";
import { Metadata } from "next";
import { getAdminSiteSettings as getSiteSettings } from "@/lib/firebase-admin";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
   title: "Contact Us | Upmark",
   description: "Start a conversation with Upmark. We're ready to build your marketing system.",
};

export default async function ContactPage() {
   const settings = await getSiteSettings();

   const vis = settings?.visibility ?? {};
   const show = (key: string) => vis[key as keyof typeof vis] ?? true;

   const email = settings?.contactEmail || "hello@upmark.co";
   const phone = settings?.contactPhone || "+91 98765 43210";
   const address = settings?.contactAddress || "WeWork, BKC, Mumbai 400051, India";

   const pageVisible = show("contact");
   const infoVisible = show("contactInfo");
   const formVisible = show("contactForm");

   if (!pageVisible) return null;

   return (
      // Added flex, flex-col, and justify-center to vertically center the content. 
      // Adjusted padding (pt-24 pb-8) so it stays visually balanced against your fixed navbar.
      <div className="min-h-screen pt-24 sm:pt-28 md:pt-36 pb-8 sm:pb-12">
         <section className="container mx-auto px-4 sm:px-6 relative z-10 w-full max-w-5xl overflow-hidden md:overflow-visible">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-accent-blue/8 blur-[60px] md:blur-[80px] pointer-events-none rounded-full"></div>

            {(infoVisible || formVisible) && (
            <div className="text-center mb-6 sm:mb-8 relative z-10">
               <span className="text-secondary-surface-dark font-extrabold tracking-[0.2em] uppercase text-xl mb-3">
                  LET&apos;S TALK
               </span>
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-primary-text tracking-tight leading-tight mb-4 uppercase">
                  Ready to <span className="text-accent-blue">Grow?</span>
               </h1>
               <p className="text-muted-text text-sm sm:text-lg max-w-2xl font-light mx-auto">
                  Tell us about your project and we&apos;ll get back to you within 24 hours.
               </p>
            </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 relative z-10 items-stretch">
               {/* Form Column */}
               {formVisible && (
               <div className="lg:w-2/3 h-full order-1 lg:order-2">
                  <ContactForm />

                  {/* What happens next — mobile only */}
                  {infoVisible && (
                  <div className="lg:hidden mt-8 p-5 sm:p-6 rounded-sm bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 border border-accent-blue/20">
                     <h3 className="text-primary-text font-bold mb-4 text-base">What happens next?</h3>
                     <ul className="flex flex-col gap-3">
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full border border-primary-text/20 text-primary-text/50 flex items-center justify-center font-bold text-xs">1</div>
                            <div className="text-muted-text text-xs">We review your brief within 24h</div>
                         </li>
                         <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full border border-primary-text/20 text-primary-text/50 flex items-center justify-center font-bold text-xs">2</div>
                            <div className="text-muted-text text-xs">You receive a tailored proposal</div>
                         </li>
                         <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full border border-primary-text/20 text-primary-text/50 flex items-center justify-center font-bold text-xs">3</div>
                            <div className="text-muted-text text-xs">Strategy kickoff call within 48h</div>
                         </li>
                         <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full border border-primary-text/20 text-primary-text/50 flex items-center justify-center font-bold text-xs">4</div>
                            <div className="text-muted-text text-xs">Your campaign launches in days</div>
                         </li>
                     </ul>
                  </div>
                  )}
               </div>
               )}

               {/* Info Column */}
               {infoVisible && (
               <div className="lg:w-1/3 flex flex-col gap-4 sm:gap-6 order-2 lg:order-1">
                   <div className="p-5 sm:p-6 rounded-sm bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 border border-accent-blue/20 flex flex-col gap-5">
                      <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-full bg-accent-blue/15 flex items-center justify-center flex-shrink-0">
                           <Mail size={18} className="text-accent-blue" />
                         </div>
                         <div>
                           <div className="text-accent-blue uppercase tracking-widest text-[10px] font-bold mb-1">Email us</div>
                           <a href={`mailto:${email}`} className="text-primary-text text-sm font-medium hover:text-accent-blue transition-colors duration-200">{email}</a>
                         </div>
                      </div>
                      <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-full bg-accent-blue/15 flex items-center justify-center flex-shrink-0">
                           <Phone size={18} className="text-accent-blue" />
                         </div>
                         <div>
                           <div className="text-accent-blue uppercase tracking-widest text-[10px] font-bold mb-1">Call us</div>
                           <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-primary-text text-sm font-medium hover:text-accent-blue transition-colors duration-200">{phone}</a>
                         </div>
                      </div>
                      <div className="flex items-start gap-4">
                         <div className="w-10 h-10 rounded-full bg-accent-blue/15 flex items-center justify-center flex-shrink-0">
                           <MapPin size={18} className="text-accent-blue" />
                         </div>
                         <div>
                           <div className="text-accent-blue uppercase tracking-widest text-[10px] font-bold mb-1">Find us</div>
                           <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" className="text-primary-text text-sm font-medium leading-relaxed hover:text-accent-blue transition-colors duration-200">{address}</a>
                         </div>
                      </div>
                  </div>

                  {/* What happens next — desktop only */}
                  <div className="hidden lg:block">
                     <h3 className="text-primary-text font-bold mb-4 text-base">What happens next?</h3>
                     <ul className="flex flex-col gap-3">
                        <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full border border-primary-text/20 text-primary-text/50 flex items-center justify-center font-bold text-xs">1</div>
                            <div className="text-muted-text text-xs">We review your brief within 24h</div>
                         </li>
                         <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full border border-primary-text/20 text-primary-text/50 flex items-center justify-center font-bold text-xs">2</div>
                            <div className="text-muted-text text-xs">You receive a tailored proposal</div>
                         </li>
                         <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full border border-primary-text/20 text-primary-text/50 flex items-center justify-center font-bold text-xs">3</div>
                            <div className="text-muted-text text-xs">Strategy kickoff call within 48h</div>
                         </li>
                         <li className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full border border-primary-text/20 text-primary-text/50 flex items-center justify-center font-bold text-xs">4</div>
                            <div className="text-muted-text text-xs">Your campaign launches in days</div>
                         </li>
                     </ul>
                  </div>
               </div>
               )}
            </div>
         </section>
      </div>
   );
}