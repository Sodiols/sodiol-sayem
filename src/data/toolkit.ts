export type Tool = {
  id: string;
  name: string;
  label: string;
  icon?: string;
  mark?: readonly string[];
  x: number; y: number; w: number; h: number; angle: number;
  mobile: { span: 2 | 3; size: number; offset: number };
};

// Positions are art-directed on a 1200 × 640 canvas, never randomized.
// Array order also defines the deliberately staggered compact arrangement.
export const toolkit: readonly Tool[] = [
  { id: "javascript", name: "JavaScript", label: "JavaScript", icon: "javascript", x: 80, y: 145, w: 80, h: 80, angle: -7, mobile: { span: 2, size: 76, offset: 18 } },
  { id: "typescript", name: "TypeScript", label: "TypeScript", icon: "typescript", x: 235, y: 90, w: 110, h: 110, angle: 5, mobile: { span: 2, size: 98, offset: 0 } },
  { id: "html", name: "HTML", label: "HTML", icon: "html5", x: 85, y: 520, w: 72, h: 72, angle: -5, mobile: { span: 2, size: 76, offset: 29 } },
  { id: "react", name: "React", label: "React", icon: "react", x: 395, y: 180, w: 124, h: 124, angle: -4, mobile: { span: 3, size: 116, offset: 0 } },
  { id: "nextjs", name: "Next.js", label: "Next.js", icon: "nextdotjs", x: 235, y: 280, w: 118, h: 118, angle: -5, mobile: { span: 3, size: 108, offset: 24 } },
  { id: "css", name: "CSS", label: "CSS", icon: "css", x: 210, y: 495, w: 72, h: 72, angle: 7, mobile: { span: 2, size: 76, offset: 0 } },
  { id: "tailwind", name: "Tailwind CSS", label: "Tailwind CSS", icon: "tailwindcss", x: 80, y: 350, w: 84, h: 84, angle: 6, mobile: { span: 2, size: 86, offset: 26 } },
  { id: "vite", name: "Vite", label: "Vite", icon: "vite", x: 395, y: 370, w: 82, h: 82, angle: 7, mobile: { span: 2, size: 80, offset: 5 } },
  { id: "python", name: "Python", label: "Python", icon: "python", x: 380, y: 520, w: 82, h: 82, angle: -6, mobile: { span: 2, size: 84, offset: 22 } },
  { id: "nodejs", name: "Node.js", label: "Node.js", icon: "nodedotjs", x: 555, y: 95, w: 112, h: 112, angle: -4, mobile: { span: 2, size: 108, offset: 0 } },
  { id: "rest", name: "REST APIs", label: "REST APIs", mark: ["REST", "APIs"], x: 705, y: 75, w: 118, h: 76, angle: 4, mobile: { span: 2, size: 102, offset: 23 } },
  { id: "supabase", name: "Supabase", label: "Supabase", icon: "supabase", x: 555, y: 285, w: 96, h: 96, angle: 4, mobile: { span: 3, size: 98, offset: 0 } },
  { id: "firebase", name: "Firebase", label: "Firebase", icon: "firebase", x: 695, y: 200, w: 84, h: 84, angle: -7, mobile: { span: 3, size: 82, offset: 24 } },
  { id: "postgresql", name: "PostgreSQL", label: "PostgreSQL", icon: "postgresql", x: 695, y: 390, w: 90, h: 90, angle: -4, mobile: { span: 2, size: 86, offset: 22 } },
  { id: "github", name: "GitHub", label: "GitHub", icon: "github", x: 895, y: 95, w: 112, h: 112, angle: 6, mobile: { span: 2, size: 104, offset: 0 } },
  { id: "git", name: "Git", label: "Git", icon: "git", x: 1040, y: 185, w: 80, h: 80, angle: -6, mobile: { span: 2, size: 78, offset: 26 } },
  { id: "vscode", name: "VS Code", label: "VS Code", icon: "vscode", x: 1045, y: 395, w: 90, h: 90, angle: 4, mobile: { span: 2, size: 94, offset: 0 } },
  { id: "vercel", name: "Vercel", label: "Vercel", icon: "vercel", x: 1140, y: 290, w: 80, h: 80, angle: 6, mobile: { span: 2, size: 80, offset: 22 } },
  { id: "analytics", name: "Google Analytics", label: "Analytics", icon: "googleanalytics", x: 1150, y: 490, w: 76, h: 76, angle: 5, mobile: { span: 2, size: 78, offset: 8 } },
  { id: "claude", name: "Claude Code", label: "Claude Code", icon: "claude", x: 555, y: 470, w: 96, h: 96, angle: -6, mobile: { span: 3, size: 94, offset: 18 } },
  { id: "codex", name: "OpenAI Codex", label: "OpenAI Codex", mark: ["OpenAI", "Codex"], x: 705, y: 550, w: 126, h: 80, angle: 3, mobile: { span: 3, size: 142, offset: 0 } },
  { id: "ai-studio", name: "Google AI Studio", label: "Google AI Studio", mark: ["Google", "AI Studio"], x: 850, y: 335, w: 132, h: 84, angle: -5, mobile: { span: 3, size: 138, offset: 0 } },
  { id: "cursor", name: "Cursor", label: "Cursor", icon: "cursor", x: 890, y: 505, w: 84, h: 84, angle: 6, mobile: { span: 3, size: 88, offset: 22 } },
  { id: "antigravity", name: "Google Antigravity", label: "Google Antigravity", mark: ["Google", "Antigravity"], x: 1020, y: 565, w: 142, h: 80, angle: -4, mobile: { span: 3, size: 148, offset: 14 } },
  { id: "search-console", name: "Google Search Console", label: "Search Console", icon: "googlesearchconsole", x: 1140, y: 75, w: 82, h: 82, angle: -3, mobile: { span: 3, size: 88, offset: 0 } },
];
