export type ProjectKind = "commerce" | "app" | "desktop";

export type Project = {
  slug: "husnalogy" | "prichat" | "tara" | "minute-tracker";
  name: string;
  /** Uppercase display name used in big headings. */
  title: string;
  type: string;
  kind: ProjectKind;
  number: string;
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
    number: "01",
    url: "https://husnalogy.com/",
    format: "WEB EXPERIENCE",
    short: "A more personal way to shop for life’s important moments.",
    description:
      "A commerce experience focused on personalised invitations, stationery and gifts. Built around the idea that meaningful moments deserve thoughtful digital experiences.",
    scope: "E-commerce website",
    detail: "Commerce meets personalisation.",
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
    number: "02",
    url: "https://prichat-ebf.vercel.app/",
    linkNote: "Deployment was unavailable when last checked.",
    format: "WEB APPLICATION",
    short: "A chat project built around conversation.",
    description:
      "PriChat is a messaging web app project exploring the interfaces and interactions that make digital conversation feel direct and intuitive.",
    scope: "Messaging web app",
    detail: "Conversation, stripped to its essentials.",
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
    number: "03",
    url: "https://tarabd.co/",
    format: "COMMERCE WEBSITE",
    short: "A contemporary fashion storefront with a clear point of view.",
    description:
      "An online fashion store for women in Bangladesh, bringing everyday clothing and accessories into a polished, straightforward shopping experience.",
    scope: "Fashion commerce website",
    detail: "A storefront with its own rhythm.",
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
    number: "04",
    url: null,
    format: "DESKTOP SOFTWARE",
    short: "A focused desktop tool for making time visible.",
    description:
      "A desktop productivity app project for tracking time and giving everyday work a clearer sense of pace and progress.",
    scope: "Desktop time tracking app",
    detail: "Small minutes. Bigger picture.",
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
