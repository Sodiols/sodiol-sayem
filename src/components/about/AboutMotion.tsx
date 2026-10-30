"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./About.module.css";

// Server-rendered content stays readable without JS. This boundary only owns motion.
export function AboutMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = root.current!;
    const media = gsap.matchMedia();
    let started = false;
    let disposed = false;
    let fontTimer: ReturnType<typeof setTimeout> | undefined;
    gsap.registerPlugin(ScrollTrigger);

    const start = () => {
      if (started || disposed) return;
      started = true;
      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Two lines establish the page hierarchy, not a character-by-character effect.
        gsap.fromTo("[data-about-headline]", { yPercent: 115 }, {
          yPercent: 0, duration: 1.05, stagger: 0.12, ease: "power3.out", clearProps: "transform",
        });
        gsap.fromTo("[data-about-intro]", { y: 18, opacity: 0 }, {
          y: 0, opacity: 1, delay: 0.3, duration: 0.7, ease: "power2.out", clearProps: "transform,opacity",
        });
        gsap.utils.toArray<HTMLElement>("[data-about-content]").forEach(content => {
          gsap.fromTo(content, { y: 16, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.7, ease: "power2.out", clearProps: "transform,opacity",
            scrollTrigger: { trigger: content, start: "top 94%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-about-rule]").forEach(rule => {
          gsap.fromTo(rule, { scaleX: 0 }, {
            scaleX: 1, duration: 0.9, ease: "power2.inOut", clearProps: "transform",
            scrollTrigger: { trigger: rule, start: "top 94%", once: true },
          });
        });
        gsap.fromTo("[data-about-closing]", { yPercent: 115 }, {
          yPercent: 0, duration: 0.95, stagger: 0.1, ease: "power3.out", clearProps: "transform",
          scrollTrigger: { trigger: "[data-about-closing]", start: "top 94%", once: true },
        });
      }, element);
    };
    const prepare = () => {
      // Local preloaded fonts normally resolve immediately; a failed request never blocks content.
      void Promise.race([document.fonts.ready, new Promise(resolve => { fontTimer = setTimeout(resolve, 1000); })])
        .then(() => { clearTimeout(fontTimer); start(); });
    };
    if (element.closest<HTMLElement>("[data-intro]")?.dataset.intro === "complete") prepare();
    else window.addEventListener("sodiol:intro-complete", prepare, { once: true });

    return () => {
      disposed = true;
      clearTimeout(fontTimer);
      window.removeEventListener("sodiol:intro-complete", prepare);
      media.revert();
    };
  }, []);

  return <div ref={root} className={styles.shell}>{children}</div>;
}
