import styles from "./Hero.module.css";

const words = ["Sodiol", "Sayem"];

export function Hero() {
  return <section id="home" className={styles.hero} aria-labelledby="hero-title">
    <h1 id="hero-title" className={styles.name} data-hero-name>
      <span className="sr-only">Sodiol Sayem, full-stack developer</span>
      <span aria-hidden="true" className={styles.nameWords}>
        {words.map(word => <span key={word} className={styles.word}>
          {[...word].map((letter, index) => <span key={index} className={styles.letter} data-reveal-letter>{letter}</span>)}
        </span>)}
      </span>
    </h1>
    <div className={styles.details}>
      <p className={styles.role} data-reveal>Full-stack developer.</p>
      <div className={styles.introduction}>
        <p className={styles.description} data-reveal>I build complete web applications, from the interface people touch to the database underneath.</p>
        <div className={styles.actions} data-reveal>
          <a className={styles.primary} href="#work">See the work <span aria-hidden="true">↓</span></a>
          <a className={styles.secondary} href="#contact">Start a project <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </div>
    <div className={styles.context} data-reveal>
      <p>Senior Developer at Meka Agency</p>
      <p>Sylhet, Bangladesh</p>
    </div>
  </section>;
}
