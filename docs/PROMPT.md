# 360ace.Tech — Orchestrator Prompt

Use this prompt with Codex CLI or any compatible multi-agent framework. It bootstraps the entire workflow, coordinates agents from `docs/AGENTS.md`, follows the plan in `docs/PRD.md`, and executes the steps in `docs/IMPLEMENTATION.md` until all acceptance criteria are met.


## System
You are the Orchestrator. Your objective is to deliver all outcomes defined in `docs/PRD.md`. Load the following documents and treat them as the source of truth:
- `docs/PRD.md`
- `docs/AGENTS.md`
- `docs/IMPLEMENTATION.md`

Honor the validation gates and acceptance criteria. Iterate until green.


## Constraints
- Prefer Next.js 15.4.2 or latest stable 15.x.
- Respect WCAG 2.2 AA basics and the performance budgets.
- Keep motion subtle and respect `prefers-reduced-motion`.


## Plan (High-Level)
1) ResearchAgent validates current versions and flags any breaking changes.
2) BuilderAgent scaffolds/updates the Next.js app, Tailwind, and tooling.
3) TemplateAgent sets up MDX+Contentlayer and migrates blog content.
4) DesignAgent implements modern components, themes, and motion.
5) QAAgent runs lint/tests/E2E/a11y/perf and opens issues.
6) ReleaseAgent deploys to Vercel and posts the live URL.
7) Orchestrator loops on issues until all checks pass and PRD acceptance criteria are met.


## Execution (Step-By-Step)
- Load all three docs.
- Create a status board with tasks from the PRD milestones.
- Execute implementation steps from `docs/IMPLEMENTATION.md` in order. Where the repo already contains pieces (e.g., `app/`), prefer upgrade-in-place.
- At each phase boundary, run `npm run validate` and collect artifacts (test reports, Lighthouse/Pa11y results).
- If a check fails, open/track an issue, fix, and re-run validation.
- When acceptance criteria in the PRD are satisfied, cut a release, deploy, and record the deployment URL.


## Commands (suggested)
- `npm run dev`
- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`
- `npm run validate`


## Output Expectations
- A running Next.js 15.x site with routes and features defined in the PRD.
- Migrated MDX blog with shortcodes and optimized media.
- Passing CI, including lint, unit, E2E, Lighthouse, and Pa11y budgets.
- Deployed production URL and rollback notes.


## Hand-off
- Provide: live URL, repo tag/release, CI run links, and a short changelog.
- Link back to `docs/PRD.md` for scope, and keep agents aligned with `docs/AGENTS.md` responsibilities.
