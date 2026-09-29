"use client";

import Image from "next/image";
import Link from "next/link";
import * as m from "motion/react-m";
import { useReducedMotion, type Variants } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { LocalTime } from "@/components/ui/LocalTime";
import { navigation } from "@/data/navigation";
import { projects } from "@/data/projects";
import { site, socialLinks } from "@/data/site";
import { ease } from "@/lib/motion";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { cn } from "@/lib/utils";

// Staged entrance: background, identity, navigation, previews, metadata.
const reveal: Variants = {
  hidden: { opacity: 0, y: 10 },
  shown: (step: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease, delay: 0.06 + step * 0.05 },
  }),
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

const eyebrow = "text-[0.6875rem] font-medium tracking-[0.16em] uppercase";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

type MenuProps = {
  onClose: (restoreFocus: boolean) => void;
};

export function Menu({ onClose }: MenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose(true);
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (element) => element.offsetParent !== null,
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKeyDown(event);
    lockScroll();
    document.addEventListener("keydown", listener);
    return () => {
      unlockScroll();
      document.removeEventListener("keydown", listener);
    };
  }, []);

  const navigate = () => onClose(false);
  const pathname = usePathname();
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const stripHidden = reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)" };
  const stripShown = (index: number) =>
    reduceMotion
      ? { opacity: 1 }
      : {
          clipPath: "inset(0 0% 0 0)",
          transition: { duration: 0.5, ease, delay: 0.14 + index * 0.05 },
        };

  const utilityLinks = [
    ...(site.resume ? [{ label: "Download CV", href: site.resume, download: true }] : []),
    ...socialLinks.filter((link) => link.label !== "Email").map((link) => ({ ...link, download: false })),
  ];

  return (
    <m.div
      ref={dialogRef}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-paper text-ink lg:overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.05 } }}
    >
      <div className="page-x layout-grid min-h-dvh content-start gap-y-14 pt-5 pb-8 md:pt-6 lg:h-dvh lg:grid-rows-[auto_minmax(0,1fr)_auto] lg:content-stretch lg:gap-y-0 lg:px-[4.6vw] lg:pt-10 lg:pb-12">
        {/* Identity */}
        <m.div
          className="col-span-3 md:col-span-6 lg:col-span-5"
          variants={reveal}
          custom={0}
          initial="hidden"
          animate="shown"
          exit="exit"
        >
          <Link href="/" onClick={navigate} className="hit block w-fit" aria-label={`${site.name}, home`}>
            <span className="caps lg:text-[clamp(3rem,5.3vw,5.5rem)] lg:leading-[0.86] lg:font-medium lg:tracking-[-0.04em]">
              <span className="lg:block">{site.firstName}</span>{" "}
              <span className="lg:block">{site.lastName}</span>
            </span>
          </Link>
          <p className={cn(eyebrow, "mt-4 hidden text-muted lg:block")}>
            {site.role} / {site.country}
          </p>
        </m.div>

        {/* Utility links and close */}
        <m.div
          className="col-span-1 flex items-center justify-end gap-8 md:col-span-2 lg:col-span-7 lg:self-start lg:pt-1"
          variants={reveal}
          custom={0}
          initial="hidden"
          animate="shown"
          exit="exit"
        >
          <ul className="hidden items-center gap-8 text-[0.625rem] font-medium tracking-[0.14em] uppercase lg:flex">
            {utilityLinks.map((link) => (
              <li key={link.label}>
                {link.download ? (
                  <a href={link.href} download className="link-line hit">
                    {link.label}
                  </a>
                ) : (
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="link-line hit">
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
          <span aria-hidden className="hidden h-6 w-px bg-line lg:block" />
          <button
            type="button"
            autoFocus
            onClick={() => onClose(true)}
            className="group -m-3.5 flex items-center gap-2.5 p-3.5 text-[0.8125rem] font-medium tracking-[0.16em] uppercase"
          >
            Close
            <svg
              aria-hidden
              viewBox="0 0 12 12"
              className="size-3 transition-transform duration-300 ease-out-soft group-hover:rotate-90"
            >
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </m.div>

        {/* Navigation */}
        <m.nav
          aria-label="Primary"
          className="col-span-4 md:col-span-6 lg:col-span-3 lg:row-start-2 lg:mt-[3.75rem] lg:self-start"
          variants={reveal}
          custom={1}
          initial="hidden"
          animate="shown"
          exit="exit"
        >
          <h2 className={cn(eyebrow, "border-b border-line pb-3 text-muted lg:border-0 lg:pb-0")}>Navigation</h2>
          <ul className="mt-2 lg:mt-4">
            {navigation.map((item) => {
              const current = isCurrent(item.href);
              return (
                <li key={item.href} className="border-b border-line lg:border-0">
                  <Link
                    href={item.href}
                    onClick={navigate}
                    aria-current={current ? "page" : undefined}
                    className="group grid grid-cols-[3.75rem_1fr] items-baseline py-3.5 lg:py-2.5"
                  >
                    <span className="relative pl-2 text-[0.6875rem] font-medium tracking-[0.16em] text-muted">
                      {current && <span aria-hidden className="absolute top-1/2 -left-2 size-1.5 -translate-y-1/2 rounded-full bg-ink" />}
                      {item.number}
                    </span>
                    <span
                      className={cn(
                        "text-[1.5rem] font-medium tracking-[0.14em] uppercase transition-[translate,color] duration-300 ease-out-soft group-hover:translate-x-1 group-focus-visible:translate-x-1 lg:text-[1.125rem]",
                        current ? "text-ink" : "text-ink/80",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </m.nav>

        {/* Selected work: strip, number and title share one row */}
        <m.section
          aria-labelledby="menu-work"
          className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-5 lg:row-start-2 lg:mt-7 lg:grid lg:grid-cols-subgrid lg:content-start lg:self-start"
          variants={reveal}
          custom={2}
          initial="hidden"
          animate="shown"
          exit="exit"
          onMouseLeave={() => setActiveSlug(null)}
        >
          <h2
            id="menu-work"
            className={cn(eyebrow, "border-b border-line pb-3 text-muted lg:col-span-8 lg:mb-7 lg:border-0 lg:pb-0")}
          >
            Selected Work
          </h2>
          <ul className="mt-6 grid gap-10 md:grid-cols-2 lg:col-span-8 lg:mt-0 lg:grid-cols-subgrid lg:gap-y-3">
            {projects.map((project, index) => {
              const isActive = activeSlug === project.slug;
              const isDimmed = activeSlug !== null && !isActive;
              return (
                <li key={project.slug} className="lg:col-span-8 lg:grid lg:grid-cols-subgrid">
                  <Link
                    href={`/work/${project.slug}`}
                    onClick={navigate}
                    onMouseEnter={() => setActiveSlug(project.slug)}
                    onFocus={() => setActiveSlug(project.slug)}
                    onBlur={() => setActiveSlug(null)}
                    className="flex flex-col lg:col-span-8 lg:grid lg:grid-cols-subgrid lg:items-center"
                  >
                    <span className="text-[0.6875rem] font-medium tracking-[0.16em] text-muted lg:col-span-1 lg:col-start-6">
                      {project.number}
                    </span>
                    <span
                      className={cn(
                        "mt-1 text-[1.5rem] font-medium tracking-[0.14em] uppercase lg:col-span-2 lg:mt-0 lg:whitespace-nowrap lg:text-[0.9375rem] lg:transition-transform lg:duration-300 lg:ease-out-soft",
                        isActive && "lg:translate-x-1",
                      )}
                    >
                      {project.title}
                      <span
                        aria-hidden
                        className={cn(
                          "ml-2 hidden tracking-normal transition-opacity duration-300 lg:inline",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      >
                        →
                      </span>
                    </span>
                    <m.span
                      className="relative mt-4 block aspect-[16/7] overflow-hidden bg-well lg:order-first lg:col-span-5 lg:mt-0 lg:aspect-[11/2] lg:max-h-[calc((100dvh-24rem)/4)]"
                      initial={stripHidden}
                      animate={stripShown(index)}
                    >
                      <Image
                        src={project.menuImage}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 38vw, (min-width: 768px) 45vw, 92vw"
                        priority={index < 2}
                        className={cn(
                          "object-cover transition-[opacity,filter,scale] duration-500 ease-out-soft lg:grayscale",
                          isActive && "lg:scale-[1.02] lg:grayscale-0",
                          isDimmed && "lg:opacity-30",
                        )}
                      />
                    </m.span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </m.section>

        {/* Mobile contact links */}
        <m.ul
          className="caps col-span-4 flex flex-col border-t border-line pt-3 lg:hidden"
          variants={reveal}
          custom={3}
          initial="hidden"
          animate="shown"
          exit="exit"
        >
          {site.resume && (
            <li>
              <ArrowLink href={site.resume} arrow="↓" className="py-3.5">
                Download CV
              </ArrowLink>
            </li>
          )}
          {socialLinks.map((link) => (
            <li key={link.label}>
              <ArrowLink href={link.href} className="py-3.5">
                {link.label}
              </ArrowLink>
            </li>
          ))}
        </m.ul>

        {/* Metadata */}
        <m.p
          className={cn(eyebrow, "col-span-2 self-end text-muted lg:col-span-4 lg:row-start-3")}
          variants={reveal}
          custom={4}
          initial="hidden"
          animate="shown"
          exit="exit"
        >
          <LocalTime /> / {site.utcOffset}
        </m.p>
        <m.p
          className={cn(
            eyebrow,
            "col-span-2 self-end text-right text-muted md:col-span-6 lg:col-span-4 lg:col-start-9 lg:row-start-3",
          )}
          variants={reveal}
          custom={4}
          initial="hidden"
          animate="shown"
          exit="exit"
        >
          Full Stack / {site.role}
        </m.p>
      </div>
    </m.div>
  );
}
