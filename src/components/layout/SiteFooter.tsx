import { socialProfiles, navigationLinks } from "@/data/navigation";
import { socialIcons } from "./socialIcons";
import styles from "./SiteFooter.module.css";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/privacy/CookieSettingsButton";

export function SiteFooter() {
  const year = new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Asia/Dhaka" }).format(new Date());
  return <footer className={styles.footer}>
    <div className={styles.columns}>
      <div><p className={styles.lead}>Sodiol Sayem</p><p>Full-stack developer</p><p>Sylhet, Bangladesh</p></div>
      <nav aria-label="Footer"><p className={styles.lead}>Pages</p>{navigationLinks.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
      <nav aria-label="Social profiles"><p className={styles.lead}>Elsewhere</p>
        {Object.entries(socialProfiles).map(([key, profile]) => {
          if (!profile.url) return null;
          const icon = socialIcons[key as keyof typeof socialIcons];
          return <a key={key} href={profile.url} target="_blank" rel="noopener noreferrer"><svg viewBox={icon.viewBox} aria-hidden="true" focusable="false"><path d={icon.path} /></svg>{profile.label}<span className="sr-only"> (opens in a new tab)</span></a>;
        })}
      </nav>
      <nav aria-label="More information"><p className={styles.lead}>Information</p><Link href="/faq">FAQ</Link><Link href="/privacy-policy">Privacy Policy</Link><CookieSettingsButton /><Link href="/#home">Back to top <span aria-hidden="true">↑</span></Link></nav>
    </div>
    <Link href="/#home" className={styles.brand} aria-label="sodiol. home" translate="no">
      <svg viewBox="0 0 520 132" aria-hidden="true" focusable="false"><text x="0" y="104" textLength="516" lengthAdjust="spacingAndGlyphs">sodiol.</text></svg>
    </Link>
    <p className={styles.copyright}>© {year} Sodiol Sayem. Built and hand-coded in Sylhet.</p>
  </footer>;
}
