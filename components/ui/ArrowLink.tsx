import Link from "next/link";
import type { ReactNode } from "react";
import { cn, isExternal } from "@/lib/utils";

type ArrowLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  arrow?: "→" | "↗" | "↓";
  onClick?: () => void;
};

/** Text link with a trailing arrow: → internal, ↗ external, ↓ download. */
export function ArrowLink({ href, children, className, arrow, onClick }: ArrowLinkProps) {
  const external = isExternal(href);
  const glyph = arrow ?? (external ? "↗" : "→");
  const content = (
    <>
      <span className="link-line">{children}</span>
      <span aria-hidden className={cn("arrow", glyph === "↗" && "arrow-up")}>
        {glyph}
      </span>
    </>
  );
  const classes = cn("group hit inline-flex items-baseline gap-[0.4em]", className);

  if (!external && glyph !== "↓") {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  const opensTab = href.startsWith("http");
  return (
    <a
      href={href}
      className={classes}
      onClick={onClick}
      {...(opensTab && { target: "_blank", rel: "noopener noreferrer" })}
      {...(glyph === "↓" && { download: "" })}
    >
      {content}
      {opensTab && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
