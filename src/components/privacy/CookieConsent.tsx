"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { readConsent, saveConsent, serverConsent, subscribeConsent } from "@/lib/consent";
import { setAnalyticsConsent } from "@/lib/analytics";
import styles from "./CookieConsent.module.css";

export function CookieConsent() {
  const choice = useSyncExternalStore(subscribeConsent,readConsent,serverConsent);
  const dialog = useRef<HTMLDialogElement>(null);
  const checkbox = useRef<HTMLInputElement>(null);
  const [settings,setSettings] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const open = () => { opener.current = document.activeElement as HTMLElement; setSettings(true); };
    window.addEventListener("sodiol:cookie-settings",open);
    return () => window.removeEventListener("sodiol:cookie-settings",open);
  }, []);
  useEffect(() => {
    const element = dialog.current!;
    if (!settings) { if(element.open)element.close(); return; }
    if (checkbox.current) checkbox.current.checked = readConsent() === "accepted";
    element.showModal();
    const html = document.documentElement.style.overflow;
    const body = document.body.style.overflow;
    const padding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`;
    document.documentElement.style.overflow="hidden";
    document.body.style.overflow="hidden";
    return () => {
      if(element.open)element.close();
      document.documentElement.style.overflow=html;
      document.body.style.overflow=body;
      document.body.style.paddingRight=padding;
      if(opener.current?.isConnected)opener.current.focus({preventScroll:true});
      else document.querySelector<HTMLElement>("[data-cookie-preferences],footer [data-cookie-settings]")?.focus({preventScroll:true});
    };
  }, [settings]);
  function choose(analytics:boolean) {
    saveConsent(analytics);
    // Apply withdrawal immediately, before the React subscription commits.
    setAnalyticsConsent(analytics);
    setSettings(false);
  }
  return <div className={styles.root}>
    {choice === "unknown" && !settings && <aside className={styles.banner} aria-labelledby="cookie-heading" data-consent-banner>
      <h2 id="cookie-heading">A little about cookies.</h2>
      <p>Optional analytics measure site visits.</p>
      <div className={styles.actions}><button type="button" onClick={()=>choose(true)}>Accept analytics</button><button type="button" onClick={()=>choose(false)}>Reject optional</button></div>
      <div className={styles.links}>
        <button type="button" data-cookie-preferences onClick={event=>{opener.current=event.currentTarget;setSettings(true);}}>Preferences</button>
        <Link href="/privacy-policy">Privacy Policy</Link>
      </div>
    </aside>}
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="preferences-heading" onCancel={event=>{event.preventDefault();setSettings(false);}} onClose={()=>setSettings(false)}>
      <div className={styles.dialogTop}><h2 id="preferences-heading">Your cookie preferences.</h2><button type="button" onClick={()=>setSettings(false)} aria-label="Close cookie preferences">×</button></div>
      <p>Choose what works for you. Optional analytics starts only after you accept.</p>
      <label className={styles.category}><span><strong>Necessary</strong><small>Site functionality and remembering your preference.</small></span><input type="checkbox" checked disabled aria-label="Necessary storage, always active" readOnly /></label>
      <label className={styles.category}><span><strong>Analytics</strong><small>Optional Google Analytics measurement. Advertising remains disabled.</small></span><input ref={checkbox} type="checkbox" aria-label="Allow analytics" /></label>
      <div className={styles.actions}><button type="button" onClick={()=>choose(Boolean(checkbox.current?.checked))}>Save preferences</button><button type="button" onClick={()=>choose(false)}>Reject optional</button></div>
      <Link href="/privacy-policy" onClick={()=>setSettings(false)}>Privacy Policy</Link>
    </dialog>
  </div>;
}
