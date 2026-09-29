import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { InView } from "@/components/ui/InView";
import { MagneticArrow } from "@/components/ui/MagneticArrow";
import { site } from "@/data/site";

export function ContactCTA() {
  return (
    <section aria-labelledby="contact-heading" className="page-x pb-24 md:pb-32">
      <InView className="layout-grid gap-y-10 border-t border-line pt-6">
        <p className="label col-span-4 text-muted md:col-span-2 lg:col-span-3">Contact</p>
        <div className="col-span-4 md:col-span-8 lg:col-span-9">
          <h2 id="contact-heading" className="display text-[clamp(2.75rem,7.6vw,8.25rem)]">
            <span className="unmask">
              <span>Let’s build</span>
            </span>
            <span className="unmask">
              <span style={{ "--delay": "90ms" } as CSSProperties}>something good.</span>
            </span>
          </h2>

          <div className="rise-in mt-12 flex flex-wrap items-end justify-between gap-10 md:mt-16" style={{ "--delay": "220ms" } as CSSProperties}>
            <div>
              <p className="max-w-[34ch] text-lg leading-normal">
                Have a project, an idea or an interesting problem? Tell me what you’re working on.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
                <Link
                  href="/contact"
                  className="caps group inline-flex min-h-12 items-center gap-3 rounded-full bg-ink px-6 text-paper transition-colors duration-200 hover:bg-[#2a2a28]"
                >
                  Start a project
                  <span aria-hidden className="arrow">
                    →
                  </span>
                </Link>
                <ArrowLink href={`mailto:${site.email}`} className="caps">
                  {site.email}
                </ArrowLink>
              </div>
            </div>
            <MagneticArrow href="/contact" label="Go to the contact page" />
          </div>
        </div>
      </InView>
    </section>
  );
}
