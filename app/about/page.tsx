import Image from "next/image";
import { Capabilities } from "@/components/home/Capabilities";
import { ContactCTA } from "@/components/home/ContactCTA";
import { LocalTime } from "@/components/ui/LocalTime";
import { PageIntro } from "@/components/ui/PageIntro";
import { Reveal } from "@/components/ui/Reveal";
import { about } from "@/data/about";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Sodiol Sayem is a full stack web developer in Sylhet, Bangladesh, building useful, well crafted web products from database to interface.",
  path: "/about",
});

function IdentityPanel() {
  const facts = [
    { term: "Role", value: site.longRole },
    { term: "Based in", value: site.location },
    { term: "Coordinates", value: "24.89° N, 91.87° E" },
  ];
  return (
    <div className="flex aspect-[4/5] flex-col bg-ink p-6 text-paper md:p-8">
      <p className="label flex justify-between text-white/55">
        <span>Identity</span>
        <span>{site.country}</span>
      </p>
      <p aria-hidden className="display mt-auto text-[clamp(3.5rem,8.5vw,8rem)] leading-[0.82]">
        {site.firstName}
        <br />
        {site.lastName}
      </p>
      <dl className="label mt-8 border-t border-white/15">
        {facts.map((fact) => (
          <div key={fact.term} className="flex justify-between gap-4 border-b border-white/15 py-2.5">
            <dt className="text-white/55">{fact.term}</dt>
            <dd className="text-right">{fact.value}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 py-2.5">
          <dt className="text-white/55">Local time</dt>
          <dd>
            <LocalTime /> {site.utcOffset}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageIntro label="About" title={["I’m Sodiol", "Sayem."]}>
        <p>A web developer focused on building useful, thoughtful and well crafted digital products.</p>
      </PageIntro>

      <section aria-label="Introduction" className="page-x layout-grid gap-y-12 pb-32 md:pb-48">
        <figure className="col-span-4 md:col-span-4 lg:col-span-5">
          {about.portrait ? (
            <div className="relative aspect-[4/5] overflow-hidden bg-well">
              <Image
                src={about.portrait.src}
                alt={about.portrait.alt}
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover grayscale"
              />
            </div>
          ) : (
            <IdentityPanel />
          )}
        </figure>

        <div className="col-span-4 flex flex-col justify-end md:col-span-4 lg:col-span-5 lg:col-start-8">
          <p className="label text-muted">Biography</p>
          <p className="mt-6 text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.12] font-medium tracking-[-0.025em]">
            I care about what happens between design and engineering.
          </p>
          <div className="mt-10 max-w-[52ch] space-y-5 text-lg leading-relaxed text-muted">
            {about.biography.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="approach-heading" className="page-x pb-32 md:pb-48">
        <div className="layout-grid gap-y-8 border-t border-line pt-6">
          <p className="label col-span-4 text-muted md:col-span-2 lg:col-span-3">Approach</p>
          <h2 id="approach-heading" className="col-span-4 text-[clamp(1.75rem,2.8vw,2.5rem)] leading-[1.05] font-medium tracking-[-0.03em] md:col-span-6 lg:col-span-9">
            How I work
          </h2>
        </div>
        <ol className="layout-grid mt-12 gap-y-14 md:mt-16">
          {about.approach.map((principle, index) => (
            <li key={principle.title} className="col-span-4 md:col-span-8 lg:col-span-4">
              <Reveal delay={index * 0.1} y={16}>
                <span className="display block text-[clamp(3.5rem,6vw,5.5rem)] text-ink/15">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 border-t border-ink pt-4 text-2xl font-medium tracking-[-0.02em]">{principle.title}</h3>
                <p className="mt-3 max-w-[40ch] leading-normal text-muted">{principle.detail}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <Capabilities variant="compact" />

      <section aria-labelledby="interests-heading" className="page-x pb-32 md:pb-48">
        <div className="layout-grid gap-y-8 border-t border-line pt-6">
          <h2 id="interests-heading" className="label col-span-4 text-muted md:col-span-2 lg:col-span-3">
            Currently interested in
          </h2>
          <ul className="col-span-4 md:col-span-6 lg:col-span-9">
            {about.interests.map((interest, index) => (
              <li
                key={interest}
                className="group grid grid-cols-[2.75rem_1fr] items-baseline border-b border-line py-4 first:pt-0 md:grid-cols-[4rem_1fr]"
              >
                <span className="label text-muted">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-[clamp(1.25rem,2.2vw,2rem)] leading-[1.15] font-medium tracking-[-0.02em] transition-[translate,color] duration-200 ease-out-soft group-hover:translate-x-1.5">
                  {interest}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
