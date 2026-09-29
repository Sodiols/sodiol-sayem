"use client";

import { LazyMotion, domAnimation, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import type { CSSProperties, FocusEvent, PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ViewCursorProps = {
  label: string;
  className?: string;
  style?: CSSProperties;
  /** The real link or button, sized to fill the area. */
  children: ReactNode;
};

const spring = { stiffness: 380, damping: 34, mass: 0.5 };

/**
 * Decorative VIEW circle that trails the mouse inside one project visual.
 * Position lives in motion values, so pointer movement never re-renders.
 * Visibility is plain CSS: hover for mouse, focus-visible for keyboard.
 */
export function ViewCursor({ label, className, style, children }: ViewCursorProps) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, spring);
  const smoothY = useSpring(y, spring);

  function moveTo(left: number, top: number, jump: boolean) {
    x.set(left);
    y.set(top);
    if (jump) {
      smoothX.jump(left);
      smoothY.jump(top);
    }
  }

  function follow(event: PointerEvent<HTMLDivElement>, jump = false) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    moveTo(event.clientX - bounds.left, event.clientY - bounds.top, jump || !!reduceMotion);
  }

  function centre(event: FocusEvent<HTMLDivElement>) {
    const { width, height } = event.currentTarget.getBoundingClientRect();
    moveTo(width / 2, height / 2, true);
  }

  return (
    <div
      className={cn("group/cursor relative", className)}
      style={style}
      onPointerEnter={(event) => follow(event, true)}
      onPointerMove={follow}
      onFocus={centre}
    >
      {children}
      <LazyMotion features={domAnimation} strict>
        <m.span
          aria-hidden
          style={{ x: smoothX, y: smoothY }}
          className="pointer-events-none absolute top-0 left-0 z-20 hidden pointer-fine:block"
        >
          <span className="label flex size-[4.5rem] -translate-x-1/2 -translate-y-1/2 scale-50 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-[0_2px_12px_rgba(17,17,17,0.08)] transition-[opacity,scale] duration-300 ease-out-soft group-hover/cursor:scale-100 group-hover/cursor:opacity-100 group-has-[:focus-visible]/cursor:scale-100 group-has-[:focus-visible]/cursor:opacity-100">
            {label}
          </span>
        </m.span>
      </LazyMotion>
    </div>
  );
}
