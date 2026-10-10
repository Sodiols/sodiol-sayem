"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { navItems } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Close the menu after navigating.
  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        toggleRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 761px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) close();
    };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onChange);
    };
  }, [open, close]);

  const isCurrent = (href: string) => pathname === href || pathname === href.replace(/\/$/, "");

  return (
    <header className="site-header" id="site-header">
      <div className="shell nav-inner">
        <Link className="wordmark" href="/" aria-label="Sodiol, homepage">
          sodiol<span className="brand-stop">.</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
              {item.label} <span className="nav-n">{item.n}</span>
            </Link>
          ))}
        </nav>
        <Link className="nav-cta" href="/contact/">
          LET&apos;S CONNECT <span aria-hidden="true">↗</span>
        </Link>
        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span></span>
          <span></span>
        </button>
      </div>
      <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" hidden={!open}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isCurrent(item.href) ? "page" : undefined}
            onClick={close}
          >
            <span>{item.n}</span>
            {item.label}
            <b aria-hidden="true">↗</b>
          </Link>
        ))}
      </nav>
    </header>
  );
}
