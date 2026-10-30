"use client";

export const CONSENT_KEY = "sodiol:consent:v1";
export const CONSENT_EVENT = "sodiol:consent-change";
export type ConsentChoice = "unknown" | "accepted" | "rejected";
let sessionChoice: ConsentChoice = "unknown";
export function readConsent(): ConsentChoice {
  if (typeof window === "undefined") return "unknown";
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return sessionChoice;
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || !value) return "unknown";
    const data = value as Record<string, unknown>;
    return data.version === 1 && typeof data.analytics === "boolean" && typeof data.updatedAt === "number" &&
      data.updatedAt <= Date.now() && Date.now() - data.updatedAt < 180 * 86400000
      ? data.analytics ? "accepted" : "rejected" : "unknown";
  } catch { return sessionChoice; }
}
export function saveConsent(analytics: boolean) {
  sessionChoice = analytics ? "accepted" : "rejected";
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ version:1, analytics, updatedAt:Date.now() })); } catch { /* Current-session choice still works without storage. */ }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
export function subscribeConsent(callback: () => void) {
  const storage = (event: StorageEvent) => { if (event.key === CONSENT_KEY || event.key === null) { sessionChoice = "unknown"; callback(); } };
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener("storage", storage);
  return () => { window.removeEventListener(CONSENT_EVENT, callback); window.removeEventListener("storage", storage); };
}
export const serverConsent = (): ConsentChoice => "unknown";
