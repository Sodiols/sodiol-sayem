# Sodiol, Brutalist Developer Portfolio

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4. Every page is prerendered as static HTML.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run typecheck
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public origin, e.g. `https://your-domain.com` (no trailing slash). Used for canonical URLs, share image URLs, `sitemap.xml` and `robots.txt`. On Vercel it falls back to the production domain when unset. |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Access key from [web3forms.com](https://web3forms.com). Contact form messages are delivered to the email address tied to this key. The key ends up in the browser bundle, since Web3Forms submissions are sent from the browser. |

Restart `npm run dev` after changing env variables. After deploying, submit `https://your-domain.com/sitemap.xml` in Google Search Console.

## SEO

| What | Where |
| --- | --- |
| Per-page title, description, canonical, Open Graph and Twitter cards | `lib/seo.ts` (`pageMetadata`), used by every `page.tsx` |
| Social sharing image for every page (1200x630 PNG) | `app/og/[image]/route.tsx`, content in `lib/share-images.ts` |
| JSON-LD (WebSite, Person, WebPage, CreativeWork, BreadcrumbList, ItemList) | `lib/seo.ts` + `components/seo/json-ld.tsx` |
| `robots.txt` | `app/robots.ts` |
| `sitemap.xml` (includes image entries) | `app/sitemap.ts` |
| Favicon | `app/icon.svg` |

Share images are served at `/og/<page>.png` (for example `/og/tara.png`). The `.png` extension keeps them out of the trailing-slash redirect, so social crawlers get the image directly without a 308. URLs keep the original directory style (`/about/`, `/projects/tara/`) via `trailingSlash: true`.

## Typography

- **Archivo** (variable, black weight, width axis at 112): display headlines
- **Geist**: body text and buttons
- **Geist Mono**: labels, eyebrows and metadata

Fonts are self-hosted through `next/font`. The static `.woff` files in `assets/fonts/` are used only to render the share images (SIL Open Font License).

## Project structure

```
app/                        Routes (Next.js App Router)
  layout.tsx                Root layout: fonts, header, footer, default metadata
  page.tsx                  Home  /
  about/page.tsx            About  /about/
  work/page.tsx             Work  /work/
  contact/page.tsx          Contact  /contact/
  projects/[slug]/page.tsx  Case studies  /projects/<slug>/
  og/[image]/route.tsx      Share images  /og/<page>.png
  robots.ts, sitemap.ts     robots.txt and sitemap.xml
  not-found.tsx, icon.svg   404 page and favicon
  globals.css               Imports Tailwind and every file in styles/, in order
components/
  layout/                   Site header (mobile menu) and footer
  projects/                 Project card, project artwork, filterable work grid
  contact/                  Contact form (Web3Forms)
  ui/                       Reusable UI: brutal dropdown (accessible listbox)
  seo/                      JSON-LD script tag
data/
  projects.ts               Project content: edit this to add or change projects
lib/
  site.ts                   Site name, URL, nav items, tech list
  seo.ts                    Page metadata + structured data helpers
  share-images.ts           Text and colors for each share image
  og.tsx                    Share image renderer
styles/
  base.css                  Tokens (colors, fonts), reset, shared utilities
  typography.css            Type refinements, loaded last
  layout/                   header.css, footer.css
  components/               buttons, sections, project cards and art, contact form, select
  pages/                    home, about, work, case-study, contact
assets/fonts/               Fonts used only to render share images
public/                     Static files served as-is from /
```

Edit project content in `data/projects.ts`. Pages, the sitemap and share images update from it.

## Notes carried over from the static version

- **PriChat:** the deployment URL returned 404 when last checked; the case study says so.
- **Minute Tracker:** no public download link was supplied.
- **Contact form:** sends through Web3Forms (needs `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`). Without a key, the form shows a "not connected yet" message instead of pretending to send. A hidden honeypot field filters basic spam bots.
- Project visuals are abstract CSS illustrations, not screenshots of the live sites.

The original static HTML site is kept in `legacy-static-site/` for reference. It is not part of the build and can be deleted.
