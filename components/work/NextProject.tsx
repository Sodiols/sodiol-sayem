import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

export function NextProject({ project }: { project: Project }) {
  const { heroImage } = project;
  return (
    <nav aria-label="Next project" className="page-x pb-24 md:pb-32">
      <Link href={`/work/${project.slug}`} className="group layout-grid gap-y-8 border-t border-ink pt-5">
        <p className="label col-span-4 flex justify-between md:col-span-8 lg:col-span-3 lg:flex-col lg:justify-start lg:gap-2">
          <span>Next project</span>
          <span className="text-muted">{project.number}</span>
        </p>
        <div className="col-span-4 md:col-span-8 lg:col-span-9">
          <p className="display text-[clamp(2.75rem,8vw,8.5rem)]">
            <span className="inline-block transition-transform duration-500 ease-out-soft group-hover:translate-x-2">
              {project.title}
            </span>{" "}
            <span aria-hidden className="arrow font-normal">
              →
            </span>
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-9 md:gap-x-[var(--gutter)]">
            <div
              className="relative overflow-hidden bg-well md:col-span-5"
              style={{ aspectRatio: `${heroImage.width} / ${heroImage.height}` }}
            >
              <Image
                src={heroImage.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 38vw, (min-width: 768px) 55vw, 100vw"
                className="object-cover object-top transition-transform duration-700 ease-out-soft group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col justify-end md:col-span-4">
              <p className="text-[0.9375rem] text-muted">{project.category}</p>
              <p className="mt-3 max-w-[34ch] text-lg leading-normal">{project.summary}</p>
              <span className="caps mt-6 inline-flex gap-[0.4em]">
                <span className="link-line">Read the case study</span>
                <span aria-hidden className="arrow">
                  →
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </nav>
  );
}
