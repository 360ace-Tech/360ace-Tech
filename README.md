# 360ace.Tech — Next.js Revamp

The legacy static site has been reimagined as a modern Next.js 15.5.4 application with three design variants, Contentlayer-powered publishing, and immersive yet accessible 3D experiences.

## Getting Started

```bash
npm install
npm run dev
```

Visit:
- `/` — renders the default variant (controlled by `SITE_VARIANT` env)
- `/v1`, `/v2`, `/v3` — explore each concept individually
- `/blog` and `/blog/[slug]` — Markdown/MDX insights rendered via Contentlayer2

Set the active concept for the root route:

```bash
SITE_VARIANT=v3 npm run dev
```

## Tech Stack Highlights

- **Next.js 15.5.4 (App Router)** with React Server Components and Route Handlers.
- **Tailwind CSS + shadcn/ui primitives** for rapid UI development and theming.
- **Framer Motion** micro-interactions with reduced-motion awareness.
- **React Three Fiber** hero scene (Variant B) with dynamic import and graceful fallbacks.
- **Contentlayer2 + MDX** for typed content sourced from `content/blog`.
- **Theme tokens** loaded per variant for quick experimentation across concepts.

## Scripts

- `npm run dev` — start local development.
- `npm run build` — production build (runs Contentlayer2 generation, type checking, and Next.js build).
- `npm run lint` — lint the project.
- `npm run typecheck` — TypeScript validation.
- `npm run format` — Prettier format.

## Troubleshooting

- If `npm run dev` or `npm run build` fails with `Cannot find package 'next-contentlayer2'`, ensure dependencies are installed by running `npm install`. The Contentlayer-powered build relies on this package to hydrate typed content modules before Next.js starts.

## Content Workflow

- Blog posts live in `content/blog`. Images are available under `public/blogs/img`.
- Contentlayer2 generates typed modules in `.contentlayer/` (ignored from git).
- Author new posts by adding Markdown/MDX files with frontmatter (`title`, `date`, `tags`, `summary`, etc.).

## Variants

Documentation for each prototype lives in `docs/variants/`. Capture Lighthouse, Axe, and FPS results as you iterate.
