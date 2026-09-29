import { ProjectActions, ProjectVisual } from "@/components/work/ProjectParts";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

// Each entry sits differently on the 12 column grid so the gallery reads as a sequence, not a list of cards.
const compositions = [
  { text: "lg:col-span-3", image: "lg:col-span-8 lg:col-start-5", sizes: "(min-width: 1024px) 62vw, 100vw" },
  { text: "lg:col-span-3 lg:col-start-10", image: "lg:col-span-7 lg:col-start-1", sizes: "(min-width: 1024px) 55vw, 100vw" },
  { text: "lg:col-span-3", image: "lg:col-span-6 lg:col-start-6", sizes: "(min-width: 1024px) 47vw, 100vw" },
  { text: "lg:col-span-3 lg:col-start-10", image: "lg:col-span-7 lg:col-start-2", sizes: "(min-width: 1024px) 55vw, 100vw" },
];

type ProjectEntryProps = {
  project: Project;
  index: number;
  embeddable: boolean;
  priority?: boolean;
};

export function ProjectEntry({ project, index, embeddable, priority }: ProjectEntryProps) {
  const layout = compositions[index % compositions.length];

  return (
    <article className="layout-grid gap-y-6 border-t border-line pt-4 lg:grid-rows-[auto_1fr]">
      <header className={cn("col-span-4 md:col-span-6 lg:row-start-1", layout.text)}>
        <p className="label flex justify-between text-muted">
          <span>{project.number}</span>
          <span>{project.year ?? "—"}</span>
        </p>
        <h3 className="mt-6 text-[clamp(2rem,3.4vw,3rem)] leading-[0.95] font-semibold tracking-[-0.035em] uppercase lg:mt-10">
          {project.title}
        </h3>
        <p className="mt-3 text-[0.9375rem] text-muted">{project.category}</p>
        <p className="mt-5 max-w-[36ch] leading-normal">{project.summary}</p>
      </header>

      <div className={cn("col-span-4 self-start md:col-span-8 lg:row-span-2 lg:row-start-1", layout.image)}>
        <ProjectVisual project={project} sizes={layout.sizes} priority={priority} />
      </div>

      <footer className={cn("col-span-4 flex flex-col gap-5 md:col-span-8 lg:row-start-2 lg:justify-end", layout.text)}>
        <p className="label text-muted">{project.technologies.join(" · ")}</p>
        <ProjectActions project={project} embeddable={embeddable} />
      </footer>
    </article>
  );
}
