import Image from "next/image";
import { toolkit, toolkitGroups, additionalToolIds, type Tool } from "@/data/toolkit";
import { projects } from "@/data/projects";
import styles from "./Toolboard.module.css";

const toolsOf = (ids: readonly string[]) => ids.map(id => toolkit.find(tool => tool.id === id)!);

function usage(tool: Tool) {
  const names = projects.filter(project => project.technologies.includes(tool.name)).map(project => project.name);
  return names.length === projects.length ? "In all four projects" : names.join(", ");
}

export function Toolboard() {
  return <section id="skills" className={styles.section} aria-labelledby="toolkit-title" data-toolkit>
    <header className={styles.header}>
      <h2 id="toolkit-title">Behind the scenes.</h2>
      <p>The tools behind the work, grouped by what they do.</p>
    </header>
    <div className={styles.groups}>
      {toolkitGroups.map((group, index) => <section key={group.name} className={styles.group} aria-labelledby={`toolkit-group-${index}`} data-tool-group={group.name}>
        <div className={styles.groupIntro}>
          <h3 id={`toolkit-group-${index}`}>{group.name}</h3>
          <p>{group.description}</p>
        </div>
        <ul className={styles.tools}>
          {toolsOf(group.tools).map(tool => {
            const usedIn = usage(tool);
            return <li key={tool.id}>
              <div className={styles.tool} translate="no">
                {tool.icon && <Image className={styles.logo} src={`/toolkit/${tool.icon}.svg`} width={24} height={24} alt="" unoptimized loading="lazy" />}
                <span>{tool.name}</span>
              </div>
              {usedIn && <p className={styles.usage}>{usedIn}</p>}
            </li>;
          })}
        </ul>
      </section>)}
    </div>
    <details className={styles.additional}>
      <summary>Additional tools &amp; exploration <span aria-hidden="true">+</span></summary>
      <ul>{additionalToolIds.map(id => <li key={id} translate="no">{toolkit.find(tool => tool.id === id)!.name}</li>)}</ul>
    </details>
  </section>;
}
