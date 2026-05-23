import { Timestamp } from "firebase/firestore";

// ─── Work Items (real client work) ────────────────────
export interface WorkItem {
  id?: string;
  title: string;
  client: string;
  description: string;
  category: "Studies" | "Success Stories" | "Stills & Motions";
  tag?: string;
  // Stats
  stat1?: string;
  stat1label?: string;
  stat2?: string;
  stat2label?: string;
  // Visual
  gradient?: string;
  imageUrl?: string;
  // Production (Stills & Motions)
  mediaType?: "Stills" | "Motion";
  duration?: string;
  mediaUrl?: string;
  // Legacy
  metrics: string[];
  // Status
  published: boolean;
  order?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type WorkItemCategory = WorkItem["category"];

// ─── Case Studies (theoretical/aspirational studies) ──
export interface CaseStudy {
  id?: string;
  title: string;
  client: string;
  description: string;
  category: "Studies" | "Success Stories";
  tag?: string;
  // Stats
  stat1?: string;
  stat1label?: string;
  stat2?: string;
  stat2label?: string;
  // Visual
  gradient?: string;
  imageUrl?: string;
  mediaUrl?: string;
  // Detailed narrative sections
  hiredFor?: string;
  situation?: string;
  keyExecutions?: string;
  timeframe?: string;
  // Social links
  websiteUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  // Legacy
  metrics: string[];
  // Status
  published: boolean;
  order?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type CaseStudyCategory = CaseStudy["category"];

export interface Service {
  id?: string;
  title: string;
  description: string;
  icon_url: string;
  subtitle?: string;      // e.g. "Foundation", "Paid Media"
  order?: number;          // For custom sort order
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Lead {
  id?: string;
  name: string;
  email: string;
  company: string;
  service: string;
  projectDetails: string;
  createdAt?: Timestamp;
}

export interface Testimonial {
  id?: string;
  quote: string;
  name: string;
  role: string;
  featured?: boolean;
  order?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface HeroMetric {
  value: string;
  label: string;
  suffix?: string; // e.g. "+", "%", "x"
  isGold?: boolean; // for the gold gradient style
}

export interface PhilosophyPointer {
  title: string;
  desc: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ContentItem {
  title: string;
  subtitle: string;
  description: string;
}

export interface SeoPageConfig {
  title?: string;
  description?: string;
  ogImage?: string;
  keywords?: string;
}

export interface WorkSection {
  label: string;
  title: string;
  subtitle: string;
}

export interface SiteSettings {
  heroVideoUrl?: string;
  // Hero metrics
  heroMetrics?: HeroMetric[];
  // Contact info
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  // Homepage section content
  philosophyPointers?: PhilosophyPointer[];
  processSteps?: ProcessStep[];
  contentItems?: ContentItem[];
  studioCapabilities?: string[];
  // Work page sections
  portfolioSection?: WorkSection;
  productionSection?: WorkSection;
  // SEO configuration
  seo?: Record<string, SeoPageConfig>;
  updatedAt?: Timestamp;
}
