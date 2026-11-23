import Link from "next/link";
import styles from "./AboutSection.module.css";

export function AboutSection() {
  return (
    <div className={styles.profile}>
      <section id="about" className={styles.chapter} aria-labelledby="about-title">
        <h2 id="about-title" className={styles.heading}>About me</h2>
        <div className={styles.content}>
          <p className={styles.intro}>I’m Sodiol Sayem, a full-stack developer based in Sylhet, Bangladesh.</p>
          <p className={styles.copy}>I care about what happens on both sides of the screen. On a storefront, that means following a purchase from the product page through checkout to the order the shop receives. In a chat app, it means making sure only the right people can join a conversation.</p>
          <div className={styles.links}>
            <a href="#experience">See my experience <span aria-hidden="true">↓</span></a>
            <a href="#contact">Get in touch <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>

      <section id="experience" className={styles.chapter} aria-labelledby="experience-title">
        <h2 id="experience-title" className={styles.heading}>Experience</h2>
        <div className={styles.content}>
          <div className={styles.jobMeta}>
            <p className="font-medium">Meka Agency</p>
            <p><time dateTime="2026-07-01">July 2026</time> – present</p>
          </div>
          <h3 className={styles.role}>Senior Developer</h3>
          <p className={styles.copy}>I was the sole developer on Husnalogy and TARA. I built the customer-facing storefronts and the systems the shops use to manage products and orders.</p>
          <ul aria-label="Case studies from Meka Agency" className={styles.cases}>
            {["Husnalogy", "TARA"].map(name => (
              <li key={name}>
                <Link href={`/work/${name.toLowerCase()}`}>
                  <span>{name}</span>
                  <span className={styles.action}>Case study <span aria-hidden="true">→</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
