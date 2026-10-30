import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import styles from "./EditorialPage.module.css";

export function EditorialPage({ label, title, description, children }: { label: string; title: string; description?: string; children: React.ReactNode }) {
  return <><main id="main" className={styles.page}>
    <header className={styles.heading}><p className={styles.label}>{label}</p><div className={styles.mask}><h1 className={styles.reveal}>{title}</h1></div>{description && <p className={styles.description}>{description}</p>}</header>
    <div className={styles.body}>{children}</div>
    <div className={styles.backWrap}><Link className={styles.back} href="/">Back to home <span aria-hidden="true">↗</span></Link></div>
  </main><SiteFooter /></>;
}
