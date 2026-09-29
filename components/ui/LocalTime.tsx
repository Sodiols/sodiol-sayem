"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/data/site";

const withSeconds = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const withoutSeconds = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timeZone,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
}

export function LocalTime({ seconds = true }: { seconds?: boolean }) {
  const format = seconds ? withSeconds : withoutSeconds;
  const time = useSyncExternalStore(
    subscribe,
    () => format.format(Date.now()),
    () => null,
  );

  return (
    <time className="tabular-nums">
      {time ?? (seconds ? "--:--:--" : "--:--")}
    </time>
  );
}
