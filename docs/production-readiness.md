# Production readiness

## Implementation

The existing intro, project carousel, inline case studies, homepage About,
toolboard and fullscreen navigation remain in place. New UI uses the existing
Cormorant Garamond / General Sans fonts and monochrome palette. Taste settings:
design variance 5, motion intensity 3, visual density 3. Editorial page headings
have one short masked reveal; reduced motion disables it. FAQ uses native
keyboard-accessible disclosures. No runtime packages were added.

Routes: `/`, `/faq`, `/privacy-policy`, `/thank-you`, native `not-found.tsx`,
`/robots.txt` and `/sitemap.xml`. `/about` remains a permanent redirect to
`/#about`; case studies remain inline. The thank-you route and 404 are noindex.
A direct confirmation-page visit uses neutral copy instead of claiming a message
was sent. The normal success flow uses a five-minute timestamp-only session marker;
it is a UI affordance, not proof of identity or an authorization mechanism.

`src/lib/site-config.ts` owns the configured canonical origin and route registry.
`src/lib/metadata.ts` produces unique titles/descriptions, canonical, Open Graph
and Twitter metadata. The sitemap includes only indexable registry entries and
omits invented modification dates. Homepage JSON-LD describes the visible Person
and WebSite, using configured social URLs. No FAQ-rich-result promise is made.
Existing project alt descriptions match the supplied composite screenshots;
decorative technology icons use empty alt inside named controls.

Four static 1200×630 PNG sharing images and branded icons use existing local fonts.
`scripts/generate-social-assets.mjs` regenerates them with Playwright. These files
are static assets, not an image-generation dependency or per-request renderer.

## Required deployment configuration

Set these in the hosting project's **production** environment and rebuild:

- `NEXT_PUBLIC_SITE_URL`: `https://sodiol-sayem.vercel.app` (verified configured
  origin). A missing or invalid production origin fails the build instead of
  silently generating localhost canonicals. Change this single value when the
  actual canonical domain changes.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: owner supplied `G-Q7605FDWJZ`.
- `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`: the existing form's public key; confirm its
  recipient and verification status in Web3Forms.
  Local `.env.local` is ignored and is not included in Git. `.env.example` has
  intentionally empty values; it is not a deployable credential configuration.

The GA4 ID is configured locally. An absent/invalid ID disables the tag without
breaking the website. Public `NEXT_PUBLIC_*` values are embedded at build time.

## Analytics and consent

`Analytics`, `CookieConsent`, `CookieSettingsButton`, `consent.ts` and `analytics.ts`
implement Basic Consent Mode v2. No Google script is mounted before explicit
acceptance. Necessary functionality remains available after rejection. Optional
analytics is unchecked in preferences, with accept/reject given equal treatment.
A versioned boolean choice and date persist for up to 180 days; storage failure
falls back to an in-memory choice. Native dialog preferences support Escape,
focus restoration, background inertness and scroll lock. Footer settings remain
available across routes. Rejection in another tab updates the active tab.

Only analytics storage can be granted. Ad storage, ad user data and ad
personalization stay denied; Google signals/personalization are disabled in tag
configuration. Withdrawal sets Google's disable flag immediately, updates consent,
stops the site's events and attempts to delete accessible `_ga` cookies. It cannot
erase already collected provider data.

Route pageviews are manual and deduplicated; automatic config pageviews are off.
The site's events are `project_view`, `live_site_click`, `case_study_open`,
`contact_form_success` and `contact_cta_click`. Project parameters come from an
allowlist. Query strings, fragments, referrers and form values are excluded from
the site's payloads. No pre-consent actions are replayed after acceptance.

**GA4 dashboard:** In Admin → Data streams → this Web stream → Enhanced
measurement, disable automatic page/history measurement and other automatic
interaction collection (or turn Enhanced measurement off). This integration owns
pageviews and meaningful events; leaving automatic history measurement on can
duplicate events. Review property retention, Google signals, ads links, data
sharing and regional settings. Then verify consent with Tag Assistant and check
the actual property in DebugView/Realtime. A fetched tag or HTTP collect response
alone does not prove that the correct account displays the events.

## Web3Forms and hCaptcha

The contact component retains its length checks, duplicate guard, 20-second
timeout, abort-on-unmount, rate-limit handling and value preservation. Only HTTP
success **and** JSON `success === true` creates the receipt, fires a consent-gated
success event and uses client navigation to `/thank-you`. Failures stay on the form.
No form content appears in analytics, browser logs, URLs or session markers.

`Captcha.tsx` lazy-loads the official hCaptcha SDK when the form is used. It uses
Web3Forms' documented free-plan sitekey, explicit rendering, a compact dark widget,
expiry/error callbacks, retry and token reset after each request. Its space is
reserved to avoid a late widget layout shift. No paid CAPTCHA or invented key is
used. A hidden honeypot remains supplemental. Client checks can be bypassed;
server enforcement is essential.

**Web3Forms dashboard:** open the form associated with the existing key. In its
spam protection / Block Spam settings, select and enable **hCaptcha**, then save.
The provider must require and verify the submitted `h-captcha-response`; widget
visibility alone does not prove that this setting is active. Verify the recipient
email and key status, submit from the deployed domain, and confirm inbox delivery
(including spam). Test missing/expired tokens are rejected by the provider.
Domain restrictions are a **Pro** feature: none were purchased or silently enabled.
If already subscribed, review the allowlist after testing and add only intended
hostnames; this can intentionally prevent localhost submissions.

## HTTPS and headers

On 30 October 2026, a certificate-validating request to the configured HTTPS origin
returned 200, and HTTP returned 308 to HTTPS. The deployment identifies Vercel and
already sends HSTS with subdomains/preload. That existing hosting policy was not
changed; no DNS, nameservers, certificates or hosting settings were edited.

`next.config.ts` adds CSP, frame protection, nosniff, strict-origin referrer policy
and a restricted Permissions Policy, and removes the powered-by header. Production
CSP omits `unsafe-eval`; development permits it for Next's debugging tooling.
Script/frame/connect allowlists cover the official Google tag, Analytics,
Web3Forms and hCaptcha. All third-party integration URLs use HTTPS.

**CSP tradeoff:** static Next.js bootstrap scripts and current inline animation
styles require `unsafe-inline` in this allowlist policy. It is not a strict
nonce/hash-based XSS defence. Per-request nonces would require dynamic rendering;
that architecture change was avoided to preserve prerendering and performance.
No sensitive content or user HTML is rendered. Deploy and check these new headers
on actual public routes and third-party challenges; local headers do not establish
that the latest build is live. Vercel manages TLS/redirects for this deployment.

## Privacy owner review

The visible policy identifies the person, form fields/purpose, providers, consent
storage, timestamp-only confirmation state, optional analytics, hosting and privacy
request channels. It makes no invented company, address, retention guarantee,
legal basis or compliance certification claim. A fixed inquiry-email retention
schedule has not been established. The owner must confirm retention, provider
settings/terms, request handling and applicable requirements with legal review
before treating the policy as definitive. Deployment does not itself establish
legal compliance.

## Repeatable checks

Run `npm run lint`, `npm run typecheck`, `npm run build`, and `npm audit --omit=dev`.
Start the built app on port 3203, then run `scripts/verify-production.mjs` in an
environment with Playwright installed and its browsers available. Optionally set
`PLAYWRIGHT_MODULE_PATH` to an existing Playwright package directory and
`TEST_BASE_URL` to the production-build listener. No QA package is required at
runtime. Reports/screenshots are written to ignored `.reference/production/`.

The suite inspects HTTP status, metadata, sitemap, robots, preview PNG dimensions,
security headers, consent rejection/acceptance/withdrawal, SPA pageview commands,
form validation, failure preservation, duplicate protection, success navigation,
direct thank-you visits, native disclosures, responsive overflow and dialogs.
Deterministic third-party response stubs in tests do **not** establish live CAPTCHA,
email delivery or GA4 account receipt. Human hCaptcha completion, recipient-inbox
confirmation, Tag Assistant/GA4 property checks and physical-device testing remain
separate launch gates.

## Recorded live integration checks

The final local production build loaded exactly one official Google tag after
opt-in. A real `page_view` request for `G-Q7605FDWJZ` reached Google's `/g/collect`
and received HTTP 204. No Google requests occurred before acceptance; no new
collection responses appeared after withdrawal in this check. This proves
browser-to-endpoint transport, not account-level Realtime/DebugView attribution.
A request aborted during browser teardown is not counted as confirmed delivery.

Without analytics consent, focusing the contact form loaded the real hCaptcha
SDK and its iframe/assets successfully over HTTPS (HTTP 200, no browser errors).
No CAPTCHA resources were requested before form interaction in that check. A
human challenge was not completed, and provider enforcement/inbox delivery are
not verified by successful widget loading.

The production browser suite passed in Chromium at 320/390/768/1440px and in
Firefox/WebKit at 390px. Lint, standalone TypeScript, optimized build and the
production dependency audit passed (zero reported production vulnerabilities).
Lighthouse mobile scores were: homepage performance 60, FAQ 78, privacy 79;
all three scored 100 for accessibility, best practices and SEO. These are local
lab measurements, not field Core Web Vitals or a claim that performance work is
finished. The existing cinematic intro is preserved.

The final contact refinement removes the section-number tag, retains the native
project-type select with progressive customizable-picker styling where supported,
and places Send message beside verification on desktop, right-aligned below it on
narrow screens. No custom dropdown state or additional library is required.

Sources: [Google Basic Consent Mode](https://developers.google.com/tag-platform/security/guides/consent),
[manual pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views),
[Web3Forms hCaptcha setup](https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha),
[domain restriction plan requirement](https://docs.web3forms.com/getting-started/pro-features/restrict-to-domain).
