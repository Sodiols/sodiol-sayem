"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NavigationOverlay } from "./NavigationOverlay";
import styles from "./Navbar.module.css";

export function Navbar() {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const destination = useRef<string | null>(null);
  const focusFrame = useRef(0);
  const pendingFocus = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => () => cancelAnimationFrame(focusFrame.current), []);
  useLayoutEffect(() => {
    if (visible || !pendingFocus.current) return;
    const target = pendingFocus.current;
    pendingFocus.current = null;
    // The header must have committed its non-inert state before Safari can focus it.
    focusFrame.current = requestAnimationFrame(() => target.focus({ preventScroll: true }));
  }, [visible]);

  const requestClose = useCallback(() => setOpen(false), []);
  const requestNavigation = useCallback((href: string) => {
    destination.current = href;
    setOpen(false);
  }, []);
  const afterClose = useCallback(() => {
    setVisible(false);
    setOpen(false);
    const href = destination.current;
    destination.current = null;
    cancelAnimationFrame(focusFrame.current);
    if (!href) {
      pendingFocus.current = trigger.current;
      return;
    }
    const url = new URL(href, window.location.href);
    if (url.pathname !== window.location.pathname) {
      router.push(href);
      return;
    }
    const target = document.getElementById(url.hash.slice(1));
    if (!target) {
      pendingFocus.current = trigger.current;
      return;
    }
    if (window.location.hash !== url.hash) window.history.pushState(null, "", url.hash);
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    if (url.hash === "#work") {
      window.dispatchEvent(new Event("sodiol:work-start"));
      window.scrollTo({ top: 0, behavior });
    }
    else target.scrollIntoView({ behavior, block: "start" });
    const focusTarget = target.querySelector<HTMLElement>("h1,h2") ?? target;
    focusTarget.setAttribute("tabindex", "-1");
    pendingFocus.current = focusTarget;
    focusTarget.addEventListener("blur", () => focusTarget.removeAttribute("tabindex"), { once: true });
  }, [router]);

  return <div ref={root} className={styles.root} data-overlay-visible={visible}>
    <header className={styles.bar} aria-label="Site navigation" aria-hidden={visible} inert={visible}>
      <Link href="/#home" className={styles.wordmark} aria-label="Sodiol home" translate="no">sodiol.</Link>
      <button ref={trigger} className={styles.menuButton} type="button" aria-label="Open navigation menu"
        aria-expanded={open} aria-controls="navigation-overlay" aria-haspopup="dialog"
        onClick={() => {
          if (root.current?.closest<HTMLElement>("[data-intro]")?.dataset.intro !== "complete") return;
          destination.current = null;
          pendingFocus.current = null;
          cancelAnimationFrame(focusFrame.current);
          setVisible(true);
          setOpen(true);
        }}>
        <span /><span />
      </button>
    </header>
    <NavigationOverlay open={open} onRequestClose={requestClose} onNavigate={requestNavigation} onClosed={afterClose} />
  </div>;
}
