"use client";

import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { projects } from "@/data/projects";
import { ProjectImage } from "./ProjectImage";
import { ProjectCaseStudy } from "./ProjectCaseStudy";
import styles from "./ProjectShowcase.module.css";

type CarouselState = { active: number; requested: number; incoming: number | null; imageReady: boolean };
type CarouselAction = { type: "select" | "step" | "ready" | "finished"; index: number };
function carouselReducer(state: CarouselState, action: CarouselAction): CarouselState {
  if (action.type === "ready") return action.index === state.incoming ? { ...state, imageReady: true } : state;
  if (action.type === "finished") {
    if (action.index !== state.incoming) return state;
    return { ...state, active: action.index, incoming: state.requested === action.index ? null : state.requested, imageReady: false };
  }
  const requested = ((action.type === "step" ? state.requested + action.index : action.index) + projects.length) % projects.length;
  // Loading can be superseded immediately; a visible mask reveal completes first.
  return state.imageReady ? { ...state, requested }
    : { ...state, requested, incoming: requested === state.active ? null : requested };
}

function CarouselArrows({ onPrevious, onNext }: { onPrevious: () => void; onNext: () => void }) {
  return <div className={styles.arrows} role="group" aria-label="Project navigation">
    <button type="button" onClick={onPrevious} aria-label="Previous project"><span aria-hidden="true">‹</span></button>
    <button type="button" onClick={onNext} aria-label="Next project"><span aria-hidden="true">›</span></button>
  </div>;
}

function ProjectSelector({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  return <nav className={styles.rail} aria-label="Select a project">
    <div className={styles.selector}>
      {projects.map((project, index) => <button key={project.slug} type="button"
        aria-label={`Show ${project.name}`} aria-current={active === index ? "true" : undefined}
        onClick={() => onSelect(index)}><span /></button>)}
    </div>
  </nav>;
}

export function ProjectShowcase() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const layerIn = useRef<HTMLDivElement>(null);
  const layerOut = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const [{ active, incoming, imageReady }, dispatch] = useReducer(carouselReducer, { active: 0, requested: 0, incoming: null, imageReady: false });
  const [caseOpen, setCaseOpen] = useState(false);
  const [caseVisit, setCaseVisit] = useState(0);
  const project = projects[active];
  const select = useCallback((index: number) => dispatch({ type: "select", index }), []);
  const step = (direction: number) => dispatch({ type: "step", index: direction });

  // A running image reveal finishes cleanly, then services the latest selection.
  // Controls remain usable without stacking competing animations.
  useLayoutEffect(() => {
    if (incoming === null || !imageReady) return;
    const front = layerIn.current!;
    const back = layerOut.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const duration = reduced.matches ? 1 : 680;
    let disposed = false;
    const animations = [
      front.animate([
        { clipPath: "inset(0 100% 0 0)", transform: "translate3d(2.5%,0,0)" },
        { clipPath: "inset(0 0% 0 0)", transform: "translate3d(0,0,0)" },
      ], { duration, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" }),
      back.animate([{ transform: "translate3d(0,0,0)" }, { transform: "translate3d(-2%,0,0)" }],
        { duration, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" }),
    ];
    const finishMotion = () => { if (reduced.matches) animations.forEach(animation => animation.finish()); };
    reduced.addEventListener("change", finishMotion);
    void Promise.all(animations.map(animation => animation.finished)).then(() => {
      if (disposed) return;
      dispatch({ type: "finished", index: incoming });
    }).catch(() => undefined);
    return () => {
      disposed = true;
      reduced.removeEventListener("change", finishMotion);
      animations.forEach(animation => animation.cancel());
    };
  }, [incoming, imageReady]);

  useEffect(() => {
    if (incoming === null && caseOpen && window.location.hash.startsWith("#case-")) window.history.replaceState(null, "", `#case-${project.slug}`);
  }, [project.slug, caseOpen, incoming]);

  useEffect(() => {
    const shell = root.current!.closest<HTMLElement>("[data-intro]");
    const restoration = window.history.scrollRestoration;
    const startsAtWork = ["", "#work", "#home", "#main"].includes(window.location.hash);
    if (shell?.dataset.intro !== "complete" && startsAtWork) {
      window.history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    const resolveHash = () => {
      const hash = window.location.hash;
      const index = projects.findIndex(item => hash === `#case-${item.slug}`);
      if (index >= 0) {
        select(index);
        setCaseOpen(true);
        setCaseVisit(visit => visit + 1);
      } else if (["#work", "#home"].includes(hash)) select(0);
    };
    const onIntroComplete = () => {
      window.history.scrollRestoration = restoration;
      if (startsAtWork) window.scrollTo({ top: 0, behavior: "instant" });
      resolveHash();
    };
    const onWorkStart = () => { select(0); setCaseOpen(false); };
    window.addEventListener("sodiol:work-start", onWorkStart);
    window.addEventListener("hashchange", resolveHash);
    window.addEventListener("popstate", resolveHash);
    if (shell?.dataset.intro === "complete") resolveHash();
    else window.addEventListener("sodiol:intro-complete", onIntroComplete, { once: true });
    return () => {
      window.history.scrollRestoration = restoration;
      window.removeEventListener("sodiol:work-start", onWorkStart);
      window.removeEventListener("sodiol:intro-complete", onIntroComplete);
      window.removeEventListener("hashchange", resolveHash);
      window.removeEventListener("popstate", resolveHash);
    };
  }, [select]);

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault(); step(event.key === "ArrowRight" ? 1 : -1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault(); select(event.key === "Home" ? 0 : projects.length - 1);
    }
  }
  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    pointer.current = event.isPrimary && event.pointerType !== "mouse" && !(event.target as HTMLElement).closest("a,button")
      ? { id: event.pointerId, x: event.clientX, y: event.clientY } : null;
  }
  function pointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = pointer.current;
    pointer.current = null;
    if (!start || start.id !== event.pointerId) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (Math.abs(x) >= 50 && Math.abs(x) > Math.abs(y) * 1.5) step(x < 0 ? 1 : -1);
  }
  function openCase() {
    if (window.location.hash !== `#case-${project.slug}`) window.history.pushState(null, "", `#case-${project.slug}`);
    setCaseOpen(true);
    setCaseVisit(visit => visit + 1);
  }
  function backToWork() {
    window.history.replaceState(null, "", "#work");
    canvas.current?.focus({ preventScroll: true });
    // Supersede the case-entry element scroll with another element scroll;
    // Firefox can otherwise finish that pending scroll after window.scrollTo.
    canvas.current?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return <section ref={root} id="work" className={styles.showcase} aria-labelledby="work-title" data-showcase data-active={active}>
    <div id="home" className={styles.homeAnchor} />
    <h1 id="work-title" className="sr-only">Selected work</h1>
    <div ref={canvas} className={styles.stage} role="region" aria-roledescription="carousel" aria-label="Selected projects"
      tabIndex={0} onKeyDown={keyboard} data-carousel aria-busy={incoming !== null}>
      <div className={styles.artwork} onPointerDown={pointerDown} onPointerUp={pointerUp} onPointerCancel={() => { pointer.current = null; }}>
        <div className={styles.imageViewport}>
          <div key={project.slug} ref={layerOut} className={styles.frame} data-current-image>
            <ProjectImage key={project.image.src} project={project} critical={active === 0} />
          </div>
          {incoming !== null && <div key={projects[incoming].slug} ref={layerIn} className={`${styles.frame} ${styles.incoming}`} aria-hidden="true" data-incoming-image>
            <ProjectImage key={projects[incoming].image.src} project={projects[incoming]} onReady={() => dispatch({ type: "ready", index: incoming })} />
          </div>}
        </div>
        <div className={styles.infoPanel} data-project-info>
          <div className={styles.infoMask}><h2 translate="no">{project.name}</h2></div>
          <div className={styles.actions}>
            <span className={styles.infoMask}><a href={project.href} target="_blank" rel="noopener noreferrer">Live site <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></span>
            <span className={styles.infoMask}><button type="button" onClick={openCase} disabled={incoming !== null}
              aria-expanded={caseOpen} aria-controls="project-case-study">Read the case <span aria-hidden="true">↗</span></button></span>
          </div>
        </div>
      </div>
      <CarouselArrows onPrevious={() => step(-1)} onNext={() => step(1)} />
      <ProjectSelector active={active} onSelect={select} />
      <div className={styles.descriptionStrip}>
        <div><span className={styles.marker} aria-hidden="true"><i /><i /><i /></span><p>{project.summary}</p></div>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{project.name}. Project {active + 1} of {projects.length}.</p>
    </div>
    <div id="project-case-study" hidden={!caseOpen}>
      {caseOpen && <ProjectCaseStudy project={project} visit={caseVisit} transitioning={incoming !== null} onBack={backToWork} />}
    </div>
    <noscript><div className={styles.noScript}>
      <p>Explore the projects</p>
      {projects.map(item => <details key={item.slug}><summary>{item.name}</summary><p>{item.description}</p><a href={item.href} target="_blank" rel="noopener noreferrer">Live site ↗</a></details>)}
    </div></noscript>
  </section>;
}
