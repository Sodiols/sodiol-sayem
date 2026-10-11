import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/data/projects";
import { pageMetadata, personSchema, webPageSchema, websiteSchema } from "@/lib/seo";
import { site } from "@/lib/site";

const title = "Sodiol | Creative Developer in Sylhet, Bangladesh";
const description = site.description;

export const metadata = pageMetadata({ title, description, path: "/", image: "home", type: "profile" });

export default function HomePage() {
  return (
    <main id="main">
      <JsonLd
        graph={[
          websiteSchema(),
          personSchema(),
          webPageSchema({ type: "WebPage", name: title, description, path: "/", image: "home" }),
        ]}
      />
      <section className="hero shell">
        <div className="hero-kicker">
          <span className="eyebrow">HELLO, I&apos;M A CREATIVE DEVELOPER</span>
        </div>
        <div className="hero-head">
          <h1>
            SODIOL<span className="hero-dot">.</span>
          </h1>
        </div>
        <div className="hero-bottom">
          <div className="hero-badge" aria-label="Based in Sylhet, Bangladesh">
            <span className="badge-spark">✳</span>
            <span>
              BASED IN
              <br />
              <b>SYLHET, BD</b>
            </span>
          </div>
          <div className="hero-statement">
            <p>
              I MAKE <span>DIGITAL</span>
              <br />
              THINGS FEEL <em>DIFFERENT.</em>
            </p>
            <div className="hero-sub">
              <span>I build websites, online stores, web apps and desktop software.</span>
              <Link className="primary-button" href="/work/">
                VIEW MY WORK <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block work-section" id="selected-work">
        <div className="shell">
          <div className="section-heading">
            <div>
              <h2>
                SELECTED
                <br />
                <i>WORK</i>
                <span className="title-period">.</span>
              </h2>
            </div>
            <Link className="text-link" href="/work/">
              ALL PROJECTS <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="statement-band">
        <div className="shell statement-grid">
          <div>
            <span className="huge-asterisk" aria-hidden="true">
              ✳
            </span>
          </div>
          <div>
            <h2>
              LESS NOISE.
              <br />
              <span>MORE</span> INTENT.
            </h2>
            <p>
              I take projects from first idea to launch: planning the structure, designing the interface and writing the
              code. Everything I ship is responsive and accessible.
            </p>
            <Link href="/about/" className="button-outline-light">
              ABOUT ME <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-block tools-section">
        <div className="shell">
          <div className="section-heading">
            <h2>
              WHAT I<br />
              WORK <i>WITH.</i>
            </h2>
          </div>
          <div className="tools-cloud">
            {site.tech.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
