import { Timestamp } from "firebase/firestore";

export interface CaseStudy {
  id?: string;
  title: string;
  client: string;
  metrics: string[];
  description: string;
  category: "Studies" | "Success Stories" | "Stills & Motions";
  mediaUrl?: string;
  // New fields for rich card layouts
  tag?: string;            // e.g. "Fashion & Lifestyle"
  stat1?: string;          // e.g. "+210%"
  stat1label?: string;     // e.g. "Revenue Growth"
  stat2?: string;          // e.g. "+380%"
  stat2label?: string;     // e.g. "Social Engagement"
  gradient?: string;       // e.g. "from-purple-900/30 to-indigo-900/10"
  imageUrl?: string;       // Cloudinary image URL
  duration?: string;       // For Stills & Motions: "0:30", "1:15", etc.
  mediaType?: "Stills" | "Motion"; // For Stills & Motions category
  
  // Detailed Section fields
  hiredFor?: string;
  situation?: string;
  keyExecutions?: string;
  timeframe?: string;
  
  // Social links
  websiteUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;

  order?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

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

export interface Advantage {
  title: string;
  desc: string;
}

export interface SeoPageConfig {
  title?: string;
  description?: string;
  ogImage?: string;
  keywords?: string;
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
  advantages?: Advantage[];
  // SEO configuration
  seo?: Record<string, SeoPageConfig>;
  updatedAt?: Timestamp;
}

export type CaseStudyCategory = CaseStudy["category"];
