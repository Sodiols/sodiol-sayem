"use client";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { readSubmissionReceipt,subscribeReceipt } from "@/lib/submission-receipt";
import styles from "./EditorialPage.module.css";
export function ThankYou() {
  const received=useSyncExternalStore(subscribeReceipt,readSubmissionReceipt,()=>false);
  return <main id="main" className={`${styles.page} ${styles.status}`}>
    <header className={styles.heading}><p className={styles.label}>{received ? "MESSAGE RECEIVED" : "A NOTE BEFORE YOU GO"}</p><div className={styles.mask}><h1 className={styles.reveal} style={{fontSize:"clamp(70px,12vw,180px)"}}>{received ? "Thank you." : "Say hello."}</h1></div></header>
    <div className={styles.body}><p>{received ? "Your message is on its way. I’ll get back to you as soon as I can." : <>This page confirms messages sent through the portfolio form. To start a conversation, visit the <Link href="/#contact">contact section</Link>.</>}</p><Link className={styles.back} href="/">Back to home <span aria-hidden="true">↗</span></Link></div>
  </main>;
}
