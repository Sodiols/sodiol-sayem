import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Page Not Found | Sodiol" },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main">
      <section className="page-hero shell">
        <h1>
          PAGE NOT
          <br />
          <em>FOUND.</em>
        </h1>
        <div className="page-hero-bottom">
          <p>This page doesn&apos;t exist or has moved.</p>
          <Link className="primary-button" href="/work/">
            VIEW MY WORK <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
