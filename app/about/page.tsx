import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, pageMetadata, personSchema, webPageSchema } from "@/lib/seo";

const title = "About Sodiol | Creative Developer from Sylhet";
const description =
  "Meet Sodiol, a creative developer based in Sylhet, Bangladesh. Explore his approach and technologies, including Next.js, React, TypeScript, Supabase and Firebase.";

export const metadata = pageMetadata({ title, description, path: "/about/", image: "about", type: "profile" });

const stack = [
  { title: "LANGUAGES.", tags: ["HTML", "CSS", "JavaScript", "TypeScript"] },
  { title: "FRAMEWORKS.", tags: ["Next.js", "React", "Tailwind CSS", "Bootstrap", "jQuery"] },
  { title: "BACKEND.", tags: ["Supabase", "Firebase"] },
];

const approach = [
  { title: "MAKE IT CLEAR.", text: "Structure and readability come first." },
  { title: "GIVE IT CHARACTER.", text: "A look that belongs to the project." },
  { title: "MAKE IT WORK.", text: "Responsive, accessible and fast." },
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
        <h1>
          HI, I&apos;M
          <br />
          <em>SODIOL.</em>
        </h1>
        <div className="page-hero-bottom">
          <p>A creative developer from Sylhet, Bangladesh. I turn ideas into websites and applications that work.</p>
          <span className="page-hero-symbol" aria-hidden="true">
            ✳
          </span>
        </div>
      </section>

      <section className="about-grid shell">
        <div className="about-label">
          <div className="about-circle">
            SYLHET
            <br />
            BANGLADESH
          </div>
        </div>
        <div className="about-copy">
          <h2>
            I BELIEVE THE WEB SHOULD HAVE <i>PERSONALITY.</i>
          </h2>
          <p>
            I work across front-end development, web applications, commerce experiences, and desktop software. From a
            simple landing page to a more complex product, I care about how the experience looks and how it behaves.
          </p>
        </div>
      </section>

      <section className="section-block about-stack">
        <div className="shell">
          <div className="section-heading">
            <h2>
              TOOLS I
              <br />
              <i>USE.</i>
            </h2>
          </div>
          <div className="stack-columns">
            {stack.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
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
            <h2>
              HOW I<br />
              <i>WORK.</i>
            </h2>
          </div>
          <div className="approach-list">
            {approach.map((item) => (
              <div key={item.title}>
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
