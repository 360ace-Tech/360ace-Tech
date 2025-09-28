# 360ace.Tech — Agents & Roles

Updated: 2025-09-28

This document defines the AI agents and human-in-the-loop roles to deliver the PRD in `docs/PRD.md`. Each agent lists objective, responsibilities, validation checks, commands, and expected outputs.

Link to next phase: See implementation steps in `docs/IMPLEMENTATION.md`.


## Global Conventions
- Source of truth: Next.js App Router (`app/`), TypeScript, Tailwind v4.
- Definition of Done: all acceptance criteria in PRD met; CI green; Lighthouse/Pa11y budgets met; deployable on Vercel.
- Commands are run from the repository root unless noted.


## 🧠 ResearchAgent
- Objective: Confirm latest stable ecosystem choices and patterns (Next.js 15.x, React 19, Tailwind v4, Motion, R3F, Contentlayer/MDX, WCAG 2.2, SEO).
- Responsibilities:
  - Validate framework/library versions and breaking changes.
  - Propose defaults for SEO, a11y, performance budgets.
  - Curate examples for Motion and R3F with reduced-motion fallbacks.
- Validation checks:
  - Versions documented and compatible; rationale recorded in PRD.
  - a11y and SEO checklists complete.
- Commands:
  - `npm run validate:versions` (optional custom script)
- Output & hand-off:
  - Update notes referenced by BuilderAgent and DesignAgent.


## 🧱 BuilderAgent
- Objective: Scaffold the Next.js 15.4.2+ app, configure tooling, and ensure clean builds.
- Responsibilities:
  - Initialize project (or update existing) with App Router and strict TS.
  - Configure Tailwind v4, ESLint, Prettier, Jest, Playwright.
  - Add base layout, metadata, theme toggle, sitemap/robots routes.
- Validation checks:
  - `npm run lint` passes; `npm run build` succeeds; `npm run test` green.
- Commands:
  - `npx create-next-app@latest` (if bootstrapping)
  - `npm run dev`
  - `npm run lint`
  - `npm run build`
- Output & hand-off:
  - Working shell with layout, navigation, global styles, and CI config.


## 🎨 DesignAgent
- Objective: Apply modern UI/UX with Tailwind, set tokens, spacing/typography scale, and dark/light themes.
- Responsibilities:
  - Design system primitives (colors, spacing, radii, shadows, typography).
  - Compose responsive sections; add Motion interactions respecting reduced motion.
  - Create iconography strategy (React icons/local SVG), replace icon fonts.
- Validation checks:
  - WCAG 2.2 AA color contrast; keyboard focus logic; reduced-motion.
  - Visual consistency across pages and breakpoints.
- Commands:
  - `npm run dev`
  - `npm run test:e2e` (for a11y flows with Playwright)
- Output & hand-off:
  - Reusable components with storybook-like examples (optional), docs in `components/README.md` (optional).


## 🧩 TemplateAgent
- Objective: Build reusable content components and blog pipeline.
- Responsibilities:
  - MDX + Contentlayer (or plain MDX) configuration; type-safe post model.
  - Blog list, tag pages, and post layout; MDX shortcodes (Callout, Figure, Code, Steps).
  - Image optimization and path migration from legacy `/assets` to `public/`.
- Validation checks:
  - Content generated at build; pages render with no runtime errors; images optimized.
- Commands:
  - `npm run dev`
  - `npm run build`
- Output & hand-off:
  - `content/` with migrated posts; `lib/contentlayer.ts`; page templates in `app/blog/`.


## 🧪 QAAgent
- Objective: Validate quality gates: lint, tests, accessibility, performance, links.
- Responsibilities:
  - Run Playwright E2E for nav, blog read, contact form.
  - Run Pa11y CI and Lighthouse CI; check broken links.
  - Record baseline metrics and open issues for regressions.
- Validation checks:
  - All budgets in PRD met; no level A/AA blocking a11y issues.
- Commands:
  - `npm run lint`
  - `npm run test`
  - `npm run test:e2e`
  - `npm run validate` (aggregated validation)
- Output & hand-off:
  - CI artifacts (reports) and issue list; go/no-go signal.


## 🚀 ReleaseAgent
- Objective: Configure CI/CD and ship to Vercel (primary) or Cloudflare Pages.
- Responsibilities:
  - Configure GitHub Actions; preview deployments.
  - Environment setup for analytics/email; domain mappings.
- Validation checks:
  - Production build succeeds; routes (sitemap/robots/manifest) available; monitoring enabled.
- Commands:
  - `npm run build`
  - `npm run start` (preview)
- Output & hand-off:
  - Live deployment URL, DNS notes, and rollback instructions.


## 🔁 Orchestrator (meta-role)
- Objective: Coordinate all agents end-to-end until PRD acceptance is met.
- Responsibilities: Sequence tasks, resolve blockers, re-run validation, and maintain status board.
- Commands:
  - `npm run dev`
  - `npm run validate`
  - `npm run build`
- Output & hand-off:
  - Final status report, links to CI runs, and changelog.
