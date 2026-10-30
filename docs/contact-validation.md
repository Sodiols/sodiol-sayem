# Homepage contact validation

## Design review

Applied the local Taste and Web Design Guidelines skills. Design variance 5:
an asymmetric editorial split within the existing typography system. Motion 3:
finite masked heading entry, short field stagger and focus underline; no loops.
Visual density 3: generous whitespace, four native controls and no form card.
The user-provided copy, palette and established fonts take priority over defaults.

Reviewed screenshots at 1903, 1440, 768, 390 and 320 CSS pixels. Desktop retains
the split composition; mobile uses a single column with 16px input text. No new
dependencies, photography, font files, backend routes or continuous animations.

## Local checks

- ESLint, TypeScript and optimized Next.js build passed.
- Chromium, Firefox and WebKit at 1440, 390 and 320px: required/email validation,
  first-error focus, API error responses, malformed responses, strict success,
  retained values on failure, success reset and duplicate-request protection passed.
- Production browser: menu Contact destination, normal-motion entrance, network
  failure, timeout, honeypot, input preservation, Google verification metadata and
  legacy About redirect passed without runtime errors.
- Existing compact About layout/anchors passed across all three browser engines
  at desktop/mobile sizes, including reduced motion and a no-JavaScript redirect.
- Reduced-motion form controls remain usable. Footer occurs once and uses the
  configured social profiles. No submitted values are logged by application code.

Fault/success UI cases used intercepted responses; those checks do not prove
email delivery. Separate real browser submissions were attempted in Chromium
and Edge. Both failed before an API response, with the Edge request reporting
`net::ERR_FAILED`; the UI preserved values and showed failure. A narrowly scoped
connected-mailbox search found no matching test message. Provider acceptance and
recipient delivery remain unverified. Retry on the deployed domain and confirm
the message in the mailbox associated with the configured Web3Forms key.

Production Lighthouse mobile run: accessibility 100, best practices 100, SEO 100,
performance 52. Performance includes the existing cinematic intro and full homepage;
this is not evidence of a lightweight-site performance target being met. Existing
toolkit wordmark accessible-name warnings and main-thread/LCP findings remain
outside this contact implementation. Physical-device testing remains open.

Search Console meta is present exactly once locally. Hosted verification requires
deployment and confirmation in Google Search Console; ownership is not claimed.
