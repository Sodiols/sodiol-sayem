"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);
const words = ["Sodiol", "Sayem"];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      const scrub = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to("[data-hero-name]", { yPercent: 38, rotateX: 28, opacity: .15, ease: "none", scrollTrigger: scrub });
      gsap.to("[data-hero-top]", { y: -120, opacity: 0, ease: "none", scrollTrigger: scrub });
    }, root);
    return () => context.revert();
  }, []);

  return <section ref={root} id="home" className={styles.hero} aria-labelledby="hero-title" data-scene="1">
    <div className={styles.top} data-hero-top>
      <p data-reveal>Full-stack developer</p>
      <p data-reveal>Senior Developer at Meka Agency</p>
      <p data-reveal>Sylhet, Bangladesh</p>
    </div>
    <div className={styles.lower}>
      <div className={styles.lede}>
        <p data-reveal>I build complete web applications, from the interface people touch to the database underneath.</p>
        <div className={styles.actions} data-reveal>
          <a className={styles.primary} href="#work">See the work <span aria-hidden="true">↓</span></a>
          <a className={styles.secondary} href="#contact">Start a project <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <h1 id="hero-title" className={styles.name} data-hero-name>
        <span className="sr-only">Sodiol Sayem, full-stack developer</span>
        <span aria-hidden="true" className={styles.nameWords}>
          {words.map(word => <span key={word} className={styles.word}>
            {[...word].map((letter, index) => <span key={index} className={styles.letter} data-reveal-letter>{letter}</span>)}
          </span>)}
        </span>
      </h1>
    </div>
  </section>;
}
