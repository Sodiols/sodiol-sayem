import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-top">
          <div>
            <Link className="footer-big" href="/contact/">
              LET&apos;S
              <br />
              <span>CONNECT.</span>
              <span className="big-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <Link className="wordmark footer-mark" href="/">
            sodiol<span className="brand-stop">.</span>
          </Link>
          <span>© {year} SODIOL</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </div>
    </footer>
  );
}
