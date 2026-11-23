"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectImage } from "./ProjectImage";
import styles from "./ProjectShowcase.module.css";
import { trackEvent } from "@/lib/analytics";

export function ProjectShowcase() {
  const root = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const item = projects[current];
  const router = useRouter();

  useEffect(() => {
    const shell = root.current!.closest<HTMLElement>("[data-intro]");
    const restoration = window.history.scrollRestoration;
    const startsAtTop = ["", "#home", "#main"].includes(window.location.hash);
    if (shell?.dataset.intro !== "complete" && startsAtTop) {
      window.history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    // Old in-page case links (#case-slug) now live on their own pages.
    const legacy = projects.find(item => window.location.hash === `#case-${item.slug}`);
    if (legacy) router.replace(`/work/${legacy.slug}`);
    const onIntroComplete = () => {
      window.history.scrollRestoration = restoration;
      if (startsAtTop) window.scrollTo({ top: 0, behavior: "instant" });
    };
    if (shell?.dataset.intro !== "complete") window.addEventListener("sodiol:intro-complete", onIntroComplete, { once: true });
    return () => {
      window.history.scrollRestoration = restoration;
      window.removeEventListener("sodiol:intro-complete", onIntroComplete);
    };
  }, [router]);

  const seen = useRef(new Set<string>());
  useEffect(() => {
    const slug = projects[current].slug;
    if (seen.current.has(slug) || root.current!.closest<HTMLElement>("[data-intro]")?.dataset.intro !== "complete") return;
    seen.current.add(slug);
    trackEvent("project_view", slug);
  }, [current]);

  return <section ref={root} id="work" className={styles.work} aria-labelledby="work-title" data-scene="0.22">
    <header className={styles.head}>
      <h2 id="work-title" data-split>Selected work</h2>
      <div className={styles.introCopy}>
        <p data-rise>Four applications built end to end: two storefronts, a team’s publishing system and a real-time chat.</p>
        <a className={styles.skipWork} href="#about">Continue to about <span aria-hidden="true">↓</span></a>
      </div>
    </header>
    <div className={styles.stage}>
      <nav className={styles.index} aria-label="Projects">
        {projects.map((project, index) => (
          <button key={project.slug} type="button" data-project-index aria-pressed={index === current}
            onClick={() => setCurrent(index)} translate="no">{project.name}</button>
        ))}
      </nav>
      <Link className={styles.preview} href={`/work/${item.slug}`} aria-label={`Read the ${item.name} case study`}
        onClick={() => trackEvent("case_study_open", item.slug)}>
        <ProjectImage key={item.slug} project={item} />
      </Link>
      <article className={styles.project} aria-labelledby="selected-project-name">
        <div>
          <p className={styles.category}>{item.category} · {item.context}</p>
          <h3 id="selected-project-name" className={styles.name} translate="no">{item.name}</h3>
        </div>
        <div className={styles.detail}>
          <p className={styles.summary}>{item.summary}</p>
          <ul className={styles.tech} aria-label="Technologies">{item.technologies.slice(0, 4).map(tool => <li key={tool}>{tool}</li>)}</ul>
          <div className={styles.actions}>
            <Link className={styles.caseButton} href={`/work/${item.slug}`} onClick={() => trackEvent("case_study_open", item.slug)}>
              Read case study <span aria-hidden="true">→</span></Link>
            <a className={styles.liveLink} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("live_site_click", item.slug)}>
              Live site <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
          </div>
        </div>
      </article>
    </div>
  </section>;
}
