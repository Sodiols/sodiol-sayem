"use client";
import { scrollToY } from "@/lib/scroll";

// Back to the top of the page being read, not to the home page.
export function BackToTop({ className }: { className?: string }) {
  return <button type="button" className={className} onClick={() => {
    scrollToY(0);
    const title = document.querySelector<HTMLElement>("h1");
    if (!title) return;
    title.setAttribute("tabindex", "-1");
    title.focus({ preventScroll: true });
    title.addEventListener("blur", () => title.removeAttribute("tabindex"), { once: true });
  }}>Back to top <span aria-hidden="true">↑</span></button>;
}
