import type { MetadataRoute } from "next";
import { pages, site } from "@/lib/site-config";
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.entries(pages).filter(([, page]) => page.index).map(([path]) => ({ url: new URL(path, site.origin).href }));
}
