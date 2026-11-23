import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { NotFoundSuggestion } from "@/components/pages/NotFoundSuggestion";
import { navigationLinks } from "@/data/navigation";
import { projects } from "@/data/projects";
import styles from "@/components/pages/NotFound.module.css";

export const metadata: Metadata = { title: "Page Not Found | Sodiol Sayem", description: "This page could not be found. Return to Sodiol Sayem’s portfolio.", robots: { index:false,follow:true }, alternates:{canonical:null} };

export default function NotFound() {
  return <><main id="main" className={styles.page}>
    <p className={styles.code} aria-hidden="true">404</p>
    <div className={styles.content}>
      <h1>This page doesn’t exist.</h1>
      <p className={styles.lede}>The address may have a typo, or the page has moved since the link was shared.</p>
      <NotFoundSuggestion className={styles.suggestion} />
      <div className={styles.actions}>
        <Link className={styles.home} href="/">Back to home <span aria-hidden="true">→</span></Link>
        <Link className={styles.contact} href="/#contact">Contact me <span aria-hidden="true">↗</span></Link>
      </div>
      <div className={styles.lists}>
        <nav aria-labelledby="lost-cases"><h2 id="lost-cases">Case studies</h2>
          <ul>{projects.map(project => <li key={project.slug}><Link href={`/work/${project.slug}`} translate="no">{project.name} <span aria-hidden="true">→</span></Link></li>)}</ul></nav>
        <nav aria-labelledby="lost-home"><h2 id="lost-home">On the home page</h2>
          <ul>{navigationLinks.map(link => <li key={link.href}><Link href={link.href}>{link.label} <span aria-hidden="true">→</span></Link></li>)}</ul></nav>
      </div>
    </div>
  </main><SiteFooter invite={false} /></>;
}
