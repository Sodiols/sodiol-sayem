import { ContactForm } from "@/components/contact/ContactForm";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { LocalTime } from "@/components/ui/LocalTime";
import { PageIntro } from "@/components/ui/PageIntro";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with Sodiol Sayem about a website, web application or ecommerce project.",
  path: "/contact",
});

export default function ContactPage() {
  const channels = [
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "GitHub", value: site.github.replace("https://", ""), href: site.github },
    site.linkedin ? { label: "LinkedIn", value: "Profile", href: site.linkedin } : null,
  ].filter((channel) => channel !== null);

  return (
    <>
      <PageIntro label="Contact" title={["Let’s build", "something good."]} size="compact">
        <p>Have a project, idea or interesting problem? Send a note, or email me directly.</p>
      </PageIntro>

      <section className="page-x pb-32 md:pb-48" aria-label="Contact details and form">
        <div className="layout-grid gap-y-16 border-t border-line pt-8 md:pt-10">
          <aside className="col-span-4 md:col-span-3 lg:col-span-4">
            <dl>
              {channels.map((channel) => (
                <div key={channel.label} className="border-b border-line py-4 first:pt-0">
                  <dt className="label text-muted">{channel.label}</dt>
                  <dd className="mt-2 text-lg break-words">
                    <ArrowLink href={channel.href}>{channel.value}</ArrowLink>
                  </dd>
                </div>
              ))}
              <div className="py-4">
                <dt className="label text-muted">Location</dt>
                <dd className="mt-2 text-lg">{site.location}</dd>
                <dd className="label mt-1 text-muted">
                  <LocalTime seconds={false} /> {site.utcOffset}
                </dd>
              </div>
            </dl>
            <p className="mt-8 max-w-[34ch] text-[0.9375rem] leading-normal text-muted">
              Prefer email? Write to the address above instead of using the form.
            </p>
          </aside>

          <div id="message-form" className="col-span-4 scroll-mt-24 md:col-span-5 md:col-start-4 lg:col-span-7 lg:col-start-6">
            <h2 className="label mb-8 text-muted">Send a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
