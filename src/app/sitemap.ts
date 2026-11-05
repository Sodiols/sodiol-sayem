import type { MetadataRoute } from "next";
import { pages, site } from "@/lib/site-config";
import { projects } from "@/data/projects";
export default function sitemap(): MetadataRoute.Sitemap {
  return [...Object.entries(pages).filter(([, page]) => page.index).map(([path]) => ({ url: new URL(path, site.origin).href })),
    ...projects.map(project => ({ url: `${site.origin}/work/${project.slug}` }))];
}
