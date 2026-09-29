"use client";

import { LazyMotion, domAnimation, useScroll, useTransform, type MotionStyle } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type ReactNode } from "react";

type DriftProps = {
  /** Pixels travelled across the element's pass through the viewport. Negative drifts down. */
  distance: number;
  className?: string;
  children: ReactNode;
};

/**
 * Subtle scroll parallax. The offset is exposed as a CSS variable and only
 * applied from the lg breakpoint, and only when motion is allowed.
 */
export function Drift({ distance, className, children }: DriftProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const offset = useTransform(scrollYProgress, [0, 1], [`${distance / 2}px`, `${-distance / 2}px`]);
  // Motion animates CSS variables, its style type just doesn't declare them.
  const style = { "--drift": offset } as MotionStyle;

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        ref={ref}
        style={style}
        className={`motion-safe:lg:translate-y-(--drift) ${className ?? ""}`}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
