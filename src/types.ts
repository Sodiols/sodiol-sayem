export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  imageUrl: string;
  demoUrl: string;
  githubUrl: string;
  featured: boolean;
  detail: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Tools';
  level: number; // 0 to 100
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string[];
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  budget: string;
  createdAt: string;
  status: 'new' | 'read' | 'archived';
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  github: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  resumeUrl: string;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  stats: {
    completedProjects: number;
    happyClients: number;
    yearsExperience: number;
  };
}
