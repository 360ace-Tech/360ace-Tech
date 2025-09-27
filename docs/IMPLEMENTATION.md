# Implementation Plan — 360ace.Tech Revamp (Next.js 15.5.4)

This document translates the PRD (docs/PRD.md) into a concrete, step‑by‑step plan. It adds a variants strategy to deliver three distinct concepts (V1/V2/V3) before finalizing the direction.

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
- Optional variant sub‑branches: `variant/minimal`, `variant/immersive`, `variant/editorial` merged into `revamp`.

## Variants Strategy (V1/V2/V3)
- Goals: ship three deployable previews that share the same content/model but differ in presentation.
- Routing:
  - Create route groups: `app/(variants)/v1`, `app/(variants)/v2`, `app/(variants)/v3`.
  - Keep a shared core under `app/(core)` for layouts, head/metadata, and MDX providers.
  - Root selection: production "/" uses env `SITE_VARIANT` (`v1|v2|v3`). During review, prototypes live at `/v1`, `/v2`, `/v3`.
- Content reuse: single Contentlayer schema; all variants import the same typed data.
- Theming:
  - Define theme tokens (CSS variables, Tailwind theme extension) per variant under `styles/themes/{v1,v2,v3}.css`.
  - shadcn/ui components read tokens; minimal overrides per variant.
- Motion & 3D per variant:
  - V1: minimal motion (Framer), CSS/Canvas effects only.
  - V2: R3F hero (dynamic import + motion toggle + reduced‑motion support).
  - V3: rich MDX components (callouts/steps/galleries) with light motion.
- Measurement deliverables for each variant:
  - Lighthouse (Perf/A11y/SEO/Best) + size snapshot, Axe, FPS notes for V2.
  - Short rationale doc in `docs/variants/{v1,v2,v3}.md`.

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

Phase 3 — Variants (V1/V2/V3)
1) Layout base in `app/(core)` + MDX provider and shared components.
2) Create `app/(variants)/v1` (minimal), `v2` (immersive 3D), `v3` (editorial) with dedicated theme tokens.
3) Wire env `SITE_VARIANT` and `/v1|/v2|/v3` routes; root `/` resolves to selected variant.
4) Measure each variant (Lighthouse/Axe/FPS); write `docs/variants/*.md` rationales.

Phase 4 — Selection + Merge
1) Stakeholder review; choose primary direction; optionally merge best elements.
2) Consolidate selected variant into production layout; keep `/v1|/v2|/v3` for reference until launch.

Phase 5 — SEO/Perf/Analytics
1) Metadata, JSON‑LD, OG; tune to hit LCP/CLS/TBT budgets.
2) Enable analytics; connect Sentry.

Phase 6 — QA + Launch
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
- `scripts/collect-metrics.mjs`: run Lighthouse (CI) for `/v1|/v2|/v3` and store reports.

## Directory Layout (target)
```
app/
  (core)/               # shared layout/providers/seo
  (variants)/
    v1/                 # minimal performance-first
      page.tsx
    v2/                 # immersive 3D hero
      page.tsx
    v3/                 # editorial/brand story
      page.tsx
  blog/
    page.tsx
    [slug]/page.tsx
  api/contact/route.ts
components/
  ui/           # shadcn/ui exports
  mdx/          # MDX shortcodes
  3d/           # R3F scenes
content/
  blog/
  services/
  case-studies/
lib/
public/
styles/
  themes/
    v1.css
    v2.css
    v3.css
docs/
  adr/
  variants/
scripts/
```

## Acceptance Gates
- Performance: LCP < 2.5s, CLS < 0.1, TBT < 200ms on target profiles.
- Accessibility: Axe ≥ 95; keyboard nav; reduced‑motion honored.
- SEO: Metadata complete; JSON‑LD valid; OG images render; Lighthouse SEO ≥ 95.
- Content: Legacy blogs migrated; templates functioning; redirects in place.
- CI/CD: All checks green; previews for each variant.
- Variants: Three deployed previews with reports and a documented selection decision.

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

# run variants locally (visit /v1, /v2, /v3)
npm run dev
# or choose default variant for root
SITE_VARIANT=v2 npm run dev
```

---

For scope and quality bars, see `docs/PRD.md`.

