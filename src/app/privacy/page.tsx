import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/firestore";

export const metadata: Metadata = {
  title: "Privacy Policy | Upmark",
  description: "Learn how Upmark Media collects, uses and protects your personal data.",
};

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();
  const email = settings?.contactEmail || "hello@upmark.co";
  const phone = settings?.contactPhone || "+91 98765 43210";
  const address = settings?.contactAddress || "WeWork, BKC, Mumbai 400051, India";
  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-32">
      <section className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10">
        <div className="mb-10 sm:mb-16">
          <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs mb-4 block flex items-center gap-4">
            <span className="w-8 h-[1px] bg-accent-blue"></span>
            LEGAL
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black font-heading text-white tracking-tight mb-4 sm:mb-6">
            Privacy Policy
          </h1>
          <p className="text-muted-text text-base sm:text-lg font-light">
            Last updated: April 15, 2026
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 sm:space-y-10">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">1. Introduction</h2>
            <p className="text-muted-text leading-relaxed">
              Upmark Media (&quot;Upmark&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, store and share your personal information when you visit our website, use our services, or interact with us in any way.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
            <p className="text-muted-text leading-relaxed">We may collect the following types of information:</p>
            <ul className="list-disc list-inside text-muted-text space-y-2 pl-4">
              <li><strong className="text-white">Contact Information:</strong> Name, email address, phone number and company name when you submit our contact form or reach out to us directly.</li>
              <li><strong className="text-white">Project Details:</strong> Information about your business, marketing goals and project requirements that you share with us during consultations.</li>
              <li><strong className="text-white">Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, referring URLs, browser type and device information.</li>
              <li><strong className="text-white">Cookies & Analytics:</strong> We use cookies and similar tracking technologies to improve your browsing experience and understand site performance.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. How We Use Your Information</h2>
            <p className="text-muted-text leading-relaxed">We use your personal information for the following purposes:</p>
            <ul className="list-disc list-inside text-muted-text space-y-2 pl-4">
              <li>To respond to your enquiries and provide our marketing services</li>
              <li>To send you relevant communications, proposals and project updates</li>
              <li>To improve our website, services and user experience</li>
              <li>To analyse website traffic and usage patterns</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Data Sharing</h2>
            <p className="text-muted-text leading-relaxed">
              We do not sell, trade or rent your personal information to third parties. We may share data with trusted service providers (such as hosting platforms, analytics tools and email services) who assist us in operating our business. These providers are contractually obligated to protect your data and use it only for the purposes we specify.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Data Security</h2>
            <p className="text-muted-text leading-relaxed">
              We implement industry-standard security measures to protect your personal information, including encrypted data transmission (SSL/TLS), secure cloud infrastructure and access controls. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">6. Data Retention</h2>
            <p className="text-muted-text leading-relaxed">
              We retain your personal information only for as long as necessary to fulfil the purposes outlined in this policy, or as required by applicable law. Lead enquiry data is retained for up to 24 months. You may request deletion of your data at any time.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">7. Your Rights</h2>
            <p className="text-muted-text leading-relaxed">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-text space-y-2 pl-4">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">8. Cookies</h2>
            <p className="text-muted-text leading-relaxed">
              Our website uses essential cookies to ensure proper functionality and analytics cookies (such as Google Analytics) to understand how visitors use our site. You can control cookie preferences through your browser settings. Disabling cookies may affect certain features of the website.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">9. Third-Party Links</h2>
            <p className="text-muted-text leading-relaxed">
              Our website may contain links to external websites. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review the privacy policies of any external sites you visit.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">10. Changes to This Policy</h2>
            <p className="text-muted-text leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated &quot;Last updated&quot; date. We encourage you to review this policy periodically.
            </p>
          </div>

          <div className="space-y-4 border-t border-white/10 pt-10">
            <h2 className="text-2xl font-bold text-white">Contact Us</h2>
            <p className="text-muted-text leading-relaxed">
              If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us:
            </p>
            <div className="bg-secondary-surface/30 border border-white/5 rounded-2xl p-6 space-y-2">
              <p className="text-white font-medium">Upmark Media</p>
              <p className="text-muted-text text-sm">Email: <a href={`mailto:${email}`} className="text-accent-blue hover:underline">{email}</a></p>
              {phone && <p className="text-muted-text text-sm">Phone: {phone}</p>}
              <p className="text-muted-text text-sm">Address: {address}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-16 pt-8 sm:pt-10 border-t border-white/10 text-center">
          <Link href="/" className="text-accent-blue hover:text-blue-400 transition-colors font-medium">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
