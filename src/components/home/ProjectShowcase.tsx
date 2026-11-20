"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { projects, type Project } from "@/data/projects";
import { ProjectImage } from "./ProjectImage";
import { mountWorkStage } from "./workStage";
import styles from "./ProjectShowcase.module.css";
import { trackEvent } from "@/lib/analytics";
import { scrollToY } from "@/lib/scroll";

const vars = (values: Record<string, string | number>) => values as CSSProperties;

function ProjectActions({ project }: { project: Project }) {
  return <div className={styles.actions}>
    <Link className={styles.caseButton} href={`/work/${project.slug}`} onClick={() => trackEvent("case_study_open", project.slug)}>
      Read the case <span aria-hidden="true">→</span>
    </Link>
    <a className={styles.liveLink} href={project.href} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("live_site_click", project.slug)}>
      Live site <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
    </a>
  </div>;
}

export function ProjectShowcase() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [glReady, setGlReady] = useState(false);
  const stageReady = useRef(false);
  const router = useRouter();

  // Where the page must be for project `index` to stand in the middle of the ribbon.
  const yFor = useCallback((index: number) => {
    const box = track.current!.getBoundingClientRect();
    return box.top + window.scrollY + index/(projects.length - 1)*(box.height - window.innerHeight);
  }, []);

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

  useEffect(() => {
    let disposed = false, cleanup = () => {};
    stageReady.current = false;
    const updateFallback = () => {
      if (stageReady.current || !track.current) return;
      const box = track.current.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height - window.innerHeight)));
      setCurrent(Math.round(progress * (projects.length - 1)));
    };
    window.addEventListener("scroll", updateFallback, { passive: true });
    updateFallback();
    let started = false;
    const startStage = () => {
      if (started || disposed) return;
      started = true;
      void mountWorkStage({
        host: canvas.current!, track: track.current!,
        sources: projects.map(project => project.mockup ?? project.image),
        onActive: setCurrent, onHover: setHovered,
        onReady: () => { stageReady.current = true; setGlReady(true); },
      }).then(dispose => { if (disposed) dispose(); else cleanup = dispose; }).catch(() => {
        // The image and native project controls remain usable without WebGL.
        stageReady.current = false;
        updateFallback();
      });
    };
    const preload = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      preload.disconnect();
      startStage();
    }, { rootMargin: `${Math.round(window.innerHeight * .6)}px 0px` });
    preload.observe(track.current!);
    return () => { disposed = true; preload.disconnect(); cleanup(); window.removeEventListener("scroll", updateFallback); };
  }, []);

  const seen = useRef(new Set<string>());
  useEffect(() => {
    const slug = projects[current].slug;
    if (seen.current.has(slug) || root.current!.closest<HTMLElement>("[data-intro]")?.dataset.intro !== "complete") return;
    seen.current.add(slug);
    trackEvent("project_view", slug);
  }, [current]);

  function stageClick(event: MouseEvent<HTMLDivElement>) {
    if (hovered === null || (event.target as Element).closest("a,button")) return;
    if (hovered !== current) return scrollToY(yFor(hovered));
    trackEvent("case_study_open", projects[current].slug);
    router.push(`/work/${projects[current].slug}`);
  }

  return <section ref={root} id="work" className={styles.work} aria-labelledby="work-title" data-scene="0.22">
    <header className={styles.head}>
      <h2 id="work-title" data-split>Selected work</h2>
      <div className={styles.introCopy}>
        <p data-rise>Four applications built end to end: two storefronts, a team’s publishing system and a real-time chat.</p>
        <a className={styles.skipWork} href="#about">Continue to about <span aria-hidden="true">↓</span></a>
      </div>
    </header>
    <div ref={track} className={styles.track} style={vars({ "--count": projects.length })}>
      <div className={styles.stage} data-gl={glReady ? "ready" : undefined} data-hovering={hovered !== null}
        onClick={stageClick}>
        <div ref={canvas} className={styles.canvas} aria-hidden="true" />
        <div className={styles.fallback}>
          {projects.map((item, index) => <figure key={item.slug} className={styles.shot} data-state={index === current ? "active" : undefined}
            style={vars({ "--ratio": (item.mockup ?? item.image).width/(item.mockup ?? item.image).height })}>
            <ProjectImage project={item} />
          </figure>)}
        </div>
        <nav className={styles.index} aria-label="Projects">
          {projects.map((item, index) => <button key={item.slug} type="button" data-project-index aria-current={index === current ? "true" : undefined}
            onClick={() => scrollToY(yFor(index))} translate="no">{item.name}</button>)}
          <div className={styles.browse}>
            <p aria-live="polite" aria-atomic="true">Project {current + 1} of {projects.length}</p>
            <button type="button" aria-label="Previous project" disabled={current === 0} onClick={() => scrollToY(yFor(current - 1))}><span aria-hidden="true">←</span></button>
            <button type="button" aria-label="Next project" disabled={current === projects.length - 1} onClick={() => scrollToY(yFor(current + 1))}><span aria-hidden="true">→</span></button>
          </div>
        </nav>
        <div className={styles.info}>
          {projects.map((item, index) => <article key={item.slug} className={styles.project} aria-labelledby={`${item.slug}-name`}
            data-state={index === current ? "active" : index < current ? "before" : "after"} inert={index !== current}>
            <div className={styles.title}>
            <p className={styles.category}>{item.category} · {item.context}</p>
            <h3 id={`${item.slug}-name`} className={styles.name} translate="no">
              <span className="sr-only">{item.name}</span>
              <span className={styles.letters} aria-hidden="true">
                {[...item.name].map((letter, position) => <span key={position} style={vars({ "--i": position })}>{letter === " " ? " " : letter}</span>)}
              </span>
            </h3>
            </div>
            <div className={styles.detail}>
              <p className={styles.summary}>{item.summary}</p>
              <ul className={styles.tech} aria-label="Technologies">{item.technologies.slice(0, 4).map(tool => <li key={tool}>{tool}</li>)}</ul>
              <ProjectActions project={item} />
            </div>
          </article>)}
        </div>
      </div>
    </div>
    <div className={styles.compactList}>
      {projects.map(item => <article key={item.slug} className={styles.compactCard} aria-labelledby={`compact-${item.slug}-name`}>
        <Link href={`/work/${item.slug}`} className={styles.compactImage} aria-label={`Read ${item.name} case study`} onClick={() => trackEvent("case_study_open", item.slug)}>
          <ProjectImage project={item} presentation="compact" />
        </Link>
        <div>
          <p className={styles.category}>{item.category} · {item.context}</p>
          <h3 id={`compact-${item.slug}-name`} translate="no">{item.name}</h3>
          <p className={styles.summary}>{item.summary}</p>
          <ProjectActions project={item} />
        </div>
      </article>)}
    </div>
  </section>;
}
