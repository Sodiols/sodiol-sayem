"use client";

import { useEffect, useRef } from "react";
import styles from "./AboutSection.module.css";

export function AboutSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current!;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    let ready = section.closest<HTMLElement>("[data-intro]")?.dataset.intro === "complete";
    let visible = false;
    let played = false;
    const reveal = () => {
      if (!ready || !visible || played) return;
      played = true;
      observer.disconnect();
      if (motion.matches) return;
      section.querySelectorAll<HTMLElement>("[data-about-line]").forEach((line, index) => {
        animations.push(line.animate([
          { transform: "translate3d(0,110%,0)" }, { transform: "translate3d(0,0,0)" },
        ], { duration: 700, delay: index * 90, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }));
      });
      animations.push(section.querySelector<HTMLElement>("[data-about-copy]")!.animate([
        { transform: "translate3d(0,12px,0)", opacity: 0 }, { transform: "translate3d(0,0,0)", opacity: 1 },
      ], { duration: 600, delay: 140, easing: "cubic-bezier(.22,1,.36,1)", fill: "backwards" }));
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      reveal();
    }, { threshold: 0.1, rootMargin: "0px 0px -12% 0px" });
    const onIntro = () => { ready = true; reveal(); };
    const onMotion = () => { if (motion.matches) animations.forEach(animation => animation.finish()); };
    observer.observe(section);
    window.addEventListener("sodiol:intro-complete", onIntro);
    motion.addEventListener("change", onMotion);
    return () => {
      observer.disconnect();
      window.removeEventListener("sodiol:intro-complete", onIntro);
      motion.removeEventListener("change", onMotion);
      animations.forEach(animation => animation.cancel());
    };
  }, []);

  return <section ref={root} className="about section" id="about" aria-labelledby="about-title">
    <h2 id="about-title" className={styles.headline}>
      <span className={styles.lineMask}><span data-about-line>A feel for the details.</span></span>{" "}
      <span className={styles.lineMask}><span data-about-line>An eye on the whole.</span></span>
    </h2>
    <div className={styles.copy} data-about-copy>
      <p>I’m</p>
      <p className={styles.name}>Sodiol Sayem</p>
      <p>I care how a website looks, and how it works.</p>
      <p>I’m a full-stack developer based in Sylhet, Bangladesh. I work across interfaces, application logic and databases, with a particular interest in the parts that need to work together: a product page and its checkout, a chat room and its access rules.</p>
      <p>I built Husnalogy and TARA as the sole developer at Meka Agency. Both projects involved the customer-facing website and the systems behind it, from product data to order management.</p>
      <a className={styles.contactLink} href="#contact">Let’s talk <span aria-hidden="true">↗</span></a>
    </div>
    <section id="experience" className={styles.experience} aria-labelledby="experience-title">
      <h3 id="experience-title">Experience</h3>
      <div><p className={styles.role}>Senior Developer</p><p className={styles.employer}>Meka Agency</p></div>
      <p className={styles.dates}><time dateTime="2026-07-01">July 2026</time> – present</p>
      <p className={styles.experienceCopy}>Sole developer of Husnalogy and TARA, building their storefronts and application functionality as part of my work at Meka Agency.</p>
    </section>
  </section>;
}
