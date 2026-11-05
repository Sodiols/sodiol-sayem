"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { setLenis } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Smooth scrolling once the intro hands over, and a staggered rise for every [data-rise].
export function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shell = document.querySelector<HTMLElement>("[data-intro]");
    let lenis: Lenis | null = null;
    const raf = (time: number) => lenis?.raf(time*1000);

    const start = () => {
      if (!reduced) {
        lenis = new Lenis({ lerp: .1, wheelMultiplier: .9 });
        lenis.on("scroll", ScrollTrigger.update);
        setLenis(lenis);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
      }
      ScrollTrigger.refresh();
    };
    if (shell?.dataset.intro === "complete") start();
    else window.addEventListener("sodiol:intro-complete", start, { once: true });

    const context = gsap.context(() => {
      if (reduced) return;
      gsap.set("[data-rise]", { y: 28, opacity: 0 });
      ScrollTrigger.batch("[data-rise]", {
        start: "top 88%", once: true,
        onEnter: batch => gsap.fromTo(batch, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: "expo.out", stagger: .075, overwrite: true }),
      });
      // Big headings stand their letters up one by one, out of a line mask.
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach(heading => {
        // autoSplit re-splits once the display face loads, so the lines break where the reader sees them.
        SplitText.create(heading, { type: "lines,chars", mask: "lines", autoSplit: true,
          onSplit: split => gsap.from(split.chars, { yPercent: 110, rotateX: -80, transformOrigin: "50% 100%", duration: 1.1, ease: "expo.out", stagger: .028,
            scrollTrigger: { trigger: heading, start: "top 85%", once: true } }) });
      });
    });

    // Images, fonts and the opened case study move things; keep trigger positions true.
    // A refresh restores the scroll position, so it waits for a smooth scroll (opening a case) to land.
    let pending = 0, lastScroll = 0;
    const onScroll = () => { lastScroll = performance.now(); };
    const refresh = () => {
      clearTimeout(pending);
      pending = window.setTimeout(() => performance.now() - lastScroll < 200 ? refresh() : ScrollTrigger.refresh(), 200);
    };
    const resized = new ResizeObserver(refresh);
    resized.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      resized.disconnect();
      window.removeEventListener("scroll", onScroll);
      clearTimeout(pending);
      window.removeEventListener("sodiol:intro-complete", start);
      gsap.ticker.remove(raf);
      lenis?.destroy();
      setLenis(null);
      context.revert();
    };
  }, [pathname]);

  return null;
}
