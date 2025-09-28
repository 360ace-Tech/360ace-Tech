# 360ace.Tech — Product Requirements Document (PRD)

Updated: 2025-09-28

This PRD defines the vision, scope, architecture, and success criteria to revamp 360ace.Tech into a modern, professional, responsive, and maintainable web application using Next.js 15.4.2 (or latest stable in 15.x), React 19, and a modular content system.

Link to next phase: See AGENTS plan in `docs/AGENTS.md`.


## Vision & Goals
- Present 360ace.Tech as a credible cloud, DevOps/SRE, and infrastructure consultancy with clear services and case-driven proof.
- Deliver a fast, accessible, SEO-first website with modern UI/UX, subtle motion, and optional 3D that enhances (not distracts) content.
- Make content changes easy (blogs, case studies, services) via MD/MDX with type-safe content ingestion.
- Ship a maintainable, modular Next.js app with strong defaults: performance, a11y, testing, CI/CD, and observability.


## Target Audience & Experience Goals
- Decision makers and technical leaders (CTO/VP Eng/Platform lead) evaluating partners.
- Practitioners (DevOps, SRE, Cloud engineers) seeking detailed practices and blog content.
- Experience goals:
  - Clarity: Understand services in <10 seconds on landing.
  - Trust: Case studies, client logos, certifications, and process.
  - Speed: Sub-2.5s LCP on 4G mid-tier; smooth but respectful motion (reduced-motion honored).
  - Accessibility: WCAG 2.2 AA conformance basics.


## Current Site Review (index.html, /assets, /blogs)
Summary of content today:
- Landing with multiple hero slides (GIFs) and marketing copy.
- Sections: Home, About, What we do (IT Infrastructure, IaC, CI/CD, DevOps & SRE, Config Mgmt), Contact form.
- Assets: hand-rolled CSS/SCSS, JS for menu/accordion/scroll, Swiper/ScrollReveal via CDN, icon fonts.
- Blogs: Markdown files with YAML frontmatter and images.

Key issues and opportunities:
- Performance: multiple blocking/remote CSS/JS; large GIFs; no image optimization; icon fonts via CDNs; duplicated meta viewport; no font optimization.
- Accessibility: many images have empty or missing alt; keyboard/contrast states unclear; motion/scroll effects without reduced-motion fallbacks.
- Maintainability: scattered assets, imperative DOM scripts; hard to scale components and pages; manual blog wiring.
- SEO: metadata not systematic; no structured data; sitemap/robots not integrated with build; heavy client JS.
- UX: carousel-heavy hero; animated GIFs; inconsistent spacing/typography; contact form not integrated.

What to keep / migrate / improve:
- Keep: core brand, copy themes, blog articles, imagery (optimize/convert where needed).
- Migrate: blogs to MDX + type-safe content pipeline; hero/message; services into modular sections.
- Improve: performance budgets, Next Image, metadata, analytics, visual hierarchy, motion system, and a11y.


## Information Architecture & Navigation
- Top-level routes (App Router):
  - `/` Home (hero, value props, services overview, highlights)
  - `/services` (IT Infra, IaC, CI/CD, DevOps & SRE, Config Mgmt)
  - `/work` (case studies/process; optional)
  - `/blog` (list with tags/categories)
  - `/blog/[slug]` (MDX article)
  - `/about` (team, credentials)
  - `/contact` (form, social, map or cal.com)
- Utility routes (file-convention): `sitemap.xml`, `robots.txt`, `manifest`, `icon`, `opengraph-image`.


## Technology Stack & Architecture
- Framework: Next.js 15.4.2+ (App Router, Server Components, Server Actions, Metadata API, PPR/Turbopack dev). React 19 for features and ecosystem parity.
- Styling/UI: Tailwind CSS v4 (atomic, theming via CSS custom properties), shadcn/ui + Radix primitives (optional), CSS variables for theming.
- Motion: Motion for React (`motion/react`) for page/section transitions, micro-interactions, and scroll/gesture; respect `prefers-reduced-motion`.
- 3D: React Three Fiber (+ Drei helpers) for optional hero/feature scenes; degrade gracefully with static fallback.
- Content: MD/MDX in repository + Contentlayer for type-safe ingestion and live reload; alternative is plain MDX via `@next/mdx` if Contentlayer is not desired.
- Images/Fonts: Next/Image (optimized, remote patterns) and Next/Font (self-hosted Inter/variable fonts).
- Forms: Server Actions or API route + provider (e.g., Resend or form backend) with spam protection (honeypot/turnstile) and optimistic UI.
- SEO: Next.js Metadata API + file-based `sitemap.ts` and `robots.ts`; optional `next-sitemap` postbuild for large content.
- Tooling: TypeScript, ESLint 9 support, Prettier, Playwright (E2E), Jest/RTL (unit), Lighthouse CI (perf), Pa11y CI (a11y).
- Deployment: Vercel (primary), Cloudflare Pages or any Node/Edge capable host (secondary). Enable analytics/observability.

Reasoning highlights:
- Next.js 15 adds React 19 support, stable Turbopack dev, improved instrumentation, and stronger Server Actions security.
- Tailwind v4 simplifies setup and speeds builds; Motion is the recommended modern animation package (successor branding of framer-motion import path via `motion/react`).
- R3F provides idiomatic React 3D with strong ecosystem (Drei, gltfjsx) and safe fallbacks.
- MDX + Contentlayer creates a type-safe blog pipeline; App Router Metadata API covers core SEO with built-in file conventions.


## Feature List
- Responsive layout with grid/stack utilities; dark/light theme toggle (system default + `next-themes`).
- Hero with 3D starfield or lightweight particles; animated section headers and cards; subtle parallax where appropriate.
- Services pages with diagrams/icons, collapsible FAQs, and contact CTAs.
- Blog system: list, pagination, tags, categories, reading time; MDX shortcodes (Callout, Figure, Code with copy); search (client side or algolia optional).
- SEO defaults: titles/templates, canonical, open graph/Twitter cards, structured data for posts, sitemaps, robots, manifest.
- A11y: keyboard nav, focus rings, color-contrast tokens, skip link, motion preferences, semantic landmarks.
- Observability: basic web vitals, error instrumentation, 404/500 pages.


## 3D & Interaction Recommendations
- Homepage hero: optional R3F scene (logo orbit, subtle particles) with canvas fallback to static imagery; limit GPU cost and size, lazy mount below user idle or after LCP.
- Blog cards: 3D tilt and depth shadows (pure CSS or Motion; optional perspective parallax for hover, disabled on touch).
- Services diagrams: SVG with Motion-driven reveals; avoid gratuitous animation.


## SEO & Accessibility Checklist (AA baseline)
- Metadata via `metadata` or `generateMetadata`; page-level unique titles/descriptions.
- `app/robots.ts`, `app/sitemap.ts` (or `next-sitemap`) and `app/manifest.ts`.
- Semantic landmarks: `header/nav/main/section/aside/footer`.
- Images: descriptive alt; decorative images `alt=""` and `aria-hidden` where appropriate; use `next/image`.
- Color contrast ≥ 4.5:1 body text; ≥ 3:1 large text/UI components.
- Focus-visible rings; skip-to-content link.
- Reduced motion: match `prefers-reduced-motion` in Motion and CSS.
- Forms: labels/aria, error messaging, authentication not reliant on cognitive tests.


## Testing & Validation Plan
- Unit: Jest + Testing Library for components, MDX shortcodes.
- E2E: Playwright coverage for core flows (nav, blog read, contact submit) across desktop/mobile.
- Performance: Lighthouse CI budget (e.g., LCP ≥ 85, TBT ≤ 200ms on mobile); Next/Image audit.
- A11y: Pa11y CI and axe playbook; manual keyboard/AT checks.
- Visual: Percy (optional) for visual diffs.


## Milestones & Timeline (example, 3–4 weeks)
- M0 — Discovery & IA (1–2 days): content inventory, asset decisions, finalize routes.
- M1 — Scaffold & Foundation (4–5 days): Next 15.4.2 app, Tailwind v4, theming, layout, navigation, metadata.
- M2 — Content System (3–4 days): MDX + Contentlayer, blog list/detail, shortcodes, images.
- M3 — UI/UX & Motion (3–4 days): sections, cards, Motion interactions; optional R3F hero.
- M4 — Integrations & Forms (2 days): contact form, analytics/observability, sitemap/robots.
- M5 — QA & Launch (3 days): tests, a11y, perf tuning, CI/CD, deploy.


## Deployment Plan
- Primary: Vercel (automatic previews, environment secrets, analytics, Image Optimization). Alternate: Cloudflare Pages/Workers or self-hosted Node.
- Artifacts: `output: standalone` for portability; environment config via `.env`.
- CI: GitHub Actions to run lint, tests, build, Lighthouse/Pa11y, and deploy.


## Acceptance Criteria
- Next.js 15.4.2+ and React 19 in production build; Lighthouse ≥ 85 (mobile) on key pages; Pa11y passes critical checks; sitemap/robots available; blog MDX migrated; contact form functional; dark/light theme working; reduced-motion respected.


## References
- Next.js 15 overview and upgrades; Node min version and features.
- Next.js 15.4 release highlights.
- NPM next@15.4.2 package page.
- Tailwind CSS v4 announcement and features.
- Motion for React docs (import from `motion/react`).
- React Three Fiber docs and Canvas API.
- WCAG 2.2 recommendation and overview.


***


# Appendix A — Content Migration Notes
- Move `blogs/*.md` to `content/blog/*.mdx` (allow MD, process as MDX). Keep frontmatter fields: `title`, `date`, `tags`, `categories`, `image.path`, `image.alt`, `author`.
- Update image paths to `/public/` or allow `next/image` remote patterns; convert heavy GIFs to MP4 or WebM where possible.
- Create redirects if legacy blog slugs differ.


# Appendix B — Performance Budgets (initial)
- JS per route ≤ 150KB gzip (excluding R3F scenes); limit third-party.
- Images: serve responsive sizes; hero ≤ 180KB LCP image on mobile; preconnect/preload when needed.
- Fonts: 1–2 variable faces, `display: swap`, subset if necessary.


# Appendix C — Risks & Mitigations
- 3D performance on low-end devices: provide static fallback and disable high-cost effects on mobile.
- Contentlayer build time on large content: consider pure `@next/mdx` or split content repo if scale grows.
- Animation overuse: enforce reduced motion, keep durations subtle, test keyboard flows thoroughly.
