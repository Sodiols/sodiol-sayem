"use client";

import { useEffect, useRef, useState } from "react";

type WorkProgressProps = {
  items: { number: string; title: string }[];
};

/**
 * "02 / 04 — TARA": follows whichever project crosses the middle band of the viewport.
 * One IntersectionObserver, and state changes only when a different project takes over.
 */
export function WorkProgress({ items }: WorkProgressProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState(0);
  const total = String(items.length).padStart(2, "0");

  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.workItem));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    section.querySelectorAll("[data-work-item]").forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const current = items[active];

  return (
    <p ref={ref} className="label flex items-baseline gap-4 text-muted">
      <span className="tabular-nums">
        <span key={current.number} className="swap-in inline-block text-ink">
          {current.number}
        </span>{" "}
        / {total}
      </span>
      <span key={current.title} className="swap-in hidden truncate lg:inline">
        {current.title}
      </span>
    </p>
  );
}
