# Sodiol Sayem — Portfolio

Personal site built with Next.js (App Router), React, TypeScript, Tailwind CSS v4 and Motion.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build
```

## Where things live

| What | File |
| --- | --- |
| Name, email, GitHub, LinkedIn, résumé, site URL | `data/site.ts` |
| Projects, case study copy, architecture diagrams | `data/projects.ts` |
| Experience timeline | `data/experience.ts` |
| Lab entries (empty state until added) | `data/lab.ts` |
| About page copy and portrait | `data/about.ts` |
| Capabilities and tools | `data/technologies.ts` |
| Primary navigation | `data/navigation.ts` |
| Design tokens, grid and type utilities | `app/globals.css` |

Everything that lists projects (home, menu, archive, case studies, sitemap, experience) reads from `data/projects.ts`.

## Still to fill in

- **Portrait**: add an image and set `about.portrait` in `data/about.ts`. The typographic identity panel is shown until then.
- **PriChat screens**: only the sign in screen exists in `public/projects/prichat/`. Messaging, voice message and call screenshots would strengthen its case study; add them to its `gallery` and, if relevant, `caseStudy.visuals` in `data/projects.ts`.
- **TARA year**: not known, so it shows “—”. Add `year` in `data/projects.ts`.
- **Case study copy** was written from what is visible on the live sites. Technologies listed are only those confirmed from the production builds (Husnalogy and TARA: Next.js + Supabase; Meka: WordPress + Elementor). Review and extend.

## Content model notes

- `caseStudy.visuals` (optional) places gallery images beside the Challenge, Approach and Features sections of a case study. Portrait images in a gallery are shown beside Architecture & Implementation; the rest appear under “More screens”.
- `data/lab.ts` entries each name a working demo (`type`, `depth`, `messages`) from `components/lab/`. Only add entries whose demo actually works.
- Capabilities and their demos live in `data/technologies.ts` and `components/home/CapabilityDemos.tsx`; tools are grouped by `toolGroups`.

## Project images

```
public/projects/<slug>/
  hero.webp    1600×1000, case study hero and project listings
  menu.webp    ~1200×440, strip used in the fullscreen menu
  01.webp …    gallery images (any size; set width/height in data)
  mobile.webp  780×1688, portrait gallery image
```

## Environment variables

Copy `.env.example` to `.env.local`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap and Open Graph. Falls back to the Vercel production URL, then `localhost`. |
| `RESEND_API_KEY` | [Resend](https://resend.com) API key for the contact form. |
| `CONTACT_TO_EMAIL` | Inbox that receives contact messages. |
| `CONTACT_FROM_EMAIL` | Sender address on a domain verified in Resend. |

Without `RESEND_API_KEY` and `CONTACT_TO_EMAIL`, the form still validates input but tells the visitor that nothing was sent and shows the email address instead. It never reports a delivery that did not happen.

The contact endpoint (`app/api/contact/route.ts`) validates on the server, uses a honeypot field and a minimum fill time, and applies a per-instance rate limit (5 messages per IP per 10 minutes). For stronger protection on a busy site, back the rate limit with a shared store.
