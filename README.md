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
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | [Web3Forms](https://web3forms.com) access key used by the contact form. Web3Forms access keys are designed to be used in client side forms, so this is safe to expose to the browser. |

## Contact form

The form in `components/contact/ContactForm.tsx` submits directly from the browser to `https://api.web3forms.com/submit`. There is no Next.js route in between. Input is checked first with `validateContact()` from `lib/contact.ts`, and nothing is sent unless it passes. The success screen only appears after Web3Forms confirms delivery; on a failure, a rate limit (HTTP 429) or a network error the form keeps its contents and shows a message instead. Spam is filtered with the Web3Forms `botcheck` honeypot.

Without `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`, the form still validates input but tells the visitor that nothing was sent and shows the email address instead. It never reports a delivery that did not happen.

To set it up:

1. Create a Web3Forms account or form at [web3forms.com](https://web3forms.com) and verify the email address that should receive messages.
2. Generate the access key for that form.
3. Add it to `.env.local` as `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` and restart `npm run dev`.
4. Add the same variable in your hosting platform (for Vercel: Project Settings → Environment Variables).
5. Redeploy. `NEXT_PUBLIC_` variables are embedded in the browser bundle at build time, so a change only takes effect after a new build.

Replies go straight to the visitor: Web3Forms uses the submitted `email` field as the Reply-To address.
