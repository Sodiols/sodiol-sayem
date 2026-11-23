"use client";

import { useEffect, useState } from "react";
import styles from "./ProjectShowcase.module.css";

// The case study's contents, kept beside the reading and marking the part being read.
export function CaseContents({ items }: { items: readonly (readonly [id: string, label: string])[] }) {
  const [active, setActive] = useState(items[0][0]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.querySelector("h2")!.id);
    }, { rootMargin: "-35% 0px -60% 0px" });
    items.forEach(([id]) => { const section = document.getElementById(id)?.closest("section"); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, [items]);
  return <nav className={styles.caseContents} aria-label="Case study sections">
    <ul>{items.map(([id, label]) => <li key={id}>
      <a href={`#${id}`} aria-current={active === id ? "location" : undefined}>{label}</a>
    </li>)}</ul>
  </nav>;
}
