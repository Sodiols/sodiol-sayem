"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toolkit, toolkitGroups, additionalToolIds, type Tool } from "@/data/toolkit";
import { projects } from "@/data/projects";
import styles from "./Toolboard.module.css";

gsap.registerPlugin(ScrollTrigger);
const vars = (values: Record<string, string | number>) => values as CSSProperties;
const toolsOf = (ids: readonly string[]) => ids.map(id => toolkit.find(tool => tool.id === id)!);

// Where a tool appears in a project's own technology list, say which projects run on it.
function usage(tool: Tool) {
  const names = projects.filter(project => project.technologies.includes(tool.name)).map(project => project.name);
  if (names.length === projects.length) return "In all four projects";
  return names.join(", ");
}

function Logo({ tool, size }: { tool: Tool; size: number }) {
  return tool.icon
    ? <Image className={styles.logo} src={`/toolkit/${tool.icon}.svg`} width={size} height={size} alt="" unoptimized loading="lazy" draggable={false} />
    : <span className={styles.mark}>{tool.mark?.join(" ")}</span>;
}

// The stack drawn as the layers under a finished site: they part as you scroll and the one being read lifts.
export function Toolboard() {
  const root = useRef<HTMLElement>(null);
  const plates = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-layer]").forEach((layer, index) => ScrollTrigger.create({
        trigger: layer, start: "top 62%", end: "bottom 62%", onToggle: self => { if (self.isActive) setActive(index); },
      }));
      if (!reduced) gsap.fromTo(plates.current, { "--spread": 0 }, {
        "--spread": 1, ease: "none", scrollTrigger: { trigger: plates.current, start: "top 85%", end: "top 25%", scrub: true },
      });
    }, root);
    return () => context.revert();
  }, []);

  return <section ref={root} id="skills" className={styles.section} aria-labelledby="toolkit-title" data-toolkit data-scene="0.45">
    <header className={styles.header}>
      <h2 id="toolkit-title" data-split>Behind the scenes.</h2>
      <p data-rise>The layers under every project above: what people touch, what keeps the data, and how it ships.</p>
    </header>
    <div className={styles.stack}>
      <div className={styles.scene} aria-hidden="true">
        <div ref={plates} className={styles.plates}>
          {toolkitGroups.map((group, index) => <div key={group.name} className={styles.plate} style={vars({ "--i": index })}
            data-active={index === active} data-above={index < active}>
            <p>{group.name}</p>
            <div className={styles.tiles}>{toolsOf(group.tools).map(tool => <span key={tool.id}><Logo tool={tool} size={34} /></span>)}</div>
          </div>)}
        </div>
      </div>
      <div className={styles.layers}>
        {toolkitGroups.map((group, index) => <section key={group.name} className={styles.layer} aria-labelledby={`toolkit-group-${index}`}
          data-layer data-active={index === active} data-tool-group={group.name}>
          <h3 id={`toolkit-group-${index}`}>{group.name}</h3>
          <p className={styles.description}>{group.description}</p>
          <ul className={styles.tools}>
            {toolsOf(group.tools).map(tool => <li key={tool.id} data-rise>
              <span className={styles.tool} translate="no">{tool.icon && <Logo tool={tool} size={26} />}{tool.name}</span>
              <span className={styles.usage}>{usage(tool)}</span>
            </li>)}
          </ul>
        </section>)}
      </div>
    </div>
    <details className={styles.additional}>
      <summary>Additional tools &amp; exploration <span aria-hidden="true">+</span></summary>
      <ul>{additionalToolIds.map(id => <li key={id} translate="no">{toolkit.find(tool => tool.id === id)!.name}</li>)}</ul>
    </details>
  </section>;
}
