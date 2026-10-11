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
        <h1>
          GOT AN
          <br />
          <em>IDEA?</em> <span className="contact-arrow" aria-hidden="true">↗</span>
        </h1>
        <div className="page-hero-bottom">
          <p>Tell me about your website, app or desktop project.</p>
          <span className="page-hero-symbol" aria-hidden="true">
            ✳
          </span>
        </div>
      </section>

      <section className="contact-main shell">
        <div className="contact-side">
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
            Working with clients remotely.
          </p>
          <div className="contact-decoration" aria-hidden="true">
            ↗
          </div>
        </div>
        <div className="contact-form-wrap">
          <h2>SEND A MESSAGE.</h2>
          <p className="form-intro">Sent to my inbox through Web3Forms. Nothing is stored on this website.</p>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
