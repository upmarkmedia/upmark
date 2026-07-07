import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAdminSiteSettings as getSiteSettings } from "@/lib/firebase-admin";
import { AboutCardGrid } from "@/components/ui/AboutCardGrid";
import { ParsedHeading } from "@/components/ui/ParsedHeading";

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
    <div className="min-h-screen pt-28 sm:pt-24 md:pt-32 pb-8 sm:pb-12">
      {/* ─── About Section ─── */}
      <section className="container mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <div className="text-primary-text">
           <span className="text-secondary-surface-dark font-extrabold tracking-[0.2em] uppercase text-xl mb-3">
             {aboutEyebrow}
           </span>

           <ParsedHeading text={aboutTitle} as="h1" className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-primary-text tracking-tight leading-tight mb-4 uppercase" />
           <h2 className="text-xl sm:text-2xl md:text-3xl mt-4 mb-6 sm:mb-8 font-semibold" dangerouslySetInnerHTML={{ __html: aboutSubtitle }} />

          <div className="relative">
            <div className="float-right ml-6 sm:ml-8 lg:ml-10 mb-4 w-[300px] sm:w-[400px] lg:w-[500px] relative aspect-square rounded-sm overflow-hidden border border-primary-text/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/10 to-accent-gold/5 rounded-full blur-[40px] sm:blur-[60px] pointer-events-none"></div>
              {aboutImageUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                <video
                  src={aboutImageUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover relative z-10"
                />
              ) : (
                <Image
                  src={aboutImageUrl}
                  alt="Upmark strategy session"
                  fill
                  className="object-cover relative z-10"
                  sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 500px"
                  priority
                />
              )}
            </div>

            <div className="text-muted-text font-light text-base sm:text-lg mb-8 sm:mb-10">
              {aboutDescription.split("\n\n").map((paragraph, i) => (
                <p key={i} className="mb-4 sm:mb-6">{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="clear-both flex flex-row items-center justify-start gap-3 w-full">
            {show("services") && (
              <Link href="/services" className="group relative flex items-center justify-center gap-3 bg-accent-blue text-white px-5 py-3 rounded-sm font-semibold text-sm overflow-hidden transition-[transform] hover:scale-[1.02] active:scale-95">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">Our Services</span>
              </Link>
            )}
            {show("contact") && (
              <Link href="/contact" className="group flex items-center justify-center px-5 py-3 rounded-sm font-semibold text-sm text-primary-text bg-primary-text/5 border border-primary-text/10 hover:bg-primary-text/10 hover:border-primary-text/20 transition-colors duration-200">
                Get in touch
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ─── Meet the Team ─── */}
      {teamVisible && (
        <section id="team" className="container mx-auto px-4 sm:px-6 mb-16 sm:mb-24 scroll-mt-32">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-secondary-surface-dark font-extrabold tracking-[0.2em] uppercase text-xl mb-3">
              {teamEyebrow}
            </span>
            <ParsedHeading text={teamTitle} as="h2" className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-primary-text tracking-tight leading-tight mb-4 uppercase" />
            <p className="text-muted-text text-base sm:text-lg max-w-2xl font-light mx-auto">
              {teamDescription}
            </p>
          </div>

          <AboutCardGrid items={teamMembers} accentColor="blue" />
        </section>
      )}

      {/* ─── Meet the Investors ─── */}
      {investorsVisible && (
        <section id="investors" className="container mx-auto px-4 sm:px-6 mb-16 sm:mb-24 scroll-mt-32">
          <div className="text-center mb-10 sm:mb-14">
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

      {/* ─── CTA Section ─── */}
      <section className="graphite-grid rounded-sm my-16 sm:my-24 mx-4 sm:mx-6">
        <div className="relative z-10 py-16 sm:py-24 text-center max-w-4xl mx-auto px-4">
          <ParsedHeading text={ctaTitle} as="h2" className="text-3xl sm:text-4xl md:text-6xl font-black font-heading text-white tracking-tight mb-6 sm:mb-8 uppercase" highlight="white" />
          <p className="text-base sm:text-xl text-white/70 mb-8 sm:mb-12 font-light max-w-2xl mx-auto">
            {ctaDescription}
          </p>
          {show("contact") && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link
                href="/contact"
                className="group relative px-6 py-4 sm:px-10 sm:py-5 rounded-sm font-bold text-lg bg-accent-blue text-white transition-all justify-center hover:scale-[1.02] active:scale-95"
              >
                <div className="absolute inset-0 rounded-sm bg-gradient-to-r from-blue-600 to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">Start a conversation</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
