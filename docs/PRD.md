# Product Requirements Document (PRD)

## Project Title
360ace.Tech Website — Next.js, Modern 3D UX, and Content Platform (V2‑only)

## Objective
Rebuild the current static site into a performant, accessible, and scalable web app on Next.js 15.5.4 (App Router). Deliver a polished brand experience with subtle, high‑quality 3D/immersive elements, robust blog publishing, excellent Core Web Vitals, and a professional CI/CD workflow.

## Background & Context
- Current site is a static HTML/CSS/JS build in this repo (`index.html`, `assets/`, `blogs/`).
- Blogs exist as Markdown with images in `blogs/img/`.
- Goals: modernize stack, unify content workflow, improve UX, and enable fast iteration.

## Goals
- Modern stack with type safety, great DX, and easy hosting.
- Seamless blog rendering from Markdown/MDX with tags, search, and SEO.
- Tasteful 3D/immersive elements that enhance, not distract; graceful fallbacks.
- Excellent performance (LCP, CLS, TBT), accessibility, and SEO.
- Professional delivery: CI/CD, previews, observability, and documentation.

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
