import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { InView } from "@/components/ui/InView";
import { PageIntro } from "@/components/ui/PageIntro";
import { experience } from "@/data/experience";
import { getProject, type Project } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Experience",
  description:
    "Experience and project history of Sodiol Sayem, independent full stack web developer in Bangladesh.",
  path: "/experience",
});

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export default function ExperiencePage() {
  return (
    <>
      <PageIntro label="Experience" title={["Experience"]}>
        <p>Where I’ve worked and what I’ve built there.</p>
      </PageIntro>

      <section aria-label="Timeline" className="page-x pb-32 md:pb-48">
        <ol>
          {experience.map((entry) => {
            const related = (entry.projects ?? []).map(getProject).filter((project): project is Project => !!project);
            return (
              <li key={`${entry.period}-${entry.title}`}>
                <InView className="layout-grid gap-y-8">
                  {/* Rail: a dot for the entry and a line that runs down through its projects */}
                  <div aria-hidden className="relative col-span-1 hidden md:block lg:col-span-1">
                    <span className="absolute top-1.5 left-0 size-2.5 rounded-full bg-ink" />
                    <span className="draw-y absolute top-5 bottom-0 left-[4.5px] w-px bg-ink/40" style={delay(150)} />
                  </div>

                  <div className="col-span-4 md:col-span-7 lg:col-span-11">
                    <div className="grid gap-y-6 lg:grid-cols-11 lg:gap-x-[var(--gutter)]">
                      <p className="label lg:col-span-3">{entry.period}</p>
                      <div className="lg:col-span-4">
                        <h2 className="text-[clamp(1.75rem,3vw,2.75rem)] leading-none font-semibold tracking-[-0.03em] uppercase">
                          {entry.title}
                        </h2>
                        <p className="mt-2 text-muted">{entry.place}</p>
                      </div>
                      <p className="max-w-[46ch] text-lg leading-normal lg:col-span-4">{entry.summary}</p>
                    </div>

                    {related.length > 0 && (
                      <div className="mt-14 lg:ml-[calc((100%+var(--gutter))*3/11)]">
                        <h3 className="label text-muted">Projects in this period</h3>
                        <ul className="mt-5 border-t border-line">
                          {related.map((project, index) => (
                            <li key={project.slug} className="rise-in border-b border-line" style={delay(250 + index * 80)}>
                              <Link
                                href={`/work/${project.slug}`}
                                className="group grid grid-cols-[4.5rem_1fr_4.5rem] items-center gap-x-4 py-4 md:grid-cols-[6rem_1fr_minmax(0,1fr)_4.5rem]"
                              >
                                <span
                                  className="relative w-full overflow-hidden bg-well"
                                  style={{ aspectRatio: `${project.heroImage.width} / ${project.heroImage.height}` }}
                                >
                                  <Image
                                    src={project.heroImage.src}
                                    alt=""
                                    fill
                                    sizes="96px"
                                    className="object-cover object-top grayscale transition-[filter] duration-200 group-hover:grayscale-0"
                                  />
                                </span>
                                <span>
                                  <span className="block text-xl font-medium tracking-[-0.02em] transition-transform duration-200 ease-out-soft group-hover:translate-x-1">
                                    {project.title}
                                  </span>
                                  <span className="mt-0.5 block text-[0.875rem] text-muted md:hidden">{project.category}</span>
                                </span>
                                <span className="hidden text-muted md:block">
                                  {project.role} · {project.category}
                                </span>
                                <span className="label flex items-center justify-end gap-3">
                                  {project.year ?? "—"}
                                  <span aria-hidden className="arrow">
                                    →
                                  </span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </InView>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
