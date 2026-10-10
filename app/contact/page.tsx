import { ContactForm } from "@/components/contact/contact-form";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, pageMetadata, personSchema, webPageSchema } from "@/lib/seo";

const title = "Contact Sodiol | Discuss a Website or App Project";
const description =
  "Get in touch with Sodiol, a creative developer in Sylhet, Bangladesh. Send an inquiry about a website, web app, e-commerce project or desktop application.";

export const metadata = pageMetadata({ title, description, path: "/contact/", image: "contact" });

export default function ContactPage() {
  return (
    <main id="main">
      <JsonLd
        graph={[
          personSchema(),
          webPageSchema({ type: "ContactPage", name: title, description, path: "/contact/", image: "contact" }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact/" },
          ]),
        ]}
      />
      <section className="page-hero shell contact-heading">
        <div className="page-overline">
          <span>/ 03 - CONTACT</span>
          <span>THE START OF SOMETHING GOOD</span>
        </div>
        <h1>
          GOT AN
          <br />
          <em>IDEA?</em> <span className="contact-arrow">↗</span>
        </h1>
        <div className="page-hero-bottom">
          <p>Have a site, app, or unusual idea in mind? Tell me what you&apos;re thinking.</p>
          <span className="page-hero-symbol" aria-hidden="true">
            ✳
          </span>
        </div>
      </section>

      <section className="contact-main shell">
        <div className="contact-side">
          <span className="eyebrow">/ THE NEXT STEP</span>
          <h2>
            START
            <br />
            WITH A
            <br />
            <i>HELLO.</i>
          </h2>
          <p>
            Based in Sylhet, Bangladesh.
            <br />
            Working on the web, from anywhere.
          </p>
          <div className="contact-decoration" aria-hidden="true">
            ↗
          </div>
        </div>
        <div className="contact-form-wrap">
          <div className="form-top">
            <span>01 / PROJECT NOTE</span>
            <span>TAKES ABOUT A MINUTE</span>
          </div>
          <h2>LET&apos;S HEAR IT.</h2>
          <p className="form-intro">
            Your message goes straight to my inbox through Web3Forms. Nothing is stored on this website.
          </p>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
