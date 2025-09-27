# Product Requirements Document (PRD)

## Project Title

## Background & Context
- Current site is a static HTML/CSS/JS build in this repo (`index.html`, `assets/`, `blogs/`).
## Goals
- Seamless blog rendering from Markdown/MDX with tags, search, and SEO.
- Tasteful 3D/immersive elements that enhance, not distract; graceful fallbacks.
- Excellent performance (LCP, CLS, TBT), accessibility, and SEO.
- Professional delivery: CI/CD, previews, observability, and documentation.
## Variations (3 Concepts to Prototype)
Produce three distinct, high‑fidelity variations of the revamp to evaluate direction before committing to a final build. Each variant ships as a deployable preview with metrics.

- Variant B — Immersive 3D Hero
  - Goal: “Wow” factor on modern devices with graceful fallbacks.

  - Style: Magazine‑like layouts, rich MDX components, narrative case studies.
  - Tech emphasis: MDX template richness, callouts/steps/galleries; strong SEO.

Variant selection process
- Choose one primary direction; optionally merge strengths from others.

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
- Options: Contentlayer + MDX, or next‑mdx‑remote, or custom remark/rehype pipeline.
- Criteria: DX, type safety, hot reload, image handling, code highlighting.

4) 3D/Immersive
- Options: React Three Fiber + drei + postprocessing vs. lightweight CSS/Canvas effects where possible.
- Criteria: FPS on mid‑tier devices, CPU/GPU usage, fallback for `prefers-reduced-motion`.

5) Search

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




## Non‑Functional Requirements
- Performance budgets: LCP < 2.5s, CLS < 0.1, TBT < 200ms on fast 3G/low‑end desktop with 75th percentile targets.
- Security: Strict CSP, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, rate limiting on APIs.
- Privacy: Cookie‑less analytics by default; GDPR‑friendly.

---

## Technical Architecture
- Framework: Next.js 15.5.4 (App Router) with TypeScript.
- Rendering: Mix of SSG/ISR for blogs and marketing pages; use SSR/edge routes only where needed.
- Styling: Tailwind CSS + shadcn/ui (Radix) for accessible primitives; consider migrating existing SCSS selectively.
- Content: MDX + Contentlayer for typed content; images migrated under `public/` and rendered via `next/image`.
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
  (marketing)/
  blog/
    page.tsx       // index, tags, search
    [slug]/page.tsx
  api/contact/route.ts // serverless form handler
components/
content/
  blog/            // Contentlayer‑scanned MDX from `blogs/`
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

---
- Error rate (Sentry), 95th percentile response time for serverless endpoints.

---

## Risks & Mitigations
- 3D performance on low‑end devices — mitigate with feature detection, dynamic import, fallbacks, and motion toggle.
- Content migration inconsistencies — dry‑run script, review diffs, and add redirects.
- Framework churn — lock to latest stable Next.js; renovate for controlled upgrades.

---

## Timeline (Indicative)
- Week 1: Discovery gates, scaffolding, shared content pipeline and templates.
- Week 2: Migrate all blog content and images to the new site using MDX with frontmatter; implement reusable templates for all pages and posts.
- Week 3: Harden accessibility, performance; implement contact API; validate site rendering and content migration with all test/validation tools.
- Week 4: Finalize SEO, analytics/monitoring, CI/CD polish, redirects, launch.

---

## Work Breakdown (Agent‑Friendly)
- Setup: Next.js app, TS, Tailwind, shadcn/ui, ESLint/Prettier, Husky.
- Content: Review all previous website contents for completeness and accuracy; migrate `blogs/` to MDX with frontmatter; image moves; feed/sitemap.
- Blog UX: index with filters/search; post page with ToC and code highlight; ensure all pages and blog posts use reusable, well-documented templates for easy future updates and content improvement.
- 3D: hero effect (R3F), dynamic import, reduced‑motion support.
- SEO: titles, canonicals, OG, JSON‑LD, robots, redirects.
- Forms: contact page + serverless handler + anti‑spam.
- Testing: Playwright smoke, unit tests for utilities and components; validate site rendering and content migration with all test/validation tools.
- Delivery: Vercel pipelines, preview links, monitoring, docs.

---

## Open Questions
- Branding/assets updates or design kit to adopt?
- Preference for Tailwind vs. keeping SCSS for most components?
- Budget/approval for Algolia/Typesense if search needs to scale?
- Preferred analytics provider (Vercel, Plausible, or none)?

---

## References
- Next.js App Router docs, Contentlayer, React Three Fiber, Framer Motion, Radix UI, shadcn/ui, Plausible, Sentry.
