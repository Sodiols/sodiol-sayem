# Sodiol portfolio

Fresh Next.js App Router / React / TypeScript / Tailwind CSS portfolio.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3200. Production: `npm run build`, then `npm start`.
Checks: `npm run typecheck` and `npm run lint`.

## Intro integration

`src/components/IntroLoader.tsx` lives in the root layout so it mounts once per
document, rather than once per route. The homepage remains server rendered underneath.
The overlay and initial hidden-page CSS are included in the server HTML; there is no
post-mount flash. All moving parts share a document timeline epoch, with explicit
per-letter offsets and no frame-by-frame React updates.

The local Instrument Serif font is preloaded and explicitly awaited before the
timeline starts. A font failure falls back to Times New Roman after a bounded wait.
The font's OFL license is included in `public/fonts/`.

`data-intro` progresses from `pending` to `playing` to `complete`. Page entrance
elements use `data-reveal`; future homepage animation controllers can listen for
`sodiol:intro-complete`. Keep intro-independent scroll effects outside this component.
The hidden page is inert and scrolling is locked until the final curtain clears.
All animations, timers, and listeners are cleaned up on unmount. Reduced motion
uses a 180ms transition; without JavaScript, the portfolio is available immediately.

The destination homepage was created from scratch because the selected folder was
empty. It contains real project links carried over from the user's portfolio context.
Contact uses the homepage Web3Forms form; no public email address is invented.

## Project carousel and inline cases

The homepage opens into an artwork-first manual carousel in
`src/components/home/ProjectShowcase.tsx`. The supplied reference informs its
84/16 image and side-rail composition, vertical circular arrows, four-line
selector, and compact bottom strip. All artwork remains grayscale through CSS;
the original source files are unchanged. Descriptions, URLs, and disciplines are
centralized in the typed `src/data/projects.ts` data.

The former gallery ScrollTriggers, pinning, spacer distance, mobile scroll
observer, and scroll-driven 3D transforms have been removed. Normal document
scrolling continues into the existing sections. Arrow buttons, selector buttons,
focused Left/Right/Home/End keys, and horizontal touch swipes control projects.
There is no auto-advance timer. A reducer services rapid requests in order and
keeps the latest requested destination; native Web Animations reveal the next
image only after loading. The current artwork remains visible in the meantime.
Only current/incoming images mount. Next image optimization supplies responsive
sizes, with high fetch priority for the initial artwork and an original-file
fallback if optimization fails. No new packages.
Project artwork is statically imported from `public/projects/`. Replace those
files to update the gallery: Next generates content-hashed media URLs, bypassing
stale optimized copies even when the original filenames stay the same. Case
preview aspect ratios come from the imported image metadata automatically.
All four gallery previews use centered `object-fit: contain`, so newly supplied
project compositions stay fully visible instead of being enlarged and cropped.

Hover reveals a clipped bottom information panel with a serif title and two
staggered actions, coordinated with a 32% black scrim fading over the artwork.
The scrim fades out on mouse leave and sits beneath the usable information panel.
Focus reveals the same controls immediately; touch layouts
keep them visible. Read the case opens one inline `ProjectCaseStudy` beneath
the carousel. Its focused heading, restrained entry, shareable case hash,
original full artwork, documented scope, approach, implementation focus, and
outcome stay associated with the active project. Notes intentionally omit
unverified per-project technologies, backend features, and numerical results.
Back to work returns focus and scroll to the carousel. Works in the global menu
also resets to Husnalogy through the small `sodiol:work-start` event.
Case entry and return use matching element-scroll APIs, so a quick return
supersedes the pending case-entry scroll reliably in Firefox as well.

The carousel uses no GSAP plugin or ScrollTrigger. The menu continues using GSAP;
the compact About reveal uses native Web Animations. Reduced motion settles image changes immediately, and a
no-JavaScript project index preserves the four external destinations. The unused
General Sans 700 preload was removed; the existing fonts themselves are retained.
The gallery sits below the fixed navbar and uses 94svh rather than filling the
entire viewport. Arrow targets are 56px on desktop and 48px on mobile. The bottom
strip contains only the active project description, per the requested refinement.

## Navigation and About

`Navbar` and its native modal `NavigationOverlay` live in the root layout alongside
the intro, so internal Next.js navigation preserves their lifecycle. The panel rises
as a single surface; masked lines and social icons follow in a scoped GSAP timeline.
Escape, explicit Tab traversal, focus restoration, scroll preservation, reversible
opening/closing, and reduced motion are supported. Native modal inertness keeps the
carousel behind the menu. Colors were sampled from the supplied screenshot.
Cormorant Garamond 600 is the closest compared open-license font, not a confirmed
identification of the reference typeface. Its Latin WOFF2 and OFL are hosted locally.
Social destinations are owner-configured in `src/data/navigation.ts`. Brand paths
are from Font Awesome Free; attribution/license lives in `public/licenses/`.

The homepage contains one compact `AboutSection` between the project carousel
and toolkit. It preserves the original global two-column layout, Instrument Serif
headline, short paragraph and underlined Contact CTA. Its two masked headline
lines and small copy entry run once on viewport entry after the intro. Native
Web Animations and IntersectionObserver keep the effect scoped and lightweight;
reduced motion and disabled JavaScript leave the text immediately readable.

About in the menu points to `/#about`; the inline “Let’s talk” action points to
`#contact`. The old dedicated About page, styles, animation controller and
page-specific metadata were removed. `next.config.ts` permanently redirects
`/about` to `/#about` (HTTP 308), preserving existing external links. About remains
a homepage anchor and is not a separate sitemap entry. No replacement About route
is rendered.

## Home toolkit canvas

`Toolboard` sits once between the homepage About teaser and Contact. The compact
About section remains directly above it. Its 25 entries and deterministic desktop coordinates /
compact layout spans live in `src/data/toolkit.ts`. The canvas uses existing
Cormorant Garamond / General Sans with scoped monochrome tile styling.

Desktop movement uses a bounded CSS float that settles in less than five seconds,
then restrained pointer response. A single on-demand animation frame loop
interpolates nearby objects by at most 4px; no pointer updates enter React state.
Geometry is measured on entry/resize, not on each frame. Offscreen, hidden-tab,
reduced-motion, and coarse-pointer cases stop unnecessary motion. The label and
pause UI were removed per the requested refinement. Hover/focus pauses the
initial drift, and selecting a tile keeps its name visible. Keyboard uses native
button behavior. Touch layouts show labels and use a separate staggered layout.

The SVG assets total approximately 28 KB and load locally/lazily. Simple Icons and
Devicon sources/licenses are documented in `public/toolkit/SOURCES.md`; tool
identities without a verified symbol use text marks. No new dependencies.

## Contact and footer

The homepage `ContactSection` uses the existing Cormorant Garamond and General
Sans fonts, scoped monochrome styles, native controls, inline validation and a
single client-side POST to Web3Forms. Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in
the hosting environment before building. The existing `.env.local` is ignored
by Git. This key is a public form identifier; no forwarding API route is needed.

Only an HTTP-success response with `success: true` clears the form. Failed,
rate-limited, malformed, offline and timed-out requests preserve entered values.
Requests have a 20-second timeout, duplicate protection and unmount cancellation.
The form lazy-loads the official hCaptcha SDK on interaction and submits its token
with the request. Enable mandatory hCaptcha in the Web3Forms dashboard; the widget
alone does not establish server enforcement. A hidden honeypot is supplemental.
No paid CAPTCHA or domain-restriction feature is enabled. Strict API success now
uses client navigation to `/thank-you`; direct visits show neutral copy.

Contact is `/#contact`, also reached by the homepage About CTA. Footer links use
the same configured social profiles as navigation. The footer renders the current
year on the server. Reduced motion skips all contact entrance effects.

The Google Search Console verification token is configured through root metadata.
Deploy this build before completing verification in Search Console.

## SEO, privacy and production setup

See [production readiness](docs/production-readiness.md) for route metadata,
canonical-origin configuration, sitemap/robots, sharing assets, header policy,
Basic Consent Mode v2, GA4 setup, provider dashboard actions and verification limits.
The canonical URL, public form key and GA4 measurement ID must be present in the
hosting environment at build time. `.env.example` lists their names.

The footer links to `/faq`, `/privacy-policy`, Contact and persistent Cookie
settings. Analytics loads only after explicit opt-in; advertising permissions stay
denied. New pages reuse the site fonts and colors. No runtime dependencies were
added. QA and social-asset scripts use optional external Playwright; see the guide.

## Reference measurements

See `docs/intro-reference.md` for the source timing, movement interpretation, and
the limits of font matching from video alone.
