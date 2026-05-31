import { ContactForm } from "@/components/forms/ContactForm";
import { Metadata } from "next";
import { getSiteSettings } from "@/lib/firestore";

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
      <div className="min-h-screen pt-20 sm:pt-24 md:pt-32 pb-8 sm:pb-12">
         <section className="container mx-auto px-4 sm:px-6 relative z-10 w-full max-w-5xl overflow-hidden md:overflow-visible">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-accent-blue/8 blur-[60px] md:blur-[80px] pointer-events-none rounded-full"></div>

            {(infoVisible || formVisible) && (
            <div className="text-center mb-6 sm:mb-8 relative z-10">
               <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs mb-2 block inline-flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-accent-blue"></span>
                  LET&apos;S TALK
                  <span className="w-8 h-[1px] bg-accent-blue"></span>
               </span>
               <h1 className="text-2xl sm:text-3xl md:text-5xl font-black font-heading text-white tracking-tight mb-3 sm:mb-4">
                  Ready to <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-blue-400">Grow?</span>
               </h1>
               <p className="text-muted-text text-sm sm:text-lg max-w-2xl font-light mx-auto">
                  Tell us about your project and we&apos;ll get back to you within 24 hours.
               </p>
            </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 relative z-10 items-stretch">
               {/* Info Column */}
               {infoVisible && (
               <div className="lg:w-1/3 flex flex-col gap-4 sm:gap-6">
                  <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4">
                     <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-accent-blue uppercase tracking-widest text-[10px] font-bold mb-1">Email us</div>
                        <a href={`mailto:${email}`} className="text-white text-xs sm:text-sm font-medium truncate block">{email}</a>
                     </div>
                     <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-accent-blue uppercase tracking-widest text-[10px] font-bold mb-1">Call us</div>
                        <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-white text-xs sm:text-sm font-medium truncate block">{phone}</a>
                     </div>
                     <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-accent-blue uppercase tracking-widest text-[10px] font-bold mb-1">Find us</div>
                        <div className="text-white text-xs sm:text-sm font-medium">{address}</div>
                     </div>
                  </div>

                  <div className="hidden lg:block">
                     <h3 className="text-white font-bold mb-4 text-base">What happens next?</h3>
                     <ul className="flex flex-col gap-3">
                        <li className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded-full border border-white/20 text-white/50 flex items-center justify-center font-bold text-xs">1</div>
                           <div className="text-muted-text text-xs">We review your brief within 24h</div>
                        </li>
                        <li className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded-full border border-white/20 text-white/50 flex items-center justify-center font-bold text-xs">2</div>
                           <div className="text-muted-text text-xs">You receive a tailored proposal</div>
                        </li>
                        <li className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded-full border border-white/20 text-white/50 flex items-center justify-center font-bold text-xs">3</div>
                           <div className="text-muted-text text-xs">Strategy kickoff call within 48h</div>
                        </li>
                        <li className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded-full border border-white/20 text-white/50 flex items-center justify-center font-bold text-xs">4</div>
                           <div className="text-muted-text text-xs">Your campaign launches in days</div>
                        </li>
                     </ul>
                  </div>
               </div>
               )}

               {/* Form Column */}
               {formVisible && (
               <div className="lg:w-2/3 h-full">
                  <ContactForm />
               </div>
               )}
            </div>
         </section>
      </div>
   );
}