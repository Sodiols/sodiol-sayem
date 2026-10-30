"use client";

import { useCallback, useLayoutEffect, useRef, type KeyboardEvent, type MouseEvent } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { navigationLinks, socialProfiles } from "@/data/navigation";
import { socialIcons } from "./socialIcons";
import styles from "./Navbar.module.css";

type Props = {
  open: boolean;
  onRequestClose: () => void;
  onNavigate: (href: string) => void;
  onClosed: () => void;
};
type ScrollLock = { html: string; body: string; padding: string; scroll: number };

export function NavigationOverlay({ open, onRequestClose, onNavigate, onClosed }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const socials = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const lock = useRef<ScrollLock | null>(null);
  const intent = useRef(open);

  const releaseScroll = useCallback(() => {
    const saved = lock.current;
    if (!saved) return;
    document.documentElement.style.overflow = saved.html;
    document.body.style.overflow = saved.body;
    document.body.style.paddingRight = saved.padding;
    lock.current = null;
    if (window.scrollY !== saved.scroll) window.scrollTo({ top: saved.scroll, behavior: "instant" });
  }, []);

  useLayoutEffect(() => {
    const element = dialog.current!;
    const markOpen = () => {
      element.dataset.state = "open";
      navigation.current!.inert = false;
      socials.current!.inert = false;
    };
    const finishClose = () => {
      element.dataset.state = "closed";
      if (element.open) element.close();
      releaseScroll();
      onClosed();
    };
    const context = gsap.context(() => {
      // Clear the pixel translation parsed from the SSR percentage transform;
      // otherwise it would be added to GSAP's independent yPercent channel.
      gsap.set(`.${styles.panel}`, { y: 0, yPercent: 101 });
      gsap.set(`.${styles.revealLine}`, { y: 0, yPercent: 112 });
      gsap.set(`.${styles.menuBrand}`, { opacity: 0, y: 5 });
      gsap.set(`.${styles.socialIcon}`, { opacity: 0, y: 10 });
      timeline.current = gsap.timeline({ paused: true, onComplete: markOpen, onReverseComplete: finishClose })
        .to(`.${styles.panel}`, { yPercent: 0, duration: 0.82, ease: "power4.inOut" }, 0)
        .to(`.${styles.revealLine}`, { yPercent: 0, duration: 0.64, stagger: 0.09, ease: "power3.out" }, 0.38)
        .to(`.${styles.menuBrand}`, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.58)
        .to(`.${styles.socialIcon}`, { opacity: 1, y: 0, duration: 0.35, stagger: 0.045, ease: "power2.out" }, 0.83);
    }, element);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => {
      if (!reduced.matches || !element.open) return;
      timeline.current?.progress(intent.current ? 1 : 0, true).pause();
      if (intent.current) markOpen();
      else finishClose();
    };
    reduced.addEventListener("change", onMotionChange);
    return () => {
      reduced.removeEventListener("change", onMotionChange);
      context.revert();
      timeline.current = null;
      if (element.open) element.close();
      releaseScroll();
    };
  }, [onClosed, releaseScroll]);

  useLayoutEffect(() => {
    intent.current = open;
    const element = dialog.current!;
    const animation = timeline.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (open) {
      if (!element.open) {
        // Read before writing; no fixed body or pin reparenting that could reset GSAP scroll.
        const scrollbar = window.innerWidth - document.documentElement.clientWidth;
        const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
        lock.current = { html: document.documentElement.style.overflow, body: document.body.style.overflow,
          padding: document.body.style.paddingRight, scroll: window.scrollY };
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        if (scrollbar > 0) document.body.style.paddingRight = `${padding + scrollbar}px`;
        // Native top layer and modal inertness keep the transformed/pinned showcase beneath it.
        element.showModal();
        closeButton.current?.focus({ preventScroll: true });
      }
      element.dataset.state = "opening";
      navigation.current!.inert = true;
      socials.current!.inert = true;
      if (reduced) {
        animation.progress(1, true).pause();
        element.dataset.state = "open";
        navigation.current!.inert = false;
        socials.current!.inert = false;
      } else animation.timeScale(1).play();
    } else if (element.open) {
      element.dataset.state = "closing";
      navigation.current!.inert = true;
      socials.current!.inert = true;
      closeButton.current?.focus({ preventScroll: true });
      if (reduced || animation.progress() === 0) {
        animation.progress(0, true).pause();
        element.dataset.state = "closed";
        element.close();
        releaseScroll();
        onClosed();
      } else animation.timeScale(1.65).reverse();
    }
  }, [open, onClosed, releaseScroll]);

  function containFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab" || event.ctrlKey || event.metaKey || event.altKey) return;
    const focusable = Array.from(dialog.current!.querySelectorAll<HTMLElement>("a[href],button"))
      .filter(element => !element.closest("[inert]") && element.getClientRects().length > 0);
    if (!focusable.length) return;
    // Explicit traversal also covers Safari's default keyboard mode, which can
    // otherwise skip links despite their belonging to the active modal.
    const current = focusable.indexOf(document.activeElement as HTMLElement);
    const next = current < 0 ? (event.shiftKey ? focusable.length - 1 : 0)
      : (current + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
    event.preventDefault();
    focusable[next].focus({ preventScroll: true });
  }

  function navigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onNavigate(href);
  }

  return <dialog ref={dialog} id="navigation-overlay" className={styles.overlay} data-navigation-overlay
    aria-label="Main navigation" aria-modal="true" onKeyDown={containFocus}
    onCancel={event => { event.preventDefault(); onRequestClose(); }}>
    <button ref={closeButton} className={styles.closeButton} type="button" aria-label="Close navigation menu" onClick={onRequestClose}><span /><span /></button>
    <div className={styles.panel}>
      <span className={`${styles.wordmark} ${styles.menuBrand}`} translate="no">sodiol.</span>
      <nav ref={navigation} className={styles.menuLinks} aria-label="Primary navigation">
        {navigationLinks.map(link => <div className={styles.lineMask} key={link.href}>
          <span className={styles.revealLine}>
            <Link className={styles.menuLink} href={link.href} onClick={event => navigate(event, link.href)}>
              <span className={styles.labelWindow}><span className={styles.labelMain}>{link.label}</span><span className={styles.labelEcho} aria-hidden="true">{link.label}</span></span>
            </Link>
          </span>
        </div>)}
      </nav>
      <div ref={socials} className={styles.socials} role="group" aria-label="Social profiles">
        {Object.entries(socialProfiles).map(([key, profile]) => {
          const icon = socialIcons[key as keyof typeof socialIcons];
          const graphic = <svg viewBox={icon.viewBox} aria-hidden="true" focusable="false"><path d={icon.path} /></svg>;
          return profile.url
            ? <a key={key} className={styles.socialIcon} href={profile.url} aria-label={`${profile.label} (opens in a new tab)`} target="_blank" rel="noopener noreferrer">{graphic}</a>
            : <span key={key} className={styles.socialIcon} role="img" aria-label={`${profile.label} profile not configured`}>{graphic}</span>;
        })}
      </div>
    </div>
  </dialog>;
}
