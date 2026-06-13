# Upmark Media — Integrated Marketing Agency Platform

> A production-grade, full-stack marketing agency website with a built-in content management system, delivering a cinematic web experience powered by modern web technologies.

**Live Site:** [upmarkmedia.in](https://upmarkmedia.in)

---

## Overview

Upmark Media is an end-to-end digital platform for an integrated marketing agency combining strategy, performance marketing, content production, and execution. The project encompasses both a **public-facing marketing site** designed with premium interactions and a **fully authenticated admin dashboard** for managing all site content in real-time — no code changes or deployments required.

Every piece of content on the site — from hero videos and case studies to testimonials and contact information — is CMS-driven through Firestore and configurable from the admin panel.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19 |
| **Styling** | Tailwind CSS 4 with custom CSS theme system |
| **Animations** | Framer Motion 12 |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Auth (Email/Password) |
| **Email** | Resend (transactional + auto-responder) |
| **Media** | Cloudinary (image/video uploads) |
| **Fonts** | Poppins (headings) + Inter (body) via `next/font` |
| **Observability** | OpenTelemetry |

---

## Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── about/page.tsx            # About page
│   ├── work/page.tsx             # Portfolio/work page
│   ├── services/page.tsx         # Services with interactive capability map
│   ├── contact/page.tsx          # Contact form with lead capture
│   ├── case-studies/page.tsx     # Case studies
│   ├── privacy/page.tsx          # Privacy policy
│   ├── terms/page.tsx            # Terms of service
│   ├── api/
│   │   ├── contact/route.ts      # Lead capture + email notifications
│   │   └── migrate-services/     # Data migration endpoint
│   └── admin/                    # Authenticated admin CMS
│       ├── login/page.tsx
│       └── (dashboard)/
│           ├── page.tsx          # Dashboard overview
│           ├── leads/page.tsx    # Lead management
│           └── pages/            # Page-specific CMS editors
│               ├── home/page.tsx
│               ├── about/page.tsx
│               ├── work/page.tsx
│               ├── services/page.tsx
│               ├── case-studies/page.tsx
│               ├── contact/page.tsx
│               └── settings/page.tsx
├── components/
│   ├── layout/                   # Navbar, Footer, FloatingCTA, CustomCursor
│   ├── sections/                 # Hero, ContentGrid, ProcessTimeline, Testimonials
│   ├── ui/                       # ScrollReveal, AnimatedCounter, Carousels, Dialogs
│   ├── interactive-diagram/      # SVG orbital diagrams (Process, Capability Map)
│   ├── services-explorer/        # Desktop accordion + mobile expand
│   ├── forms/                    # Contact form with service chips
│   └── admin/                    # CMS forms, auth guards, upload widgets
├── contexts/                     # AuthContext, IdleContext
├── hooks/                        # useCollection (generic CRUD hook)
├── lib/                          # Firebase, Firestore CRUD, Resend, email templates
└── types/                        # TypeScript interfaces
```

---

## Key Features

### Public-Facing Site

#### Cinematic Hero Section
- Full-screen background video with ambient lighting glows
- Play/pause and mute/unmute controls with idle-aware visibility
- Responsive video sources (separate desktop and mobile URLs)
- `preload="metadata"` for optimized initial load

#### Interactive SVG Diagrams
- **Process Orbital** — A 6-step circular orbital visualization with animated SVG connection paths, progress rings, central information core, stacked image history, and auto-play cycling at 3-second intervals
- **Capability Map** — Interactive services diagram with orbital layout, animated connector lines, pulsing node glows, spinning border rings, and hash-based deep linking (e.g., `/services#content-engine`)

#### Scroll-Triggered Animations
- Framer Motion-powered scroll reveals with configurable direction (up/down/left/right) and distance
- Staggered viewport-triggered animations on content grids
- `content-visibility: auto` on below-fold sections for rendering optimization

#### Portfolio & Case Studies
- Horizontal scroll carousels with snap scrolling and arrow navigation
- Full-screen preview dialog with image/video, gallery toggle, stats, and sequential media preloading
- Case study cards with metric badges, categories, and hover effects

#### Testimonials Carousel
- Horizontal scroll carousel with quote cards, author info, and click-to-preview dialog

#### Custom Cursor
- GPU-composited custom cursor with inner dot + outer ring using `mix-blend-mode: difference`
- Scales up on interactive elements
- Auto-disables on touch devices and when `prefers-reduced-motion` is enabled
- Early-exit optimization after 120 frames of idle mouse movement

#### Navigation & Layout
- **Glassmorphism Navbar** — Fixed position with `backdrop-blur-xl`, scroll-aware hide/show, active route indicator with Framer Motion `layoutId`
- **Mobile Hamburger Menu** — Staggered pill animations with spring physics
- **Floating CTA** — Gradient "Get started!" button with idle-aware and footer-aware visibility
- **Footer** — 4-column layout with marquee text animation, services list, social links

#### Theming
- Two built-in themes: **Dark** (default) and **Editorial** (light/warm)
- CSS custom properties system swapped via class on `<html>`
- Configurable from the admin panel

---

### Admin CMS Dashboard

#### Authentication & Security
- Firebase email/password authentication
- Protected route wrapper with automatic redirect
- Firestore security rules: public read on content, authenticated write, admin-only lead access

#### Dashboard Overview
- Stats cards for leads, work items, case studies, services, and testimonials
- Quick action links to common tasks

#### Page Content Management
- **Home Page** — Hero video URL, about image, philosophy pointers, process steps, content items, studio capabilities, section visibility toggles, SEO metadata
- **About Page** — Team members, investors, page content, visibility controls
- **Work Page** — CRUD for portfolio items, production showcase, testimonials with gallery management
- **Services** — CRUD with icon upload, Lucide icon name mapping, display ordering
- **Case Studies** — Full CRUD with field arrays for metrics, media/image uploads, gradient picker, published toggle
- **Contact** — Contact information, visibility toggles
- **Settings** — Theme selector, logo uploads (wordmark + favicon), OG image, social links (Twitter/X, LinkedIn, Instagram), contact email

#### Media Management
- Cloudinary upload widget integration with themed UI
- Support for file, URL, and camera sources
- Single and multiple upload modes
- Preview with replace/clear actions

#### Lead Management
- View and search contact form submissions
- Timestamped lead records with full form data

---

## Performance Optimizations

| Technique | Implementation |
|---|---|
| **Conditional Rendering** | `content-visibility: auto` on below-fold sections |
| **Mobile Blur Reduction** | Dramatically reduced `backdrop-blur` values via CSS media queries |
| **Reduced Motion Support** | All animations disabled when `prefers-reduced-motion: reduce` |
| **Reduced Data Support** | Backdrop filters stripped entirely on `prefers-reduced-data` |
| **Hover Transform Suppression** | `group-hover:scale-105` removed on mobile breakpoints |
| **GPU Compositing** | `will-change: transform`, `backface-visibility: hidden`, `contain: layout style` on fixed/sticky elements |
| **Touch Target Sizing** | Minimum 44px tap targets on `pointer: coarse` devices |
| **iOS Zoom Prevention** | 16px minimum font size on input fields |
| **Safe Area Padding** | Notched device support via `env(safe-area-inset-*)` |
| **RAF-Based Animations** | Custom cursor and services explorer progress use `requestAnimationFrame` |
| **Visibility Change Handling** | Animations paused when browser tab is hidden |
| **Lazy Loading** | Gallery images and below-fold media |
| **Metadata Preloading** | Hero video uses `preload="metadata"` |

---

## SEO & Metadata

- Dynamic `generateMetadata()` in root layout with per-page overrides
- Open Graph tags (title, description, image, locale, site name, type)
- Twitter Card tags (summary_large image)
- Configurable OG image from admin panel (Cloudinary-hosted)
- Per-page SEO fields (title, description, keywords) stored in Firestore and editable from CMS
- Admin panel marked `noindex, nofollow`

---

## Responsive Design

- **Mobile-first approach** with `sm:`, `md:`, `lg:`, `xl:` breakpoint system
- Responsive typography scaling across all breakpoints
- Mobile-specific navigation (hamburger menu with animated pills)
- Mobile-specific hero video source
- Responsive grid layouts (1-col → 2-col → 3-4 col)
- Services explorer: desktop sidebar accordion → mobile expandable accordion
- Touch-friendly minimum tap targets (44px on coarse pointers)
- Safe area padding for notched devices

---

## Email System

- **Internal Notifications** — Branded HTML emails sent to the team on new lead submission
- **Auto-Responders** — Confirmation emails sent to leads with Upmark branding
- HTML email templates with inline styles for maximum compatibility
- Powered by Resend for reliable delivery

---

## Data Layer

### Firestore Collections
| Collection | Purpose |
|---|---|
| `settings` | Global site configuration (single document) |
| `services` | Service offerings with icons and ordering |
| `work` | Portfolio/work items |
| `case_studies` | Detailed case studies with metrics |
| `testimonials` | Client testimonials |
| `leads` | Contact form submissions |

### Generic CRUD Hook
The `useCollection` hook abstracts Firestore operations (fetch, create, update, delete) with built-in search filtering, providing a reusable pattern across all admin CMS pages.

---

## Design System

### Color Tokens

**Dark Theme (Default)**
| Token | Value | Usage |
|---|---|---|
| `primary-bg` | `#0F172A` | Main background |
| `secondary-surface` | `#1E293B` | Cards & surfaces |
| `accent-blue` | `#3B82F6` | Primary accent |
| `accent-gold` | `#F59E0B` | Secondary accent |
| `primary-text` | `#F8FAFC` | Primary text |
| `muted-text` | `#94A3B8` | Secondary text |

**Editorial Theme (Light)**
| Token | Value | Usage |
|---|---|---|
| `primary-bg` | `#F5F3EF` | Warm off-white background |
| `secondary-surface` | `#E7E2DA` | Cards & surfaces |
| `accent-blue` | `#4F46E5` | Indigo accent |
| `accent-gold` | `#B08968` | Warm brown accent |
| `primary-text` | `#2F343A` | Primary text |
| `muted-text` | `#4C545E` | Secondary text |

### Typography
- **Headings:** Poppins (400–800 weights) — bold, extrabold, black
- **Body:** Inter (300–600 weights) — light to semi-bold

### Visual Effects
- Glassmorphism on navbar
- Gradient text (`bg-clip-text text-transparent`)
- Ambient glow effects (blurred colored circles)
- Border glow on hover
- Custom utility classes: `.glow-blue`, `.glow-gold`, `.shadow-glow-gold`

---

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project (Firestore + Authentication)
- Cloudinary account
- Resend API key

### Installation

```bash
git clone <repository-url>
cd upmark
npm install
```

### Environment Variables

Create a `.env.local` file with the following:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

# Resend
RESEND_API_KEY=
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
npm run build
npm start
```

---

## Technical Highlights

1. **App Router with Server Components** — Pages are server-rendered by default, with `"use client"` only where interactivity requires it
2. **CMS-Driven Content** — Every visible element is configurable from the admin panel with no code changes needed
3. **Dual Firebase Initialization** — Client SDK for public reads, Admin SDK for server-side writes with lazy initialization
4. **Route Groups** — Admin pages share a layout via `(dashboard)` group without affecting URL structure
5. **Server Actions** — Cache revalidation via `revalidatePath` after CMS updates
6. **Idle Detection System** — Tracks user activity to control UI element visibility for a cinematic experience
7. **Hash-Based Deep Linking** — Services page supports direct linking to specific services via URL hash
8. **CSS-First Theming** — Tailwind v4 `@theme inline` directive with CSS custom properties instead of a JS config file
9. **Force-Dynamic Rendering** — Root layout forces server-side rendering on every request for fresh Firestore data
10. **URL Redirect Consolidation** — `next.config.ts` handles legacy URL redirects to the new admin structure

---

## License

This project is proprietary software developed for Upmark Media.
