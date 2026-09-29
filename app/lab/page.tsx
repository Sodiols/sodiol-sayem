import type { ComponentType } from "react";
import { DepthStudy } from "@/components/lab/DepthStudy";
import { MessageStudy } from "@/components/lab/MessageStudy";
import { TypeStudy } from "@/components/lab/TypeStudy";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { PageIntro } from "@/components/ui/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { labEntries, type LabDemo } from "@/data/lab";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Lab",
  description: "Small working experiments by Sodiol Sayem: variable type, interface depth and interaction states.",
  path: "/lab",
});

const demos: Record<LabDemo, ComponentType> = {
  type: TypeStudy,
  depth: DepthStudy,
  messages: MessageStudy,
};

export default function LabPage() {
  return (
    <>
      <PageIntro label={`Lab — ${String(labEntries.length).padStart(2, "0")} experiments`} title={["Lab"]}>
        <p>Experiments, ideas and things I’m building for the web. Each one below runs right here.</p>
      </PageIntro>

      <section aria-label="Lab experiments" className="page-x pb-24 md:pb-32">
        <ol className="flex flex-col gap-24 md:gap-32">
          {labEntries.map((entry) => {
            const Demo = demos[entry.demo];
            return (
              <li key={entry.number}>
                <Reveal y={18}>
                  <article className="layout-grid gap-y-8 border-t border-ink pt-5">
                    <div className="col-span-4 md:col-span-8 lg:col-span-4">
                      <p className="label flex justify-between text-muted">
                        <span>{entry.number}</span>
                        <span>{entry.year}</span>
                      </p>
                      <h2 className="mt-6 text-[clamp(1.75rem,2.8vw,2.5rem)] leading-[1.05] font-medium tracking-[-0.03em]">
                        {entry.title}
                      </h2>
                      <p className="label mt-3 text-muted">
                        {entry.kind} · {entry.status}
                      </p>
                      <p className="mt-6 max-w-[44ch] leading-normal">{entry.description}</p>
                      <p className="mt-4 flex gap-2 text-[0.875rem] text-muted">
                        <span aria-hidden>↳</span>
                        {entry.instructions}
                      </p>
                    </div>
                    <div className="col-span-4 h-[24rem] md:col-span-8 md:h-[26rem] lg:col-span-7 lg:col-start-6">
                      <Demo />
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="page-x pb-32 md:pb-48">
        <div className="layout-grid gap-y-6 border-t border-line pt-6">
          <p className="label col-span-4 text-muted md:col-span-2 lg:col-span-3">More</p>
          <div className="col-span-4 md:col-span-6 lg:col-span-9">
            <p className="max-w-[46ch] text-lg leading-normal">
              New studies are added here once they work. Code and other projects live on GitHub.
            </p>
            <ArrowLink href={site.github} className="caps mt-6">
              GitHub
            </ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
