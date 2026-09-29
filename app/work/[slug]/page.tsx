import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { PageIntro } from "@/components/ui/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { ArchitectureDiagram } from "@/components/work/ArchitectureDiagram";
import { CaseStudyNav } from "@/components/work/CaseStudyNav";
import { NextProject } from "@/components/work/NextProject";
import { getNextProject, getProject, projects, type ProjectImage } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};

  return pageMetadata({
    title: project.title,
    description: `${project.title}: ${project.summary} Case study by Sodiol Sayem.`,
    path: `/work/${project.slug}`,
    image: project.heroImage.src,
  });
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "challenge", label: "Challenge" },
  { id: "approach", label: "Approach" },
  { id: "architecture", label: "Architecture" },
  { id: "features", label: "Features" },
  { id: "outcome", label: "Outcome" },
];

function Chapter({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24 border-t border-line pt-5 pb-24 md:pb-32">
      <h2 id={`${id}-heading`} className="label flex gap-4 text-muted">
        <span>{number}</span>
        {title}
      </h2>
      <div className="mt-8 md:mt-10">{children}</div>
    </section>
  );
}

function Screen({ image, sizes, className }: { image: ProjectImage; sizes: string; className?: string }) {
  return (
    <Reveal className={className}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        className="h-auto w-full border border-line"
      />
    </Reveal>
  );
}

const prose = "max-w-[58ch] text-lg leading-normal";

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const { caseStudy, gallery } = project;
  const bySrc = (src?: string) => gallery.find((image) => image.src === src);
  const challengeImage = bySrc(caseStudy.visuals?.challenge);
  const approachImage = bySrc(caseStudy.visuals?.approach);
  const featuresImage = bySrc(caseStudy.visuals?.features);
  const mobileImage = gallery.find((image) => image.height > image.width);
  const placed = new Set([challengeImage, approachImage, featuresImage, mobileImage].filter(Boolean));
  const moreScreens = gallery.filter((image) => !placed.has(image));

  const details = [
    { term: "Role", values: [project.role] },
    { term: "Year", values: [project.year ?? "—"] },
    { term: "Services", values: project.services },
    { term: "Technology", values: project.technologies },
  ];

  return (
    <article>
      <PageIntro label={`Work / ${project.number}`} title={[project.title]} aside={<p>{project.category}</p>}>
        <p>{project.statement}</p>
      </PageIntro>

      <figure className="page-x">
        {/* Keeps the image's own proportions, never taller than most of the screen. */}
        <div
          className="relative mx-auto overflow-hidden bg-well"
          style={{
            aspectRatio: `${project.heroImage.width} / ${project.heroImage.height}`,
            maxWidth: `calc(88svh * ${project.heroImage.width} / ${project.heroImage.height})`,
          }}
        >
          <Image
            src={project.heroImage.src}
            alt={project.heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
        {gallery.length === 0 && (
          <figcaption className="label mt-3 text-muted">Screens from inside the app are not shown yet.</figcaption>
        )}
      </figure>

      <div className="page-x layout-grid gap-y-10 pt-12 pb-24 md:pt-16 md:pb-32">
        <dl className="col-span-4 grid grid-cols-2 gap-x-[var(--gutter)] gap-y-8 md:col-span-8 md:grid-cols-4 lg:col-span-9">
          {details.map((detail) => (
            <div key={detail.term}>
              <dt className="label text-muted">{detail.term}</dt>
              {detail.values.map((value) => (
                <dd key={value} className="mt-1 first-of-type:mt-3">
                  {value}
                </dd>
              ))}
            </div>
          ))}
        </dl>
        {project.url && (
          <p className="col-span-4 md:col-span-8 lg:col-span-3 lg:text-right">
            <ArrowLink href={project.url} className="caps">
              Visit live site
            </ArrowLink>
          </p>
        )}
      </div>

      <div className="page-x xl:grid xl:grid-cols-12 xl:gap-x-[var(--gutter)]">
        <aside className="hidden xl:col-span-2 xl:block">
          <CaseStudyNav sections={sections} />
        </aside>

        <div className="xl:col-span-10">
          <Chapter id="overview" number="01" title="Overview">
            <p className="max-w-[34ch] text-[clamp(1.5rem,2.6vw,2.5rem)] leading-[1.15] font-medium tracking-[-0.025em]">
              {caseStudy.overview}
            </p>
          </Chapter>

          <Chapter id="challenge" number="02" title="The Challenge">
            <div className={cn("grid gap-10", challengeImage && "md:grid-cols-12 md:gap-x-[var(--gutter)]")}>
              <p className={cn(prose, challengeImage && "md:col-span-5")}>{caseStudy.challenge}</p>
              {challengeImage && (
                <Screen image={challengeImage} sizes="(min-width: 768px) 55vw, 100vw" className="md:col-span-7" />
              )}
            </div>
          </Chapter>

          <Chapter id="approach" number="03" title="The Approach">
            <div className={cn("grid gap-10", approachImage && "md:grid-cols-12 md:gap-x-[var(--gutter)]")}>
              {approachImage && (
                <Screen image={approachImage} sizes="(min-width: 768px) 55vw, 100vw" className="md:col-span-7" />
              )}
              <div className={cn(approachImage && "md:col-span-5 md:self-end")}>
                <p className="max-w-[26ch] text-[clamp(1.25rem,1.8vw,1.625rem)] leading-[1.25] font-medium tracking-[-0.02em]">
                  {project.statement}
                </p>
                <p className={cn(prose, "mt-6 text-muted")}>{caseStudy.approach}</p>
              </div>
            </div>
          </Chapter>

          <Chapter id="architecture" number="04" title="Architecture & Implementation">
            <ArchitectureDiagram layers={project.architecture} />
            <div className={cn("mt-12 grid gap-10", mobileImage && "md:grid-cols-12 md:gap-x-[var(--gutter)]")}>
              <div className={cn(mobileImage && "md:col-span-7")}>
                <p className={prose}>{caseStudy.development}</p>
                <ul className="label mt-8 flex flex-wrap gap-x-5 gap-y-2 text-muted">
                  {project.technologies.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </div>
              {mobileImage && (
                <Screen
                  image={mobileImage}
                  sizes="(min-width: 768px) 22vw, 60vw"
                  className="w-3/5 justify-self-center md:col-span-3 md:col-start-9 md:w-full"
                />
              )}
            </div>
          </Chapter>

          <Chapter id="features" number="05" title="Selected Features">
            <div className={cn("grid gap-10", featuresImage && "md:grid-cols-12 md:gap-x-[var(--gutter)]")}>
              <ol className={cn(featuresImage ? "md:col-span-5" : "grid md:grid-cols-2 md:gap-x-[var(--gutter)]")}>
                {caseStudy.features.map((feature, index) => (
                  <li key={feature} className="grid grid-cols-[3rem_1fr] border-b border-line py-4 text-lg md:grid-cols-[4rem_1fr]">
                    <span className="label pt-1.5 text-muted">{String(index + 1).padStart(2, "0")}</span>
                    {feature}
                  </li>
                ))}
              </ol>
              {featuresImage && (
                <Screen image={featuresImage} sizes="(min-width: 768px) 55vw, 100vw" className="md:col-span-7" />
              )}
            </div>
          </Chapter>

          <Chapter id="outcome" number="06" title="Outcome">
            <p className="max-w-[36ch] text-[clamp(1.375rem,2.2vw,2rem)] leading-[1.2] font-medium tracking-[-0.02em]">
              {caseStudy.result}
            </p>
            {project.url && (
              <ArrowLink href={project.url} className="caps mt-8">
                Visit live site
              </ArrowLink>
            )}
          </Chapter>

          {moreScreens.length > 0 && (
            <section aria-labelledby="screens-heading" className="border-t border-line pt-5 pb-24 md:pb-32">
              <h2 id="screens-heading" className="label text-muted">
                More screens
              </h2>
              <div className="mt-8 grid gap-[var(--gutter)] md:mt-10">
                {moreScreens.map((image) => (
                  <Screen key={image.src} image={image} sizes="(min-width: 1280px) 80vw, 100vw" />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <NextProject project={getNextProject(project.slug)} />
    </article>
  );
}
