import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { getSiteSettings } from "@/lib/firestore";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let ogImageUrl = "/images/og-image.png";
  try {
    const settings = await getSiteSettings();
    if (settings?.globalOgImageUrl) ogImageUrl = settings.globalOgImageUrl;
  } catch (error) {
    console.error("Failed to load globalOgImageUrl:", error);
  }

  return {
    metadataBase: new URL("https://upmark.co"),
    title: "Upmark Media | Integrated Marketing That Moves Markets",
    description: "Upmark is an integrated marketing agency combining strategy, performance marketing, content production and execution into one growth engine. We build complete marketing systems that scale.",
    keywords: ["marketing agency", "performance marketing", "content production", "brand strategy", "digital marketing", "SEO", "social media management", "Upmark"],
    authors: [{ name: "Upmark Media" }],
    openGraph: {
      title: "Upmark Media | Integrated Marketing That Moves Markets",
      description: "Strategy, performance marketing, content and execution — unified. We build complete marketing systems that scale.",
      url: "https://upmark.co",
      siteName: "Upmark Media",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Upmark Media — Integrated Marketing Agency",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Upmark Media | Integrated Marketing That Moves Markets",
      description: "Strategy, performance marketing, content and execution — unified. We build complete marketing systems that scale.",
      images: [ogImageUrl],
      creator: "@upmarkmedia",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark overflow-x-hidden">
      <body className={`${poppins.variable} ${inter.variable} min-h-screen flex flex-col overflow-x-hidden`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
