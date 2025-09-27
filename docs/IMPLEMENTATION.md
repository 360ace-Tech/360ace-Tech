
# IMPLEMENTATION.md — Revamp Plan (Codex‑Driven)

> **Purpose**: End‑to‑end implementation plan to deliver the PRD with **research‑first gates**, **error‑proof workflows**, **automated verification**, and **self‑healing fixes** — orchestrated via a coding agent (e.g., *Codex*). This file is designed to be executed step‑by‑step by a capable code agent and human maintainers.

---

## 0) Operating Principles

- **Research before build**: Every major choice is preceded by a short ADR (`docs/adr/*.md`). Re‑evaluate once before build freeze.
- **Fail‑safe by default**: CI blocks merges on type/lint/test/visual baselines, Lighthouse CI budgets, a11y checks, and E2E smoke.
- **No regressions**: Golden screenshots, content diffs, and redirects validation are mandatory gates.
- **Graceful UX**: Motion/3D feature‑detect with fallbacks and `prefers-reduced-motion` respected throughout.
- **Documentation as code**: All runbooks, prompts, and scripts live in the repo.

---

## 1) Repo Preparation & Branching

```bash
# Initial branches
git checkout -b revamp
git push -u origin revamp

# Protect branches in Git hosting (UI): main, develop
# Default working branch for this program: revamp
```

**Branch model**
- `revamp` → feature integration branch for the program
- `develop` → staging (auto deploy previews)
- `main` → production

---

## 2) Discovery & Research Gates (ADR‑Driven)

Create a minimal ADR template under `docs/adr/000-template.md`:

```md
# {Title}
- **Date**: YYYY-MM-DD
- **Status**: Proposed | Accepted | Rejected | Superseded by ADR-XXX
- **Context / Problem**
- **Options Considered**
- **Decision**
- **Consequences**
- **Verification Plan** (how we’ll prove this was right)
```

### Gate A — Framework & Runtime
**Options**: Next.js (App Router, RSC), SvelteKit, Remix.  
**Default**: Next.js (per PRD).  
**Verify**: RSC + Route Handlers work; ISR/SSG for blog; Edge runtime optional; Turbopack viability.

### Gate B — Styling & UI
**Options**: Tailwind + `@tailwindcss/typography` + shadcn/ui (Radix) vs CSS Modules/SCSS.  
**Criteria**: a11y, design velocity, theming, bundle size, maintainability.

### Gate C — Content Pipeline
**Options**: Contentlayer + MDX vs `next-mdx-remote` vs custom remark/rehype.  
**Default**: Contentlayer + MDX for typed content and hot reload.  
**Verify**: Correct frontmatter typing, image handling via `next/image`, code highlight with Shiki/`rehype-pretty-code`.

### Gate D — 3D/Immersive
**Options**: React Three Fiber + drei + postprocessing vs lightweight CSS/canvas effects.  
**Verify**: FPS ≥ 55 on mid-tier laptop; motion toggle; dynamic import; bundle split confirmed.

### Gate E — Search
**Default**: Client-side FlexSearch; adapter layer for Algolia/Typesense if needed.  
**Verify**: Index size & FCP unaffected; hydration cost acceptable.

Each gate gets an ADR: `docs/adr/00X-*.md` with a one‑pager and quick PoC if needed.

---

## 3) Scaffold & Tooling (Automated)

> Target stack per PRD: **Next.js 15.x (App Router, TS)**, Tailwind, shadcn/ui, Contentlayer, MDX, Framer Motion, R3F, FlexSearch, Playwright, Vitest/Jest, ESLint/Prettier, Husky, lint-staged, Changesets, next-seo/SERP helpers, Sentry (errors), Plausible or Vercel Analytics.

```bash
# Pre-reqs
corepack enable
pnpm -v || npm i -g pnpm

# Create app
pnpm create next-app@latest app-revamp --ts --eslint --tailwind --src-dir --app --import-alias "@/*"
cd app-revamp

# Add dependencies
pnpm add contentlayer next-contentlayer gray-matter remark rehype rehype-pretty-code shiki
pnpm add next-seo reading-time zod react-hook-form swr class-variance-authority clsx
pnpm add framer-motion
pnpm add @react-three/fiber three @react-three/drei
pnpm add flexsearch
pnpm add sharp # for next/image local optimization

# Dev tools
pnpm add -D @types/node @types/react @types/react-dom typescript
pnpm add -D eslint prettier eslint-config-next eslint-config-prettier stylelint stylelint-config-standard
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional
pnpm add -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D playwright @playwright/test @axe-core/playwright
pnpm add -D lighthouse lhci
pnpm add -D changesets @changesets/cli

# Initialize tools
pnpm dlx husky init
pnpm dlx @changesets/cli init
```

**Husky hooks** (`.husky/pre-commit`):
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
pnpm lint-staged
```

**lint-staged** (`package.json` excerpt):
```json
{
  "lint-staged": {
    "*.{ts,tsx,js}": ["eslint --fix", "prettier --write"],
    "*.md": ["prettier --write"],
    "*.{css,scss}": ["stylelint --fix"]
  }
}
```

**Commitlint** (`commitlint.config.cjs`):
```js
export default { extends: ['@commitlint/config-conventional'] };
```

---

## 4) Directory Structure (Aligned to PRD)

```
app/
  (marketing)/
  blog/
    page.tsx              # index, tags, search
    [slug]/page.tsx
  api/contact/route.ts    # serverless form handler (Zod-validated)
components/
content/
  blog/                   # Contentlayer‑scanned MDX (from legacy blogs/)
lib/
public/
styles/
docs/adr/
```

---

## 5) Content Migration Plan (Automated & Verifiable)

### 5.1 Map & Normalize
- Convert `blogs/*.md` → MDX with stable frontmatter:
  - `title`, `date`, `author`, `tags[]`, `summary`, `hero`, `draft`
- Move referenced images to `public/` and update links to absolute `/` paths.

**Frontmatter example**:
```md
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

### 5.2 Migration Script (with Dry‑Run)
Add `scripts/migrate-content.ts`:

```ts
/**
 * Migrates legacy ./blogs/*.md to ./content/blog/*.mdx
 * - Validates/repairs frontmatter
 * - Rewrites image paths to /
 * - Reports redirect map if slugs change
 * Run: pnpm migrate:content --dry-run | --write
 */
```

**package.json**:
```json
{
  "scripts": {
    "migrate:content": "ts-node --transpile-only scripts/migrate-content.ts",
    "migrate:content:check": "pnpm migrate:content --dry-run && git diff --exit-code"
  }
}
```

### 5.3 Redirects & Backlinks
- Produce `redirects.csv` from the migration script:
  - `from_url, to_url, http_status`
- Implement redirects in Next.js (`next.config.mjs`) or hosting platform config.
- Validate with Playwright: old URLs → `to` with 301/308; capture report.

### 5.4 Feeds & Sitemaps
- `app/rss.xml/route.ts`, `app/atom.xml/route.ts`, `app/sitemap.xml/route.ts`
- Validate with XML schema linters and a crawler in CI.

---

## 6) Blog UX & Rendering

- **Index**: tag filters, search (FlexSearch), pagination.
- **Post**: ToC, code highlight (Shiki/rehype-pretty-code), reading time, next/prev, canonical URLs, social cards.
- **MDX shortcodes**: callouts, steps, tabs, image grids (`components/mdx/*`).

---

## 7) 3D / Immersive (R3F) with Fallbacks

- Lazy load hero scene via `dynamic(() => import('./Hero3D'), { ssr: false })`.
- Feature‑detect WebGL, reduce motion:
  - If `prefers-reduced-motion` or insufficient GPU, render static hero image.
- Cap frame loop for CPU restraint; test FPS on mid‑tier laptop in CI (Playwright + FPS probe).

---

## 8) Forms & Serverless API

- Contact form: React Hook Form + Zod schema; server validation in `api/contact/route.ts`.
- Anti‑spam: honeypot field + rate limiting (IP hash, short window). Optional captcha toggle.
- Email notify: integrate provider (e.g., Resend/alternative) via env var; log to server if disabled in dev.

---

## 9) SEO & Social

- Titles, meta, canonicals; JSON‑LD (`Organization`, `BreadcrumbList`, `BlogPosting`).
- `robots.txt` and `sitemap.xml` routes.
- Dynamic OG images via `@vercel/og` or alternative image generation route.

---

## 10) Accessibility & Performance Budgets

- **Budgets**: LCP < 2.5s, CLS < 0.1, TBT < 200ms on fast 3G / low‑end desktop (75th pctl).
- **Checks**:
  - `@axe-core/playwright` for a11y violations in smoke pages.
  - Lighthouse CI with JSON budgets; block PR if exceeded.
  - Bundle analyzer optional for regressions.

---

## 11) Observability

- Sentry for error capture; Plausible or Vercel Analytics (opt‑in, cookie‑less).
- Server logs for `api/contact` success/failure (redact PII).

---

## 12) CI/CD (GitHub Actions)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    branches: [revamp, develop, main]
  push:
    branches: [revamp]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: corepack enable
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck || (echo 'Typecheck failed' && exit 1)
      - run: pnpm lint
      - run: pnpm test -- --coverage
      - name: Playwright install
        run: pnpm dlx playwright install --with-deps
      - name: E2E smoke
        run: pnpm e2e:smoke
      - name: Lighthouse
        run: pnpm lhci autorun
      - name: Content migration dry-run
        run: pnpm migrate:content:check
```

Add `.github/workflows/preview.yml` for deploy previews (Vercel or other).

---

## 13) Verification Gates (What Blocks a Merge)

1. **Static checks**: ESLint, Prettier, Stylelint, Typecheck.
2. **Unit**: Vitest coverage ≥ threshold.
3. **E2E**: Playwright smoke of key pages (Home, Blog Index, Blog Post, Contact).
4. **A11y**: No serious violations (`@axe-core/playwright`).
5. **Perf**: LHCI budgets green on Home/Blog Post.
6. **Content**: Migration dry‑run yields zero unknowns; redirects validated.
7. **SEO**: sitemap/robots present; canonical/noindex rules applied as expected.
8. **Security**: Headers present in responses; contact API rate‑limited.

Merge is blocked if any gate fails. Codex should auto‑attempt fixes where trivial (lint, format, low‑hanging performance issues) and push a new commit.

---

## 14) Codex Agent Runbook

> The following instructions can be pasted into a code agent console to orchestrate the program.

### 14.1 Bootstrap Prompt (High‑Level)

```
You are the Implementation Agent for a website revamp. Goals:
- Research first (create ADRs under docs/adr) for framework, styling, content pipeline, 3D, search.
- Scaffold Next.js TS App Router project with Tailwind, shadcn/ui, Contentlayer MDX, Framer Motion, R3F.
- Migrate legacy blogs from ./blogs/*.md to ./content/blog/*.mdx with validated frontmatter, image path rewrites, and redirects.
- Implement blog UX (index w/ tags+search, post w/ ToC, code highlight, reading time, next/prev).
- Add contact form (React Hook Form + Zod) with serverless route, anti-spam, and email integration via env.
- Add SEO (titles, canonicals, OG, JSON-LD), feeds (RSS/Atom), and sitemap.
- Add tests (Vitest + Testing Library), Playwright E2E+axe, Lighthouse CI budgets.
- Set up CI/CD (GitHub Actions) with merge gates; deploy previews.
- Add observability (Sentry + Plausible/Vercel Analytics).
- Ensure R3F hero is lazy-loaded with motion toggle and fallbacks.
- Provide run scripts and documentation.

Constraints:
- No secrets in repo; use env vars.
- Respect performance budgets and accessibility.
- Fix any CI failures and re-run until green.

Deliverables:
- Working repo with passing CI on revamp branch.
- IMPLEMENTATION.md updated with steps taken and decisions in docs/adr.
- Migration report (redirects.csv), feeds, sitemap, and verification artifacts.

Begin by scanning repo for ./index.html, ./assets/, ./blogs/ and propose an ADR for each research gate.
```

### 14.2 Guardrails
- Never delete content; move and deprecate with redirects.
- Always run `pnpm migrate:content --dry-run` before `--write`.
- If Playwright/LHCI fail, attempt automated fixes, else open an issue with logs.

### 14.3 Commands (Agent Checklist)
- `pnpm typecheck && pnpm lint && pnpm test`
- `pnpm e2e:smoke` (local dev server) → fix failures
- `pnpm lhci autorun` → improve LCP/CLS/TBT until budgets pass
- `pnpm migrate:content:check` → only then `pnpm migrate:content --write`

---

## 15) Scripts & Config Snippets

**`package.json` (scripts excerpt)**:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e:smoke": "playwright test",
    "lhci": "lhci",
    "migrate:content": "ts-node --transpile-only scripts/migrate-content.ts",
    "migrate:content:check": "pnpm migrate:content --dry-run && git diff --exit-code"
  }
}
```

**Lighthouse CI** (`lighthouserc.json`):
```json
{
  "ci": {
    "collect": {
      "staticDistDir": ".next",
      "startServerCommand": "pnpm start",
      "url": ["/", "/blog", "/blog/sample-post"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:seo": ["error", {"minScore": 0.9}],
        "uses-rel-preconnect": "warn"
      }
    }
  }
}
```

**Playwright** (`playwright.config.ts` smoke example):
```ts
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:3000' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

**A11y smoke** (`tests/e2e/a11y.spec.ts`):
```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('a11y: home/blog/contact have no serious violations', async ({ page }) => {
  for (const path of ['/', '/blog', '/contact']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(v => ['serious','critical'].includes(v.impact));
    expect(serious, `A11y violations on ${path}`).toEqual([]);
  }
});
```

---

## 16) Security & Privacy
- Add strict security headers in Next.js (CSP with nonces for RSC inline, `frame-ancestors 'none'`, HSTS on apex).
- Rate‑limit contact API; redact PII in logs.
- Cookie‑less analytics; opt‑in only.

---

## 17) Rollout Plan

1. **Week 1** — Research ADRs, scaffold, shared content/MDX templates.
2. **Week 2** — Migrate blogs & images, implement pages/components.
3. **Week 3** — Harden a11y/perf; implement contact API; verify redirects.
4. **Week 4** — SEO polish, analytics/monitoring, CI green, UAT → promote to `develop`, then `main`.

**Promotion**:
- Auto preview on PR → QA checks → merge to `develop` (staging) → UAT sign‑off → tag + release to `main`.

**Rollback**:
- Immutable builds; revert commit + redeploy. Keep old static assets for 7 days to preserve caches.

---

## 18) Acceptance Criteria (Definition of Done)

- All CI gates pass (lint/type/unit/e2e/a11y/perf budgets).
- Blog migration complete; redirects validated; feeds and sitemap live.
- 3D hero loads lazily with motion toggle; fallbacks verified.
- Contact form works with server validation and rate limits.
- Error budget healthy; Sentry shows no unhandled exceptions post‑launch.
- Documentation complete (ADRs, this IMPLEMENTATION.md, runbooks).

---

## 19) Open Questions
- Branding system or design kit updates?
- Search scale budget (stay local vs Algolia/Typesense)?
- Preferred analytics provider?
- Keep any legacy SCSS selectively?

---

## 20) Checklist (Copy into PR Template)

- [ ] ADRs merged for gates A–E
- [ ] Scaffold completed; scripts added
- [ ] Content migration dry‑run clean; `--write` executed
- [ ] Redirects validated (Playwright)
- [ ] Blog UX complete (index/search/ToC/reading time)
- [ ] Forms/API validated with spam tests
- [ ] A11y/Lighthouse budgets green
- [ ] Observability configured
- [ ] CI/CD passing; preview deploy verified
- [ ] Docs updated (ADRs, runbooks, IMPLEMENTATION.md)

---

## 21) Appendix — Minimal `next.config.mjs` Redirects Example

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Example: load from generated redirects.json if desired
    return [
      // { source: '/old-path', destination: '/blog/new-slug', permanent: true },
    ];
  },
  experimental: {
    // enable as needed
  },
};

export default nextConfig;
```
