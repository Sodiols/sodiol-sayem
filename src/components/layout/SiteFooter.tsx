import { socialProfiles } from "@/data/navigation";
import { socialIcons } from "./socialIcons";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const year = new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Asia/Dhaka" }).format(new Date());
  return <footer className={styles.footer}>
    <div className={styles.inner}>
      <a href="#home" className={styles.brand} aria-label="Sodiol home" translate="no">sodiol.</a>
      <nav className={styles.socials} aria-label="Social profiles">
        {Object.entries(socialProfiles).map(([key, profile]) => {
          if (!profile.url) return null;
          const icon = socialIcons[key as keyof typeof socialIcons];
          return <a key={key} href={profile.url} aria-label={`${profile.label} (opens in a new tab)`} target="_blank" rel="noopener noreferrer"><svg viewBox={icon.viewBox} aria-hidden="true" focusable="false"><path d={icon.path} /></svg></a>;
        })}
      </nav>
      <p className={styles.copyright}>© {year} Sodiol Sayem</p>
      <a className={styles.back} href="#home">Back to top <span aria-hidden="true">↑</span></a>
    </div>
  </footer>;
}
