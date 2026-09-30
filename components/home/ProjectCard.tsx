"use client";

import Image from "next/image";
import Link from "next/link";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
  type Variants,
} from "motion/react";
import * as m from "motion/react-m";
import { useRef, type CSSProperties } from "react";
import type { Project, ProjectImage } from "@/data/projects";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type Crop = { x: number; y: number; width: number; height: number };

export type CardLayout = {
  /** Grid placement and height of the list item. */
  area: string;
  /** Aspect ratio of the card below the desktop mosaic. */
  shape: string;
  /** Where the photograph sits inside the card, and which edge dissolves into the ground. */
  frame: string;
  /** Width and position of the text block. */
  copy: string;
  title: string;
  sizes: string;
  delay: number;
  parallax?: boolean;
  /** Small card: once the mosaic starts, the summary waits for the widest screens. */
  compact?: boolean;
};

type ProjectCardProps = {
  project: Project;
  image: ProjectImage;
  layout: CardLayout;
  tone: "light" | "dark";
  /** object-position for the photograph, chosen per image. */
  focus?: string;
  /** A region of the source (fractions of its size) that always covers the frame, at any card shape. */
  crop?: Crop;
  /** Contrast after the grayscale conversion; flat sources need more. */
  contrast?: number;
};

const card: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0% round 8px)", y: 48 },
  shown: { clipPath: "inset(0% 0% 0% 0% round 8px)", y: 0 },
};

const photo: Variants = {
  hidden: { scale: 1.1 },
  shown: { scale: 1 },
};

const copy: Variants = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0 },
};

/**
 * Sizes and places the image so the crop region covers its frame, like object-fit: cover applied
 * to part of the image. Container query units keep this in CSS, so it holds at every breakpoint.
 */
function cropStyle(image: ProjectImage, crop: Crop): CSSProperties {
  const ratio = image.width / image.height;
  const width = `max(${100 / crop.width}cqw, ${(100 * ratio) / crop.height}cqh)`;
  return {
    width,
    height: `calc(${width} / ${ratio})`,
    left: `calc(50cqw - ${crop.x + crop.width / 2} * ${width})`,
    top: `calc(50cqh - ${(crop.y + crop.height / 2) / ratio} * ${width})`,
  };
}

function DiagonalArrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
    </svg>
  );
}

/**
 * One project in the Selected Work mosaic. The photograph is always monochrome (CSS grayscale,
 * sources untouched) and fades into a ground of the same tone where the text sits, instead of
 * being darkened by an overlay. The whole card is one link; a stretched overlay carries it.
 */
export function ProjectCard({ project, image, layout, tone, focus = "50% 50%", crop, contrast = 1.05 }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Applied through a CSS variable, only with motion-safe, and inside a 6% overscan so no edge shows.
  const drift = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const photoStyle = (layout.parallax ? { "--drift": drift } : undefined) as MotionStyle | undefined;
  const dark = tone === "dark";
  // Monochrome is a rendering treatment only; the source files keep their colour.
  const filter = `grayscale(1) contrast(${contrast})${dark ? "" : " brightness(0.95)"}`;
  const reveal = (delay: number, length = 1) =>
    reduceMotion ? { duration: 0 } : { duration: length, ease, delay: layout.delay + delay };

  return (
    <li className={layout.area}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <m.article
            ref={ref}
            data-card
            variants={card}
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={reveal(0, 1)}
            className={cn(
              "group relative isolate h-full overflow-hidden rounded-lg xl:aspect-auto",
              layout.shape,
              dark ? "bg-ink text-paper" : "bg-well text-ink",
            )}
          >
            <div className={cn("absolute", layout.frame)}>
              <m.div
                variants={photo}
                transition={reveal(0, 1.4)}
                style={photoStyle}
                className="absolute inset-x-0 -inset-y-[6%] transition-[scale] duration-700 ease-out-soft group-hover:scale-[1.025] motion-safe:translate-y-(--drift)"
              >
                {crop ? (
                  <div className="absolute inset-0 overflow-hidden [container-type:size]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      // The crop is drawn larger than the frame, so ask for a correspondingly wider source.
                      sizes={layout.sizes.replace(/(\d+)vw/g, (_, vw: string) => `${Math.ceil(Number(vw) / Math.min(crop.width, crop.height))}vw`)}
                      className="absolute max-w-none"
                      style={{ ...cropStyle(image, crop), filter }}
                    />
                  </div>
                ) : (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={layout.sizes}
                    className="object-cover"
                    style={{ objectPosition: focus, filter }}
                  />
                )}
              </m.div>
            </div>

            <m.div
              variants={copy}
              transition={reveal(0.35, 0.6)}
              className="relative flex h-full flex-col justify-between p-5 md:p-6"
            >
              <p className={cn("label flex justify-between tabular-nums", dark ? "text-paper/70" : "text-ink/60")}>
                <span>{project.number}</span>
                <span>{project.year ?? "—"}</span>
              </p>

              <div className="flex items-end justify-between gap-6">
                <div className={layout.copy}>
                  <p className={cn("label tracking-[0.12em]", dark ? "text-paper/70" : "text-ink/60")}>
                    {project.category}
                  </p>
                  <h3
                    className={cn(
                      "mt-2.5 font-semibold tracking-[-0.035em] transition-transform duration-500 ease-out-soft group-hover:translate-x-1",
                      layout.title,
                    )}
                  >
                    {project.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-3 max-w-[34ch] text-[0.875rem] leading-normal",
                      dark ? "text-paper/70" : "text-ink/70",
                      layout.compact && "xl:max-2xl:hidden",
                    )}
                  >
                    {project.summary}
                  </p>
                  <p aria-hidden className="mt-5 flex items-center gap-2.5 text-[0.8125rem] font-medium">
                    View Project <span className="arrow">→</span>
                  </p>
                </div>

                <span
                  aria-hidden
                  className={cn(
                    "grid size-11 shrink-0 place-items-center rounded-full border transition-[scale,border-color] duration-300 ease-out-soft group-hover:scale-110 md:size-12",
                    dark ? "border-paper/45 group-hover:border-paper" : "border-ink/30 group-hover:border-ink",
                  )}
                >
                  <span className="transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <DiagonalArrow />
                  </span>
                </span>
              </div>
            </m.div>

            {/* Focus ring drawn inside: the card clips its overflow, so an outside outline would be hidden. */}
            <Link
              href={`/work/${project.slug}`}
              aria-label={`${project.title} case study`}
              className={cn(
                "absolute inset-0 z-10 rounded-lg focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:ring-2 focus-visible:ring-inset",
                dark ? "focus-visible:outline-paper focus-visible:ring-ink" : "focus-visible:outline-ink focus-visible:ring-white",
              )}
            />
          </m.article>
        </MotionConfig>
      </LazyMotion>
    </li>
  );
}
