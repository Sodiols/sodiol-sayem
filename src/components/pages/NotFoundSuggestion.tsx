"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { projects } from "@/data/projects";

const places = [
  ...projects.map(project => ({ href: `/work/${project.slug}`, label: `the ${project.name} case study`,
    keys: [project.slug.replace(/-/g, ""), project.name.toLowerCase().replace(/\s+/g, "")] })),
  { href: "/faq", label: "the FAQ", keys: ["faq", "questions"] },
  { href: "/privacy-policy", label: "the privacy policy", keys: ["privacy", "privacypolicy", "cookies"] },
  { href: "/#about", label: "About me", keys: ["about"] },
  { href: "/#contact", label: "the contact form", keys: ["contact", "hire"] },
  { href: "/#work", label: "Selected work", keys: ["work", "projects", "portfolio"] },
];

function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = above;
    }
  }
  return row[b.length];
}

// The real page a mistyped address most likely meant; the last part of the path counts first.
export function closestPlace(pathname: string) {
  const words = pathname.toLowerCase().split("/").map(word => word.replace(/[^a-z0-9]/g, "")).filter(word => word.length >= 3).reverse();
  for (const word of words) {
    let best: typeof places[number] | undefined, score = Infinity;
    for (const place of places) for (const key of place.keys) {
      const gap = word.includes(key) || key.includes(word) ? 0 : distance(word, key);
      if (gap < score && gap <= Math.max(1, Math.floor(key.length / 3))) { best = place; score = gap; }
    }
    if (best) return best;
  }
}

export function NotFoundSuggestion({ className }: { className?: string }) {
  const place = closestPlace(usePathname());
  if (!place) return null;
  return <p className={className}>Were you looking for <Link href={place.href}>{place.label}</Link>?</p>;
}
