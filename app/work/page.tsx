import { JsonLd } from "@/components/seo/json-ld";
import { WorkGrid } from "@/components/projects/work-grid";
import { projects } from "@/data/projects";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

const title = "Selected Work | Sodiol Creative Developer";
const description =
  "Explore projects by Sodiol, including Husnalogy, PriChat, TARA and Minute Tracker. Websites, messaging apps, commerce and desktop software.";

export const metadata = pageMetadata({ title, description, path: "/work/", image: "work" });

export default function WorkPage() {
  return (
    <main id="main">
      <JsonLd
        graph={[
          {
            ...webPageSchema({ type: "CollectionPage", name: title, description, path: "/work/", image: "work" }),
            mainEntity: {
              "@type": "ItemList",
              itemListElement: projects.map((project, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: project.name,
                url: absoluteUrl(`/projects/${project.slug}/`),
              })),
            },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work/" },
          ]),
        ]}
      />
      <section className="page-hero shell">
        <div className="page-overline">
          <span>/ 02 - WORK</span>
          <span>THE THINGS I PUT OUT INTO THE WORLD</span>
        </div>
        <h1>
          PROOF IN
          <br />
          THE <em>PIXELS.</em>
        </h1>
        <div className="page-hero-bottom">
          <p>Different projects. Different problems. One common thread: building things with intention.</p>
          <span className="page-hero-symbol" aria-hidden="true">
            ↘
          </span>
        </div>
      </section>
      <section className="section-block work-listing">
        <div className="shell">
          <WorkGrid />
        </div>
      </section>
    </main>
  );
}
