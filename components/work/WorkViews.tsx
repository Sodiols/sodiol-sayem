"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type View = "gallery" | "index";

const labels: Record<View, string> = { gallery: "Gallery", index: "Index" };

/** Switches between two server-rendered views of the same projects. Focus stays on the toggle. */
export function WorkViews({ gallery, index, count }: { gallery: ReactNode; index: ReactNode; count: string }) {
  const [view, setView] = useState<View>("gallery");

  return (
    <>
      <div className="flex items-center justify-between border-y border-line py-3">
        <p className="label text-muted">{count} projects</p>
        <div role="group" aria-label="Project view" className="flex gap-1">
          {(Object.keys(labels) as View[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={view === option}
              onClick={() => setView(option)}
              className={cn(
                "label min-h-10 rounded-full px-4 transition-colors duration-200",
                view === option ? "bg-ink text-paper" : "text-muted hover:text-ink",
              )}
            >
              {labels[option]}
            </button>
          ))}
        </div>
      </div>
      <div key={view} className="swap-in">
        {view === "gallery" ? gallery : index}
      </div>
    </>
  );
}
