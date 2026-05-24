# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server (Turbopack, default in Next.js 16)
npm run build    # Production build (Turbopack)
npm run start    # Start production server
npm run lint     # Run ESLint (uses eslint CLI, not next lint)
```

No test suite is configured.

## Environment Variables

Copy `.env.example` to `.env.local` before running locally:

```
DIRECTUS_URL=        # Directus API base URL (e.g. https://api.vansao.com)
DIRECTUS_TOKEN=      # Directus static access token
NEXT_PUBLIC_SITE_URL= # Public frontend URL for canonical URLs/sitemap
RESEND_API_KEY=      # Resend SMTP key for contact form emails
CONTACT_EMAIL=       # Destination address for contact form submissions
```

## Architecture

This is a **Vietnamese-language marketing website** for Vạn Sao agency (web design, events, data migration), built with Next.js 16 App Router.

**Stack:** Next.js 16 · React 19.2 · JavaScript/JSX (no TypeScript) · Tailwind CSS v4 · shadcn/ui (radix-nova preset) · Docker standalone deployment

**Path alias:** `@/*` → `./src/*` (configured in `jsconfig.json`)

### Data layer

All content comes from a headless Directus backend via `src/lib/directus.js`, which wraps `fetch()` calls to the Directus REST API. Collections: `posts` (M2M with `categories` via junction `posts_categories`), `categories`, `services`. Featured images are stored as URL strings. Pages use `Promise.all` for parallel fetching. The contact form (`src/app/api/contact/route.js`) sends email via Nodemailer + Resend SMTP.

### Route structure

| Route | Description |
|-------|-------------|
| `/` | Homepage — static, ISR |
| `/blog` | Blog listing with category filtering |
| `/blog/[slug]` | Individual post, `generateMetadata` for per-post SEO |
| `/dich-vu/[slug]` | Service detail pages (dynamic slug from Directus) |
| `/gioi-thieu` | About page |
| `/lien-he` | Contact page with form |
| `/api/contact` | Route Handler: POST to send contact email |

SEO extras: `sitemap.js`, `robots.js`, `opengraph-image.jsx` (dynamic OG image generation).

### Component conventions

- **Server Components** (default): fetch data directly, export `generateMetadata`
- **Client Components** (`'use client'`): Header (mobile nav), ContactSection (form state), BlogClient (category filter)
- UI primitives live in `src/components/ui/` (shadcn/ui — do not hand-edit generated files)
- Page-level sections are in `src/components/` (Hero, Services, Blog, Contact, Footer, etc.)

## Next.js 16 Breaking Changes

Before writing code, read the relevant guide in `node_modules/next/dist/docs/`. Key changes from prior versions:

### Async Request APIs (breaking)
`params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` are **all async** — synchronous access was removed. Always `await` them:

```js
// page.js / layout.js / route.js
export default async function Page({ params }) {
  const { slug } = await params          // must await
  const search = await searchParams      // must await
}
```

### fetch() is NOT cached by default
`fetch` results are uncached unless you add the `use cache` directive or `next: { revalidate }`. Current code uses `next: { revalidate: 3600 }` on Directus fetches — that still works, but new code should prefer `'use cache'` + `cacheLife()`:

```js
import { cacheLife } from 'next/cache'

async function getPosts() {
  'use cache'
  cacheLife('hours')
  // ...
}
```

### Turbopack is the default bundler
`next dev` and `next build` both use Turbopack. The tilde (`~`) prefix in Sass imports is unsupported — use bare package names. Custom `webpack` config in `next.config.mjs` will break the build; use `turbopack` config instead.

### ESLint
Use `eslint` CLI directly (`npm run lint`), not `next lint`.

## About Me
- Name: Hải (Zenith)

## Communication
- Answer in Vietnamese
- Be short, direct, and to the point
- Do not explain unless I explicitly ask
- No extra suggestions, no off-topic
- No long explanations
- No guessing

## Coding Rules
- Do NOT write code immediately
- First, analyze and restate the requirement
- Ask questions until requirements are fully clear
- Only when I confirm, then write code
- Do not assume missing details
- Code comments in English

## Preferred Workflow
- Discuss logic step-by-step with me
- Finalize solution before coding
- If anything is unclear, ask questions instead of answering
