"use client";

import { cancelFrame, frame } from "motion";
import { useEffect, useRef } from "react";

const LETTERS = ["S", "O", "D", "I", "O", "L"];
const REST = [0.28, 0.65, 0.92, 0.28, 0.55, 0.22];
const FALLBACK_WIDTHS = [160, 214, 228, 56, 206, 106];
const GAP = 6;
const INSET = 8;
const WORD_WIDTH = 1000;
const SAMPLES = 20;

// Verified against the bundled font's fvar table. Cap-height axes remain fixed.
function variation(influence: number) {
  return `"wght" ${100 + influence * 900}, "wdth" ${25 + influence * 126}, "opsz" 144`;
}

function layout(widths: number[]) {
  const available = WORD_WIDTH - INSET * 2 - GAP * (LETTERS.length - 1);
  const total = widths.reduce((sum, width) => sum + width, 0);
  let x = INSET;
  return widths.map((width) => {
    const length = width / total * available;
    const result = { x, length };
    x += length + GAP;
    return result;
  });
}

const fallback = layout(FALLBACK_WIDTHS);

export function HeroTypography() {
  const areaRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(SVGTextElement | null)[]>([]);
  const measureRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const area = areaRef.current;
    const measure = measureRef.current;
    const letters = lettersRef.current;
    if (!area || !measure || letters.some((letter) => !letter)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let disposed = false;
    let visible = false;
    let running = false;
    let fontReady = false;
    let pointer: number | null = null;
    let bounds = area.getBoundingClientRect();
    let current = [...REST];
    let anchors = fallback.map(({ x, length }) => (x + length / 2) / WORD_WIDTH);
    let widths: number[][] = [];

    function naturalWidth(index: number, influence: number) {
      const sample = influence * SAMPLES;
      const lower = Math.min(SAMPLES - 1, Math.floor(sample));
      const row = widths[index];
      return row ? row[lower] + (row[lower + 1] - row[lower]) * (sample - lower) : FALLBACK_WIDTHS[index];
    }

    function paint() {
      // React detaches the letter refs before this effect's cleanup runs; a resize or frame in that gap must not paint.
      if (disposed || letters.some((letter) => !letter)) return;
      const positions = layout(current.map((value, index) => naturalWidth(index, value)));
      letters.forEach((letter, index) => {
        letter!.style.fontVariationSettings = variation(current[index]);
        letter!.setAttribute("x", positions[index].x.toFixed(3));
        letter!.setAttribute("textLength", positions[index].length.toFixed(3));
      });
    }

    function stop() {
      cancelFrame(tick);
      running = false;
    }

    function allowed() {
      return fontReady && visible && !document.hidden && !reduced.matches && finePointer.matches;
    }

    function tick({ delta }: { delta: number }) {
      if (!allowed()) { stop(); return; }
      const seconds = Math.min(delta, 40) / 1000;
      const smoothing = 1 - Math.exp(-seconds / 0.12);
      let moving = false;
      current = current.map((value, index) => {
        // Fixed resting anchors prevent expanding glyphs from chasing the cursor.
        const distance = pointer === null ? 0 : (pointer - anchors[index]) / 0.19;
        const target = pointer === null ? REST[index] : Math.exp(-distance * distance * 1.5);
        const next = value + (target - value) * smoothing;
        if (Math.abs(target - next) > 0.0003) moving = true;
        return Math.abs(target - next) < 0.0003 ? target : next;
      });
      paint();
      if (!moving) stop();
    }

    function start() {
      if (allowed() && !running) {
        running = true;
        frame.update(tick, true);
      }
    }

    function reset() {
      stop();
      pointer = null;
      current = [...REST];
      paint();
    }

    function updateAvailability() {
      if (!allowed()) reset();
    }

    function measureFont() {
      if (disposed) return;
      // Measure only on font/size changes, never during pointer animation.
      widths = LETTERS.map((letter) => {
        measure!.textContent = letter;
        return Array.from({ length: SAMPLES + 1 }, (_, index) => {
          measure!.style.fontVariationSettings = variation(index / SAMPLES);
          return measure!.getComputedTextLength();
        });
      });
      const positions = layout(REST.map((value, index) => naturalWidth(index, value)));
      anchors = positions.map(({ x, length }) => (x + length / 2) / WORD_WIDTH);
      paint();
    }

    function resize() {
      bounds = area!.getBoundingClientRect();
      if (fontReady) measureFont();
    }

    function move(event: PointerEvent) {
      if (event.pointerType === "touch" || !allowed()) return;
      bounds = area!.getBoundingClientRect();
      pointer = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      start();
    }

    function leave() {
      pointer = null;
      start();
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateAvailability();
    });
    observer.observe(area);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(area);
    area.addEventListener("pointermove", move, { passive: true });
    area.addEventListener("pointerleave", leave);
    area.addEventListener("pointercancel", leave);
    document.addEventListener("visibilitychange", updateAvailability);
    reduced.addEventListener("change", updateAvailability);
    finePointer.addEventListener("change", updateAvailability);
    document.fonts.addEventListener("loadingdone", measureFont);

    const family = getComputedStyle(measure).fontFamily;
    // A rejected font load leaves the server-rendered, fitted fallback intact.
    void document.fonts.load(`420px ${family}`, "SODIOL").then(() => document.fonts.ready).then(() => {
      if (disposed) return;
      fontReady = document.fonts.check(`420px ${family}`, "SODIOL");
      measureFont();
      updateAvailability();
    }).catch(() => { /* Native fallback remains visible without an animation dependency. */ });

    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      area.removeEventListener("pointermove", move);
      area.removeEventListener("pointerleave", leave);
      area.removeEventListener("pointercancel", leave);
      document.removeEventListener("visibilitychange", updateAvailability);
      reduced.removeEventListener("change", updateAvailability);
      finePointer.removeEventListener("change", updateAvailability);
      document.fonts.removeEventListener("loadingdone", measureFont);
    };
  }, []);

  return (
    <div ref={areaRef} className="hero-type-area">
      <h1 id="hero-heading" aria-label="SODIOL" className="hero-heading">
        <svg className="hero-word" viewBox="0 0 1000 320" aria-hidden="true" focusable="false">
          {LETTERS.map((letter, index) => (
            <text
              key={index}
              ref={(element) => { lettersRef.current[index] = element; }}
              x={fallback[index].x}
              y="307"
              textLength={fallback[index].length}
              lengthAdjust="spacingAndGlyphs"
              style={{ fontVariationSettings: variation(REST[index]) }}
            >{letter}</text>
          ))}
          <text ref={measureRef} x="0" y="307" visibility="hidden" />
        </svg>
      </h1>
      <p className="hero-intention">made with intention</p>
    </div>
  );
}
