"use client";
import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { measurementId, setAnalyticsConsent, trackPage, trackEvent } from "@/lib/analytics";
import { readConsent, subscribeConsent, serverConsent } from "@/lib/consent";

export function Analytics() {
  const choice = useSyncExternalStore(subscribeConsent, readConsent, serverConsent);
  const path = usePathname();
  useEffect(() => { setAnalyticsConsent(choice === "accepted"); if (choice === "accepted") trackPage(path); }, [choice, path]);
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest?.('a[href="/#contact"],a[href="#contact"]');
      if (anchor) trackEvent("contact_cta_click");
    };
    document.addEventListener("click",click);
    return () => document.removeEventListener("click",click);
  }, []);
  if (!measurementId || choice !== "accepted") return null;
  // Basic Consent Mode: this external script is never mounted before opt-in.
  return <Script id="sodiol-google-tag" src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />;
}
