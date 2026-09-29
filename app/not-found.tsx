import type { Metadata } from "next";
import { ArrowLink } from "@/components/ui/ArrowLink";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="page-x flex min-h-[100svh] flex-col justify-between pt-36 pb-12 md:pt-48">
      <p className="label text-muted">404</p>
      <div>
        <h1 className="display text-[clamp(3rem,9.4vw,10.5rem)]">
          This page
          <br />
          doesn’t exist.
        </h1>
        <ArrowLink href="/" className="caps mt-12">
          Back home
        </ArrowLink>
      </div>
    </section>
  );
}
