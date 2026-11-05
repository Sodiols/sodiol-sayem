const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
if (!configuredUrl && process.env.NODE_ENV === "production") {
  throw new Error("Set NEXT_PUBLIC_SITE_URL to the canonical HTTPS production origin before building.");
}
const origin = new URL(configuredUrl || "http://localhost:3200");
if (origin.username || origin.password || origin.search || origin.hash || origin.pathname !== "/" ||
    (process.env.NODE_ENV === "production" && origin.protocol !== "https:")) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be a plain HTTPS origin without a path or credentials.");
}
export const site = {
  origin: origin.origin,
  name: "Sodiol Sayem",
  title: "Sodiol Sayem | Full-Stack Developer",
  description: "Full-stack developer in Sylhet, Bangladesh. Senior Developer at Meka Agency. Explore my work in e-commerce, real-time applications and complete web platforms.",
  locale: "en_US",
} as const;

// The same registry drives metadata, sitemap and analytics' safe route names.
export const pages = {
  "/": { title: site.title, description: site.description, image: "home", index: true },
  "/faq": { title: "Frequently Asked Questions | Sodiol Sayem", description: "Answers to common questions about working with Sodiol Sayem, website development, collaborations, and project inquiries.", image: "faq", index: true },
  "/privacy-policy": { title: "Privacy Policy | Sodiol Sayem", description: "Learn how Sodiol Sayem’s portfolio website handles contact form information, analytics, cookies, and privacy preferences.", image: "privacy", index: true },
  "/thank-you": { title: "Message Received | Sodiol Sayem", description: "Thank you for contacting Sodiol Sayem. Your message has been submitted successfully.", image: "thank-you", index: false },
} as const;
export type PagePath = keyof typeof pages;
