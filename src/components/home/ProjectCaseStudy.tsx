"use client";
import { useEffect, useRef } from "react";
import type { Project } from "@/data/projects";
import { CaseStudyContent } from "./CaseStudyContent";
import styles from "./ProjectShowcase.module.css";

type Props = { project: Project; visit: number; transitioning: boolean; onBack: () => void };

export function ProjectCaseStudy({ project, visit, transitioning, onBack }: Props) {
  const root = useRef<HTMLElement>(null);
  const lastVisit = useRef(-1);
  useEffect(() => {
    if (transitioning || visit === lastVisit.current) return;
    lastVisit.current = visit;
    const section = root.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    section.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
    section.scrollIntoView({ behavior: reduced.matches ? "instant" : "smooth", block: "start" });
  }, [visit, transitioning]);
  return <article ref={root} className={styles.caseStudy} aria-labelledby={`case-${project.slug}-title`} data-case-study data-project={project.slug}>
    <div className={styles.caseTop}><p>PROJECT NOTES</p><button type="button" onClick={onBack}>Back to work <span aria-hidden="true">↑</span></button></div>
    <CaseStudyContent project={project} />
    <div className={styles.caseActions}><button type="button" onClick={onBack}>Back to work <span aria-hidden="true">↑</span></button></div>
  </article>;
}
