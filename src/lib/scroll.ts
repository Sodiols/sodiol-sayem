import type Lenis from "lenis";

// The page's one smooth scroller, so programmatic scrolls glide the same way the wheel does.
let lenis: Lenis | null = null;
export const setLenis = (instance: Lenis | null) => { lenis = instance; };

export function scrollToY(top: number) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis && !reduced) lenis.scrollTo(top, { duration: 1.2 });
  else window.scrollTo({ top, behavior: reduced ? "instant" : "smooth" });
}
