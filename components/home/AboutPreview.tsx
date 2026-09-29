import type { CSSProperties } from "react";
import { StackModel } from "@/components/home/StackModel";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { InView } from "@/components/ui/InView";
import { about, stackLayers } from "@/data/about";

export function AboutPreview() {
  return (
    <section aria-labelledby="about-heading" className="page-x pb-32 md:pb-48">
      <div className="layout-grid gap-y-14 border-t border-line pt-6">
        <InView className="col-span-4 md:col-span-8 lg:col-span-6">
          <p className="label text-muted">About</p>
          <h2 id="about-heading" className="display mt-8 text-[clamp(2.5rem,5.4vw,5.5rem)] md:mt-12">
            <span className="unmask">
              <span>Thoughtful interfaces.</span>
            </span>
            <span className="unmask">
              <span style={{ "--delay": "90ms" } as CSSProperties}>Solid foundations.</span>
            </span>
          </h2>
          <div className="rise-in mt-10 max-w-[46ch] space-y-4 leading-normal text-muted md:mt-14" style={{ "--delay": "200ms" } as CSSProperties}>
            {about.biography.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ArrowLink href="/about" className="caps mt-8">
            More about me
          </ArrowLink>
        </InView>

        <div className="col-span-4 md:col-span-6 md:col-start-2 lg:col-span-6 lg:col-start-7 lg:self-center">
          <StackModel />
          <ol className="mt-6 grid grid-cols-3 gap-x-[var(--gutter)] border-t border-line pt-4">
            {stackLayers.map((layer, index) => (
              <li key={layer.name}>
                <span className="label text-muted">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-2 text-[0.9375rem] font-medium">{layer.name}</p>
                <p className="mt-1 text-[0.8125rem] leading-snug text-muted">{layer.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
