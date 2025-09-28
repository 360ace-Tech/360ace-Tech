# 360ace.Tech — Next.js Site (V2‑only)

This site runs on Next.js 15.5.4 with Tailwind, shadcn/ui, Contentlayer, and an immersive but performant V2 design. Variant exploration (V1/V3) has been archived under `archive/` and routes are now simplified to a single experience.

## Getting Started

```bash
npm install
npm run dev
```

Visit:
- `/` — the primary V2 experience
- `/blog` and `/blog/[slug]` — Markdown/MDX insights via Contentlayer2

## Tech Stack Highlights

- **Next.js 15.5.4 (App Router)** with React Server Components and Route Handlers.
- **Tailwind CSS + shadcn/ui primitives** for rapid UI development and theming.
- **Framer Motion** micro-interactions with reduced-motion awareness.
- **React Three Fiber** hero scene with dynamic import and graceful fallbacks.
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

## Templates

- `components/layout/site-shell.tsx` — shared page chrome (header/footer). Wrap pages with `<SiteShell>…</SiteShell>`.
- `components/templates/not-found.tsx` — reusable 404 template. The app route `app/not-found.tsx` uses it.
  - Props: `title?`, `message?`, `primaryCta?`, `secondaryCta?`.
  - Example:
    
    ```tsx
    import { NotFoundTemplate } from '@/components/templates/not-found';

    export default function NotFound() {
      return <NotFoundTemplate title="Missing" message="We couldn't find that." />;
    }
    ```

### Using templates across pages
- Wrap any new page in `SiteShell` for consistent nav/footer.
- Compose sections from `components/sections/*`.
- For hero, use `components/variants/v2/hero.tsx` which encapsulates the 3D scene and gradient background.

### Section aliases and legacy anchors
- Direct section routes exist and will scroll to the respective section on home:
  - `/services` → `/#services`
  - `/process` → `/#process`
  - `/insights` → `/#insights`
  - `/contact` → `/#contact`
- Legacy variant paths are permanently redirected:
  - `/v1/*`, `/v2/*`, `/v3/*` → `/*`
  - Most browsers preserve `#fragment` across redirects, but the aliases above provide robust fallbacks if needed.

## Responsive Nav
- Custom breakpoint `nav` at `982px` determines when the desktop menu appears.
- Classes `nav:flex` and `nav:hidden` control visibility in `components/navigation/site-header.tsx`.
- If you change breakpoints in `tailwind.config.ts`, restart the dev server to apply them.

## Archive

- All earlier prototype work (V1 and V3) and their theme tokens live under `archive/` for reference. These files are excluded from TypeScript builds.
