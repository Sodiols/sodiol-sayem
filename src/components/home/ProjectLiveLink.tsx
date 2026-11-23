"use client";
import { trackEvent } from "@/lib/analytics";
export function ProjectLiveLink({ href, slug, name, className }: { href: string; slug: string; name: string; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("live_site_click", slug)}>Visit {name} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>;
}
