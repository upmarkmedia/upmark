import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/firestore";
import { Users, BadgeCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Upmark",
  description: "Upmark builds complete marketing systems. Meet our team of strategists, creatives, producers and performance marketers.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  const vis = settings?.visibility ?? {};
  const show = (key: string) => vis[key as keyof typeof vis] ?? true;

  const aboutImageUrl = settings?.homeAboutImageUrl || "/images/philosophy.png";
  const teamMembers = settings?.teamMembers ?? [];
  const investors = settings?.investors ?? [];

  const pageVisible = show("about");
  const teamVisible = show("aboutTeam") && teamMembers.length > 0;
  const investorsVisible = show("aboutInvestors") && investors.length > 0;

  if (!pageVisible) return null;

  return (
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-32 pb-8 sm:pb-12">
      {/* ─── About Section ─── */}
      <section className="container mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-16 text-primary-text items-center">
          <div className="lg:w-7/12 flex flex-col items-start pr-0 lg:pr-10">
            <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs mb-6 inline-flex items-center gap-4">
              <span className="w-8 h-[1px] bg-accent-blue"></span>
              ABOUT US
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-primary-text tracking-tight leading-tight mb-4">
              Most agencies only <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-indigo-400">create content</span> <br className="hidden md:block" />or run ads.
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl mt-4 mb-6 sm:mb-8 font-semibold">
              Upmark builds <span className="text-accent-gold">complete marketing systems.</span>
            </h2>
            <div className="flex flex-col gap-4 sm:gap-6 text-muted-text font-light text-base sm:text-lg mb-8 sm:mb-10">
              <p>
                Founded on the belief that modern marketing must be fast, precise and measurable, Upmark brings together strategists, creatives, producers and performance marketers who operate as one integrated team.
              </p>
              <p>
                When your strategist sits next to your editor, your performance data informs your creative, and your content team understands your media budget — the work gets sharper. We&apos;re not a collection of specialists working in parallel. We&apos;re a single, integrated team where every discipline makes every other one better. That&apos;s the Upmark advantage.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              {show("services") && (
                <Link href="/services" className="group flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-semibold text-sm sm:text-base text-primary-text border border-primary-text/20 hover:border-accent-blue hover:bg-accent-blue/5 transition-[border-color,background-color] w-full sm:w-auto">
                  Explore our services
                </Link>
              )}
              {show("contact") && (
                <Link href="/contact" className="group flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-semibold text-sm sm:text-base text-primary-text bg-accent-blue/10 border border-accent-blue/30 hover:bg-accent-blue/20 hover:border-accent-blue/50 transition-[border-color,background-color] w-full sm:w-auto">
                  Get in touch
                </Link>
              )}
            </div>
          </div>

          <div className="lg:w-5/12 w-full flex justify-center items-center relative min-h-[280px] sm:min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/10 to-accent-gold/5 rounded-full blur-[40px] sm:blur-[60px] pointer-events-none"></div>
            <div className="relative w-full aspect-square max-w-[320px] sm:max-w-[450px] rounded-3xl overflow-hidden border border-primary-text/10 shadow-2xl">
              <Image
                src={aboutImageUrl}
                alt="Upmark strategy session"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-bg/60 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Meet the Team ─── */}
      {teamVisible && (
        <section id="team" className="container mx-auto px-4 sm:px-6 mb-16 sm:mb-24 scroll-mt-32">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs mb-4 block inline-flex items-center gap-4">
              <span className="w-8 h-[1px] bg-accent-blue"></span>
              MEET THE TEAM
              <span className="w-8 h-[1px] bg-accent-blue"></span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-primary-text tracking-tight mb-4">
              The people behind <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-indigo-400">the work</span>
            </h2>
            <p className="text-muted-text text-base sm:text-lg max-w-2xl font-light mx-auto">
              Strategists, creatives, producers and performance marketers — operating as one integrated team.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="group relative bg-secondary-surface/40 border border-primary-text/5 rounded-2xl overflow-hidden hover:border-accent-blue/30 transition-all duration-300 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-sm"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {member.imageUrl ? (
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-blue/10 to-accent-gold/5">
                      <Users size={48} className="text-primary-text/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-bg/80 via-transparent to-transparent"></div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-primary-text mb-1">{member.name}</h3>
                  <p className="text-accent-blue text-sm font-medium mb-2">{member.specialty}</p>
                  <p className="text-muted-text text-sm font-light leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Meet the Investors ─── */}
      {investorsVisible && (
        <section id="investors" className="container mx-auto px-4 sm:px-6 mb-16 sm:mb-24 scroll-mt-32">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-accent-blue font-bold tracking-[0.2em] uppercase text-xs mb-4 block inline-flex items-center gap-4">
              <span className="w-8 h-[1px] bg-accent-blue"></span>
              OUR INVESTORS
              <span className="w-8 h-[1px] bg-accent-blue"></span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-primary-text tracking-tight mb-4">
              Backed by <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-gold to-yellow-400">visionaries</span>
            </h2>
            <p className="text-muted-text text-base sm:text-lg max-w-2xl font-light mx-auto">
              We&apos;re proud to be supported by investors who believe in our mission.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {investors.map((investor, i) => (
              <div
                key={i}
                className="group relative bg-secondary-surface/40 border border-primary-text/5 rounded-2xl overflow-hidden hover:border-accent-gold/30 transition-all duration-300 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-sm"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {investor.imageUrl ? (
                    <Image
                      src={investor.imageUrl}
                      alt={investor.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-gold/10 to-accent-blue/5">
                      <BadgeCheck size={48} className="text-primary-text/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-bg/80 via-transparent to-transparent"></div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-primary-text mb-1">{investor.name}</h3>
                  <p className="text-accent-gold text-sm font-medium mb-2">{investor.specialty}</p>
                  <p className="text-muted-text text-sm font-light leading-relaxed">{investor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── CTA Section ─── */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-accent-blue/10 to-accent-gold/5 border border-primary-text/5 p-8 sm:p-14 text-center">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent-blue/10 blur-[80px] pointer-events-none rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading text-primary-text tracking-tight mb-4">
              Ready to build your <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-blue-400">marketing system?</span>
            </h2>
            <p className="text-muted-text text-base sm:text-lg max-w-xl font-light mx-auto mb-8">
              Let&apos;s talk about how Upmark can help you scale.
            </p>
            {show("contact") && (
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-semibold text-sm sm:text-base text-primary-text bg-accent-blue hover:bg-blue-600 transition-colors"
              >
                Start a conversation
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
