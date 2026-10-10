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
          <span className="eyebrow">
            <span className="little-square"></span> HELLO, I&apos;M A CREATIVE DEVELOPER
          </span>
          <span className="eyebrow hero-edition">PORTFOLIO / 2026</span>
        </div>
        <div className="hero-head">
          <h1>
            SODIOL<span className="hero-dot">.</span>
          </h1>
          <div className="hero-index" aria-label="Developer based in Sylhet">
            <span>01 / 04</span>
            <span>
              DESIGN
              <br />
              MEETS
              <br />
              DEVELOPMENT
            </span>
          </div>
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
              <span>Creative development with a taste for bold ideas, considered details, and things that actually work.</span>
              <Link className="primary-button" href="/work/">
                EXPLORE MY WORK <span>↗</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="marquee" aria-label="Ideas, code, and creative thinking">
          <div className="marquee-track" aria-hidden="true">
            IDEAS <span>✳</span> CODE <span>✳</span> CURIOSITY <span>✳</span> IDEAS <span>✳</span> CODE <span>✳</span>{" "}
            CURIOSITY <span>✳</span>
          </div>
        </div>
      </section>

      <section className="section-block work-section" id="selected-work">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">/ 01 - SOME THINGS I&apos;VE BUILT</span>
              <h2>
                SELECTED
                <br />
                <i>WORK</i>
                <span className="title-period">.</span>
              </h2>
            </div>
            <Link className="text-link" href="/work/">
              ALL PROJECTS <span>↗</span>
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
            <span className="eyebrow light">/ 02 - WHAT I BRING</span>
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
              I&apos;m a creative developer from Sylhet, Bangladesh. I use modern web technology to build clear, useful
              experiences with a personality of their own.
            </p>
            <Link href="/about/" className="button-outline-light">
              A BIT MORE ABOUT ME ↗
            </Link>
          </div>
        </div>
      </section>

      <section className="section-block tools-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <span className="eyebrow">/ 03 - THE TOOLBOX</span>
              <h2>
                WHAT I<br />
                WORK <i>WITH.</i>
              </h2>
            </div>
            <p className="heading-note">
              Built with the right tools.
              <br />
              Not just the trendy ones.
            </p>
          </div>
          <div className="tools-cloud">
            {site.tech.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
          <div className="tools-bottom">
            <span>AND ALWAYS LEARNING ↗</span>
            <Link href="/about/" className="text-link">
              SEE THE FULL STORY <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
