import type { CSSProperties, ReactNode } from "react";

type PageIntroProps = {
  label: string;
  /** One entry per display line. */
  title: string[];
  children?: ReactNode;
  aside?: ReactNode;
  /** "compact" tightens spacing and scale for pages whose content should appear sooner. */
  size?: "default" | "compact";
};

export function PageIntro({ label, title, children, aside, size = "default" }: PageIntroProps) {
  const compact = size === "compact";
  return (
    <header className={compact ? "page-x pt-32 pb-12 md:pt-40 md:pb-16" : "page-x pt-36 pb-20 md:pt-48 md:pb-28"}>
      <p className="label fade-in text-muted">{label}</p>
      <h1 className={compact ? "display mt-5 text-[clamp(2.75rem,6.6vw,7.25rem)] md:mt-6" : "display mt-6 text-[clamp(3rem,9.4vw,10.5rem)] md:mt-8"}>
        {title.map((line, index) => (
          <span key={line} className="line">
            <span style={{ "--i": index } as CSSProperties}>{line}</span>
          </span>
        ))}
      </h1>
      {(children || aside) && (
        <div className={compact ? "layout-grid mt-8 gap-y-6 md:mt-10" : "layout-grid mt-12 gap-y-8 md:mt-16"}>
          {aside && (
            <div className="label fade-in col-span-4 text-muted md:col-span-3 lg:col-span-3" style={{ "--i": 2 } as CSSProperties}>
              {aside}
            </div>
          )}
          {children && (
            <div
              className="fade-in col-span-4 text-[clamp(1.125rem,1.6vw,1.375rem)] leading-snug md:col-span-5 md:col-start-4 lg:col-span-5 lg:col-start-7"
              style={{ "--i": 3 } as CSSProperties}
            >
              {children}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
