"use client";

import type { BrandItem } from "@/types";

interface BrandCarouselProps {
  brands: BrandItem[];
}

const DEFAULT_BRANDS: BrandItem[] = [
  { name: "Google" },
  { name: "Meta" },
  { name: "Shopify" },
  { name: "Stripe" },
  { name: "Notion" },
  { name: "Figma" },
  { name: "Vercel" },
  { name: "Slack" },
];

function BrandCard({ brand }: { brand: BrandItem }) {
  return (
    <div className="flex items-center justify-center px-4 sm:px-8 py-2 flex-shrink-0 w-[100px] sm:w-[140px]">
      {brand.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brand.logoUrl}
          alt={brand.name}
          className="h-6 sm:h-8 w-auto max-w-[80px] sm:max-w-[120px] object-contain brightness-0 invert"
        />
      ) : (
        <span className="text-lg sm:text-2xl font-semibold text-white whitespace-nowrap tracking-wide opacity-70">
          {brand.name}
        </span>
      )}
    </div>
  );
}

function MarqueeRow({ brands }: { brands: BrandItem[] }) {
  const tripled = [...brands, ...brands, ...brands];
  return (
    <div className="relative overflow-hidden w-full">
      <div
        className="flex w-max animate-marquee-x"
        style={{ "--marquee-duration": "30s" } as React.CSSProperties}
      >
        {tripled.map((brand, i) => (
          <BrandCard key={`h-${i}`} brand={brand} />
        ))}
      </div>
    </div>
  );
}

export const BrandCarousel = ({ brands }: BrandCarouselProps) => {
  const items = brands.length > 0 ? brands : DEFAULT_BRANDS;

  return (
    <section className="bg-black overflow-hidden relative z-20">
      <div className="py-2 sm:py-3 border-b border-white/5">
        <MarqueeRow brands={items} />
      </div>
    </section>
  );
};
