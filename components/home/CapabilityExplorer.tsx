"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { CapabilityDemo } from "@/components/home/CapabilityDemos";
import type { Capability } from "@/data/technologies";
import { cn } from "@/lib/utils";

const number = (index: number) => String(index + 1).padStart(2, "0");

/**
 * Tabs on wide screens (list of services beside the selected demo), an accordion on small ones.
 * Only the selected demo is mounted, so the others cost nothing until they are chosen.
 */
export function CapabilityExplorer({ items, idPrefix }: { items: Capability[]; idPrefix: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = items[active];

  function onTabKey(event: KeyboardEvent) {
    const last = items.length - 1;
    const next =
      event.key === "ArrowDown" || event.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : event.key === "ArrowUp" || event.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <>
      {/* Wide screens: tabs */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
        <div role="tablist" aria-orientation="vertical" aria-label="Capabilities" className="col-span-5 flex flex-col" onKeyDown={onTabKey}>
          {items.map((item, index) => {
            const selected = index === active;
            return (
              <button
                key={item.id}
                ref={(element) => {
                  tabs.current[index] = element;
                }}
                type="button"
                role="tab"
                id={`${idPrefix}-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`${idPrefix}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                onPointerEnter={(event) => event.pointerType === "mouse" && setActive(index)}
                className={cn(
                  "group grid grid-cols-[3.5rem_1fr_auto] items-baseline border-b border-line py-4 text-left transition-colors duration-200 first:border-t",
                  selected ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                <span className="label">{number(index)}</span>
                <span className="text-[clamp(1.25rem,1.9vw,1.75rem)] font-medium tracking-[-0.02em]">{item.title}</span>
                <span
                  aria-hidden
                  className={cn("transition-[opacity,translate] duration-200", selected ? "opacity-100" : "-translate-x-1 opacity-0")}
                >
                  →
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${idPrefix}-panel`}
          aria-labelledby={`${idPrefix}-tab-${current.id}`}
          className="col-span-6 col-start-7 flex h-[31rem] flex-col"
        >
          <div key={current.id} className="swap-in flex h-full flex-col">
            <p className="max-w-[44ch] text-lg leading-normal">{current.detail}</p>
            <div className="mt-6 min-h-0 flex-1">
              <CapabilityDemo id={current.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Small screens: accordion */}
      <ul className="border-t border-line lg:hidden">
        {items.map((item, index) => {
          const expanded = open === index;
          return (
            <li key={item.id} className="border-b border-line">
              <h3>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`${idPrefix}-accordion-${item.id}`}
                  onClick={() => setOpen(expanded ? null : index)}
                  className="grid min-h-14 w-full grid-cols-[2.75rem_1fr_auto] items-baseline py-4 text-left"
                >
                  <span className="label text-muted">{number(index)}</span>
                  <span className="text-xl font-medium tracking-[-0.02em]">{item.title}</span>
                  <span aria-hidden className={cn("text-lg transition-transform duration-200", expanded && "rotate-45")}>
                    +
                  </span>
                </button>
              </h3>
              {expanded && (
                <div id={`${idPrefix}-accordion-${item.id}`} className="swap-in pb-6">
                  <p className="leading-normal text-muted">{item.detail}</p>
                  <div className="mt-5 h-[19rem]">
                    <CapabilityDemo id={item.id} />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
