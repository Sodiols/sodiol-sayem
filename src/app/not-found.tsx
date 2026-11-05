import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/components/pages/EditorialPage.module.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
export const metadata: Metadata = { title: "Page Not Found | Sodiol Sayem", description: "This page could not be found. Return to Sodiol Sayem’s portfolio.", robots: { index:false,follow:true }, alternates:{canonical:null} };
export default function NotFound() {
  return <><main id="main" className={`${styles.page} ${styles.status}`}><header className={styles.heading}><div className={styles.mask}><h1 className={styles.reveal}>404.</h1></div></header><div className={styles.body}><h2>Nothing here.</h2><p>Looks like this page doesn’t exist.</p><Link className={styles.back} href="/">Back to home <span aria-hidden="true">↗</span></Link></div></main><SiteFooter /></>;
}
