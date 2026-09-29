import { WorkProgress } from "@/components/home/WorkProgress";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Drift } from "@/components/ui/Drift";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectActions, ProjectVisual } from "@/components/work/ProjectParts";
import { projects, type Project } from "@/data/projects";
import { embeddableBySlug } from "@/lib/embed";
import { cn } from "@/lib/utils";

// Placement on the project field: 8 columns on tablets, 9 beside the pinned introduction on desktop.
// The first project is the featured composition; the rest vary in scale and alignment.
const placements = [
  { column: "md:col-span-8 lg:col-span-9", sizes: "(min-width: 1024px) 50vw, 100vw", drift: 24 },
  { column: "md:col-span-5 lg:col-span-5", sizes: "(min-width: 1024px) 38vw, (min-width: 768px) 62vw, 100vw", drift: -32 },
  {
    column: "md:col-span-5 md:col-start-4 lg:col-span-4 lg:col-start-6 lg:mt-44",
    sizes: "(min-width: 1024px) 30vw, (min-width: 768px) 62vw, 100vw",
    drift: 36,
  },
  {
    column: "md:col-span-6 md:col-start-2 lg:col-span-6 lg:col-start-3",
    sizes: "(min-width: 1024px) 45vw, (min-width: 768px) 75vw, 100vw",
    drift: -20,
  },
];

function ProjectMeta({ project, featured }: { project: Project; featured?: boolean }) {
  return (
    <>
      <p className="label flex justify-between text-muted">
        <span>{project.number}</span>
        <span>{project.year ?? "—"}</span>
      </p>
      <h3
        className={cn(
          "font-semibold tracking-[-0.03em] uppercase",
          featured ? "mt-5 text-[clamp(2rem,3.2vw,3.25rem)] leading-[0.92]" : "mt-4 text-[clamp(1.5rem,2.2vw,2rem)] leading-none",
        )}
      >
        {project.title}
      </h3>
      <p className="mt-2 text-[0.9375rem] text-muted">{project.category}</p>
      <p className={cn("leading-normal", featured ? "mt-6 max-w-[30ch] text-lg" : "mt-4 max-w-[40ch]")}>
        {project.summary}
      </p>
      <p className="label mt-4 text-muted">{project.technologies.join(" · ")}</p>
    </>
  );
}

export async function SelectedWork() {
  // Resolved at build/revalidate time (cached for a day), never in the visitor's browser.
  const embeddable = await embeddableBySlug(projects);
  const [featured, ...rest] = projects;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="page-x layout-grid scroll-mt-8 gap-y-16 pt-24 pb-32 md:pt-32 lg:pb-48"
    >
      {/* Introduction, pinned while the projects scroll past on desktop */}
      <div className="col-span-4 md:col-span-8 lg:col-span-3 lg:border-r lg:border-line lg:pr-[var(--gutter)]">
        <div className="flex flex-col gap-10 lg:sticky lg:top-0 lg:h-[100svh] lg:justify-between lg:pt-28 lg:pb-12">
          <div>
            <p className="label text-muted">Selected Work</p>
            <h2 id="work-heading" className="display mt-6 text-[clamp(2.75rem,3.9vw,4.5rem)]">
              Projects
              <br />
              I’ve built.
            </h2>
            <div className="mt-8">
              <WorkProgress items={projects.map(({ number, title }) => ({ number, title }))} />
            </div>
          </div>
          <div className="max-w-[30ch]">
            <p className="leading-normal text-muted">
              Websites and digital products designed and developed for real businesses.
            </p>
            <ArrowLink href="/work" className="caps mt-6">
              All work
            </ArrowLink>
          </div>
        </div>
      </div>

      {/* Project field */}
      <ol className="col-span-4 grid grid-cols-1 gap-y-20 md:col-span-8 md:grid-cols-8 md:gap-x-[var(--gutter)] md:gap-y-28 lg:col-span-9 lg:grid-cols-9 lg:pt-28">
        <li data-work-item={0} className={placements[0].column}>
          <Drift distance={placements[0].drift}>
            <Reveal y={24}>
              <article className="grid gap-y-6 md:grid-cols-8 md:gap-x-[var(--gutter)] lg:grid-cols-9 lg:items-end">
                <div className="md:col-span-8 lg:col-span-6">
                  <ProjectVisual project={featured} sizes={placements[0].sizes} />
                </div>
                <div className="md:col-span-6 lg:col-span-3 lg:pb-2">
                  <ProjectMeta project={featured} featured />
                  <div className="mt-8 border-t border-line pt-4">
                    <ProjectActions project={featured} embeddable={embeddable[featured.slug]} />
                  </div>
                </div>
              </article>
            </Reveal>
          </Drift>
        </li>

        {rest.map((project, index) => {
          const place = placements[(index + 1) % placements.length];
          return (
            <li key={project.slug} data-work-item={index + 1} className={place.column}>
              <Drift distance={place.drift}>
                <Reveal y={24} delay={(index % 2) * 0.08}>
                  <article className="flex flex-col">
                    <ProjectVisual project={project} sizes={place.sizes} />
                    <div className="mt-5">
                      <ProjectMeta project={project} />
                      <div className="mt-6">
                        <ProjectActions project={project} embeddable={embeddable[project.slug]} />
                      </div>
                    </div>
                  </article>
                </Reveal>
              </Drift>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
