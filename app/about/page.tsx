import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, pageMetadata, personSchema, webPageSchema } from "@/lib/seo";

const title = "About Sodiol | Creative Developer from Sylhet";
const description =
  "Meet Sodiol, a creative developer based in Sylhet, Bangladesh. Explore his approach and technologies, including Next.js, React, TypeScript, Supabase and Firebase.";

export const metadata = pageMetadata({ title, description, path: "/about/", image: "about", type: "profile" });

const stack = [
  { n: "01 / CORE", title: ["THE", "FOUNDATION."], tags: ["HTML", "CSS", "JavaScript", "TypeScript"] },
  { n: "02 / FRAMEWORKS", title: ["THE", "BUILDERS."], tags: ["Next.js", "React", "Tailwind CSS", "Bootstrap", "jQuery"] },
  { n: "03 / BACKEND SERVICES", title: ["BEHIND", "THE SCENES."], tags: ["Supabase", "Firebase"] },
];

const approach = [
  { n: "01", title: "MAKE IT CLEAR.", text: "Structure and readability first." },
  { n: "02", title: "GIVE IT CHARACTER.", text: "Details that feel intentional." },
  { n: "03", title: "MAKE IT WORK.", text: "Responsive, accessible, and practical." },
];

export default function AboutPage() {
  return (
    <main id="main">
      <JsonLd
        graph={[
          personSchema(),
          webPageSchema({ type: "AboutPage", name: title, description, path: "/about/", image: "about" }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about/" },
          ]),
        ]}
      />
      <section className="page-hero shell">
        <div className="page-overline">
          <span>/ 01 - ABOUT</span>
          <span>THE PERSON BEHIND THE PIXELS</span>
        </div>
        <h1>
          NOT YOUR
          <br />
          AVERAGE <em>DEV.</em>
        </h1>
        <div className="page-hero-bottom">
          <p>
            Hi, I&apos;m <strong>Sodiol.</strong> A creative developer from Sylhet, Bangladesh. I like turning interesting
            ideas into functional websites and applications.
          </p>
          <span className="page-hero-symbol" aria-hidden="true">
            ✳
          </span>
        </div>
      </section>

      <section className="about-grid shell">
        <div className="about-label">
          <span className="eyebrow">/ THE SHORT VERSION</span>
          <div className="about-circle">
            SYLHET
            <br />↗<br />
            BANGLADESH
          </div>
        </div>
        <div className="about-copy">
          <h2>
            I BELIEVE THE WEB SHOULD HAVE <i>PERSONALITY.</i>
          </h2>
          <p>
            Development is more than arranging components on a screen. It&apos;s about making something clear, responsive,
            useful, and memorable.
          </p>
          <p>
            I work across front-end development, web applications, commerce experiences, and desktop software. From a
            simple landing page to a more complex product, I care about how the experience looks and how it behaves.
          </p>
        </div>
      </section>

      <section className="section-block about-stack">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">/ THE STACK</span>
              <h2>
                TOOLS OF
                <br />
                THE <i>TRADE.</i>
              </h2>
            </div>
            <p className="heading-note">
              A flexible toolkit for
              <br />
              different kinds of problems.
            </p>
          </div>
          <div className="stack-columns">
            {stack.map((group) => (
              <div key={group.n}>
                <span className="stack-n">{group.n}</span>
                <h3>
                  {group.title[0]}
                  <br />
                  {group.title[1]}
                </h3>
                <div className="stack-tags">
                  {group.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block approach-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">/ APPROACH</span>
              <h2>
                HOW I<br />
                <i>THINK.</i>
              </h2>
            </div>
          </div>
          <div className="approach-list">
            {approach.map((item) => (
              <div key={item.n}>
                <span>{item.n}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
