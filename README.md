# 360ace.Tech — Platform Engineering & Cloud Solutions

[![CI - Build & Test](https://github.com/360ace-Tech/360ace-Tech/actions/workflows/ci.yml/badge.svg)](https://github.com/360ace-Tech/360ace-Tech/actions/workflows/ci.yml)

A modern, high-performance marketing website for 360ace.Tech, showcasing platform engineering, DevOps, and cloud transformation services. Built with Next.js 15 and designed for exceptional user experience and performance.

## About 360ace.Tech

360ace.Tech delivers expert consulting in:
- **Platform Engineering**: Cloud-native architectures, Kubernetes, containerization
- **DevOps & SRE**: CI/CD pipelines, infrastructure as code, site reliability
- **Cloud Transformation**: Multi-cloud strategies, migrations, cost optimization
- **AI/ML Enablement**: Data platforms, MLOps, AI infrastructure

## Features

- 🎨 **Immersive Design**: Modern UI with smooth animations and 3D elements
- 🌓 **Dark Mode**: Full theme support with system preference detection
- 📱 **Responsive**: Mobile-first design with custom breakpoints
- ⚡ **Performance**: Edge runtime, SSG, and optimized assets
- 📝 **Content Management**: MDX-powered blog with syntax highlighting
- 🔍 **SEO Optimized**: Meta tags, sitemap, and semantic HTML
- ♿ **Accessible**: WCAG compliant with keyboard navigation
- 📧 **Contact Forms**: Integrated with SendGrid and reCAPTCHA
- 🎯 **Analytics Ready**: Google Analytics integration

## Tech Stack

### Core Framework
- **Next.js 15.5.4** with App Router
- **React 18** with Server Components
- **TypeScript** for type safety
- **Edge Runtime** for optimal performance

### Styling & UI
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component primitives
- **Framer Motion** for animations
- **React Three Fiber** for 3D graphics
- **Custom fonts**: Priestacy, Inter

### Content & Data
- **Contentlayer2** for type-safe content
- **MDX** for rich blog posts
- **rehype-pretty-code** for syntax highlighting
- **reading-time** for article estimates

### Development Tools
- **ESLint** for code quality
- **Prettier** for code formatting
- **GitHub Actions** for CI/CD

## Getting Started

### Prerequisites
- Node.js 18.18 or higher (< 25)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/360ace-Tech/360ace-Tech.git
cd 360ace-Tech

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the site.

## Available Scripts

- `npm run dev` — Start local development server
- `npm run build` — Create production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint checks
- `npm run typecheck` — Run TypeScript validation
- `npm run format` — Format code with Prettier

## Project Structure

```
360ace-Tech/
├── app/                    # Next.js App Router pages
│   ├── (core)/            # Core pages with layout
│   ├── api/               # API routes
│   └── downloads/         # Download endpoints
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── navigation/       # Header and footer
│   ├── sections/         # Page sections
│   ├── ui/               # UI primitives
│   └── variants/         # Design variants
├── content/              # MDX content
│   └── blog/            # Blog posts
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Global styles
```

## Content Management

### Blog Posts

Blog posts are written in Markdown/MDX and stored in `content/blog/`. Each post includes frontmatter:

```markdown
---
title: Your Post Title
date: 2024-01-01
author: Your Name
tags: [tag1, tag2]
categories: [category]
summary: Brief description
image:
  path: /blogs/img/image.png
  alt: Image description
---

Your content here...
```

Contentlayer2 automatically generates TypeScript types for all content.

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration:

### Workflow Triggers
- **Pull Requests**: All branches
- **Push Events**: `dev`, `staging`, `feature/**`, `fix/**`

### CI Checks
1. **Lint**: ESLint validation
2. **Type Check**: TypeScript compilation
3. **Build**: Full production build
4. **Contentlayer**: Content generation

All checks must pass before merging to `main`.

## Deployment

The site is optimized for edge deployment platforms:
- **Cloudflare Pages** (recommended)
- **Vercel**
- **Netlify**

All API routes use Edge Runtime for compatibility.

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# Site configuration
NEXT_PUBLIC_SITE_URL=https://360ace.tech

# Email (SendGrid)
SENDGRID_API_KEY=your_key
CONTACT_TO_EMAIL=hello@example.com
CONTACT_FROM_EMAIL=no-reply@example.com

# reCAPTCHA v2
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET=your_secret

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_ga_id
```

## Customization

### Theme Colors
Edit `app/globals.css` to customize colors:
```css
:root {
  --primary: ...;
  --secondary: ...;
}
```

### Breakpoints
Custom breakpoints in `tailwind.config.ts`:
- `nav`: 982px (navigation toggle)
- Standard: sm, md, lg, xl, 2xl

### Content
Update site content in `lib/site-content.ts`

## Performance Optimizations

- Static Site Generation (SSG) for blog posts
- Edge Runtime for API routes
- Image optimization with Next.js Image
- Font optimization with next/font
- Contentlayer caching
- Lazy loading for heavy components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

All rights reserved © 2024 360ace.Tech

## Support

For issues or questions:
- GitHub Issues: [github.com/360ace-Tech/360ace-Tech/issues](https://github.com/360ace-Tech/360ace-Tech/issues)
- Website: [360ace.tech](https://360ace.tech)

---

Built with ❤️ by the 360ace.Tech team
