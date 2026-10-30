import Image from "next/image";
import { toolkit, toolkitGroups } from "@/data/toolkit";
import styles from "./Toolboard.module.css";

export function Toolboard() {
  return <section id="skills" className={styles.section} aria-labelledby="toolkit-title" data-toolkit>
    <div className={styles.inner}>
      <header className={styles.header}>
        <div><h2 id="toolkit-title">Behind the scenes.</h2><p className={styles.description}>The tools I use to make things work.</p></div>
      </header>
      <div className={styles.board}>
        {toolkitGroups.map((group,index)=><section key={group.name} className={styles.row} aria-labelledby={`toolkit-group-${index}`} data-tool-group={group.name}>
          <h3 id={`toolkit-group-${index}`}>{group.name}</h3>
          <ul className={styles.tools}>
        {group.tools.map(id => { const tool=toolkit.find(item=>item.id===id)!; return <li key={tool.id} className={styles.item}>
          {tool.icon ? <><span className={styles.identity}><Image className={styles.logo} src={`/toolkit/${tool.icon}.svg`} width={32} height={32} alt="" unoptimized loading="lazy" draggable={false} /></span><span className={styles.name} translate="no">{tool.name}</span></>
            : <span className={styles.textIdentity} translate="no">{tool.name}</span>}
        </li>; })}
          </ul>
        </section>)}
      </div>
    </div>
  </section>;
}
