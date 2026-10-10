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
        <div className="page-overline">
          <span>/ 404</span>
          <span>THIS PAGE DOES NOT EXIST</span>
        </div>
        <h1>
          LOST IN
          <br />
          THE <em>PIXELS.</em>
        </h1>
        <div className="page-hero-bottom">
          <p>The page you were looking for moved or never existed. The work is still here.</p>
          <Link className="primary-button" href="/work/">
            EXPLORE MY WORK <span>↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
