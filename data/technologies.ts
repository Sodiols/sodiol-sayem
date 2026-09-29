export type CapabilityId = "frontend" | "fullstack" | "webapp" | "ecommerce" | "api" | "performance";

export type Capability = {
  id: CapabilityId;
  title: string;
  detail: string;
};

export const capabilities: Capability[] = [
  {
    id: "frontend",
    title: "Frontend Development",
    detail: "Interfaces in React and Next.js with careful attention to type, layout and interaction.",
  },
  {
    id: "fullstack",
    title: "Full Stack Development",
    detail: "From database schema to the last pixel, owned as one piece of work.",
  },
  {
    id: "webapp",
    title: "Web Application Development",
    detail: "Authenticated products with real data, roles and states that hold up in daily use.",
  },
  {
    id: "ecommerce",
    title: "Ecommerce Development",
    detail: "Catalogues, carts, checkout and admin tooling built around how a store actually runs.",
  },
  {
    id: "api",
    title: "API & Backend Development",
    detail: "REST endpoints, Node.js services and Postgres data models with sensible boundaries.",
  },
  {
    id: "performance",
    title: "Performance & Architecture",
    detail: "Server-first rendering, lean bundles and structures that stay easy to change.",
  },
];

export const toolGroups = [
  { name: "Interface", tools: ["Next.js", "React", "TypeScript", "JavaScript", "Tailwind CSS"] },
  { name: "Backend", tools: ["Node.js", "REST APIs"] },
  { name: "Data", tools: ["Supabase", "PostgreSQL"] },
  { name: "Workflow & Deployment", tools: ["Git", "GitHub", "Vercel"] },
];

export const heroStack = ["Next.js", "TypeScript", "Node.js", "Supabase"];
