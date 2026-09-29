import Link from "next/link";
import type { CSSProperties } from "react";
import { ProjectCard, type CardLayout, type Crop } from "@/components/home/ProjectCard";
import { ScrollCue, WorkGeometry } from "@/components/home/WorkDetails";
import { WorkMosaic } from "@/components/home/WorkMosaic";
import { InView } from "@/components/ui/InView";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";

// The mosaic, desktop first: a tall card on the left, a wide and a compact card beside it, and a
// panorama underneath, from 1280px. Below that, tablets and laptops keep the tall and panorama cards full width with the other two
// paired between them; phones stack everything in order.
// Frames: "stacked" puts the photograph on top and fades its edges into the card's ground,
// "split" puts it on the right and fades its left edge, leaving calm space for the text.
const layouts: CardLayout[] = [
  {
    area: "md:col-span-2 xl:col-span-1 xl:row-span-2",
    shape: "aspect-[4/5] md:aspect-[16/10]",
    frame:
      "inset-x-0 top-0 h-[64%] [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_58%,transparent)] md:left-auto md:h-full md:w-[60%] md:[mask-image:linear-gradient(to_right,transparent,#000_38%),linear-gradient(to_bottom,transparent,#000_16%)] md:[mask-composite:intersect] xl:left-0 xl:h-[66%] xl:w-full xl:[mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_58%,transparent)]",
    copy: "md:max-w-[42%] xl:max-w-none",
    title: "text-[clamp(2rem,2.7vw,2.875rem)] leading-[0.95]",
    sizes: "(min-width: 1280px) 30vw, (min-width: 768px) 60vw, 100vw",
    delay: 0,
    parallax: true,
  },
  {
    area: "xl:col-start-2 xl:row-start-1 xl:mb-3",
    shape: "aspect-[4/5]",
    frame:
      "inset-x-0 top-0 h-[62%] [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_58%,transparent)] xl:left-auto xl:h-full xl:w-[62%] xl:[mask-image:linear-gradient(to_right,transparent,#000_36%),linear-gradient(to_bottom,transparent,#000_16%)] xl:[mask-composite:intersect]",
    copy: "xl:max-w-[46%]",
    title: "text-[clamp(1.625rem,2vw,2.125rem)] leading-none",
    sizes: "(min-width: 1280px) 26vw, (min-width: 768px) 50vw, 100vw",
    delay: 0.08,
  },
  {
    area: "xl:col-start-3 xl:row-start-1",
    shape: "aspect-[4/5]",
    frame: "inset-x-0 top-0 h-[62%] xl:h-[56%] [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_58%,transparent)]",
    copy: "",
    title: "text-[clamp(1.625rem,1.8vw,2rem)] leading-none",
    sizes: "(min-width: 1280px) 24vw, (min-width: 768px) 50vw, 100vw",
    delay: 0.16,
    compact: true,
  },
  {
    area: "md:col-span-2 xl:col-start-2 xl:row-start-2",
    shape: "aspect-[4/5] md:aspect-[2/1]",
    frame:
      "inset-x-0 top-0 h-[62%] [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_58%,transparent)] md:left-auto md:h-full md:w-[58%] md:[mask-image:linear-gradient(to_right,transparent,#000_34%),linear-gradient(to_bottom,transparent,#000_16%)] md:[mask-composite:intersect]",
    copy: "md:max-w-[40%]",
    title: "text-[clamp(2rem,2.7vw,2.875rem)] leading-[0.95]",
    sizes: "(min-width: 1280px) 40vw, (min-width: 768px) 58vw, 100vw",
    delay: 0.04,
    parallax: true,
  },
];

// Art direction per project: which of its images to use, how it is cropped, and whether it is a
// dark image that needs a dark ground and light type. Anything not listed uses its hero image,
// centred, on a light ground.
type ArtDirection = { src?: string; tone?: "dark"; focus?: string; crop?: Crop; contrast?: number; seamless?: boolean };

const direction: Record<string, ArtDirection> = {
  // The invitation photograph from the mobile homepage, cropped inside the surrounding interface.
  husnalogy: { src: "/projects/husnalogy/mobile.webp", crop: { x: 0.06, y: 0.215, width: 0.86, height: 0.345 } },
  tara: { focus: "62% 40%" },
  // The photograph on the right of the homepage hero, clear of its headline. It sits under a
  // flat colour wash on the site, so it needs extra contrast once grey.
  meka: { src: "/projects/meka/hero.webp", tone: "dark", crop: { x: 0.52, y: 0.18, width: 0.48, height: 0.72 }, contrast: 1.45 },
  // Its dark interface greys to exactly the ink ground, so the photograph needs no fade.
  prichat: { tone: "dark", seamless: true },
};

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export function SelectedWork() {
  const featured = projects.slice(0, layouts.length);

  // Facts only, derived from the data files.
  const liveProjects = projects.filter((project) => project.url).length;
  const technologies = new Set(projects.flatMap((project) => project.technologies)).size;
  const since = Math.min(...experience.flatMap((entry) => entry.period.match(/\d{4}/g) ?? []).map(Number));
  const stats = [
    { value: liveProjects, label: ["Live", "projects"] },
    { value: technologies, label: ["Technologies", "shipped"] },
    ...(Number.isFinite(since) ? [{ value: since, label: ["Independent", "since"] }] : []),
  ];

  return (
    <section id="work" aria-labelledby="work-heading" className="page-x relative scroll-mt-8 overflow-clip pt-24 pb-32 md:pt-32 lg:pb-40">
      <InView className="relative">
        <div className="flex items-center gap-4">
          <p className="label rise-in tracking-[0.18em] text-muted">
            02 <span className="mx-1.5">/</span> Portfolio
          </p>
        </div>

        <div className="relative z-[1] mt-7 flex flex-col gap-8 md:mt-9 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2
              id="work-heading"
              className="text-[clamp(3.25rem,8.2vw,9.5rem)] leading-[0.9] font-semibold tracking-[-0.06em]"
            >
              <span className="unmask">
                <span style={delay(80)}>Selected Work</span>
              </span>
            </h2>
            <p className="rise-in mt-6 max-w-[46ch] text-[1.0625rem] leading-relaxed text-muted md:mt-8" style={delay(240)}>
              Websites and digital products designed and developed for real businesses, from custom
              commerce platforms to a realtime chat application.
            </p>
          </div>

          <Link
            href="/work"
            className="rise-in group inline-flex min-h-13 items-center gap-8 self-start rounded-full border border-ink/15 bg-white px-7 text-[0.875rem] font-medium transition-colors duration-200 hover:border-ink lg:mt-[clamp(0.5rem,1.6vw,2rem)]"
            style={delay(360)}
          >
            View All Work <span aria-hidden className="arrow">→</span>
          </Link>
        </div>

        <WorkGeometry className="absolute top-[-3.5rem] left-[47%] hidden aspect-[560/300] w-[36%] [mask-image:linear-gradient(to_bottom,transparent,#000_40%)] lg:block">
          <p className="rise-in absolute top-[52%] left-[60%] hidden text-[0.8125rem] leading-snug text-muted xl:block" style={delay(420)}>
            Commerce
            <br />
            Websites
            <br />
            Applications
            <br />
            for real businesses.
          </p>
        </WorkGeometry>
      </InView>

      <div className="mt-14 md:mt-20">
        <WorkMosaic>
          {featured.map((project, index) => {
            const art = direction[project.slug] ?? {};
            const images = [project.heroImage, ...project.gallery];
            // Without direction, the tall card prefers a portrait screen when the project has one.
            const image =
              images.find((item) => item.src === art.src) ??
              (index === 0 ? images.find((item) => item.height > item.width) : undefined) ??
              project.heroImage;
            return (
              <ProjectCard
                key={project.slug}
                project={project}
                image={image}
                layout={layouts[index]}
                tone={art.tone ?? "light"}
                focus={art.focus}
                crop={art.crop}
                contrast={art.contrast}
                seamless={art.seamless}
              />
            );
          })}
        </WorkMosaic>
      </div>

      <div className="mt-14 flex flex-col gap-10 md:mt-16 md:flex-row md:items-center md:justify-between">
        <dl className="flex">
          {stats.map((stat, index) => (
            <div key={stat.label.join(" ")} className={index === 0 ? "pr-6 md:pr-10" : "border-l border-line px-6 md:px-10"}>
              <dt className="sr-only">{stat.label.join(" ")}</dt>
              <dd className="text-[1.75rem] leading-none font-semibold tracking-[-0.04em] tabular-nums">{stat.value}</dd>
              <dd aria-hidden className="mt-2.5 text-[0.8125rem] leading-snug text-muted">
                {stat.label[0]}
                <br />
                {stat.label[1]}
              </dd>
            </div>
          ))}
        </dl>
        <ScrollCue href="#after-work" />
      </div>
      <span id="after-work" aria-hidden className="absolute bottom-0" />
    </section>
  );
}
