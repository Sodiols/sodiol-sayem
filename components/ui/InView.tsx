"use client";

import { useEffect, useRef, type ReactNode } from "react";

type InViewProps = {
  className?: string;
  children: ReactNode;
  /** Shrinks the viewport used for detection, so the effect starts once the element is properly visible. */
  margin?: string;
};

/**
 * Marks its element with data-in-view="false" after hydration and "true" once it scrolls into view,
 * then stops observing. CSS only hides things for the "false" state, so the server-rendered page
 * (and any browser without JavaScript) shows the finished composition.
 */
export function InView({ className, children, margin = "0px 0px -15% 0px" }: InViewProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.dataset.inView = "false";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.dataset.inView = "true";
        observer.disconnect();
      },
      { rootMargin: margin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [margin]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
