import type { Metadata } from "next";
import { absoluteUrl, site } from "@/lib/site";
import type { Project } from "@/data/projects";
import { ogSize, shareImagePath, shareImages, type ShareImageId } from "@/lib/share-images";

type PageSeo = {
  title: string;
  description: string;
  /** Route path with trailing slash, e.g. "/about/". */
  path: string;
  /** Key in shareImages, rendered at /og/<image>.png. */
  image: ShareImageId;
  type?: "website" | "article" | "profile";
};

/** Per-page metadata: canonical URL plus Open Graph and Twitter cards with the page's own share image. */
export function pageMetadata({ title, description, path, image, type = "website" }: PageSeo): Metadata {
  const shareImage = {
    url: shareImagePath(image),
    width: ogSize.width,
    height: ogSize.height,
    alt: shareImages[image].alt,
    type: "image/png",
  };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title,
      description,
      siteName: site.name,
      locale: site.locale,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}

const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;

export function personSchema() {
  return {
    "@type": "Person",
    "@id": personId,
    name: site.name,
    url: absoluteUrl("/"),
    jobTitle: site.jobTitle,
    homeLocation: { "@type": "Place", name: site.location },
    knowsAbout: [...site.tech],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: site.name,
    url: absoluteUrl("/"),
    description: site.description,
    inLanguage: "en",
    author: { "@id": personId },
  };
}

export function webPageSchema({
  type = "WebPage",
  name,
  description,
  path,
  image,
}: {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  name: string;
  description: string;
  path: string;
  image: ShareImageId;
}) {
  return {
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    isPartOf: { "@id": websiteId },
    about: { "@id": personId },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(shareImagePath(image)),
      width: ogSize.width,
      height: ogSize.height,
    },
    inLanguage: "en",
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function projectSchema(project: Project) {
  const path = `/projects/${project.slug}/`;
  return {
    "@type": "CreativeWork",
    "@id": `${absoluteUrl(path)}#work`,
    name: project.name,
    headline: project.detail,
    description: project.description,
    url: absoluteUrl(path),
    image: absoluteUrl(shareImagePath(project.slug)),
    genre: project.scope,
    creator: { "@id": personId },
    ...(project.url ? { sameAs: project.url } : {}),
  };
}
