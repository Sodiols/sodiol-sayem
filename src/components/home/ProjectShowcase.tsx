"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectImage } from "./ProjectImage";
import { mountWorkStage } from "./workStage";
import styles from "./ProjectShowcase.module.css";
import { trackEvent } from "@/lib/analytics";
import { scrollToY } from "@/lib/scroll";

const vars = (values: Record<string, string | number>) => values as CSSProperties;

export function ProjectShowcase() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [glReady, setGlReady] = useState(false);
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
    void mountWorkStage({
      host: canvas.current!, track: track.current!,
      sources: projects.map(project => project.image),
      onActive: setCurrent, onHover: setHovered, onReady: () => setGlReady(true),
    }).then(dispose => { if (disposed) dispose(); else cleanup = dispose; });

    // When the wheel rests between two projects, settle on the nearer one.
    let idle = 0;
    const settle = () => {
      clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const box = track.current!.getBoundingClientRect();
        if (box.top > 0 || box.bottom < window.innerHeight) return;
        const position = -box.top/(box.height - window.innerHeight)*(projects.length - 1);
        const nearest = Math.round(position);
        if (Math.abs(position - nearest) > .015) scrollToY(yFor(nearest));
      }, 220);
    };
    window.addEventListener("scroll", settle, { passive: true });
    return () => { disposed = true; cleanup(); clearTimeout(idle); window.removeEventListener("scroll", settle); };
  }, [yFor]);

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
      <p data-rise>Four applications built end to end: two storefronts, a team’s publishing system and a real-time chat.</p>
    </header>
    <div ref={track} className={styles.track} style={vars({ "--count": projects.length })}>
      <div className={styles.stage} data-gl={glReady ? "ready" : undefined} data-hovering={hovered !== null}
        data-cursor={hovered === null ? undefined : hovered === current ? "Open case" : "View"} onClick={stageClick}>
        <div ref={canvas} className={styles.canvas} aria-hidden="true" />
        <div className={styles.fallback}>
          {projects.map((item, index) => <figure key={item.slug} className={styles.shot} data-state={index === current ? "active" : undefined}
            style={vars({ "--ratio": item.image.width/item.image.height })}>
            <ProjectImage project={item} critical={index === 0} />
          </figure>)}
        </div>
        <nav className={styles.index} aria-label="Projects">
          {projects.map((item, index) => <button key={item.slug} type="button" data-project-index aria-current={index === current ? "true" : undefined}
            onClick={() => scrollToY(yFor(index))} translate="no">{item.name}</button>)}
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
              <div className={styles.actions}>
                <Link className={styles.caseButton} href={`/work/${item.slug}`} onClick={() => trackEvent("case_study_open", item.slug)}>
                  Read the case <span aria-hidden="true">→</span></Link>
                <a className={styles.liveLink} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("live_site_click", item.slug)}>
                  Live site <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
              </div>
            </div>
          </article>)}
        </div>
      </div>
    </div>
  </section>;
}
