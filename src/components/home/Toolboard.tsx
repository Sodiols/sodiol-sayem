"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { toolkit } from "@/data/toolkit";
import styles from "./Toolboard.module.css";

function subscribeMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getServerMotion = () => false;

export function Toolboard() {
  const board = useRef<HTMLUListElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const reduced = useSyncExternalStore(subscribeMotion, getMotion, getServerMotion);

  useEffect(() => {
    const element = board.current!;
    const shell = element.closest<HTMLElement>("[data-intro]");
    const fine = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const entries = Array.from(element.querySelectorAll<HTMLElement>("[data-tool-position]")).map(position => ({
      position, response: position.querySelector<HTMLElement>("[data-tool-response]")!, cx: 0, cy: 0, x: 0, y: 0,
    }));
    let visible = false;
    let ready = shell?.dataset.intro === "complete";
    let pointer: { x: number; y: number } | null = null;
    let origin = { x: 0, y: 0 };
    let frame = 0;
    let lastTime = 0;

    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      pointer = null;
      entries.forEach(entry => {
        entry.x = 0; entry.y = 0;
        entry.response.style.removeProperty("--push-x");
        entry.response.style.removeProperty("--push-y");
        entry.response.style.removeProperty("--tilt-x");
        entry.response.style.removeProperty("--tilt-y");
      });
    };
    const running = () => visible && ready && !document.hidden && !reduced;
    const sync = () => {
      element.dataset.running = String(running());
      if (!running() || !fine.matches) reset();
    };
    const measure = () => {
      // One batched read per entry/resize; pointer animation never measures layout.
      const rect = element.getBoundingClientRect();
      const centers = entries.map(entry => entry.position.getBoundingClientRect());
      origin = { x: rect.left + window.scrollX, y: rect.top + window.scrollY };
      entries.forEach((entry, index) => {
        entry.cx = centers[index].left + centers[index].width / 2 - rect.left;
        entry.cy = centers[index].top + centers[index].height / 2 - rect.top;
      });
    };
    const tick = (time: number) => {
      frame = 0;
      if (!running() || !fine.matches) return;
      const blend = 1 - Math.exp(-Math.min(time - lastTime || 16, 32) / 80);
      lastTime = time;
      let unsettled = false;
      entries.forEach(entry => {
        let x = 0, y = 0;
        if (pointer) {
          const dx = entry.cx - pointer.x;
          const dy = entry.cy - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 1 && distance < 150) {
            const force = (1 - distance / 150) * 4;
            x = dx / distance * force;
            y = dy / distance * force;
          }
        }
        entry.x += (x - entry.x) * blend;
        entry.y += (y - entry.y) * blend;
        if (Math.abs(x - entry.x) + Math.abs(y - entry.y) > 0.025) unsettled = true;
        entry.response.style.setProperty("--push-x", `${entry.x.toFixed(3)}px`);
        entry.response.style.setProperty("--push-y", `${entry.y.toFixed(3)}px`);
        entry.response.style.setProperty("--tilt-x", `${(-entry.y * 0.22).toFixed(3)}deg`);
        entry.response.style.setProperty("--tilt-y", `${(entry.x * 0.22).toFixed(3)}deg`);
      });
      if (unsettled) frame = requestAnimationFrame(tick);
    };
    const startTick = () => { if (!frame) { lastTime = performance.now(); frame = requestAnimationFrame(tick); } };
    const enter = () => { if (fine.matches && running()) measure(); };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !fine.matches || !running()) return;
      pointer = { x: event.clientX + window.scrollX - origin.x, y: event.clientY + window.scrollY - origin.y };
      startTick();
    };
    const leave = () => { pointer = null; if (running() && fine.matches) startTick(); };
    const onIntro = () => { ready = true; sync(); };
    const observer = new IntersectionObserver(records => { visible = records[0].isIntersecting; sync(); }, { threshold: 0.05 });
    const resize = new ResizeObserver(() => { reset(); if (visible && fine.matches) measure(); });
    observer.observe(element);
    resize.observe(element);
    element.addEventListener("pointerenter", enter, { passive: true });
    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerleave", leave, { passive: true });
    element.addEventListener("pointercancel", leave, { passive: true });
    fine.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("sodiol:intro-complete", onIntro);
    sync();
    return () => {
      reset(); observer.disconnect(); resize.disconnect();
      element.dataset.running = "false";
      element.removeEventListener("pointerenter", enter);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("pointercancel", leave);
      fine.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("sodiol:intro-complete", onIntro);
    };
  }, [reduced]);

  return <section id="skills" className={styles.section} aria-labelledby="toolkit-title" data-toolkit>
    <div className={styles.inner}>
      <header className={styles.header}>
        <div><h2 id="toolkit-title">Behind the scenes.</h2><p className={styles.description}>The tools I use to make things work.</p></div>
      </header>
      <p id="toolkit-help" className="sr-only">Select a tile to hold its floating motion and show its name. Select it again to release it.</p>
      <ul ref={board} className={styles.board} aria-label="Skills and tools" aria-describedby="toolkit-help"
        data-running="false">
        {toolkit.map((tool, index) => <li key={tool.id} className={styles.position} data-tool-position data-selected={selected === tool.id}
          style={{
            "--x": `${tool.x / 12}%`, "--y": `${tool.y / 6.4}%`, "--w": tool.w, "--h": tool.h,
            "--angle": `${tool.angle}deg`, "--span": tool.mobile.span, "--ms": tool.mobile.size,
            "--mt": tool.mobile.offset, "--duration": `${4 + index % 5 * 0.15}s`, "--delay": `${index % 7 * 0.025}s`,
            "--lift": `${index % 2 ? -2 : 2}px`, "--rock": `${index % 3 ? -0.2 : 0.25}deg`,
          } as CSSProperties}>
          <div className={styles.response} data-tool-response>
            <div className={styles.drift}>
              <button type="button" className={styles.tile} data-tone={index % 4} data-wordmark={Boolean(tool.mark)}
                aria-label={tool.name} aria-pressed={selected === tool.id}
                onClick={() => setSelected(value => value === tool.id ? null : tool.id)}>
                {tool.icon ? <Image className={styles.logo} src={`/toolkit/${tool.icon}.svg`} width={64} height={64} alt="" unoptimized loading="lazy" draggable={false} />
                  : <span className={styles.wordmark} aria-hidden="true">{tool.mark!.map(line => <span key={line}>{line}</span>)}</span>}
                <span className={styles.name}>{tool.label}</span>
              </button>
            </div>
          </div>
        </li>)}
      </ul>
    </div>
  </section>;
}
