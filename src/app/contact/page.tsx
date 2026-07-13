import { ContactForm } from "@/components/forms/ContactForm";
import { Metadata } from "next";
import { getSiteSettings } from "@/lib/firestore";
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
      <div className="bg-accent-blue flex flex-col">
         <div className="container mx-auto px-4 sm:px-6 pt-8 sm:pt-12 md:pt-16 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 lg:gap-y-8 gap-x-8 lg:gap-x-16 items-start">
               
               {/* Title - Order 1 */}
               {infoVisible && (
                  <div className="order-1 flex flex-col gap-3">
                     <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-[#0A0A0A] tracking-tight leading-tight uppercase">
                        Let&apos;s <span className="text-white">create</span><br />something <span className="text-white">great.</span>
                     </h1>
                     <p className="text-[#0A0A0A]/70 text-base sm:text-lg md:text-xl max-w-md font-semibold">
                        Tell us about your project and we&apos;ll get back to you within 24 hours.
                     </p>
                  </div>
               )}

               {/* Form - Order 2 (spans 2 rows on desktop to push cards below title) */}
               {formVisible && (
                  <div className="order-2 w-full lg:row-span-2">
                     <ContactForm variant="yellow" />
                  </div>
               )}

               {/* Cards - Order 3 (flows below title on desktop, below form on mobile) */}
               {infoVisible && (
                  <div className="order-3 flex flex-row gap-4 mt-2 lg:mt-0 w-full">
                     {/* Contact Info — warm ivory box */}
                     <div className="w-1/2 bg-[#F5F1EB] rounded-lg p-4 sm:p-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                           <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#0A0A0A]/10 flex items-center justify-center">
                                 <Mail size={12} className="text-[#0A0A0A]" />
                              </div>
                              <div className="text-[#0A0A0A]/50 uppercase tracking-widest text-[8px] font-bold">Email us</div>
                           </div>
                           <a href={`mailto:${email}`} className="text-[#0A0A0A] text-xs sm:text-sm font-semibold hover:text-accent-gold transition-colors break-all leading-tight">{email}</a>
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#0A0A0A]/10 flex items-center justify-center">
                                 <Phone size={12} className="text-[#0A0A0A]" />
                              </div>
                              <div className="text-[#0A0A0A]/50 uppercase tracking-widest text-[8px] font-bold">Call us</div>
                           </div>
                           <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-[#0A0A0A] text-xs sm:text-sm font-semibold hover:text-accent-gold transition-colors">{phone}</a>
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#0A0A0A]/10 flex items-center justify-center">
                                 <MapPin size={12} className="text-[#0A0A0A]" />
                              </div>
                              <div className="text-[#0A0A0A]/50 uppercase tracking-widest text-[8px] font-bold">Find us</div>
                           </div>
                           <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" className="text-[#0A0A0A] text-xs sm:text-sm font-semibold leading-relaxed hover:text-accent-gold transition-colors">{address}</a>
                        </div>
                     </div>

                     {/* What happens next — rich black box */}
                     <div className="w-1/2 bg-[#0A0A0A] rounded-lg p-4 sm:p-5 flex flex-col justify-between">
                        <h3 className="text-white font-bold mb-3 text-sm">What happens next?</h3>
                        <ul className="flex flex-col gap-3">
                           <li className="flex items-center gap-2.5">
                               <div className="w-5 h-5 rounded-full bg-accent-gold text-[#0A0A0A] flex items-center justify-center font-bold text-[10px] flex-shrink-0">1</div>
                               <div className="text-white/70 text-xs sm:text-sm font-medium leading-tight">We review your brief within 24h</div>
                            </li>
                           <li className="flex items-center gap-2.5">
                               <div className="w-5 h-5 rounded-full bg-accent-gold text-[#0A0A0A] flex items-center justify-center font-bold text-[10px] flex-shrink-0">2</div>
                               <div className="text-white/70 text-xs sm:text-sm font-medium leading-tight">You receive a tailored proposal</div>
                            </li>
                           <li className="flex items-center gap-2.5">
                               <div className="w-5 h-5 rounded-full bg-accent-gold text-[#0A0A0A] flex items-center justify-center font-bold text-[10px] flex-shrink-0">3</div>
                               <div className="text-white/70 text-xs sm:text-sm font-medium leading-tight">Strategy kickoff call within 48h</div>
                            </li>
                           <li className="flex items-center gap-2.5">
                               <div className="w-5 h-5 rounded-full bg-accent-gold text-[#0A0A0A] flex items-center justify-center font-bold text-[10px] flex-shrink-0">4</div>
                               <div className="text-white/70 text-xs sm:text-sm font-medium leading-tight">Your campaign launches in days</div>
                            </li>
                        </ul>
                     </div>
                  </div>
               )}
               
            </div>
         </div>
      </div>
   );
}
