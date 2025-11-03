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
- Also take a look at shadcn, 3js and other suitable technologies to make the site transition, professional as much as possible
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

## Project Title
360ace.Tech Website — Next.js, Modern 3D UX, and Content Platform (V2‑only)

## References
- Next.js 15 overview and upgrades; Node min version and features.
- Next.js 15.4 release highlights.
- NPM next@15.4.2 package page.
- Tailwind CSS v4 announcement and features.
- Motion for React docs (import from `motion/react`).
- React Three Fiber docs and Canvas API.
- WCAG 2.2 recommendation and overview.


## Design Direction
The site standardizes on the former Variant B (immersive 3D hero) as the single experience. Earlier explorations (V1, V3) are archived for reference and no longer part of scope.

## Non‑Goals
- Building a custom headless CMS in phase 1.
- Heavy WebGL scenes or game‑like interactions that harm performance.
- Multi‑tenant authoring system (can be revisited later if needed).

---

## Discovery & Research Gates (Use Latest Tech)
For each decision, maintain a short ADR (Architecture Decision Record) under `docs/adr/` with: problem, options, decision, rationale, and date. Re‑evaluate choices once before build freeze.

1) Framework & Runtime
- Options to compare: Next.js (latest stable, App Router, RSC) vs. alternatives (SvelteKit, Remix) — choose Next.js unless a blocker appears.
- Key capabilities to confirm: React Server Components, Route Handlers, Edge runtime support, ISR/SSG/SSR, Turbopack readiness.

2) Styling & UI
- Options: Tailwind CSS + `@tailwindcss/typography` + shadcn/ui (Radix primitives) vs. CSS Modules/SCSS + component libs.
- Criteria: a11y, design velocity, bundle size, theming, long‑term maintainability.

3) Content Pipeline
- Options: Contentlayer2 + MDX, or next‑mdx‑remote, or custom remark/rehype pipeline.
- Criteria: DX, type safety, hot reload, image handling, code highlighting.

4) 3D/Immersive
- Options: React Three Fiber + drei + postprocessing vs. lightweight CSS/Canvas effects where possible.
- Criteria: FPS on mid‑tier devices, CPU/GPU usage, fallback for `prefers-reduced-motion`.

5) Search
- Options: Client‑side full‑text (FlexSearch/Lunr) vs. hosted (Algolia/Typesense Cloud) depending on index size and budget.

6) Analytics & Monitoring
- Options: Vercel Web Analytics or Plausible (privacy‑first), plus Sentry for error tracking.

7) Forms
- Options: Serverless function with email via Resend/SendGrid; anti‑spam via hCaptcha/reCAPTCHA or honeypot + rate limiting.

8) Testing
- Options: Playwright for E2E/visual, Vitest/Jest + Testing Library for units, Lighthouse CI for perf budgets.

9) Deployment
- Options: Vercel (default) vs. Netlify/Fly — prioritize preview URLs, Edge, and ISR support.

10) Upgrades
- Use Renovate/Dependabot; pin ranges; monthly “tech radar” review to keep current.

11) Agent & Automation Workflow
- Create small focused “agents” (human or AI‑assisted) for: UI polish, UX review, SEO, content improvement, and animation/3D. Each agent proposes changes via PRs referencing relevant ADRs and measurements (e.g., Lighthouse, Axe, size snapshots).

---

## Functional Requirements

1) Pages & Navigation
- Home, Services/Capabilities, About, Blog index, Blog post, Contact.
- Global header/footer; accessible menu; breadcrumb on blogs.

2) Blog Platform
- Source: Markdown/MDX from `blogs/`. Support frontmatter (title, date, author, tags, summary, hero, draft).
- Rendering: MDX with code highlighting (Shiki or `rehype-pretty-code`), Table of Contents, reading time, next/prev posts.
- Features: tag filtering, search, RSS/Atom feed, canonical URLs, social share cards.

3) 3D/Immersive Elements
- Subtle hero animation and/or interactive background using R3F where value‑add is clear.
- Respect `prefers-reduced-motion` and offer a toggle to disable effects.
- Lazy/dynamic load heavy 3D components; degrade to static imagery.

4) Contact & Forms
- Contact form with validation (React Hook Form + Zod). Serverless handler; spam protection; email notification; optional logging.

5) Content Admin Flow (Phase 1)
- Blog posts created via Git in `blogs/` with PR review and preview deployments.

6) Templates & Content Model
- Provide reusable content templates to accelerate updates and keep consistency:
  - Blog post MDX template (frontmatter + components for callouts, code blocks, galleries).
  - Case study/portfolio template (hero, metrics, quotes, process steps).
  - Services page template (feature blocks, FAQs, CTAs).
- MD/MDX lives in `content/` (or migrated from `blogs/`); pages generated via file‑based routing and Contentlayer2.
- Allow partials/slots for hero, sidebar, and CTA sections for flexibility.

7) Routing
- No variant routes. Root `/` renders the single V2 experience. Blog remains under `/blog` and `/blog/[slug]`.

---

## Non‑Functional Requirements
- Performance budgets: LCP < 2.5s, CLS < 0.1, TBT < 200ms on fast 3G/low‑end desktop with 75th percentile targets.
- Accessibility: WCAG 2.2 AA; Axe score ≥ 95 on key pages.
- SEO: Lighthouse SEO ≥ 95; sitemaps, robots, structured data, canonical.
- Security: Strict CSP, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, rate limiting on APIs.
- Privacy: Cookie‑less analytics by default; GDPR‑friendly.

---

## Technical Architecture
- Framework: Next.js 15.5.4 (App Router) with TypeScript.
- Rendering: Mix of SSG/ISR for blogs and marketing pages; use SSR/edge routes only where needed.
- Styling: Tailwind CSS + shadcn/ui (Radix) for accessible primitives; consider migrating existing SCSS selectively.
- Content: MDX + Contentlayer2 for typed content; images migrated under `public/` and rendered via `next/image`.
- 3D: React Three Fiber + drei, dynamic imports, device capability checks, motion reduction support.
- Animations: Framer Motion for route/page transitions and micro‑interactions.
- Data Fetching: RSC + `fetch` with caching; SWR for client hydration when needed.
- Search: Client‑side index via FlexSearch initially; pluggable adapter for Algolia if scale demands.
- SEO: `next-seo` or custom layout with JSON‑LD helpers; dynamic OG image generation using `@vercel/og`.
- Testing: Playwright (E2E/visual), Vitest/Jest + Testing Library (unit), ESLint + Prettier + Stylelint.
- Tooling: Turbopack (if stable for project) or Webpack; Husky + lint-staged; Conventional Commits + Changesets.
- Observability: Vercel Analytics or Plausible, Sentry for errors.

Directory sketch
```
app/
  blog/
    page.tsx       // index, tags, search
    [slug]/page.tsx
  api/contact/route.ts // serverless form handler
components/
  layout/          // SiteShell, shared chrome
  sections/        // Services/Process/etc.
  templates/       // NotFound, other shared templates
  variants/
    v2/            // v2 hero (kept as the chosen design)
content/
  blog/            // Contentlayer2‑scanned MDX from `blogs/`
lib/
public/
styles/
docs/adr/
```

---

## Content Migration Plan
- Map `blogs/*.md` to MDX with consistent frontmatter; convert image paths to `/` under `public/`.
- Add frontmatter fields where missing; build a script to normalize metadata (date, slug, tags).
- Implement redirects if URL structure changes; preserve existing backlinks.
- Generate RSS/Atom feed and sitemap.
 - Introduce MDX templates and shortcodes for common patterns (notes, asides, tabs, callouts, image grids) to keep content edits simple.

Frontmatter example
```
---
title: Why Kubernetes?
date: 2023-03-20
author: 360ace
tags: [kubernetes, devops]
summary: A practical perspective on Kubernetes adoption.
hero: /blogs/img/why-k8s.png
draft: false
---
```

---

## Accessibility & UX
- Color contrast checks; keyboard navigation; focus styles; skip links.
- Motion: honor `prefers-reduced-motion`; turn off heavy effects by default for reduced‑motion users.
- Forms: proper labels, errors, and success states; ARIA only when necessary.

---

## SEO & Social
- Per‑page titles, meta descriptions, canonical URLs; Open Graph and Twitter cards.
- JSON‑LD for `Organization`, `BreadcrumbList`, and `BlogPosting`.
- `robots.txt`, `sitemap.xml`, and 410/301 handling for removed/moved content.

---

## Security & Privacy
- HTTP security headers (CSP with nonces for inline RSC styles, frame‑ancestors, upgrade‑insecure‑requests; HSTS on apex).
- Rate limit contact API; captcha/honeypot; server‑side validation with Zod.
- No third‑party trackers by default; opt‑in analytics only.

---

## CI/CD & Environments
- GitHub/GitLab with Vercel integration for preview deployments on PRs.
- Branching: `main` (production), `develop` (staging), `revamp` (feature branch for this program). All work merges into `revamp` via PRs; promotion to `develop` after QA; release to `main` after UAT. PR checks: lint, typecheck, unit, E2E smoke, Lighthouse CI.
- Secrets managed via Vercel envs; no secrets in repo.

---

## Acceptance Criteria (Definition of Done)
- Tech decisions documented via ADRs; all research gates completed.
- Pages implemented: Home, Services, About, Blog index, Post, Contact.
- Blog MDX rendering with ToC, code highlighting, reading time, tags, search.
- 3D elements implemented with graceful fallback and motion toggle.
- Performance: LCP < 2.5s, CLS < 0.1, TBT < 200ms on target profiles; Lighthouse ≥ 90 across PWA/Perf/A11y/SEO.
- Accessibility: Axe score ≥ 95 on key pages; keyboard nav passes.
- SEO: sitemaps, robots, JSON‑LD, canonical, dynamic OG images.
- CI/CD: automated checks passing; preview links for all PRs.
- Analytics/Monitoring: privacy‑friendly analytics enabled; Sentry connected (DSN through env).
- Documentation: README with dev setup, scripts, and deployment; migration guide.
 - Variants: Out of scope. V1/V3 archived; site ships V2 only.

---

## Metrics & KPIs
- Core Web Vitals (CrUX/Lighthouse CI): LCP, CLS, TBT.
- Organic traffic growth; blog read depth; time on page.
- Error rate (Sentry), 95th percentile response time for serverless endpoints.

---

## Risks & Mitigations
- 3D performance on low‑end devices — mitigate with feature detection, dynamic import, fallbacks, and motion toggle.
- Content migration inconsistencies — dry‑run script, review diffs, and add redirects.
- Framework churn — lock to latest stable Next.js; renovate for controlled upgrades.

---

## Timeline (Indicative)
- Week 1: Discovery gates, scaffolding, shared content pipeline and templates.
- Week 2: Build three variants (V1/V2/V3) on shared content; deploy previews + collect metrics.
- Week 3: Select/merge direction; harden accessibility, performance; implement contact API.
- Week 4: Finalize SEO, analytics/monitoring, CI/CD polish, redirects, launch.

---

## Work Breakdown (Agent‑Friendly)
- Setup: Next.js app, TS, Tailwind, shadcn/ui, ESLint/Prettier, Husky.
- Content: Migrate `blogs/` to MDX with frontmatter; image moves; feed/sitemap.
- Blog UX: index with filters/search; post page with ToC and code highlight.
- 3D: hero effect (R3F), dynamic import, reduced‑motion support.
- SEO: titles, canonicals, OG, JSON‑LD, robots, redirects.
- Forms: contact page + serverless handler + anti‑spam.
- Testing: Playwright smoke, unit tests for utilities and components.
- Delivery: Vercel pipelines, preview links, monitoring, docs.

---

## Open Questions
- Branding/assets updates or design kit to adopt?
- Preference for Tailwind vs. keeping SCSS for most components?
- Budget/approval for Algolia/Typesense if search needs to scale?
- Preferred analytics provider (Vercel, Plausible, or none)?

---

## References
- Next.js App Router docs, Contentlayer2, React Three Fiber, Framer Motion, Radix UI, shadcn/ui, Plausible, Sentry.
