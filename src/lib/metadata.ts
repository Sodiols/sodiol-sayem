import type { Metadata } from "next";
import { pages, site, type PagePath } from "./site-config";

export function pageMetadata(path: PagePath): Metadata {
  const page = pages[path];
  const url = new URL(path, site.origin).href;
  const image = { url: new URL(`/images/og/${page.image}.png`, site.origin).href, width: 1200, height: 630, type: "image/png", alt: `${page.title} — Sodiol portfolio` };
  return {
    title: { absolute: page.title }, description: page.description,
    alternates: { canonical: url }, robots: { index: page.index, follow: true },
    openGraph: { title: page.title, description: page.description, url, type: "website", siteName: site.name, locale: site.locale, images: [image] },
    twitter: { card: "summary_large_image", title: page.title, description: page.description, images: [image.url] },
  };
}
