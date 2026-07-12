import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/firestore";
import type { LegalPageSection } from "@/types";

export const metadata: Metadata = {
  title: "Terms of Service | Upmark",
  description: "Terms and conditions governing the use of Upmark Media's website and services.",
};

const FALLBACK_SECTIONS: LegalPageSection[] = [
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

export default async function TermsOfServicePage() {
  const settings = await getSiteSettings();
  const email = settings?.contactEmail || "hello@upmark.co";
  const address = settings?.contactAddress || "WeWork, BKC, Mumbai 400051, India";

  const sections = settings?.termsContent?.sections?.length
    ? settings.termsContent.sections
    : FALLBACK_SECTIONS;
  const lastUpdated = settings?.termsContent?.lastUpdated || "April 15, 2026";

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-32">
      <section className="container mx-auto px-4 sm:px-6 max-w-4xl relative z-10">
        <div className="mb-10 sm:mb-16">
          <span className="text-secondary-surface-dark font-extrabold tracking-[0.2em] uppercase text-xl mb-3">
            LEGAL
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold font-heading text-primary-text tracking-tight leading-tight mb-4 sm:mb-6 uppercase">
            Terms of Service
          </h1>
          <p className="text-muted-text text-base sm:text-lg font-light">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 sm:space-y-10">
          {sections.map((section, i) => (
            <div key={i} className="space-y-4">
              <h2 className="text-2xl font-bold text-primary-text">
                {section.title}
              </h2>
              {renderContent(section.content)}
            </div>
          ))}

          <div className="space-y-4 border-t border-primary-text/10 pt-10">
            <h2 className="text-2xl font-bold text-primary-text">Contact Us</h2>
            <p className="text-muted-text leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-secondary-surface/30 border border-primary-text/10 rounded-sm p-6 space-y-2">
              <p className="text-primary-text font-medium">Upmark Media</p>
              <p className="text-muted-text text-sm">Email: <a href={`mailto:${email}`} className="text-accent-blue hover:underline">{email}</a></p>
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
