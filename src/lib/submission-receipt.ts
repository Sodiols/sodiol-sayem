"use client";
const key = "sodiol:message-received";
let sessionTimestamp = 0;
export function markSubmissionReceived() {
  sessionTimestamp=Date.now();
  try { sessionStorage.setItem(key,String(sessionTimestamp)); } catch { /* Memory fallback for this visit. */ }
}
export function readSubmissionReceipt() {
  let timestamp=sessionTimestamp;
  try { timestamp=Number(sessionStorage.getItem(key)) || timestamp; } catch { /* No personal data is stored. */ }
  return timestamp>0 && timestamp<=Date.now() && Date.now()-timestamp<300000;
}
export function subscribeReceipt(callback:()=>void) {
  let timestamp=sessionTimestamp;
  try { timestamp=Number(sessionStorage.getItem(key)) || timestamp; } catch { /* Current memory only. */ }
  const timer=setTimeout(callback,Math.max(0,timestamp+300000-Date.now()));
  return ()=>clearTimeout(timer);
}
