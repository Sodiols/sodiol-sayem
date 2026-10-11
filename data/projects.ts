export type ProjectKind = "commerce" | "app" | "desktop";

export type Project = {
  slug: "husnalogy" | "prichat" | "tara" | "minute-tracker";
  name: string;
  /** Uppercase display name used in big headings. */
  title: string;
  type: string;
  kind: ProjectKind;
  url: string | null;
  /** Optional caveat shown next to the project link. */
  linkNote?: string;
  format: string;
  short: string;
  description: string;
  scope: string;
  detail: string;
  overview: string;
  focus: string[];
  role: string;
  status: string;
  /** Colors used for the project's social sharing image. */
  og: { background: string; foreground: string };
};

export const projects: Project[] = [
  {
    slug: "husnalogy",
    name: "Husnalogy",
    title: "HUSNALOGY",
    type: "E-commerce / Personalisation",
    kind: "commerce",
    url: "https://husnalogy.com/",
    format: "WEB EXPERIENCE",
    short: "Online store for personalised wedding invitations, stationery and gifts.",
    description:
      "A commerce experience focused on personalised invitations, stationery and gifts.",
    scope: "E-commerce website",
    detail: "Personalised invitations, stationery and gifts, sold online.",
    overview:
      "Husnalogy is a place to explore personalised wedding invitations, stationery and thoughtful gifts. The project centers on turning detailed, personal product choices into a clear, approachable shopping experience.",
    focus: ["Product discovery", "Customisation journeys", "Clear shopping experience"],
    role: "Creative web development",
    status: "PROJECT WEBSITE",
    og: { background: "#efe5d4", foreground: "#29251e" },
  },
  {
    slug: "prichat",
    name: "PriChat",
    title: "PRICHAT",
    type: "Messaging / Web app",
    kind: "app",
    url: "https://prichat-ebf.vercel.app/",
    linkNote: "Deployment was unavailable when last checked.",
    format: "WEB APPLICATION",
    short: "A messaging web app with a simple chat interface.",
    description:
      "PriChat is a messaging web app with a simple, easy-to-use chat interface.",
    scope: "Messaging web app",
    detail: "A messaging web app.",
    overview:
      "PriChat explores a focused messaging experience: conversations, interface clarity, and the small interaction details that make a chat application easier to use.",
    focus: ["Messaging interface", "Interaction design", "Web app experience"],
    role: "Web development",
    status: "PROJECT WEBSITE",
    og: { background: "#cebef6", foreground: "#2f2157" },
  },
  {
    slug: "tara",
    name: "TARA",
    title: "TARA",
    type: "Fashion / E-commerce",
    kind: "commerce",
    url: "https://tarabd.co/",
    format: "COMMERCE WEBSITE",
    short: "Online store for a women’s fashion brand from Sylhet.",
    description:
      "An online fashion store for women in Bangladesh, bringing everyday clothing and accessories into a polished, straightforward shopping experience.",
    scope: "Fashion commerce website",
    detail: "An online store for women’s fashion in Bangladesh.",
    overview:
      "TARA is a fashion brand based in Sylhet, Bangladesh. Its digital storefront brings together women’s clothing and accessories with a focus on browsing, product presentation, and a clear path to purchase.",
    focus: ["Fashion product display", "Category navigation", "Shopping journey"],
    role: "Creative web development",
    status: "PROJECT WEBSITE",
    og: { background: "#733345", foreground: "#fff6ee" },
  },
  {
    slug: "minute-tracker",
    name: "Minute Tracker",
    title: "MINUTE TRACKER",
    type: "Productivity / Desktop app",
    kind: "desktop",
    url: null,
    format: "DESKTOP SOFTWARE",
    short: "A desktop app for tracking where your time goes.",
    description:
      "A desktop productivity app for tracking the time spent on everyday work.",
    scope: "Desktop time tracking app",
    detail: "A desktop app for tracking time.",
    overview:
      "Minute Tracker is a desktop productivity project centered on tracking time. The interface prioritises legibility and an everyday workflow where the important information stays easy to find.",
    focus: ["Time tracking", "Desktop interaction", "Readable information"],
    role: "Desktop app development",
    status: "DESKTOP PROJECT",
    og: { background: "#b9c8fc", foreground: "#142252" },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}

export const projectFilters: { category: "all" | ProjectKind; label: string }[] = [
  { category: "all", label: "ALL" },
  { category: "commerce", label: "COMMERCE" },
  { category: "app", label: "WEB APPS" },
  { category: "desktop", label: "DESKTOP" },
];
