# Implementation Plan — 360ace.Tech Revamp (Next.js 15.5.4)

This document translates the PRD (docs/PRD.md) into a concrete, step‑by‑step plan. The site standardizes on a single design (V2). Prior explorations (V1, V3) are archived under `archive/` and excluded from builds.

## Targets
- Framework: Next.js 15.5.4 (App Router, RSC)
- TypeScript: strict
- Styling/UI: Tailwind CSS + shadcn/ui (Radix primitives)
- Animation: Framer Motion
- 3D: React Three Fiber (R3F) + @react-three/drei (graceful fallbacks)
- Content: MDX + Contentlayer2 (typed) using existing `blogs/` migrated to `content/`
- Search: FlexSearch (client) with adapter to Algolia/Typesense
- SEO: Next metadata + JSON‑LD helpers; optional `next-seo`
- Images: `next/image` + `sharp`; OG via `@vercel/og`
- Forms: Route Handlers + Zod validation with anti‑spam
- QA: ESLint, Prettier, Vitest/Jest + Testing Library, Playwright E2E, Lighthouse CI
- Delivery: Vercel (previews), Renovate/Dependabot

## Branch Strategy
- Long‑lived feature branch: `revamp` (no direct commits to `main`).
- Flow: feature/* → PR → `revamp` → QA → `develop` → UAT → `main`.

## Consolidated Strategy (V2 only)
- Routing: remove `/v1` and `/v3`; root `/` renders the v2 experience. Keep `/blog` and `/blog/[slug]`.
- Theming: use global light/dark tokens; v2 accents applied by the hero section.
- Templates: factor shared chrome into `components/layout/site-shell.tsx` and the 404 into `components/templates/not-found.tsx`.
- Archive: move v1/v3 routes/components/styles to `archive/`.

## Templates & Content Model
- Canonical content root: `content/` (migrate `blogs/` → `content/blog/`).
- MDX frontmatter: `title`, `date`, `author`, `tags`, `summary`, `hero`, `draft`, `canonical`.
- MDX shortcodes: Callout, Steps/Step, ImageGrid, Video, Note, Quote.
- Contentlayer schemas: `Post`, `Service`, `CaseStudy` with computed fields (slug, reading time, canonical).

## Information Architecture
- Marketing: Home, Services, About, Contact.
- Blog: `/blog` index with tags/search; `/blog/[slug]` with ToC, prev/next.
- API: `/api/contact` route handler with spam protection.

## 3D & Motion
- V2 R3F hero: low‑poly scene, dynamic import, GPU budget targets; graceful fallbacks on reduced‑motion/low capability.
- Framer Motion transitions: route/page transitions, hover/focus microinteractions.

## SEO & Analytics
- Route metadata + JSON‑LD (`Organization`, `BreadcrumbList`, `BlogPosting`).
- Dynamic OG images via `@vercel/og`.
- Analytics: Vercel or Plausible; Sentry for error tracking.

## Security, Privacy, Accessibility
- Validate API inputs via Zod; set security headers (CSP, Permissions‑Policy, Referrer‑Policy, X‑Frame‑Options).
- Prefer cookie‑less analytics; GDPR‑friendly.
- Accessibility: keyboard nav, visible focus, reduced‑motion; Axe checks in CI.

## CI/CD
- Vercel previews for every PR; labels to build all variants.
- Required checks: lint, typecheck, unit, E2E smoke, Lighthouse CI budgets.
- Renovate/Dependabot for controlled upgrades.

## Step‑By‑Step Plan

Phase 0 — Branch + Baseline
1) Create `revamp`; protect `main`. Add ESLint/Prettier/Husky + lint‑staged.
2) Upgrade to Next 15.5.4 in `package.json` (within `revamp`).

Phase 1 — Styling + UI Kit
1) Tailwind (`tailwind.config.ts`, `postcss.config.js`, `app/globals.css`).
2) Initialize shadcn/ui; generate Button, Input, Dialog, Sheet, Tabs, Accordion, Tooltip, Toast.
3) Theme tokens + reduced‑motion defaults.

Phase 2 — Content Pipeline
1) Install Contentlayer2; add schemas for `Post`, `Service`, `CaseStudy`.
2) MDX pipeline: remark‑gfm, rehype‑pretty‑code (Shiki), image handling.
3) Migrate `blogs/` → `content/blog/`; add shortcodes.
4) Blog index with filters/search; post page with ToC, prev/next.

Phase 3 — Consolidation (V2)
1) Layout base in `app/(core)` + MDX provider and shared components.
2) Implement v2 home experience at `app/page.tsx` and remove `/v1` and `/v3` routes.
3) Add `SiteShell` and 404 `NotFoundTemplate`; standardize pages on these templates.
4) Archive prior variant routes/components/styles under `archive/`.

Phase 4 — SEO/Perf/Analytics
1) Metadata, JSON‑LD, OG; tune to hit LCP/CLS/TBT budgets.
2) Enable analytics; connect Sentry.

Phase 5 — QA + Launch
1) Playwright smoke + accessibility checks.
2) Final content migration; redirects; sitemap/robots.
3) Promote `revamp` → `develop` → `main` after UAT.

## Agents & Research Tasks
- UI Agent: spacing/typography/polish; PRs with screenshots.
- UX Agent: IA, nav labels, form flow; PRs with rationale.
- SEO Agent: meta/schema/sitemap/internal links; PRs with Lighthouse/validator results.
- Motion/3D Agent: timing, performance, fallbacks; PRs with FPS/bundle diffs.
- Content Agent: improve wording/CTAs; PRs with style notes.
- Each agent documents notable decisions with ADRs in `docs/adr/*`.

## Scripts to Add
- `scripts/migrate-blogs.ts`: normalize frontmatter, update image paths.
- `scripts/generate-rss.ts`: generate RSS/Atom to `public/`.
- `scripts/verify-links.ts`: check internal links.
- `scripts/collect-metrics.mjs`: run Lighthouse (CI) for key pages and store reports.

## Directory Layout (target)
```
app/
  blog/
    page.tsx
    [slug]/page.tsx
  api/contact/route.ts
components/
  layout/      # SiteShell, nav/footer
  sections/    # Services/Process/etc.
  templates/   # NotFound, shared page templates
  variants/
    v2/        # 3D hero and v2‑specific bits
content/
  blog/
lib/
public/
styles/
docs/
  adr/
archive/
  variants/
    v1/
    v3/
  components/
  styles/
```

## Acceptance Gates
- Performance: LCP < 2.5s, CLS < 0.1, TBT < 200ms on target profiles.
- Accessibility: Axe ≥ 95; keyboard nav; reduced‑motion honored.
- SEO: Metadata complete; JSON‑LD valid; OG images render; Lighthouse SEO ≥ 95.
- Content: Legacy blogs migrated; templates functioning; redirects in place.
- CI/CD: All checks green.

## Command Cheatsheet (revamp)
```
# next + core libs
npm i next@15.5.4 framer-motion three @react-three/fiber @react-three/drei \
  tailwindcss postcss autoprefixer class-variance-authority clsx tailwind-merge \
  lucide-react contentlayer2 next-contentlayer2 remark-gfm rehype-pretty-code \
  react-hook-form zod @hookform/resolvers flexsearch --save

# shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button input dialog sheet tabs accordion tooltip toast

# contentlayer (dev)
npm i -D contentlayer2 next-contentlayer2

# run locally
npm run dev
```

---

For scope and quality bars, see `docs/PRD.md`.
