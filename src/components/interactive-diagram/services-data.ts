import { PlaySquare, Target, Film, Package, Zap, Share2, Search, Lightbulb, PenTool, Rocket, Settings, TrendingUp } from "lucide-react";

export const CAPABILITIES_DATA = [
  {
    id: "content-engine",
    number: "01",
    title: "Content Engine",
    label: "Content",
    subtitle: "Content",
    icon: PlaySquare,
    description:
      "Great content doesn't happen in a vacuum — it happens when the people making it understand the strategy behind it. Our in-house production team works across every format: short-form reels, brand films, product photography, social graphics and editorial content. Working from ideation through production and post to the final product, with cinema-grade equipment, kept entirely in-house. Because when production sits inside the same team as strategy and media, what gets made is built to perform — not just to look good.",
  },
  {
    id: "marketing-strategy",
    number: "02",
    title: "Marketing Strategy",
    label: "Strategy",
    subtitle: "Strategy",
    icon: Target,
    description:
      "Strategy isn't a document we hand you at the start and revisit at the end. It's the thinking that runs through everything we make. We define your positioning, map your audience, decode the competitive landscape, and build a channel roadmap that reflects how your customers actually behave — not how we wish they did. Because our strategists work alongside the people who will execute the plan, what you get isn't a presentation. It's a blueprint built to be used.",
  },
  {
    id: "production-post",
    number: "03",
    title: "Production & Post",
    label: "Production",
    subtitle: "Production",
    icon: Film,
    description:
      "Some briefs don't need a full creative team — they need sharp hands behind the camera and in the edit suite. When you come to us with a script, a storyboard, or even just a shoot date, we take it from there. We handle end-to-end production and post-production: cinematography, lighting, direction on the day, and everything in the edit — colour, sound, motion graphics, delivery. No ideation, no strategy layer, no overhead you don't need. Just high-quality execution, with the same cinema-grade standards we bring to every project we touch.",
  },
  {
    id: "packaging-design",
    number: "04",
    title: "Packaging Design",
    label: "Packaging",
    subtitle: "Packaging",
    icon: Package,
    description:
      "Your packaging is your first salesperson — and in a quick-commerce world, it has less than a second to earn its place in a cart. We design packaging that works: visually distinctive, shelf-ready, and built around what your customer needs to understand and feel at the point of decision. From full product-line redesigns to seasonal gifting editions, we handle everything from structural concept through to print-ready artwork. Because good packaging isn't just about looking premium — it's about communicating the right thing, to the right person, at exactly the right moment.",
  },
  {
    id: "performance-marketing",
    number: "05",
    title: "Performance Marketing",
    label: "Paid Media",
    subtitle: "Paid Media",
    icon: Zap,
    description:
      "Paid media only performs when the strategy is sound, the creative is sharp, and the targeting is precise. We run campaigns across Meta, Google, LinkedIn and programmatic networks — but what sets our work apart is that our media buyers and our creative team are the same team. We don't wait on a brief. When performance data tells a story, we respond in real time: shifting budgets, refreshing creatives, and doubling down on what's converting.",
  },
  {
    id: "social-media",
    number: "06",
    title: "Social Media Management",
    label: "Social",
    subtitle: "Social",
    icon: Share2,
    description:
      "Showing up on socials consistently is the floor, not the ceiling. We manage your presence end-to-end — content calendars, community engagement, influencer partnerships and real-time activations — but we build it all on a strategic foundation. Every format, every platform, every moment of engagement is considered in context of the larger brand you're building. Systematic in execution. Intentional in voice.",
  },
  {
    id: "seo-lead-gen",
    number: "07",
    title: "SEO & Lead Generation",
    label: "SEO",
    subtitle: "SEO",
    icon: Search,
    description:
      "Paid media gets you in the room. Organic growth keeps you there. We build SEO strategies that go beyond rankings — combining technical audits, content architecture and backlink development into a full-funnel system that compounds over time. Because our SEO team works alongside our content and strategy teams, what we produce isn't just optimised for search. It's built to convert.",
  },
];

export const PROCESS_DATA = [
  {
    id: "insight",
    num: "01",
    title: "Insight",
    icon: Lightbulb,
    description: "Deep-dive into your market, audience, competitors and brand. We surface the insights that define your edge.",
    imageUrl: "/images/service-strategy.png",
  },
  {
    id: "strategy",
    num: "02",
    title: "Strategy",
    icon: Target,
    description: "We translate insight into a precise strategy — positioning, messaging, channels and a roadmap for execution.",
    imageUrl: "/images/service-seo.png",
  },
  {
    id: "production",
    num: "03",
    title: "Creative Production",
    icon: PenTool,
    description: "Our in-house team produces every asset — video, design, copy and content — aligned to the strategy.",
    imageUrl: "/images/service-content.png",
  },
  {
    id: "launch",
    num: "04",
    title: "Campaign Launch",
    icon: Rocket,
    description: "Orchestrated rollout across paid, owned and earned channels with precision timing and audience targeting.",
    imageUrl: "/images/service-social.png",
  },
  {
    id: "optimization",
    num: "05",
    title: "Optimisation",
    icon: Settings,
    description: "Real-time monitoring and rapid iteration. We cut what doesn't work and double down on what does.",
    imageUrl: "/images/service-performance.png",
  },
  {
    id: "growth",
    num: "06",
    title: "Growth",
    icon: TrendingUp,
    description: "We systematically compound results — scaling budgets, expanding channels and building long-term growth loops.",
    imageUrl: "/images/process.png",
  },
];
