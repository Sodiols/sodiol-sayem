import { PortfolioData } from '../types';

export const defaultPortfolio: PortfolioData = {
  name: "Sodiol Sayem",
  title: "Frontend Developer & Next.js UI Engineer",
  bio: "I build modern, responsive, and SEO optimized websites using Next.js, Tailwind CSS, Firebase, and clean frontend architecture. My work focuses on fast loading pages, smooth user experience, polished visual design, and reliable website performance across every device.",
  avatar: "/logo.png",
  email: "itssayem2023@gmail.com",
  github: "https://github.com/Sodiols",
  facebook: "https://www.facebook.com/sodiol.sayem",
  instagram: "https://www.instagram.com/ignawwte",
  resumeUrl: "#",
  stats: {
    completedProjects: 35,
    happyClients: 12,
    yearsExperience: 2.5
  },
  skills: [
    { id: "s1", name: "React / Next.js", category: "Frontend", level: 95 },
    { id: "s2", name: "TypeScript", category: "Frontend", level: 92 },
    { id: "s3", name: "Tailwind CSS", category: "Frontend", level: 98 },
    { id: "s4", name: "Framer Motion", category: "Frontend", level: 88 },
    { id: "s5", name: "Node.js / Express", category: "Backend", level: 90 },
    { id: "s6", name: "Firebase / Firestore", category: "Backend", level: 85 },
    { id: "s7", name: "RESTful APIs / GraphQL", category: "Backend", level: 88 },
    { id: "s8", name: "PostgreSQL / MongoDB", category: "Backend", level: 82 },
    { id: "s9", name: "Git & GitHub Actions", category: "Tools", level: 90 },
    { id: "s10", name: "Docker", category: "Tools", level: 75 },
    { id: "s11", name: "Figma (UI/UX Design)", category: "Tools", level: 85 },
    { id: "s12", name: "Vercel / AWS", category: "Tools", level: 80 }
  ],
  projects: [
    {
      id: "p1",
      title: "HUSNALOGY",
      description: "An incredibly fast and responsive modern e-commerce platform optimized for dynamic item display and seamless checkout experiences.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Express", "Stripe", "Supabase"],
      imageUrl: "/projects/husnalogy.png",
      demoUrl: "https://husnalogy25-6-26.vercel.app",
      githubUrl: "null",
      featured: true,
      detail: "This platform is built with a focus on core web vitals and ultra-fast paint times. It incorporates server-side generation strategies alongside lazy loaded client-side checkout interactions. It features optimized cart reconciliation algorithms, custom invoice layouts, and is fully responsive across tablet, mobile, and wide desktop frames."
    },
    {
      id: "p2",
      title: "prichat",
      description: "A private chat site for all, featuring real-time fast messaging pipelines, secure data handling, and light ambient designs.",
      tech: ["React", "Tailwind CSS", "Recharts", "Lucide Icons", "Express", "Firebase"],
      imageUrl: "/projects/prichat.png",
      demoUrl: "https://prichat-ebf5.vercel.app",
      githubUrl: "null",
      featured: true,
      detail: "prichat is a highly functional private chatting system. It includes secure socket-based message delivery, dynamic scroll pinning, and a beautifully response-optimized layout that makes real-time discussion completely frictionless across devices."
    },
    {
      id: "p3",
      title: "meka agency",
      description: "A highly visual, premium agency portfolio emphasizing smooth scroll physics, custom micro-interactions, and high-impact layouts.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Motion"],
      imageUrl: "/projects/meka.png",
      demoUrl: "https://meka.agency",
      githubUrl: "null",
      featured: true,
      detail: "Built to illustrate outstanding visual capability, this agency landing page features staggered entry lists, custom cursor elements, theme transitions, and full responsive compliance. Standard HTML is fully customized to allow lightweight SVG animations that elevate the brand positioning."
    }
  ],
  experiences: [
    {
      id: "e1",
      role: "Lead Full-Stack Developer",
      company: "Meka Agency",
      duration: "2026 - Present",
      description: [
        "Leading high-fidelity web development and custom full-stack solutions for premium client products.",
        "Optimized client loading speeds by 40% and improved server uptime by integrating scalable Express backend API patterns.",
        "Fostered professional teamwork and clean design practices utilizing React, TypeScript, and Tailwind CSS."
      ]
    },
    {
      id: "e2",
      role: "Full Stack Developer",
      company: "Meka Agency",
      duration: "2025 - 2026",
      description: [
        "Designed and shipped interactive web applications, utilizing secure custom APIs and cloud storage solutions.",
        "Created scalable databases and optimized backend query routes to handle live concurrent traffic seamlessly.",
        "Engineered smooth motion frames and responsive interfaces across all layouts."
      ]
    },
    {
      id: "e3",
      role: "Front End Developer",
      company: "Chic Invite",
      duration: "2024 - 2025",
      description: [
        "Collaborated with UI/UX designers to translate Figma design templates into clean, pixel-perfect modular components.",
        "Crafted engaging micro-animations and smooth scroll interactions using Tailwind Utility classes and Framer Motion.",
        "Maintained cross-device visual compatibility and rigorous search-engine optimization protocols."
      ]
    }
  ]
};
