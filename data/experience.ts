// Only confirmed history belongs here. Add roles as { period, title, place, summary, projects }.

export type ExperienceEntry = {
  period: string;
  title: string;
  place: string;
  summary: string;
  projects?: string[];
};

export const experience: ExperienceEntry[] = [
  {
    period: "2026 — Present",
    title: "Independent Developer",
    place: "Bangladesh",
    summary:
      "Building ecommerce platforms, business websites and web applications for clients, from data model and backend through to the interface.",
    projects: ["husnalogy", "tara", "meka", "prichat"],
  },
];
