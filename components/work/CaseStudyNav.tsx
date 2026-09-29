"use client";

import { LazyMotion, domAnimation, useScroll } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Section = { id: string; label: string };

/**
 * Sticky section index for wide screens: highlights the section being read and shows reading
 * progress. Links are ordinary anchors, so it works without JavaScript too.
 */
export function CaseStudyNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Case study sections" className="sticky top-28">
      <p className="label text-muted">Contents</p>
      <div className="mt-5 flex gap-4">
        <LazyMotion features={domAnimation} strict>
          <span aria-hidden className="relative w-px shrink-0 bg-line">
            <m.span style={{ scaleY: scrollYProgress }} className="absolute inset-0 origin-top bg-ink" />
          </span>
        </LazyMotion>
        <ol className="flex flex-col gap-1">
          {sections.map((section, index) => {
            const current = section.id === active;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={current ? "location" : undefined}
                  className={cn(
                    "flex min-h-8 items-baseline gap-3 text-[0.875rem] transition-colors duration-200",
                    current ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  <span className="label">{String(index + 1).padStart(2, "0")}</span>
                  {section.label}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
