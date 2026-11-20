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
  const skipIntro = useRef<() => void>(() => {});

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
    let finished = false;
    let fontTimeout: ReturnType<typeof setTimeout>;
    page.inert = true;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const finish = () => {
      if (cancelled || finished) return;
      finished = true;
      shell.dataset.intro = "complete";
      page.inert = false;
      document.documentElement.style.overflow = previousOverflow;
      document.body.style.overflow = previousBodyOverflow;
      overlay.hidden = true;
      clearTimeout(failSafe);
      try { sessionStorage.setItem("sodiol:intro-seen", "true"); } catch { /* Storage may be unavailable. */ }
      window.dispatchEvent(new Event("sodiol:intro-complete"));
    };
    skipIntro.current = () => { animations.forEach(animation => animation.cancel()); finish(); page.querySelector<HTMLElement>("#home a")?.focus({ preventScroll: true }); };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape" && !finished) skipIntro.current(); };
    window.addEventListener("keydown", onKeyDown);
    const animate = (element: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
      const animation = element.animate(frames, {
        fill: "both", ...options,
        delay: (options.delay ?? 0) * .5,
        duration: typeof options.duration === "number" ? options.duration * .5 : options.duration,
      });
      animations.push(animation);
      return animation;
    };
    const run = async () => {
      let seen = false;
      try { seen = sessionStorage.getItem("sodiol:intro-seen") === "true"; } catch { /* Use the first-visit intro. */ }
      // Slow hydration has already used the arrival budget; show the usable page immediately.
      if (seen || window.location.pathname !== "/" || window.location.hash || motion.matches || performance.now() > 350) { finish(); return; }
      // Never wait indefinitely on a failed font request. The serif fallback is usable.
      await Promise.race([
        document.fonts.load('100px "Instrument Serif"', "sodiol."),
        new Promise<void>(resolve => { fontTimeout = setTimeout(resolve, 100); }),
      ]).catch(() => undefined);
      clearTimeout(fontTimeout);
      if (cancelled || finished) return;
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
        ], { delay: 100 + delay * .25, duration: 350 - delay * .2, easing: "cubic-bezier(.25,.1,.25,1)" });
        entrance.startTime = epoch;
        const exit = animate(glyph, [
          { transform: "translate3d(0,0,0) rotate(0deg)", opacity: 1 },
          { opacity: 0.8, offset: 0.35 },
          { transform: `translate3d(0,${-y * 1.48}em,0) rotate(${-rotate}deg)`, opacity: 0 },
        ], { delay: 540 + delay * .1, duration: 250, easing: "cubic-bezier(.45,0,.55,1)", fill: "forwards" });
        exit.startTime = epoch;
      });
      const lift = animate(surface, [
        { transform: "translate3d(0,0,0)" },
        { transform: "translate3d(0,-101%,0)" },
      ], { delay: 780, duration: 220, easing: "cubic-bezier(.76,0,.24,1)" });
      lift.startTime = epoch;
      // The dark intermediate screen stays still, then uncovers the prepared page from the left.
      const reveal = animate(curtain, [
        { transform: "scaleX(1)" }, { transform: "scaleX(0)" },
      ], { delay: 900, duration: 280, easing: "cubic-bezier(.65,0,.25,1)" });
      reveal.startTime = epoch;
      shell.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element, index) => {
        const animation = animate(element, [
          { opacity: 0, transform: "translate3d(0,18px,0)" },
          { opacity: 1, transform: "translate3d(0,0,0)" },
        ], { delay: 970 + index * 30, duration: 350, easing: "cubic-bezier(.16,1,.3,1)" });
        animation.startTime = epoch;
      });
      // The name stands up out of the ground, one letter after another, as the curtain clears.
      shell.querySelectorAll<HTMLElement>("[data-reveal-letter]").forEach((element, index) => {
        const animation = animate(element, [
          { opacity: 0, transform: "translate3d(0,.35em,-.4em) rotateX(-88deg)" },
          { opacity: 1, transform: "translate3d(0,0,0) rotateX(0deg)" },
        ], { delay: 990 + index * 10, duration: 350, easing: "cubic-bezier(.16,1,.3,1)" });
        animation.startTime = epoch;
      });
      await reveal.finished;
      finish();
    };
    const failSafe = setTimeout(finish, 4000);
    const onMotionChange = () => { if (motion.matches) { finish(); animations.forEach(a => a.cancel()); } };
    motion.addEventListener("change", onMotionChange);
    void run().catch(finish);
    return () => {
      cancelled = true;
      clearTimeout(fontTimeout);
      clearTimeout(failSafe);
      motion.removeEventListener("change", onMotionChange);
      window.removeEventListener("keydown", onKeyDown);
      animations.forEach(animation => animation.cancel());
      page.inert = false;
      document.documentElement.style.overflow = previousOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  return (
    <div ref={root} data-intro="pending">
      <div className="portfolio">{children}</div>
      <div className="intro" role="region" aria-label="Introduction">
        <button className="intro-skip" type="button" onClick={() => skipIntro.current()}>Skip intro <span aria-hidden="true">↗</span></button>
        <div className="intro-curtain" aria-hidden="true" />
        <div className="intro-surface" aria-hidden="true">
          <div className="intro-word">
            {letters.map(({ char }, index) => <span className="intro-letter" key={index}>{char}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
