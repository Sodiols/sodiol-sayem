import { site } from "@/data/site";

/**
 * Whether a site can be shown in an iframe on this portfolio, based on its
 * X-Frame-Options and CSP frame-ancestors headers. Checked on the server and
 * cached for a day; anything unclear counts as not embeddable.
 */
export async function canEmbed(url: string) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 86400 },
    });
    if (!response.ok) return false;

    // DENY and SAMEORIGIN both block a cross-origin parent.
    if (response.headers.get("x-frame-options")) return false;

    const ancestors = (response.headers.get("content-security-policy") ?? "")
      .split(";")
      .map((directive) => directive.trim().split(/\s+/))
      .find(([name]) => name === "frame-ancestors");
    if (!ancestors) return true;

    const sources = ancestors.slice(1);
    return sources.includes("*") || sources.some((source) => source.replace(/\/$/, "") === site.url);
  } catch {
    return false;
  }
}

/** canEmbed for each item with a url, keyed by slug. Cached with the underlying fetch. */
export async function embeddableBySlug(items: { slug: string; url?: string }[]) {
  const entries = await Promise.all(
    items.map(async (item) => [item.slug, item.url ? await canEmbed(item.url) : false] as const),
  );
  return Object.fromEntries(entries) as Record<string, boolean>;
}
