// Owner-supplied social destinations. Set an unavailable profile to null.
export const socialProfiles = {
  facebook: { label: "Facebook", url: "https://www.facebook.com/sodiol.sayem"},
  instagram: { label: "Instagram", url: "https://instagram.com/ignawwte" },
  github: { label: "GitHub", url: "https://github.com/Sodiols" },
  linkedin: { label: "LinkedIn", url: "https://www.linkedin.com/in/sodiol-sayem-64184b27b/"},
} satisfies Record<string, { label: string; url: string | null }>;

export const navigationLinks = [
  { label: "Works", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Toolkit", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
] as const;
