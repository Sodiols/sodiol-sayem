"use client";

import { useId, useState, type ReactNode } from "react";
import styles from "./Toolboard.module.css";

export function ToolkitGroup({ title, children }: { title: string; children: ReactNode }) {
  const [pinned, setPinned] = useState(false);
  const [preview, setPreview] = useState(false);

  const panelId = useId();
  const expanded = pinned || preview;

  return (
    <div className={styles.group} data-expanded={expanded}
      onPointerEnter={event => {
        if (event.pointerType === "mouse") setPreview(true);
      }}
      onPointerLeave={() => setPreview(false)}>
      <button type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => {
        setPreview(false);
        setPinned(value => !value);
      }}>
        <span>{title}</span>
        <span className={styles.indicator} aria-hidden="true" />
      </button>
      <div id={panelId} className={styles.panel} inert={!expanded}>
        <div className={styles.panelBody}>{children}</div>
      </div>
    </div>
  );
}
