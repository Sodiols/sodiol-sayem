"use client";

import { LazyMotion, domAnimation, useMotionValue, useSpring } from "motion/react";
import * as m from "motion/react-m";
import type { PointerEvent, ReactNode } from "react";

const spring = { stiffness: 320, damping: 30, mass: 0.6 };

/**
 * The project grid, plus a small "View Project" pill that trails a mouse pointer while it is over
 * a card. Position lives in motion values (no re-renders); visibility is CSS (:has a hovered card),
 * and the pill is purely decorative: pointer-events none, hidden for touch and reduced motion.
 */
export function WorkMosaic({ children }: { children: ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, spring);
  const smoothY = useSpring(y, spring);

  function follow(event: PointerEvent<HTMLDivElement>, jump = false) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - bounds.left);
    y.set(event.clientY - bounds.top);
    if (jump) {
      smoothX.jump(x.get());
      smoothY.jump(y.get());
    }
  }

  return (
    <div className="group/mosaic relative" onPointerEnter={(event) => follow(event, true)} onPointerMove={follow}>
      <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-[var(--gutter)] xl:grid-cols-[1.3fr_1.7fr_1fr] xl:grid-rows-[clamp(18rem,23vw,23rem)_clamp(14.5rem,18.5vw,17.5rem)]">
        {children}
      </ol>

      <LazyMotion features={domAnimation} strict>
        <m.span
          aria-hidden
          style={{ x: smoothX, y: smoothY }}
          className="pointer-events-none absolute top-0 left-0 z-20 hidden pointer-fine:block motion-reduce:!hidden"
        >
          <span className="flex -translate-x-[82%] -translate-y-[calc(100%+0.875rem)] scale-90 items-center gap-3 rounded-full bg-white px-4 py-2.5 text-[0.8125rem] font-medium whitespace-nowrap text-ink opacity-0 shadow-[0_8px_24px_-12px_rgba(17,17,17,0.35)] ring-1 ring-ink/5 transition-[opacity,scale] duration-200 ease-out-soft group-has-[[data-card]:hover]/mosaic:scale-100 group-has-[[data-card]:hover]/mosaic:opacity-100">
            View Project <span>→</span>
          </span>
        </m.span>
      </LazyMotion>
    </div>
  );
}
