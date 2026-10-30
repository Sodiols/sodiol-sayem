"use client";
import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/data/projects";
import styles from "./ProjectShowcase.module.css";

type Props = { project: Project; critical?: boolean; onReady?: () => void; presentation?: "gallery" | "case" };

export function ProjectImage({ project, critical = false, onReady, presentation = "gallery" }: Props) {
  const [fallback, setFallback] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  if (unavailable) return <div className={styles.imageFallback} role="img" aria-label={`${project.name} preview unavailable`}>
    <span>{project.name}</span><p>Project preview unavailable.</p>
  </div>;
  return <Image src={project.image} alt={project.alt} fill
    className={styles.projectImage} style={{ objectFit: presentation === "case" ? "contain" : project.fit, objectPosition: project.position }}
    sizes={presentation === "case" ? "(max-width: 767px) 90vw, 88vw" : "(max-width: 767px) calc(100vw - 66px), 84vw"}
    fetchPriority={critical ? "high" : undefined} loading="eager" unoptimized={fallback}
    onLoad={onReady} onError={() => {
      if (!fallback) setFallback(true);
      else { setUnavailable(true); onReady?.(); }
    }} />;
}
