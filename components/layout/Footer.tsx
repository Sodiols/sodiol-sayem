import type { CSSProperties } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { InView } from "@/components/ui/InView";
import { LocalTime } from "@/components/ui/LocalTime";
import { site, socialLinks } from "@/data/site";

export function Footer() {
  return (
    <footer className="page-x bg-ink pt-20 pb-6 text-paper md:pt-28">
      <InView margin="0px 0px -10% 0px">
        {/* The name is the closing gesture: revealed once, sized so SODIOL always fits the width. */}
        <p aria-hidden className="display text-[clamp(4.5rem,20.5vw,21rem)] leading-[0.8]">
          <span className="unmask">
            <span>{site.firstName}</span>
          </span>
          <span className="unmask">
            <span style={{ "--delay": "110ms" } as CSSProperties}>{site.lastName}</span>
          </span>
        </p>
      </InView>

      <div className="layout-grid label mt-16 gap-y-8 border-t border-white/15 pt-6 md:mt-24">
        <p className="col-span-2 lg:col-span-3">
          <span className="text-white/55">Local time</span>
          <br />
          <LocalTime seconds={false} /> {site.utcOffset.replace(" ", "")}
        </p>

        <ul className="col-span-2 lg:col-span-3">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <ArrowLink href={link.href} className="py-0.5 max-md:py-3.5">
                {link.label}
              </ArrowLink>
            </li>
          ))}
        </ul>

        <p className="col-span-2 lg:col-span-3">
          <span className="text-white/55">Built with</span>
          <br />
          Next.js + TypeScript
        </p>

        <div className="col-span-2 flex flex-col items-start gap-3 lg:col-span-3 lg:items-end lg:text-right">
          <a href="#main" className="group hit inline-flex items-baseline gap-[0.4em]">
            <span className="link-line">Back to top</span>
            <span aria-hidden className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5">
              ↑
            </span>
          </a>
          <p className="text-white/55">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
