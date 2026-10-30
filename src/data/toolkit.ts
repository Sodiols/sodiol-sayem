export type Tool = {
  id: string;
  name: string;
  icon?: string;
  mark?: readonly string[];
};

export const toolkit: readonly Tool[] = [
  { id: "javascript", name: "JavaScript", icon: "javascript" },
  { id: "typescript", name: "TypeScript", icon: "typescript" },
  { id: "html", name: "HTML", icon: "html5" },
  { id: "react", name: "React", icon: "react" },
  { id: "nextjs", name: "Next.js", icon: "nextdotjs" },
  { id: "css", name: "CSS", icon: "css" },
  { id: "tailwind", name: "Tailwind CSS", icon: "tailwindcss" },
  { id: "vite", name: "Vite", icon: "vite" },
  { id: "python", name: "Python", icon: "python" },
  { id: "nodejs", name: "Node.js", icon: "nodedotjs" },
  { id: "rest", name: "REST APIs", mark: ["REST", "APIs"] },
  { id: "supabase", name: "Supabase", icon: "supabase" },
  { id: "firebase", name: "Firebase", icon: "firebase" },
  { id: "postgresql", name: "PostgreSQL", icon: "postgresql" },
  { id: "github", name: "GitHub", icon: "github" },
  { id: "git", name: "Git", icon: "git" },
  { id: "vscode", name: "VS Code", icon: "vscode" },
  { id: "vercel", name: "Vercel", icon: "vercel" },
  { id: "analytics", name: "Google Analytics", icon: "googleanalytics" },
  { id: "claude", name: "Claude Code", icon: "claude" },
  { id: "codex", name: "OpenAI Codex", mark: ["OpenAI", "Codex"] },
  { id: "ai-studio", name: "Google AI Studio", mark: ["Google", "AI Studio"] },
  { id: "cursor", name: "Cursor", icon: "cursor" },
  { id: "antigravity", name: "Google Antigravity", mark: ["Google", "Antigravity"] },
  { id: "search-console", name: "Google Search Console", icon: "googlesearchconsole" },
];

export const toolkitGroups = [
  { name: "Interfaces", description: "The core stack behind my web application interfaces.", tools: ["typescript", "javascript", "react", "nextjs", "tailwind", "html", "css"] },
  { name: "Application & data", description: "Authentication, APIs, persistent data and real-time updates.", tools: ["nodejs", "rest", "supabase", "postgresql"] },
  { name: "Development & delivery", description: "Version control, development and deployment.", tools: ["git", "github", "vscode", "vercel"] },
] as const;

export const additionalToolIds = ["python", "vite", "firebase", "analytics", "search-console", "claude", "codex", "ai-studio", "cursor", "antigravity"] as const;
