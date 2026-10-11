import type { OgOptions } from "@/lib/og";
import { projects } from "@/data/projects";

export const ogSize = { width: 1200, height: 630 };

type ShareImage = OgOptions & { alt: string };

/** One social sharing image per page, served as /og/<id>.png by app/og/[image]/route.tsx. */
export const shareImages: Record<string, ShareImage> = {
  home: {
    alt: "Sodiol, creative developer based in Sylhet, Bangladesh",
    section: "PORTFOLIO",
    title: ["SODIOL"],
    subtitle: "Websites, online stores, web apps and desktop software.",
    tag: "SYLHET, BD",
  },
  about: {
    alt: "About Sodiol, creative developer",
    section: "ABOUT",
    title: ["HI, I'M", "SODIOL"],
    subtitle: "A creative developer from Sylhet, Bangladesh.",
    tag: "ABOUT",
  },
  work: {
    alt: "Selected projects by Sodiol",
    section: "WORK",
    title: ["SELECTED", "PROJECTS"],
    subtitle: "Websites, web apps, commerce and desktop software.",
    tag: `${projects.length} PROJECTS`,
  },
  contact: {
    alt: "Contact Sodiol: got an idea?",
    section: "CONTACT",
    title: ["GOT AN", "IDEA?"],
    subtitle: "Tell me about your website, app or desktop project.",
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
        },
      },
    ]),
  ),
};

export type ShareImageId = keyof typeof shareImages;

export function shareImagePath(id: ShareImageId): string {
  return `/og/${id}.png`;
}
