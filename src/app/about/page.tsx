import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { AboutMotion } from "@/components/about/AboutMotion";
import styles from "@/components/about/About.module.css";

export const metadata: Metadata = {
  title: "About Sodiol Sayem | Creative Full Stack Developer",
  description: "Meet Sodiol Sayem, a creative full stack developer from Sylhet, Bangladesh. Thoughtful design, React and Next.js interfaces, and dependable application systems.",
  openGraph: {
    title: "About Sodiol Sayem",
    description: "A full stack developer with equal care for how a website looks and how it works.",
    type: "website",
  },
};
export const viewport: Viewport = { themeColor: "#111111" };

const capabilities = [
  { title: "Frontend", tools: "React, Next.js, TypeScript, JavaScript, Tailwind CSS, HTML, CSS" },
  { title: "Backend", tools: "Node.js, REST APIs, PostgreSQL, Supabase, Firebase" },
  { title: "Application Systems", tools: "Authentication, database integrations, API integrations, application architecture" },
  { title: "Workflow", tools: "Git, GitHub, deployment workflows" },
];
const projects = ["Husnalogy", "TARA", "Epic Elites", "PriChat"];

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className={styles.label}><span>{number}</span><span aria-hidden="true">/</span>{children}</p>;
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className={styles.textLink}><span>{children}</span><span className={styles.arrow} aria-hidden="true">↗</span></Link>;
}

export default function AboutPage() {
  return <AboutMotion>
    <main id="main" className={styles.page}>
      <section className={`${styles.introduction} ${styles.grid}`} aria-labelledby="about-heading">
        <div className={styles.introLabel}><SectionLabel number="01">ABOUT</SectionLabel></div>
        <h1 id="about-heading" className={styles.headline}>
          <span className={styles.mask}><span data-about-headline>I care how it looks.</span></span>{" "}
          <span className={`${styles.mask} ${styles.serifLine}`}><span data-about-headline>I care how it works.</span></span>
        </h1>
        <p className={styles.location}>BASED IN SYLHET, <br />BANGLADESH</p>
        <p className={styles.introCopy} data-about-intro>I’m Sodiol Sayem, a full stack developer from Sylhet, Bangladesh. I turn ideas into thoughtful, functional websites, with equal attention to the design people see and the technology behind it.</p>
        <span className={`${styles.rule} ${styles.introRule}`} data-about-rule aria-hidden="true" />
      </section>

      <section className={`${styles.person} ${styles.grid}`} aria-labelledby="person-heading" data-about-section>
        <SectionLabel number="02">THE PERSON</SectionLabel>
        <div className={styles.personContent}>
          <h2 id="person-heading" className={styles.display}>Curious by nature.<br />Creative by practice.</h2>
          <div className={styles.personCopy} data-about-content>
            <p>I enjoy figuring out how things work, questioning how they could work better, and building something useful from an idea.</p>
            <p>For me, development is not only about writing code. It’s about making decisions, solving problems, and creating websites that feel considered from the first interaction to the smallest detail.</p>
          </div>
        </div>
      </section>

      <section className={styles.capabilities} aria-labelledby="capabilities-heading" data-about-section>
        <div className={`${styles.grid} ${styles.sectionHeader}`}>
          <SectionLabel number="03">CAPABILITIES</SectionLabel>
          <h2 id="capabilities-heading" className={styles.display}>The tools behind<br />the work.</h2>
        </div>
        <ol className={styles.capabilityList}>
          {capabilities.map((item, index) => <li className={styles.capability} key={item.title}>
            <span className={styles.rule} data-about-rule aria-hidden="true" />
            <span className={styles.rowIndex} aria-hidden="true">0{index + 1}</span>
            <h3>{item.title}</h3>
            <p translate="no">{item.tools}</p>
          </li>)}
        </ol>
      </section>

      <section className={`${styles.work} ${styles.grid}`} aria-labelledby="work-heading" data-about-section>
        <span className={`${styles.rule} ${styles.fullRule}`} data-about-rule aria-hidden="true" />
        <SectionLabel number="04">WORK</SectionLabel>
        <h2 id="work-heading" className={styles.display}>Ideas,<br />made real.</h2>
        <div className={styles.workContext} data-about-content>
          <p>Every project brings a different challenge. From shopping experiences to community platforms, I focus on building websites that look intentional and work reliably.</p>
          <ul className={styles.projectNames} aria-label="Highlighted projects" translate="no">
            {projects.map(name => <li key={name}>{name}</li>)}
          </ul>
          <TextLink href="/#work">Explore selected work</TextLink>
        </div>
      </section>

      <section className={`${styles.closing} ${styles.grid}`} aria-labelledby="contact-heading" data-about-section>
        <span className={`${styles.rule} ${styles.fullRule}`} data-about-rule aria-hidden="true" />
        <SectionLabel number="05">CONTACT</SectionLabel>
        <h2 id="contact-heading" className={styles.closingHeading}>
          <span className={styles.mask}><span data-about-closing>Have something</span></span>{" "}
          <span className={styles.mask}><span data-about-closing>in mind?</span></span>
        </h2>
        <div className={styles.closingCopy} data-about-content>
          <p>Whether it’s a new website, an idea in progress, or something that needs a better solution, I’d be happy to hear about it.</p>
          <TextLink href="/#contact">Let’s talk</TextLink>
        </div>
      </section>
    </main>
    <footer className={styles.footer}>
      <Link href="/#home" className={styles.footerBrand} translate="no" aria-label="Sodiol home">sodiol.</Link>
      <p>Designed &amp; built in Sylhet, Bangladesh.</p>
      <a href="#main">Back to top <span aria-hidden="true">↑</span></a>
    </footer>
  </AboutMotion>;
}
