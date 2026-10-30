"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Measured from Video Project 5.mp4. Em units preserve the movement on phones.
const letters = [
  { char: "s", y: -0.72, rotate: -16, delay: 0 },
  { char: "o", y: 0.84, rotate: 19, delay: 60 },
  { char: "d", y: -0.68, rotate: -12, delay: 120 },
  { char: "i", y: 0.78, rotate: 12, delay: 175 },
  { char: "o", y: -0.76, rotate: -19, delay: 235 },
  { char: "l", y: 0.82, rotate: 10, delay: 295 },
  { char: ".", y: -0.92, rotate: 0, delay: 350 },
];

export function IntroLoader({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = root.current!;
    const page = shell.querySelector<HTMLElement>(".portfolio")!;
    const surface = shell.querySelector<HTMLElement>(".intro-surface")!;
    const curtain = shell.querySelector<HTMLElement>(".intro-curtain")!;
    const overlay = shell.querySelector<HTMLElement>(".intro")!;
    const glyphs = shell.querySelectorAll<HTMLElement>(".intro-letter");
    const animations: Animation[] = [];
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const previousOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    let cancelled = false;
    let fontTimeout: ReturnType<typeof setTimeout>;
    page.inert = true;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const finish = () => {
      if (cancelled) return;
      shell.dataset.intro = "complete";
      page.inert = false;
      document.documentElement.style.overflow = previousOverflow;
      document.body.style.overflow = previousBodyOverflow;
      overlay.hidden = true;
      clearTimeout(failSafe);
      window.dispatchEvent(new Event("sodiol:intro-complete"));
    };
    const animate = (element: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = element.animate(frames, { fill: "both", ...options });
      animations.push(animation);
      return animation;
    };
    const run = async () => {
      // Never wait indefinitely on a failed font request. The serif fallback is usable.
      await Promise.race([
        document.fonts.load('100px "Instrument Serif"', "sodiol."),
        new Promise<void>(resolve => { fontTimeout = setTimeout(resolve, 100); }),
      ]).catch(() => undefined);
      clearTimeout(fontTimeout);
      if (cancelled) return;
      shell.dataset.intro = "playing";
      if (motion.matches) {
        finish();
        return;
      }
      const epoch = document.timeline.currentTime;
      glyphs.forEach((glyph, index) => {
        const { y, rotate, delay } = letters[index];
        const entrance = animate(glyph, [
          { transform: `translate3d(0,${y}em,0) rotate(${rotate}deg)`, opacity: 0 },
          { opacity: 0.65, offset: 0.35 },
          { transform: "translate3d(0,0,0) rotate(0deg)", opacity: 1 },
        ], { delay: delay * .25, duration: 300, easing: "cubic-bezier(.25,.1,.25,1)" });
        entrance.startTime = epoch;
        const exit = animate(glyph, [
          { transform: "translate3d(0,0,0) rotate(0deg)", opacity: 1 },
          { opacity: 0.8, offset: 0.35 },
          { transform: `translate3d(0,${-y * 1.48}em,0) rotate(${-rotate}deg)`, opacity: 0 },
        ], { delay: 440 + delay * .1, duration: 240, easing: "cubic-bezier(.45,0,.55,1)", fill: "forwards" });
        exit.startTime = epoch;
      });
      const lift = animate(surface, [
        { transform: "translate3d(0,0,0)" },
        { transform: "translate3d(0,-101%,0)" },
      ], { delay: 670, duration: 200, easing: "cubic-bezier(.76,0,.24,1)" });
      lift.startTime = epoch;
      // The dark intermediate screen stays still, then uncovers the prepared page from the left.
      const reveal = animate(curtain, [
        { transform: "scaleX(1)" }, { transform: "scaleX(0)" },
      ], { delay: 800, duration: 280, easing: "cubic-bezier(.65,0,.25,1)" });
      reveal.startTime = epoch;
      shell.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element, index) => {
        const animation = animate(element, [
          { opacity: 0, transform: "translate3d(0,18px,0)" },
          { opacity: 1, transform: "translate3d(0,0,0)" },
        ], { delay: 800 + index * 30, duration: 250, easing: "cubic-bezier(.16,1,.3,1)" });
        animation.startTime = epoch;
      });
      await reveal.finished;
      finish();
    };
    const failSafe = setTimeout(finish, 10000);
    const onMotionChange = () => { if (motion.matches) { finish(); animations.forEach(a => a.cancel()); } };
    motion.addEventListener("change", onMotionChange);
    void run().catch(finish);
    return () => {
      cancelled = true;
      clearTimeout(fontTimeout);
      clearTimeout(failSafe);
      motion.removeEventListener("change", onMotionChange);
      animations.forEach(animation => animation.cancel());
      page.inert = false;
      document.documentElement.style.overflow = previousOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  return (
    <div ref={root} data-intro="pending">
      <div className="portfolio">{children}</div>
      <div className="intro" aria-hidden="true">
        <div className="intro-curtain" />
        <div className="intro-surface">
          <div className="intro-word">
            {letters.map(({ char }, index) => <span className="intro-letter" key={index}>{char}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
