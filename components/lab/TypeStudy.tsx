"use client";

import { useRef, type ChangeEvent, type PointerEvent } from "react";

const WORD = "Intention";
const REST = 0.5;

/**
 * Separate from the homepage hero: this uses Geist's own weight axis on plain spans.
 * Weights are written straight to the DOM on input, so nothing re-renders and nothing runs when idle.
 */
export function TypeStudy() {
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const slider = useRef<HTMLInputElement>(null);

  function focusAt(position: number | null) {
    letters.current.forEach((letter, index) => {
      if (!letter) return;
      const centre = (index + 0.5) / WORD.length;
      const influence = position === null ? 0.35 : Math.exp(-(((position - centre) / 0.16) ** 2));
      letter.style.fontVariationSettings = `"wght" ${Math.round(100 + influence * 800)}`;
    });
  }

  function onPointer(event: PointerEvent<HTMLDivElement>) {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const position = Math.min(1, Math.max(0, (event.clientX - left) / width));
    focusAt(position);
    if (slider.current) slider.current.value = String(Math.round(position * 100));
  }

  return (
    <div className="flex h-full flex-col">
      <div
        className="flex flex-1 touch-pan-y items-center justify-center overflow-hidden"
        onPointerMove={onPointer}
        onPointerLeave={() => focusAt(null)}
      >
        <p aria-label={WORD} className="text-[clamp(2.75rem,8vw,6.5rem)] leading-none tracking-[-0.03em] select-none">
          {WORD.split("").map((letter, index) => (
            <span
              key={index}
              aria-hidden
              ref={(element) => {
                letters.current[index] = element;
              }}
              className="inline-block transition-[font-variation-settings] duration-150 ease-out motion-reduce:transition-none"
              style={{ fontVariationSettings: '"wght" 380' }}
            >
              {letter}
            </span>
          ))}
        </p>
      </div>
      <label className="label mt-4 flex items-center gap-4 text-muted">
        Focus
        <input
          ref={slider}
          type="range"
          min={0}
          max={100}
          defaultValue={REST * 100}
          onChange={(event: ChangeEvent<HTMLInputElement>) => focusAt(Number(event.target.value) / 100)}
          className="h-11 flex-1 accent-ink"
        />
      </label>
    </div>
  );
}
