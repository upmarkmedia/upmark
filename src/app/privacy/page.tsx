import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/firestore";
import type { LegalPageSection } from "@/types";

export const metadata: Metadata = {
  title: "Privacy Policy | Upmark",
  description: "Learn how Upmark Media collects, uses and protects your personal data.",
};

const FALLBACK_SECTIONS: LegalPageSection[] = [
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

function renderContent(content: string) {
  const paragraphs = content.split("\n\n");
  return paragraphs.map((para, i) => {
    const lines = para.split("\n");
    const hasListItems = lines.some((line) => line.startsWith("• "));
    if (hasListItems) {
      return (
        <ul key={i} className="list-disc list-inside text-muted-text space-y-2 pl-4">
          {lines.map((line, j) => (
            <li key={j}>{renderBold(line.replace(/^• /, ""))}</li>
          ))}
        </ul>
      );
    }
    return <p key={i} className="text-muted-text leading-relaxed">{renderBold(para)}</p>;
  });
}

function renderBold(text: string) {
  const parts = text.split(/(<strong>.*?<\/strong>)/g);
  return parts.map((part, i) => {
    if (part.startsWith("<strong>") && part.endsWith("</strong>")) {
      const inner = part.replace(/<\/?strong>/g, "");
      return <strong key={i} className="text-primary-text">{inner}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();
  const email = settings?.contactEmail || "hello@upmark.co";
  const phone = settings?.contactPhone || "+91 98765 43210";
  const address = settings?.contactAddress || "WeWork, BKC, Mumbai 400051, India";

  const sections = settings?.privacyContent?.sections?.length
    ? settings.privacyContent.sections
    : FALLBACK_SECTIONS;
  const lastUpdated = settings?.privacyContent?.lastUpdated || "April 15, 2026";

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-32">
      <section className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10">
        <div className="mb-10 sm:mb-16">
          <span className="text-secondary-surface-dark font-extrabold tracking-[0.2em] uppercase text-xl mb-3">
            LEGAL
          </span>
           <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold font-heading text-primary-text tracking-tight leading-tight mb-4 sm:mb-6 uppercase">
             Privacy Policy
          </h1>
          <p className="text-muted-text text-base sm:text-lg font-light">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 sm:space-y-10">
          {sections.map((section, i) => (
            <div key={i} className="space-y-4">
              <h2 className={i === 0 ? "text-xl sm:text-2xl font-bold text-primary-text" : "text-2xl font-bold text-primary-text"}>
                {section.title}
              </h2>
              {renderContent(section.content)}
            </div>
          ))}

          <div className="space-y-4 border-t border-primary-text/10 pt-10">
            <h2 className="text-2xl font-bold text-primary-text">Contact Us</h2>
            <p className="text-muted-text leading-relaxed">
              If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us:
            </p>
            <div className="bg-secondary-surface/30 border border-primary-text/10 rounded-sm p-6 space-y-2">
              <p className="text-primary-text font-medium">Upmark Media</p>
              <p className="text-muted-text text-sm">Email: <a href={`mailto:${email}`} className="text-accent-blue hover:underline">{email}</a></p>
              {phone && <p className="text-muted-text text-sm">Phone: {phone}</p>}
              <p className="text-muted-text text-sm">Address: {address}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-16 pt-8 sm:pt-10 border-t border-primary-text/10 text-center">
          <Link href="/" className="text-accent-blue hover:text-blue-400 transition-colors font-medium">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
