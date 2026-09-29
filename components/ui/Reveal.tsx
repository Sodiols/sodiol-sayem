"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { duration, ease } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance travelled upward, in px. */
  y?: number;
};

/** Fades content up once as it enters the viewport. */
export function Reveal({ children, className, delay = 0, y = 16 }: RevealProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <m.div
          data-reveal
          className={className}
          initial={{ opacity: 0, y }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: duration.content + 0.1, ease, delay }}
        >
          {children}
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}
