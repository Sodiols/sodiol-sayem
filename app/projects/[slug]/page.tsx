import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { ProjectArt } from "@/components/projects/project-art";
import { getNextProject, getProject, projects } from "@/data/projects";
import { breadcrumbSchema, pageMetadata, projectSchema, webPageSchema } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return pageMetadata({
    title: `${project.name} Project | Sodiol Portfolio`,
    description: project.description,
    path: `/projects/${project.slug}/`,
    image: project.slug,
    type: "article",
  });
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const next = getNextProject(project.slug);
  const path = `/projects/${project.slug}/`;
  const title = `${project.name} Project | Sodiol Portfolio`;

  return (
    <main id="main">
      <JsonLd
        graph={[
          webPageSchema({ name: title, description: project.description, path, image: project.slug }),
          projectSchema(project),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work/" },
            { name: project.name, path },
          ]),
        ]}
      />
      <section className="case-top shell">
        <div className="case-back">
          <Link href="/work/">← ALL PROJECTS</Link>
        </div>
        <div className="case-header">
          <div>
            <span className="eyebrow">{project.type}</span>
            <h1>
              {project.title}
              <span className="title-period">.</span>
            </h1>
          </div>
          <span className="case-asterisk" aria-hidden="true">
            ✳
          </span>
        </div>
        <div className="case-lede">
          <p>{project.detail}</p>
        </div>
        <div className="case-art">
          <ProjectArt slug={project.slug} />
        </div>
      </section>

      <section className="case-content shell">
        <div className="case-facts">
          <div>
            <span>PROJECT</span>
            <strong>{project.name}</strong>
          </div>
          <div>
            <span>CATEGORY</span>
            <strong>{project.scope}</strong>
          </div>
          <div>
            <span>DISCIPLINE</span>
            <strong>{project.role}</strong>
          </div>
          <div>
            <span>STATUS</span>
            <strong>{project.status}</strong>
          </div>
        </div>
        <div className="case-about">
          <div>
            <h2 className="eyebrow">About the project</h2>
          </div>
          <div>
            <p>{project.overview}</p>
            <div className="case-actions">
              {project.url && !project.linkNote && (
                <a className="primary-button" href={project.url} target="_blank" rel="noopener noreferrer">
                  VISIT SITE <span aria-hidden="true">↗</span>
                </a>
              )}
              {project.url && project.linkNote && (
                <>
                  <a className="secondary-button" href={project.url} target="_blank" rel="noopener noreferrer">
                    VISIT SITE <span aria-hidden="true">↗</span>
                  </a>
                  <span className="link-note">{project.linkNote}</span>
                </>
              )}
              {!project.url && <span className="no-live">NO PUBLIC LINK FOR THIS DESKTOP APP</span>}
            </div>
          </div>
        </div>
        <div className="case-focus">
          <h2 className="eyebrow">Focus areas</h2>
          <div className="focus-tags">
            {project.focus.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="next-project">
        <Link href={`/projects/${next.slug}/`} className="shell next-inner">
          <span className="eyebrow">Next project</span>
          <strong>
            {next.title} <span aria-hidden="true">↗</span>
          </strong>
        </Link>
      </section>
    </main>
  );
}
