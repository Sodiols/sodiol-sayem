"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Menu } from "@/components/layout/Menu";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  // Remember where the menu was opened, so any route change closes it.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const isOpen = openedAt === pathname;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [tucked, setTucked] = useState(false);

  // Tuck the header away while scrolling down so it never sits on top of text; bring it back on scroll up.
  // State only changes when the direction flips, so scrolling doesn't re-render per frame.
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - lastY) < 8) return;
        setTucked(y > lastY && y > 120);
        lastY = y;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  function closeMenu(restoreFocus: boolean) {
    setOpenedAt(null);
    if (restoreFocus) buttonRef.current?.focus();
  }

  return (
    <>
      <header
        className={cn(
          "page-x fixed inset-x-0 top-0 z-40 flex items-start justify-between pt-5 text-paper mix-blend-difference transition-[translate] duration-300 ease-out-soft focus-within:translate-y-0 md:pt-6",
          tucked && "-translate-y-full",
        )}
      >
        <Link href="/" className="caps -m-2 p-2" aria-label={`${site.name}, home`}>
          <span className="block sm:inline">{site.firstName}</span>{" "}
          <span className="block sm:inline">{site.lastName}</span>
        </Link>
        <button
          ref={buttonRef}
          type="button"
          className="caps group -m-3.5 flex items-center gap-2 p-3.5"
          aria-expanded={isOpen}
          aria-controls="site-menu"
          onClick={() => setOpenedAt(pathname)}
        >
          Menu
          <span aria-hidden className="flex w-4 flex-col gap-[3px] transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5">
            <span className="h-px bg-current" />
            <span className="h-px bg-current" />
          </span>
        </button>
      </header>

      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <AnimatePresence>{isOpen && <Menu onClose={closeMenu} />}</AnimatePresence>
        </MotionConfig>
      </LazyMotion>
    </>
  );
}
