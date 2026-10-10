"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import { projectFilters, projects, type ProjectKind } from "@/data/projects";

type Category = "all" | ProjectKind;

const count = (category: Category) =>
  String(category === "all" ? projects.length : projects.filter((p) => p.kind === category).length).padStart(2, "0");

export function WorkGrid() {
  const [category, setCategory] = useState<Category>("all");
  const visible = projects.filter((project) => category === "all" || project.kind === category);

  return (
    <>
      <div className="work-bar">
        <span className="eyebrow">PROJECT INDEX / 001-{String(projects.length).padStart(3, "0")}</span>
        <div className="filter-list" role="group" aria-label="Filter projects">
          {projectFilters.map((filter) => {
            const selected = filter.category === category;
            return (
              <button
                key={filter.category}
                type="button"
                className={`filter-button${selected ? " is-active" : ""}`}
                aria-pressed={selected}
                onClick={() => setCategory(filter.category)}
              >
                {filter.label} <sup>{count(filter.category)}</sup>
              </button>
            );
          })}
        </div>
      </div>
      <div className="projects-grid" id="work-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            hidden={category !== "all" && project.kind !== category}
          />
        ))}
      </div>
      <p className="filter-empty" hidden={visible.length !== 0}>
        No matching projects.
      </p>
    </>
  );
}
