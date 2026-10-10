function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  // Vercel exposes the production hostname (no protocol) at build and runtime.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const site = {
  name: "Sodiol",
  url: resolveSiteUrl(),
  locale: "en_US",
  jobTitle: "Creative Developer",
  location: "Sylhet, Bangladesh",
  themeColor: "#f4f2e9",
  description:
    "Sodiol is a creative developer from Sylhet, Bangladesh, building distinctive websites, web apps and digital experiences with React, Next.js and more.",
  tech: [
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "jQuery",
    "Bootstrap",
    "Supabase",
    "Firebase",
  ],
} as const;

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${site.url}/`).toString();
}

export const navItems = [
  { href: "/work/", label: "Work", n: "01" },
  { href: "/about/", label: "About", n: "02" },
  { href: "/contact/", label: "Contact", n: "03" },
] as const;
