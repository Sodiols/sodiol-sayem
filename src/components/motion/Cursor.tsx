"use client";

import { useEffect, useRef } from "react";

// A lantern-coloured dot that trails the pointer, grows over controls and names what a click does
// wherever an element carries data-cursor. Mouse only; touch and reduced motion keep the system cursor.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;
    const element = dot.current!, label = element.firstElementChild as HTMLElement;
    const root = document.documentElement;
    let x = -100, y = -100, cx = -100, cy = -100, frame = 0;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX; y = event.clientY;
      const target = event.target as Element;
      const text = target.closest("[data-cursor]")?.getAttribute("data-cursor") ?? "";
      element.dataset.mode = text ? "label" : target.closest("a,button,summary,select,label") ? "control" : target.closest("input,textarea,iframe") ? "hidden" : "";
      if (label.textContent !== text) label.textContent = text;
      root.dataset.cursor = "on";
    };
    const leave = () => { element.dataset.mode = "hidden"; };
    const down = () => element.dataset.pressed = "true";
    const up = () => delete element.dataset.pressed;
    const tick = () => {
      cx += (x - cx)*.2; cy += (y - cy)*.2;
      element.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    tick();
    return () => {
      cancelAnimationFrame(frame);
      delete root.dataset.cursor;
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return <div ref={dot} className="cursor" aria-hidden="true"><span /></div>;
}
