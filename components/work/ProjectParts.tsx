import Image from "next/image";
import Link from "next/link";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Tilt } from "@/components/ui/Tilt";
import { LivePreview } from "@/components/work/LivePreview";
import { ViewCursor } from "@/components/work/ViewCursor";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

// Shared by the homepage showcase and the Work gallery: the project image (opens the case study)
// and the pair of actions (case study, plus the live site when there is one).

export function ProjectVisual({ project, sizes, priority }: { project: Project; sizes: string; priority?: boolean }) {
  const { heroImage } = project;
  return (
    <Tilt>
      <ViewCursor
        label="Case study →"
        className="overflow-hidden bg-well lg:shadow-[0_30px_60px_-36px_rgba(17,17,17,0.4)]"
        style={{ aspectRatio: `${heroImage.width} / ${heroImage.height}` }}
      >
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-top transition-[scale,filter] duration-500 ease-out-soft group-hover/cursor:scale-[1.015] group-hover/cursor:brightness-[0.97]"
        />
        {/* Focus ring drawn inside: the visual clips its overflow, so an outside outline would be hidden. */}
        <Link
          href={`/work/${project.slug}`}
          aria-label={`${project.title} case study`}
          className="absolute inset-0 z-10 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ink focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
        >
          <span aria-hidden className="label absolute right-3 bottom-3 bg-paper px-2 py-1 text-ink pointer-fine:hidden">
            View case study →
          </span>
        </Link>
      </ViewCursor>
    </Tilt>
  );
}

export function ProjectActions({ project, embeddable }: { project: Project; embeddable: boolean }) {
  return (
    <div className="caps flex flex-wrap gap-x-8 gap-y-3">
      <ArrowLink href={`/work/${project.slug}`}>Case study</ArrowLink>
      {project.url && (
        <LivePreview
          title={project.title}
          url={project.url}
          embeddable={embeddable}
          className="caps group hit inline-flex items-baseline gap-[0.4em] text-muted transition-colors duration-200 hover:text-ink"
        >
          <span className="link-line">{embeddable ? "Preview live site" : "Visit live site"}</span>
          <span aria-hidden className={cn("arrow", !embeddable && "arrow-up")}>
            {embeddable ? "→" : "↗"}
          </span>
          <span className="sr-only">
            {embeddable ? ` of ${project.title}` : `: ${project.title}, opens in a new tab`}
          </span>
        </LivePreview>
      )}
    </div>
  );
}
