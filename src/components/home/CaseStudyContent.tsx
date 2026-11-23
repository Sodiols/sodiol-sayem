import Link from "next/link";
import { ProjectImage } from "./ProjectImage";
import { ProjectLiveLink } from "./ProjectLiveLink";
import { CaseContents } from "./CaseContents";
import type { Project } from "@/data/projects";
import styles from "./ProjectShowcase.module.css";

export function CaseStudyContent({ project }: { project: Project }) {
  const preview = project.mockup ?? project.image;
  const id = (part: string) => `${project.slug}-${part}`;
  const contents = [[id("overview"), "Overview"], [id("role"), "My role"], [id("approach"), "Decisions"],
    [id("features"), "Functionality"], [id("outcome"), "Outcome"]] as const;
  return <>
    <header className={styles.caseIntro}>
      <h1 id={`case-${project.slug}-title`} tabIndex={-1} translate="no">{project.name}</h1>
      <div>
        <p>{project.description}</p>
        <dl className={styles.caseFacts}>
          <div><dt>Type</dt><dd>{project.category}</dd></div>
          <div><dt>Built</dt><dd>{project.context}</dd></div>
          <div><dt>Stack</dt><dd>{project.technologies.slice(0, 4).join(", ")}</dd></div>
        </dl>
        <ProjectLiveLink className={styles.caseButton} href={project.href} slug={project.slug} name={project.name} />
      </div>
    </header>
    <div className={styles.casePreview} style={{ aspectRatio: `${preview.width} / ${preview.height}` }}>
      <ProjectImage key={preview.src} project={project} presentation="case" />
    </div>
    <div className={styles.caseBody}>
      <CaseContents items={contents} />
      <section className={styles.caseRow} aria-labelledby={id("overview")}><h2 id={id("overview")}>At a glance.</h2><p>{project.overview}</p><ul className={styles.stack} aria-label="Technologies used">{project.technologies.map(tool => <li key={tool}>{tool}</li>)}</ul></section>
      <section className={styles.caseRow} aria-labelledby={id("role")}><h2 id={id("role")}>The work I took on.</h2><p>{project.contribution}</p><ul className={styles.disciplines}>{project.disciplines.map(item => <li key={item}>{item}</li>)}</ul></section>
      <section className={styles.caseRow} aria-labelledby={id("approach")}><h2 id={id("approach")}>Decisions behind the build.</h2><p>{project.approach}</p><div className={styles.decisions} data-case-decisions>{project.decisions.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.detail}</p></div>)}</div></section>
      <section className={styles.caseRow} aria-labelledby={id("features")}><h2 id={id("features")}>What it brings together.</h2><ul className={styles.implementation}>{project.implementation.map(item => <li key={item}>{item}</li>)}</ul></section>
      <section className={styles.caseRow} aria-labelledby={id("outcome")}><h2 id={id("outcome")}>The finished application.</h2><p>{project.outcome}</p><div className={styles.caseActions}><ProjectLiveLink className={styles.caseButton} href={project.href} slug={project.slug} name={project.name} /><Link href="/#contact">Discuss a project <span aria-hidden="true">↗</span></Link></div></section>
    </div>
  </>;
}
