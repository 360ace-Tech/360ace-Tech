# 360ace.Tech — Implementation Guide

Updated: 2025-09-28

This guide provides the practical, end-to-end steps to implement the PRD (`docs/PRD.md`) and coordinate the agents (`docs/AGENTS.md`). It supports both a fresh scaffold and an in-repo upgrade.

Link to next phase: Use the orchestrator prompt in `docs/PROMPT.md`.


## 0) Prerequisites
- Node.js 20+ recommended (LTS). Next.js 15 requires Node ≥ 18.18.
- PNPM or NPM (examples use NPM).
- GitHub repo with CI permissions and Vercel account (recommended) or Cloudflare Pages alternative.


## 1) Create or Upgrade the Next.js App
Option A — Fresh scaffold (recommended clean start):
- `npx create-next-app@latest 360ace-tech --typescript --eslint --app --src-dir=false --tailwind=false`
- `cd 360ace-tech`

Option B — In-place upgrade (this repo already contains an App Router shell):
- `npm i -E next@15.4.2 react@19 react-dom@19`
- Ensure `app/` exists and `next.config.mjs` exports a plain config (we will extend it later as needed).


## 2) Tailwind CSS Setup (v4 preferred; include v3 fallback)
Preferred (v4):
- `npm i -D tailwindcss@latest`
- Create `app/globals.css` (or keep) with at least:
  - `@import "tailwindcss";`
- If using a config, create `tailwind.config.ts` with `content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"]` and define theme tokens.

Fallback (v3.4.x):
- `npm i -D tailwindcss@^3.4 postcss autoprefixer`
- `npx tailwindcss init -p`
- Configure `content` globs to `app/**` + `components/**` + `content/**` and import `@tailwind base; @tailwind components; @tailwind utilities;` in `app/globals.css`.

Add dark theme toggle:
- `npm i next-themes`
- Create a `ThemeProvider` and wrap it in `app/layout.tsx`; persist theme in `localStorage`.


## 3) Animation & 3D
Motion (official modern package):
- `npm i motion`
- Use `import { motion } from 'motion/react'` and prefer variants + reduced-motion checks.

3D (React Three Fiber + Drei):
- `npm i three @react-three/fiber @react-three/drei`
- Lazy-load heavy scenes (`dynamic(() => import('../components/Hero3D'), { ssr: false })`).
- Provide a static fallback poster image for LCP; gate effects on mobile.


## 4) Content System (MDX + Contentlayer)
Install:
- `npm i contentlayer next-contentlayer @mdx-js/react remark-gfm`

Configure `contentlayer.config.ts` (example outline):
- Define `Post` with fields: title, date, tags, categories, image (path, alt), author, slug.
- Source from `content/blog/**/*.mdx` and compute slug from filename.

Wire into Next:
- Wrap `next.config.mjs` with `withContentlayer()`.
- Create `content/` and migrate posts from `blogs/` (see migration in PRD Appendix A).

Pages:
- `app/blog/page.tsx` — listing with pagination and tag filters.
- `app/blog/[slug]/page.tsx` — render MDX via `MDXProvider` shortcodes.
- Optional: `/tags/[tag]` route for filtered view.

Shortcodes:
- `components/mdx/Callout.tsx`, `Figure.tsx`, `CodeBlock.tsx` (copy-to-clipboard), `Steps.tsx`.


## 5) Core App Structure
Recommended folders:
```
app/
  (marketing)/
  blog/
  about/
  contact/
  sitemap.ts
  robots.ts
  manifest.ts
  opengraph-image.tsx
components/
  mdx/
  ui/
  sections/
content/
  blog/
lib/
  contentlayer.ts
  seo.ts
public/
  images/
```


## 6) SEO & Metadata
- Use the Metadata API with a `metadata` export per route.
- Create `app/sitemap.ts` (or `next-sitemap` for very large sites) and `app/robots.ts`.
- Generate social images via `opengraph-image.tsx` (Satori) or static assets; include per-post OG images.


## 7) Forms & Integrations
- Contact form: Server Action or `app/api/contact/route.ts` with schema validation (Zod) and email provider (Resend or SES); honeypot and rate-limit.
- Analytics: Vercel Analytics/Speed Insights or Plausible.
- Error instrumentation: basic `error.js` and `not-found.js` pages; consider Sentry (optional).


## 8) Theming & Design System
- Establish CSS variables for color tokens (light/dark) and semantic roles.
- Define typography scale, spacing, radii, and shadows; align with Tailwind tokens.
- Replace icon fonts with inline SVGs or `react-icons`/`lucide-react`.


## 9) Testing & Quality Gates
Install:
- `npm i -D jest @testing-library/react @testing-library/jest-dom ts-jest`
- `npm i -D playwright @playwright/test`
- `npm i -D pa11y-ci lighthouse` (or use GitHub Action marketplace actions)

Scripts (examples to add to `package.json`):
- `"test": "jest"`
- `"test:e2e": "playwright test"`
- `"validate": "npm run lint && npm run test && npm run build"`
- `"validate:ci": "npm run lint && npm run test && npm run test:e2e && npm run build"`

Playwright basics:
- Add tests for: main nav, blog open/close, contact form submission.

A11y & Perf:
- Pa11y CI against `http://localhost:3000` key routes.
- Lighthouse CI with budgets for LCP/TBT/CLS.


## 10) CI/CD
GitHub Actions (outline):
- Workflow triggers: PRs and `main`.
- Jobs: install/cache, lint, unit, build, e2e (optional with preview), pa11y/lighthouse, deploy to Vercel on `main`.

Vercel:
- Connect repo, set project, configure ENV secrets, and custom domain.


## 11) Migration from Current Repo
- Remove legacy `index.html` from root after Next pages are complete.
- Move `assets/img` under `public/images/..`; convert large GIFs to MP4/WebM or APNG.
- Convert `/blogs/*.md` → `/content/blog/*.mdx`; update image references to `/images/...`.
- Replace icon fonts/CDN assets with local packages and SVGs.
- Re-implement existing sections as server components with Motion where needed.


## 12) Validation — Local and CI
Local:
- `npm run dev` — smoke test routes and responsive behavior.
- `npm run validate` — lint + tests + build.
- Manual a11y and reduced-motion reviews.

CI:
- Ensure all jobs pass; check Lighthouse/Pa11y reports.


## 13) Troubleshooting & Rollback
Common issues:
- Build fails after Tailwind v4 upgrade → temporarily pin to v3.4 and revisit.
- Contentlayer type errors → run a clean build and check frontmatter fields.
- Slow LCP due to hero media → serve a static poster, lazy-mount canvas, ensure `priority` image is optimized.

Rollback:
- Maintain a `release/*` branch per deploy; revert via GitHub UI or `git revert` and re-deploy.


## 14) Completion
- All PRD acceptance criteria satisfied; agents hand off to ReleaseAgent.
- Archive legacy assets and keep a changelog of structural changes for future maintainers.
