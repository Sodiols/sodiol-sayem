import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/ui/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectEntry } from "@/components/work/ProjectEntry";
import { WorkViews } from "@/components/work/WorkViews";
import { projectCount, projects } from "@/data/projects";
import { embeddableBySlug } from "@/lib/embed";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Work",
  description:
    "Selected work by Sodiol Sayem: commerce platforms, websites and web applications built with Next.js, Supabase and TypeScript.",
  path: "/work",
});

function ProjectIndex() {
  return (
    <table className="mt-6 w-full border-collapse text-left">
      <caption className="sr-only">All projects</caption>
      <thead className="label text-muted">
        <tr className="border-b border-line">
          <th scope="col" className="w-14 py-3 font-normal md:w-24">No.</th>
          <th scope="col" className="py-3 font-normal">Project</th>
          <th scope="col" className="hidden py-3 font-normal md:table-cell">Type</th>
          <th scope="col" className="hidden py-3 font-normal lg:table-cell">Technology</th>
          <th scope="col" className="py-3 text-right font-normal">Year</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <tr key={project.slug} className="group border-b border-line">
            <td className="label py-5 align-middle text-muted">{project.number}</td>
            <td className="py-5 align-middle">
              <Link
                href={`/work/${project.slug}`}
                className="hit flex items-center gap-4 text-lg font-medium tracking-[-0.01em] uppercase md:text-2xl"
              >
                <span className="relative hidden h-10 w-16 shrink-0 overflow-hidden bg-well sm:block">
                  <Image
                    src={project.heroImage.src}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover object-top grayscale transition-[filter] duration-200 group-hover:grayscale-0"
                  />
                </span>
                <span className="transition-transform duration-200 ease-out-soft group-hover:translate-x-1">
                  {project.title}
                </span>
                <span aria-hidden className="arrow opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  →
                </span>
              </Link>
            </td>
            <td className="hidden py-5 align-middle text-muted md:table-cell">{project.category}</td>
            <td className="label hidden py-5 align-middle lg:table-cell">{project.technologies.join(" · ")}</td>
            <td className="label py-5 text-right align-middle">{project.year ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function WorkPage() {
  const embeddable = await embeddableBySlug(projects);

  const gallery = (
    <div className="mt-16 flex flex-col gap-24 md:mt-20 md:gap-32">
      <h2 className="sr-only">Projects</h2>
      {projects.map((project, index) => (
        <Reveal key={project.slug} y={20}>
          <ProjectEntry project={project} index={index} embeddable={embeddable[project.slug]} priority={index === 0} />
        </Reveal>
      ))}
    </div>
  );

  return (
    <>
      <PageIntro label="Work" title={["Work"]} aside={<p>Commerce · Websites · Applications</p>}>
        <p>Selected digital products, websites and experiments.</p>
      </PageIntro>

      <section aria-label="Projects" className="page-x pb-32 md:pb-48">
        <WorkViews gallery={gallery} index={<ProjectIndex />} count={projectCount} />
      </section>
    </>
  );
}
