import type { Metadata } from "next";
import { site } from "@/data/site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  /** Defaults to the shared app/opengraph-image. */
  image?: string;
};

// Page-level openGraph replaces the root one entirely, so the image is set explicitly.
export function pageMetadata({ title, description, path, image = "/opengraph-image" }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: `${title} — ${site.name}`,
      description,
      url: path,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.name}`,
      description,
      images: [image],
    },
  };
}
