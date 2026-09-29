"use client";

import { LazyMotion, MotionConfig, domAnimation, useScroll, useTransform, type MotionStyle } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Two quiet pieces of the Selected Work section: the drafting geometry beside the heading and the
// scroll cue under the projects. Neither carries content that matters without motion.

/**
 * Thin circles and a line through a single point. It turns a few degrees and drifts a few pixels
 * as the section scrolls, through CSS variables that only apply with motion-safe.
 */
export function WorkGeometry({ className, children }: { className?: string; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const turn = useTransform(scrollYProgress, [0, 1], ["-6deg", "8deg"]);
  const shift = useTransform(scrollYProgress, [0, 1], ["14px", "-14px"]);
  const style = { "--turn": turn, "--shift": shift } as MotionStyle;

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div ref={ref} style={style} className={cn("pointer-events-none", className)}>
        <svg
          viewBox="0 0 560 300"
          aria-hidden
          className="absolute inset-0 size-full overflow-visible text-line motion-safe:translate-y-(--shift)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <g className="origin-[300px_150px] motion-safe:rotate-(--turn)">
            <circle cx="210" cy="-40" r="250" />
            <path d="M150 225 600 0" />
            <path d="M300 104v-14M300 196v14M254 150h-14M346 150h14" />
          </g>
          <circle cx="300" cy="150" r="34" />
          <circle cx="300" cy="150" r="96" strokeDasharray="1 5" />
          <circle cx="300" cy="150" r="3.5" fill="var(--color-ink)" stroke="none" />
        </svg>
        {children}
      </m.div>
    </LazyMotion>
  );
}

/** Dot, label and a circled arrow that bobs gently. Links to whatever follows the section. */
export function ScrollCue({ href }: { href: string }) {
  return (
    <a href={href} className="group flex items-center gap-4 md:gap-5" aria-label="Scroll to the next section">
      <span aria-hidden className="size-1.5 rounded-full bg-ink" />
      <span className="label tracking-[0.18em] text-muted transition-colors duration-200 group-hover:text-ink">
        Scroll to explore
      </span>
      <span
        aria-hidden
        className="grid size-12 place-items-center rounded-full border border-ink/20 transition-colors duration-200 group-hover:border-ink"
      >
        <LazyMotion features={domAnimation} strict>
          <MotionConfig reducedMotion="user">
            <m.span
              className="block"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.6 }}
            >
              ↓
            </m.span>
          </MotionConfig>
        </LazyMotion>
      </span>
    </a>
  );
}
