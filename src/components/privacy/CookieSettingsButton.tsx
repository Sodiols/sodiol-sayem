"use client";
export function CookieSettingsButton() {
  return <button type="button" data-cookie-settings onClick={()=>window.dispatchEvent(new Event("sodiol:cookie-settings"))}>Cookie settings</button>;
}
