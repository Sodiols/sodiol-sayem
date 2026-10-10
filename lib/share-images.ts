import type { OgOptions } from "@/lib/og";
import { projects } from "@/data/projects";

export const ogSize = { width: 1200, height: 630 };

type ShareImage = OgOptions & { alt: string };

const total = String(projects.length).padStart(2, "0");

/** One social sharing image per page, served as /og/<id>.png by app/og/[image]/route.tsx. */
export const shareImages: Record<string, ShareImage> = {
  home: {
    alt: "Sodiol, creative developer based in Sylhet, Bangladesh",
    section: "PORTFOLIO",
    title: ["SODIOL"],
    subtitle: "Digital things, built with intention.",
    tag: "SYLHET, BD",
  },
  about: {
    alt: "About Sodiol: not your average dev",
    section: "ABOUT",
    title: ["NOT YOUR", "AVERAGE DEV"],
    subtitle: "A creative developer from Sylhet, Bangladesh.",
    tag: "THE PERSON",
  },
  work: {
    alt: "Selected work by Sodiol: proof in the pixels",
    section: "WORK",
    title: ["PROOF IN", "THE PIXELS"],
    subtitle: "Websites, web apps, commerce and desktop software.",
    tag: `${projects.length} PROJECTS`,
  },
  contact: {
    alt: "Contact Sodiol: got an idea?",
    section: "CONTACT",
    title: ["GOT AN", "IDEA?"],
    subtitle: "Have a site, app, or unusual idea in mind?",
    tag: "SAY HELLO",
  },
  ...Object.fromEntries(
    projects.map((project): [string, ShareImage] => [
      project.slug,
      {
        alt: `${project.name} case study by Sodiol: ${project.detail}`,
        section: "CASE STUDY",
        title: project.title.split(" "),
        subtitle: project.detail,
        tag: project.format,
        panel: {
          background: project.og.background,
          foreground: project.og.foreground,
          label: project.type,
          number: `${project.number} / ${total}`,
        },
      },
    ]),
  ),
};

export type ShareImageId = keyof typeof shareImages;

export function shareImagePath(id: ShareImageId): string {
  return `/og/${id}.png`;
}
