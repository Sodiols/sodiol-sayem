"use client";

import { useEffect, useRef } from "react";

const trailLength = 12;

// A decorative mouse trail; the browser keeps its normal pointer and hit targets.
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dots = Array.from(root.current!.children) as HTMLElement[];
    const points = dots.map(() => ({ x: 0, y: 0 }));
    let x = 0, y = 0, lastMove = 0, previous = 0, frame = 0, active = false;
    // Remove the old label flag if this component was replaced by a hot update.
    delete document.documentElement.dataset.cursor;

    const clear = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      active = false;
      dots.forEach(dot => { dot.style.opacity = "0"; });
    };
    const tick = (now: number) => {
      frame = 0;
      if (!fine.matches || reduced.matches || document.hidden) return clear();
      const fade = Math.max(0, 1 - (now - lastMove) / 380);
      if (fade === 0) return clear();
      const delta = Math.min(64, Math.max(1, now - previous)) / (1000 / 60);
      const follow = 1 - Math.pow(.55, delta);
      previous = now;
      let targetX = x, targetY = y;
      points.forEach((point, index) => {
        point.x += (targetX - point.x) * follow;
        point.y += (targetY - point.y) * follow;
        const taper = 1 - index / trailLength;
        dots[index].style.transform = `translate3d(${point.x}px,${point.y}px,0) scale(${.3 + taper * .7})`;
        dots[index].style.opacity = String(fade * taper * .5);
        targetX = point.x;
        targetY = point.y;
      });
      frame = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !fine.matches || reduced.matches) return;
      if ((event.target as Element).closest("input,textarea,select,iframe")) return clear();
      x = event.clientX;
      y = event.clientY;
      lastMove = performance.now();
      if (!active) {
        active = true;
        previous = lastMove;
        points.forEach(point => { point.x = x; point.y = y; });
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onVisibility = () => { if (document.hidden) clear(); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", clear);
    document.addEventListener("pointerleave", clear);
    document.addEventListener("visibilitychange", onVisibility);
    fine.addEventListener("change", clear);
    reduced.addEventListener("change", clear);
    return () => {
      clear();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", clear);
      document.removeEventListener("pointerleave", clear);
      document.removeEventListener("visibilitychange", onVisibility);
      fine.removeEventListener("change", clear);
      reduced.removeEventListener("change", clear);
    };
  }, []);

  return <div ref={root} className="cursor-trail" data-cursor-trail aria-hidden="true">
    {Array.from({ length: trailLength }, (_, index) => <span key={index} />)}
  </div>;
}
