"use client";

import { pages, site, type PagePath } from "./site-config";
import { readConsent } from "./consent";

const configuredId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
export const measurementId = configuredId && /^G-[A-Z0-9]{6,20}$/.test(configuredId) ? configuredId : undefined;
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
let initialized = false;
let enabled = false;
let previousPath = "";
const denied = { analytics_storage:"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied" };

function removeAnalyticsCookies() {
  const domains = location.hostname.split(".").map((_, index, parts) => parts.slice(index).join("."));
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    const expiry = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    document.cookie = expiry;
    domains.forEach(domain => { document.cookie = `${expiry}; Domain=${domain}`; document.cookie = `${expiry}; Domain=.${domain}`; });
  }
}
export function setAnalyticsConsent(accepted: boolean) {
  const wasEnabled = enabled;
  enabled = accepted && Boolean(measurementId);
  if (!measurementId) return;
  const target = window as AnalyticsWindow;
  Object.assign(target, { [`ga-disable-${measurementId}`]: !enabled });
  if (!enabled) {
    if (initialized) target.gtag?.("consent", "update", denied);
    previousPath = "";
    removeAnalyticsCookies();
    return;
  }
  if (!initialized) {
    target.dataLayer = target.dataLayer || [];
    target.gtag = function () {
      // Google's command queue expects its documented Arguments-object wrapper.
      // eslint-disable-next-line prefer-rest-params
      target.dataLayer!.push(arguments);
    };
    target.gtag("consent", "default", denied);
    target.gtag("js", new Date());
    initialized = true;
  }
  if (!wasEnabled) target.gtag!("consent", "update", { ...denied, analytics_storage:"granted" });
  target.gtag!("config", measurementId, {
    send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:false,
    cookie_expires:30 * 86400, cookie_update:false,
    page_location:new URL(location.pathname in pages ? location.pathname : "/", site.origin).href,
    page_referrer:"",
  });
}
function allowed() { return enabled && measurementId && readConsent() === "accepted"; }
export function trackPage(path: string) {
  if (!allowed() || !(path in pages) || previousPath === path) return;
  previousPath = path;
  (window as AnalyticsWindow).gtag?.("event", "page_view", {
    page_location:new URL(path, site.origin).href, page_title:pages[path as PagePath].title, page_referrer:"",
  });
}
type Event = "project_view" | "live_site_click" | "case_study_open" | "contact_form_success" | "contact_cta_click";
export function trackEvent(event: Event, project?: string) {
  if (!allowed()) return;
  const known = ["husnalogy","tara","epic-elites","prichat"];
  (window as AnalyticsWindow).gtag?.("event", event, {
    ...(project && known.includes(project) ? { project_id:project } : {}),
    page_location:new URL(location.pathname in pages ? location.pathname : "/", site.origin).href,
    page_referrer:"",
  });
}
