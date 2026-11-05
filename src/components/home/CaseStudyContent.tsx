import Link from "next/link";
import { ProjectImage } from "./ProjectImage";
import { ProjectLiveLink } from "./ProjectLiveLink";
import type { Project } from "@/data/projects";
import styles from "./ProjectShowcase.module.css";

export function CaseStudyContent({ project, standalone = false }: { project: Project; standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  const SectionHeading = standalone ? "h2" : "h3";
  const DecisionHeading = standalone ? "h3" : "h4";
  return <>
    <header className={styles.caseIntro}>
      <Heading id={`case-${project.slug}-title`} tabIndex={-1} translate="no">{project.name}</Heading>
      <div><p className={styles.caseContext}>{project.context}</p><p>{project.description}</p></div>
    </header>
    <div className={styles.casePreview} style={{ aspectRatio: `${project.image.width} / ${project.image.height}` }}>
      <ProjectImage key={project.image.src} project={project} presentation="case" />
    </div>
    <div className={styles.caseBody}>
      <section className={styles.caseRow} aria-labelledby={`${project.slug}-overview`}><p className={styles.caseLabel}>The project</p><div><SectionHeading id={`${project.slug}-overview`}>At a glance.</SectionHeading><p>{project.overview}</p><ul className={styles.stack} aria-label="Technologies used">{project.technologies.map(tool => <li key={tool}>{tool}</li>)}</ul></div></section>
      <section className={styles.caseRow} aria-labelledby={`${project.slug}-role`}><p className={styles.caseLabel}>My contribution</p><div><SectionHeading id={`${project.slug}-role`}>The work I took on.</SectionHeading><p>{project.contribution}</p><ul className={styles.disciplines}>{project.disciplines.map(item => <li key={item}>{item}</li>)}</ul></div></section>
      <section className={styles.caseRow} aria-labelledby={`${project.slug}-approach`}><p className={styles.caseLabel}>Design & engineering</p><div><SectionHeading id={`${project.slug}-approach`}>Decisions behind the build.</SectionHeading><p>{project.approach}</p><div className={styles.decisions} data-case-decisions>{project.decisions.map(item => <div key={item.title}><DecisionHeading>{item.title}</DecisionHeading><p>{item.detail}</p></div>)}</div></div></section>
      <section className={styles.caseRow} aria-labelledby={`${project.slug}-features`}><p className={styles.caseLabel}>Functionality</p><div><SectionHeading id={`${project.slug}-features`}>What it brings together.</SectionHeading><ul className={styles.implementation}>{project.implementation.map(item => <li key={item}>{item}</li>)}</ul></div></section>
      <section className={styles.caseRow} aria-labelledby={`${project.slug}-outcome`}><p className={styles.caseLabel}>The result</p><div><SectionHeading id={`${project.slug}-outcome`}>The finished application.</SectionHeading><p>{project.outcome}</p><div className={styles.caseActions}><ProjectLiveLink href={project.href} slug={project.slug} name={project.name} />{!standalone && <Link href={`/work/${project.slug}`}>Open full case study <span aria-hidden="true">↗</span></Link>}<Link href="/#contact">Discuss a project <span aria-hidden="true">↗</span></Link></div></div></section>
    </div>
  </>;
}
