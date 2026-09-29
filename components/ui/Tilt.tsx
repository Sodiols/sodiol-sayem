"use client";

import { LazyMotion, domAnimation, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { pointerSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees at the element's edges. */
  max?: number;
};

/**
 * Restrained pointer tilt for mouse users. The perspective lives on the outer element and the
 * rotation on the inner one, so it never fights the reveal, parallax or image scale transforms
 * applied by other wrappers. Touch and reduced motion get a flat, still element.
 */
export function Tilt({ children, className, max = 2.5 }: TiltProps) {
  const reduceMotion = useReducedMotion();
  const bounds = useRef<DOMRect | null>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, pointerSpring);
  const springY = useSpring(rotateY, pointerSpring);

  function track(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || reduceMotion) return;
    bounds.current ??= event.currentTarget.getBoundingClientRect();
    const { left, top, width, height } = bounds.current;
    rotateY.set(((event.clientX - left) / width - 0.5) * 2 * max);
    rotateX.set(-((event.clientY - top) / height - 0.5) * 2 * max);
  }

  function release() {
    bounds.current = null;
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div
      className={cn("[perspective:1600px]", className)}
      onPointerEnter={() => (bounds.current = null)}
      onPointerMove={track}
      onPointerLeave={release}
    >
      <LazyMotion features={domAnimation} strict>
        <m.div style={{ rotateX: springX, rotateY: springY }} className="[transform-style:preserve-3d]">
          {children}
        </m.div>
      </LazyMotion>
    </div>
  );
}
