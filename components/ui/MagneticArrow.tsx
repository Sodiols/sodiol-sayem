"use client";

import Link from "next/link";
import { LazyMotion, domAnimation, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import type { PointerEvent } from "react";
import { pointerSpring } from "@/lib/motion";

const PULL = 10;

/**
 * Circular arrow link. The circle leans a few pixels toward a mouse pointer, while the link's own
 * box (the clickable area) never moves. Touch and reduced motion get a still circle.
 */
export function MagneticArrow({ href, label }: { href: string; label: string }) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, pointerSpring);
  const springY = useSpring(y, pointerSpring);

  function pull(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse" || reduceMotion) return;
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - left) / width - 0.5) * 2 * PULL);
    y.set(((event.clientY - top) / height - 0.5) * 2 * PULL);
  }

  function release() {
    x.set(0);
    y.set(0);
  }

  return (
    <Link
      href={href}
      aria-label={label}
      onPointerMove={pull}
      onPointerLeave={release}
      className="group flex size-32 shrink-0 items-center justify-center md:size-40"
    >
      <LazyMotion features={domAnimation} strict>
        <m.span
          style={{ x: springX, y: springY }}
          className="flex size-24 items-center justify-center rounded-full bg-ink text-3xl text-paper transition-colors duration-200 group-hover:bg-[#2a2a28] md:size-32 md:text-4xl"
        >
          <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </m.span>
      </LazyMotion>
    </Link>
  );
}
