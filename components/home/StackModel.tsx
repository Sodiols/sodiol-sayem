"use client";

import { LazyMotion, domAnimation, useScroll, useTransform, type MotionStyle } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { stackLayers as layers } from "@/data/about";

// Three layers of a web product, drawn as thin panels. Scroll progress separates them in depth;
// without JavaScript or with reduced motion the finished, separated arrangement is shown.

function InterfacePanel() {
  return (
    <div className="flex h-full flex-col gap-[6%] p-[7%]">
      <div className="flex items-center justify-between">
        <span className="h-[0.35rem] w-[22%] rounded-full bg-ink" />
        <span className="flex gap-[0.4rem]">
          <span className="h-[0.3rem] w-6 rounded-full bg-ink/25" />
          <span className="h-[0.3rem] w-6 rounded-full bg-ink/25" />
          <span className="h-[0.3rem] w-6 rounded-full bg-ink/25" />
        </span>
      </div>
      <div className="grid flex-1 grid-cols-[1.3fr_1fr] gap-[6%]">
        <div className="flex flex-col justify-center gap-[0.55rem]">
          <span className="h-[0.7rem] w-[90%] rounded-full bg-ink" />
          <span className="h-[0.7rem] w-[65%] rounded-full bg-ink" />
          <span className="mt-1 h-[0.3rem] w-[80%] rounded-full bg-ink/25" />
          <span className="h-[0.3rem] w-[70%] rounded-full bg-ink/25" />
          <span className="mt-2 h-[1.1rem] w-[42%] rounded-[2px] bg-ink" />
        </div>
        <div className="rounded-[2px] bg-well" />
      </div>
    </div>
  );
}

function ApplicationPanel() {
  const routes = ["/", "/work", "/api"];
  return (
    <div className="flex h-full items-center justify-around p-[7%]">
      {routes.map((route) => (
        <span key={route} className="flex flex-col items-center gap-2">
          <span className="flex size-10 items-center justify-center rounded-full border border-ink/50 font-mono text-[0.625rem]">
            {route}
          </span>
          <span className="h-6 w-px bg-ink/30" />
        </span>
      ))}
    </div>
  );
}

function DataPanel() {
  return (
    <div className="flex h-full flex-col justify-center gap-[0.45rem] p-[8%]">
      {[0, 1, 2, 3].map((row) => (
        <span key={row} className="grid grid-cols-[1fr_2fr_1fr] gap-2">
          <span className={row === 0 ? "h-[0.3rem] rounded-full bg-ink/70" : "h-[0.3rem] rounded-full bg-ink/25"} />
          <span className={row === 0 ? "h-[0.3rem] rounded-full bg-ink/70" : "h-[0.3rem] rounded-full bg-ink/25"} />
          <span className={row === 0 ? "h-[0.3rem] rounded-full bg-ink/70" : "h-[0.3rem] rounded-full bg-ink/25"} />
        </span>
      ))}
    </div>
  );
}

const panels = [InterfacePanel, ApplicationPanel, DataPanel];

export function StackModel() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const spread = useTransform(scrollYProgress, [0, 1], [0.15, 1]);
  // Motion animates CSS variables; its style type just doesn't declare them. The same value is rendered
  // on server and client; reduced motion overrides it in CSS (.stack-model) to avoid a hydration mismatch.
  const style = { "--spread": spread } as MotionStyle;

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        ref={ref}
        style={style}
        aria-hidden
        className="stack-model relative mx-auto aspect-square w-full max-w-[34rem] [perspective:1800px]"
      >
        <div className="absolute inset-[12%] [transform:rotateX(56deg)_rotateZ(-36deg)] [transform-style:preserve-3d]">
          {panels.map((Panel, index) => (
            <div
              key={layers[index].name}
              className="absolute inset-0 border border-ink/20 bg-paper/70 shadow-[0_18px_40px_-28px_rgba(17,17,17,0.45)]"
              style={{ transform: `translateZ(calc(var(--spread) * ${(1 - index) * 7.5}rem))` }}
            >
              <span className="absolute bottom-2 left-3 font-mono text-[0.625rem] tracking-[0.08em] text-muted uppercase">
                {String(index + 1).padStart(2, "0")} {layers[index].name}
              </span>
              <Panel />
            </div>
          ))}
        </div>
      </m.div>
    </LazyMotion>
  );
}

