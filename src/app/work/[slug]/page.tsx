import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { site } from "@/lib/site-config";
import { CaseStudyContent } from "@/components/home/CaseStudyContent";
import { SiteFooter } from "@/components/layout/SiteFooter";
import styles from "@/components/home/ProjectShowcase.module.css";
import { JsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  const title = `${project.name} — Development Case Study | Sodiol Sayem`;
  const url = `${site.origin}/work/${project.slug}`;
  const image = { url: new URL(project.image.src, site.origin).href, width: project.image.width, height: project.image.height, alt: project.alt };
  return { title: { absolute: title }, description: project.description, alternates: { canonical: url }, robots: { index: true, follow: true },
    openGraph: { title, description: project.description, url, type: "article", siteName: site.name, images: [image] },
    twitter: { card: "summary_large_image", title, description: project.description, images: [image.url] } };
}
export default async function Work({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex(item => item.slug === slug);
  if (index < 0) notFound();
  const project = projects[index], next = projects[(index + 1) % projects.length];
  const url = `${site.origin}/work/${project.slug}`;
  return <><JsonLd data={{"@context":"https://schema.org","@graph":[
      {"@type":"CreativeWork","@id":`${url}#work`,name:project.name,headline:`${project.name} — Development Case Study`,description:project.description,url,
        image:new URL(project.image.src, site.origin).href,genre:project.category,keywords:project.technologies.join(", "),
        creator:{"@type":"Person","@id":`${site.origin}/#person`,name:site.name,url:site.origin},sameAs:project.href},
      {"@type":"BreadcrumbList",itemListElement:[
        {"@type":"ListItem",position:1,name:"Home",item:site.origin},
        {"@type":"ListItem",position:2,name:"Selected work",item:`${site.origin}/#work`},
        {"@type":"ListItem",position:3,name:project.name,item:url}]},
    ]}} />
    <main id="main" className={`${styles.caseStudy} ${styles.standalone}`}>
    <nav className={styles.caseTop} aria-label="Case study navigation"><Link href="/#work">← Selected work</Link><Link href="/#contact">Discuss a project ↗</Link></nav>
    <CaseStudyContent project={project} />
    <nav aria-label="Next case study"><Link className={styles.nextProject} href={`/work/${next.slug}`}>
      <span>Next project</span><strong translate="no">{next.name} <span aria-hidden="true">→</span></strong></Link></nav>
  </main><SiteFooter /></>;
}
