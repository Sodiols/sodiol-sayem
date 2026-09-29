"use client";

import { useRef, type PointerEvent } from "react";

const layers = [
  { name: "Page", className: "inset-[6%] bg-well" },
  { name: "Window", className: "inset-x-[14%] inset-y-[16%] border border-ink/20 bg-paper" },
  { name: "Card", className: "left-[24%] right-[34%] top-[30%] bottom-[34%] border border-ink/20 bg-white" },
  { name: "Action", className: "left-[28%] w-[20%] top-[56%] h-[9%] rounded-full bg-ink" },
];

/**
 * Layered panels in CSS 3D. Tilt and depth are CSS variables written on input, so the scene only
 * changes when someone interacts with it. Reduced motion keeps a still, angled view (the slider still works).
 */
export function DepthStudy() {
  const scene = useRef<HTMLDivElement>(null);

  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !scene.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    scene.current.style.setProperty("--ry", `${((event.clientX - left) / width - 0.5) * 24}deg`);
    scene.current.style.setProperty("--rx", `${-((event.clientY - top) / height - 0.5) * 16}deg`);
  }

  function rest() {
    scene.current?.style.setProperty("--ry", "-18deg");
    scene.current?.style.setProperty("--rx", "10deg");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1 [perspective:1200px]" onPointerMove={tilt} onPointerLeave={rest}>
        <div
          ref={scene}
          className="absolute inset-x-0 inset-y-6 mx-auto max-w-[34rem] transition-transform duration-300 ease-out [--depth:2.2rem] [--rx:10deg] [--ry:-18deg] [transform-style:preserve-3d] [transform:rotateX(var(--rx))_rotateY(var(--ry))] motion-reduce:transition-none"
        >
          {layers.map((layer, index) => (
            <div
              key={layer.name}
              className={`absolute shadow-[0_14px_30px_-20px_rgba(17,17,17,0.45)] transition-transform duration-300 ease-out ${layer.className}`}
              style={{ transform: `translateZ(calc(var(--depth) * ${index}))` }}
            >
              <span className="absolute -top-5 left-0 font-mono text-[0.625rem] tracking-[0.08em] text-muted uppercase">
                {layer.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <label className="label mt-4 flex items-center gap-4 text-muted">
        Depth
        <input
          type="range"
          min={0}
          max={60}
          defaultValue={22}
          onChange={(event) => scene.current?.style.setProperty("--depth", `${Number(event.target.value) / 10}rem`)}
          className="h-11 flex-1 accent-ink"
        />
      </label>
    </div>
  );
}
