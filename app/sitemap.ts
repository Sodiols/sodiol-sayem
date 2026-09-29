import type { MetadataRoute } from "next";
import { navigation } from "@/data/navigation";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", ...navigation.map((item) => item.href)];

  return [
    ...pages.map((path) => ({
      url: `${site.url}${path === "/" ? "" : path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...projects.map((project) => ({
      url: `${site.url}/work/${project.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
