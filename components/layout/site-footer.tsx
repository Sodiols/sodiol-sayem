import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div>
            <p className="eyebrow light">HAVE SOMETHING IN MIND?</p>
            <Link className="footer-big" href="/contact/">
              LET&apos;S MAKE
              <br />
              IT <span>HAPPEN.</span>
              <span className="big-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          </div>
          <div className="footer-side">
            <p>
              Thoughtful development.
              <br />
              Distinct digital experiences.
            </p>
            <Link href="/contact/" className="small-underlined">
              START A CONVERSATION ↗
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <Link className="wordmark footer-mark" href="/">
            sodiol<span className="brand-stop">.</span>
          </Link>
          <span>BASED IN SYLHET, BANGLADESH</span>
          <span>© {year} SODIOL</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </div>
    </footer>
  );
}
