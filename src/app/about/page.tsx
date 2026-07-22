import { Metadata } from "next";
import Link from "next/link";
import { getSiteSettings } from "@/lib/firestore";
import { AboutCardGrid } from "@/components/ui/AboutCardGrid";
import { ParsedHeading } from "@/components/ui/ParsedHeading";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { StorySection } from "@/components/ui/about/StorySection";

function formatDescription(text: string): string {
  let html = text;
  if (!text.includes("<p>") && !text.includes("<h") && !text.includes("<strong")) {
    html = text
      .split(/\n\s*\n/)
      .filter((p) => p.trim())
      .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
      .join("");
  }
  // Remove empty paragraphs to fix spacing issues caused by CMS empty lines
  return html.replace(/<p>(\s*|<br\s*\/?>|&nbsp;)*<\/p>/gi, "");
}

export const metadata: Metadata = {
  title: "About Us | Upmark",
  description: "Upmark builds complete marketing systems. Meet our team of strategists, creatives, producers and performance marketers.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const vis = settings?.visibility ?? {};
  const show = (key: string) => vis[key as keyof typeof vis] ?? true;

  const aboutImageUrl = settings?.homeAboutImageUrl || "/images/about-story.svg";
  const teamMembers = settings?.teamMembers ?? [];
  const investors = settings?.investors ?? [];

  const aboutEyebrow = settings?.aboutEyebrow ?? "ABOUT US";
  const aboutTitle = settings?.aboutTitle ?? "Most agencies only <span class=\"bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-indigo-400\">create content</span> <br class=\"hidden md:block\" />or run ads.";
  const aboutSubtitle = settings?.aboutSubtitle ?? "Upmark builds <span class=\"text-accent-gold\">complete marketing systems.</span>";
  const aboutDescription = settings?.aboutDescription ?? "Founded on the belief that modern marketing must be fast, precise and measurable, Upmark brings together strategists, creatives, producers and performance marketers who operate as one integrated team.\n\nWhen your strategist sits next to your editor, your performance data informs your creative, and your content team understands your media budget — the work gets sharper. We&apos;re not a collection of specialists working in parallel. We&apos;re a single, integrated team where every discipline makes every other one better. That&apos;s the Upmark advantage.";
  const teamEyebrow = settings?.teamEyebrow ?? "MEET THE TEAM";
  const teamTitle = settings?.teamTitle ?? "The people behind <span class=\"bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-indigo-400\">the work</span>";
  const teamDescription = settings?.teamDescription ?? "Strategists, creatives, producers and performance marketers — operating as one integrated team.";
  const investorsEyebrow = settings?.investorsEyebrow ?? "OUR INVESTORS";
  const investorsTitle = settings?.investorsTitle ?? "Backed by <span class=\"bg-clip-text text-transparent bg-gradient-to-r from-accent-gold to-yellow-400\">visionaries</span>";
  const investorsDescription = settings?.investorsDescription ?? "We&apos;re proud to be supported by investors who believe in our mission.";
  const ctaTitle = settings?.ctaTitle ?? "Ready to build your <span class=\"bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-blue-400\">marketing system?</span>";
  const ctaDescription = settings?.ctaDescription ?? "Let&apos;s talk about how Upmark can help you scale.";

  const pageVisible = show("about");
  const teamVisible = show("aboutTeam") && teamMembers.length > 0;
  const investorsVisible = show("aboutInvestors") && investors.length > 0;

  if (!pageVisible) return null;

  return (
    <div className="min-h-screen pt-8 md:pt-12">
      {/* ─── About Section ─── */}
      <section className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-16 mb-10 sm:mb-16 relative z-10">
        <StorySection
          eyebrow={aboutEyebrow}
          title={aboutTitle}
          subtitle={sanitizeHtml(aboutSubtitle).replace(/&nbsp;/g, ' ')}
          descriptionHtml={sanitizeHtml(formatDescription(aboutDescription)).replace(/&nbsp;/g, ' ')}
          imageUrl={aboutImageUrl}
          showServices={show("services")}
          showContact={show("contact")}
        />
      </section>

      {/* ─── Meet the Team ─── */}
      {teamVisible && (
        <section id="team" className="container mx-auto px-4 sm:px-6 mb-10 sm:mb-16 scroll-mt-32">
          <div className="text-center mb-6 sm:mb-10">
            <span className="text-secondary-surface-dark font-extrabold tracking-[0.2em] uppercase text-xl mb-3">
              {teamEyebrow}
            </span>
            <ParsedHeading text={teamTitle} as="h2" className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-primary-text tracking-tight leading-tight mb-4 uppercase" />
            <p className="text-muted-text text-base sm:text-lg max-w-2xl font-light mx-auto">
              {teamDescription}
            </p>
          </div>

          <AboutCardGrid items={teamMembers} accentColor="gold" />
        </section>
      )}

      {/* ─── Meet the Investors ─── */}
      {investorsVisible && (
        <section id="investors" className="container mx-auto px-4 sm:px-6 mb-10 sm:mb-16 scroll-mt-32">
          <div className="text-center mb-6 sm:mb-10">
            <span className="text-secondary-surface-dark font-extrabold tracking-[0.2em] uppercase text-xl mb-3">
              {investorsEyebrow}
            </span>
            <ParsedHeading text={investorsTitle} as="h2" className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-primary-text tracking-tight leading-tight mb-4 uppercase" />
            <p className="text-muted-text text-base sm:text-lg max-w-2xl font-light mx-auto">
              {investorsDescription}
            </p>
          </div>

          <AboutCardGrid items={investors} accentColor="gold" />
        </section>
      )}

      {/* ─── CTA Section — flush, no gaps ─── */}
      <section className="graphite-grid">
        <div className="relative z-10 py-16 sm:py-24 text-center max-w-4xl mx-auto px-4">
          <ParsedHeading text={ctaTitle} as="h2" className="text-3xl sm:text-4xl md:text-6xl font-black font-heading text-white tracking-tight mb-6 sm:mb-8 uppercase" highlight="white" />
          <p className="text-base sm:text-xl text-white/70 mb-8 sm:mb-12 font-light max-w-2xl mx-auto">
            {ctaDescription}
          </p>
          {show("contact") && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link
                href="/contact"
                className="px-6 py-4 sm:px-10 sm:py-5 rounded-sm font-bold text-lg bg-accent-gold text-black transition-all justify-center hover:scale-[1.02] active:scale-95"
              >
                Start a conversation
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
