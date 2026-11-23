import { ToolkitGroup } from "./ToolkitGroup";
import Image from "next/image";
import { additionalToolIds, toolkit, toolkitGroups } from "@/data/toolkit";
import { projects } from "@/data/projects";
import styles from "./Toolboard.module.css";

const sharedStack = toolkit.filter(tool =>
  projects.every(project => project.technologies.includes(tool.name))
);

function ToolList({ ids }: { ids: readonly string[] }) {
  return (
    <ul className={styles.tools}>
      {ids.map(id => {
        const tool = toolkit.find(entry => entry.id === id)!;
        return (
          <li key={id} translate="no">
            {tool.icon && <Image src={`/toolkit/${tool.icon}.svg`} width={20} height={20} alt="" unoptimized />}
            {tool.name}
          </li>
        );
      })}
    </ul>
  );
}

export function Toolboard() {
  return (
    <section id="skills" className={styles.section} aria-labelledby="toolkit-title">
      <header className={styles.header}>
        <h2 id="toolkit-title">Behind the scenes.</h2>
        <p>My <a href="#work">four featured projects</a> share a core stack: {new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(sharedStack.map(tool => tool.name))}.</p>
      </header>
      <div className={styles.groups}>
        {toolkitGroups.map((group, index) => (
          <ToolkitGroup key={group.name} title={group.name} defaultOpen={index === 0}>
            <p className={styles.description}>{group.description}</p>
            <ToolList ids={group.tools} />
          </ToolkitGroup>
        ))}
        <ToolkitGroup title="Additional tools & exploration">
          <ToolList ids={additionalToolIds} />
        </ToolkitGroup>
      </div>
    </section>
  );
}
