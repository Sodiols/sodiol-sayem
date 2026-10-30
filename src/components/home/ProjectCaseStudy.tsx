"use client";
import { useEffect, useRef } from "react";
import type { Project } from "@/data/projects";
import { ProjectImage } from "./ProjectImage";
import styles from "./ProjectShowcase.module.css";
import { trackEvent } from "@/lib/analytics";

type Props = { project: Project; visit: number; transitioning: boolean; onBack: () => void };

export function ProjectCaseStudy({ project, visit, transitioning, onBack }: Props) {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const lastVisit = useRef(-1);
  useEffect(() => {
    if (transitioning || visit === lastVisit.current) return;
    lastVisit.current = visit;
    const section = root.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    title.current?.focus({ preventScroll: true });
    section.scrollIntoView({ behavior: reduced.matches ? "instant" : "smooth", block: "start" });
    if (reduced.matches) return;
    const animations = Array.from(section.querySelectorAll<HTMLElement>("[data-case-reveal]")).map((element, index) =>
      element.animate([{ transform: "translate3d(0,16px,0)", opacity: 0 }, { transform: "translate3d(0,0,0)", opacity: 1 }],
        { duration: 600, delay: index * 60, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }));
    const finish = () => { if (reduced.matches) animations.forEach(animation => animation.finish()); };
    reduced.addEventListener("change", finish);
    return () => { reduced.removeEventListener("change", finish); animations.forEach(animation => animation.cancel()); };
  }, [visit, transitioning]);
  return <article ref={root} className={styles.caseStudy} aria-labelledby="case-title" data-case-study data-project={project.slug}>
    <div className={styles.caseTop}><p>PROJECT NOTES</p><button type="button" onClick={onBack}>Back to work <span aria-hidden="true">↑</span></button></div>
    <header className={styles.caseIntro} data-case-reveal>
      <h2 ref={title} id="case-title" tabIndex={-1} translate="no">{project.name}</h2><p>{project.description}</p>
    </header>
    <div className={styles.casePreview} style={{ aspectRatio: `${project.image.width} / ${project.image.height}` }}>
      <ProjectImage key={project.image.src} project={project} presentation="case" />
    </div>
    <div className={styles.caseBody}>
      <section className={styles.caseRow} aria-labelledby="overview-title"><p className={styles.caseLabel}>01 / OVERVIEW</p><div><h3 id="overview-title">{project.name}, at a glance.</h3><p>{project.overview}</p></div></section>
      <section className={styles.caseRow} aria-labelledby="role-title"><p className={styles.caseLabel}>02 / MY ROLE</p><div><h3 id="role-title">The scope of the work.</h3><ul className={styles.disciplines}>{project.disciplines.map(item => <li key={item}>{item}</li>)}</ul></div></section>
      <section className={styles.caseRow} aria-labelledby="approach-title"><p className={styles.caseLabel}>03 / THE APPROACH</p><div><h3 id="approach-title">A direction of its own.</h3><p>{project.approach}</p></div></section>
      <section className={styles.caseRow} aria-labelledby="implementation-title"><p className={styles.caseLabel}>04 / IMPLEMENTATION</p><div><h3 id="implementation-title">What the project brings together.</h3><ul className={styles.implementation}>{project.implementation.map(item => <li key={item}>{item}</li>)}</ul></div></section>
      <section className={styles.caseRow} aria-labelledby="outcome-title"><p className={styles.caseLabel}>05 / THE OUTCOME</p><div><h3 id="outcome-title">The finished experience.</h3><p>{project.outcome}</p><div className={styles.caseActions}><a href={project.href} target="_blank" rel="noopener noreferrer" onClick={()=>trackEvent("live_site_click",project.slug)}>Live site <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a><button type="button" onClick={onBack}>Back to work <span aria-hidden="true">↑</span></button></div></div></section>
    </div>
  </article>;
}