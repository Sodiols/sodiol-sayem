import styles from "./Hero.module.css";

const words = ["Sodiol", "Sayem"];

export function Hero() {
  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-title" data-scene="1">
      <div className={styles.identity}>
        <p className={styles.role} data-reveal>Full-stack developer</p>
        <h1 id="hero-title" className={styles.name}>
          <span className="sr-only">Sodiol Sayem</span>
          <span aria-hidden="true" className={styles.nameWords}>
            {words.map(word => (
              <span key={word} className="inline-flex">
                {[...word].map((letter, index) => (
                  <span key={index} className="inline-block" data-reveal-letter>{letter}</span>
                ))}
              </span>
            ))}
          </span>
        </h1>
      </div>
      <div className={styles.details}>
        <div>
          <p className={styles.summary}>I build storefronts, publishing tools, and real-time apps from interface to database.</p>
          <p className={styles.byline}>Senior Developer at Meka Agency <span aria-hidden="true">·</span> Sylhet, Bangladesh</p>
        </div>
        <div className={styles.actions}>
          <a className={styles.primary} href="#work">View projects <span aria-hidden="true">↓</span></a>
          <a className={styles.secondary} href="#contact">Start a project <span aria-hidden="true">↓</span></a>
        </div>
      </div>
    </section>
  );
}
