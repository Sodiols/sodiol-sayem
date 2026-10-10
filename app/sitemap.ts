import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { shareImagePath } from "@/lib/share-images";
import { absoluteUrl } from "@/lib/site";

const pages: { path: string; image: string; changeFrequency: "monthly" | "yearly"; priority: number }[] = [
  { path: "/", image: "home", changeFrequency: "monthly", priority: 1 },
  { path: "/work/", image: "work", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about/", image: "about", changeFrequency: "yearly", priority: 0.7 },
  { path: "/contact/", image: "contact", changeFrequency: "yearly", priority: 0.6 },
  ...projects.map((project) => ({
    path: `/projects/${project.slug}/`,
    image: project.slug,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.map(({ path, image, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
    images: [absoluteUrl(shareImagePath(image))],
  }));
}
