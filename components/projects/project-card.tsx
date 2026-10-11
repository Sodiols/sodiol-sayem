import Link from "next/link";
import { ProjectArt } from "@/components/projects/project-art";
import type { Project } from "@/data/projects";

export function ProjectCard({ project, hidden }: { project: Project; hidden?: boolean }) {
  const href = `/projects/${project.slug}/`;

  return (
    <article className="project-card" data-filter={project.kind} hidden={hidden}>
      <Link className="project-preview" href={href} aria-label={`Read about ${project.name}`}>
        <ProjectArt slug={project.slug} />
        <span className="preview-open" aria-hidden="true">
          ↗
        </span>
      </Link>
      <div className="project-meta">
        <div>
          <span className="eyebrow">{project.type}</span>
          <h3>
            <Link href={href}>{project.name}</Link>
          </h3>
          <p>{project.short}</p>
        </div>
        <Link className="circle-arrow" href={href} aria-label={`View ${project.name} case study`}>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
