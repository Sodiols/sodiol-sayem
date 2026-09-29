// Personal details live here. Leave a value as null to hide it everywhere it is used.
export const site = {
  name: "Sodiol Sayem",
  firstName: "Sodiol",
  lastName: "Sayem",
  role: "Web Developer",
  longRole: "Full Stack Web Developer",
  description:
    "Sodiol Sayem is a full stack web developer in Bangladesh building web applications, commerce platforms and websites with Next.js, TypeScript and Supabase.",
  location: "Sylhet, Bangladesh",
  country: "Bangladesh",
  timeZone: "Asia/Dhaka",
  utcOffset: "GMT +6",
  email: "itssayem2023@gmail.com",
  github: "https://github.com/Sodiols",
  linkedin: "https://www.linkedin.com/in/sodiol-sayem-64184b27b/" as string | null,
  // Path of the CV in public/. Set to null to hide the download links.
  resume: "/Sodiol_Sayem_CV_Enhanced.pdf" as string | null,
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  ).replace(/\/$/, ""),
};

export type SocialLink = { label: string; href: string };

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: site.github },
  site.linkedin ? { label: "LinkedIn", href: site.linkedin } : null,
  { label: "Email", href: `mailto:${site.email}` },
].filter((link): link is SocialLink => link !== null);
