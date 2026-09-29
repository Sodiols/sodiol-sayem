import { CapabilityExplorer } from "@/components/home/CapabilityExplorer";
import { capabilities, toolGroups } from "@/data/technologies";
import { cn } from "@/lib/utils";

type CapabilitiesProps = {
  /** "compact" drops the large heading for pages that already introduce the subject. */
  variant?: "full" | "compact";
};

export function Capabilities({ variant = "full" }: CapabilitiesProps) {
  const compact = variant === "compact";
  const idPrefix = compact ? "about-capabilities" : "capabilities";

  return (
    <section aria-labelledby={`${idPrefix}-heading`} className="page-x pb-32 md:pb-48">
      <div className="layout-grid gap-y-8 border-t border-line pt-6">
        <p className="label col-span-4 text-muted md:col-span-2 lg:col-span-3">What I do</p>
        <h2
          id={`${idPrefix}-heading`}
          className={cn(
            "col-span-4 md:col-span-6 lg:col-span-9",
            compact ? "text-[clamp(1.75rem,2.8vw,2.5rem)] leading-[1.05] font-medium tracking-[-0.03em]" : "display text-[clamp(2.5rem,5.4vw,5.5rem)]",
          )}
        >
          {compact ? "Capabilities" : "Built end to end."}
        </h2>
      </div>

      <div className={compact ? "mt-10" : "mt-14 md:mt-20"}>
        <CapabilityExplorer items={capabilities} idPrefix={idPrefix} />
      </div>

      <div className="layout-grid mt-24 gap-y-10 border-t border-line pt-6 md:mt-32">
        <h3 className="label col-span-4 text-muted md:col-span-8 lg:col-span-3">Tools I work with</h3>
        <div className="col-span-4 grid grid-cols-2 gap-x-[var(--gutter)] gap-y-10 md:col-span-8 md:grid-cols-4 lg:col-span-9">
          {toolGroups.map((group) => (
            <div key={group.name}>
              <p className="label text-muted">{group.name}</p>
              <ul className="mt-4 space-y-1.5">
                {group.tools.map((tool) => (
                  <li key={tool} className="text-[clamp(1.0625rem,1.5vw,1.375rem)] font-medium tracking-[-0.02em]">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
