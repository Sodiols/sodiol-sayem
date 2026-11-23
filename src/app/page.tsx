import { Hero } from "@/components/home/Hero";
import { TrustSections } from "@/components/home/TrustSections";
import { ProjectShowcase } from "@/components/home/ProjectShowcase";
import { Toolboard } from "@/components/home/Toolboard";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import type { Viewport } from "next";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site-config";
import { socialProfiles } from "@/data/navigation";
import { projects } from "@/data/projects";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = pageMetadata("/");

export const viewport: Viewport = { themeColor: "#e5e8ce" };

export default function Home() {
  return <>
    <JsonLd data={{"@context":"https://schema.org","@graph":[
      {"@type":"Person","@id":`${site.origin}/#person`,name:site.name,url:site.origin,image:`${site.origin}/images/og/home.png`,description:site.description,
        jobTitle:"Full-Stack Developer",worksFor:{"@type":"Organization",name:"Meka Agency"},
        homeLocation:{"@type":"Place",name:"Sylhet, Bangladesh",address:{"@type":"PostalAddress",addressLocality:"Sylhet",addressCountry:"BD"}},
        knowsAbout:["Full-stack web development","E-commerce development","Next.js","React","TypeScript","Supabase","PostgreSQL","Tailwind CSS"],
        sameAs:Object.values(socialProfiles).map(profile=>profile.url).filter(Boolean)},
      {"@type":"WebSite","@id":`${site.origin}/#website`,name:site.name,url:site.origin,inLanguage:"en",author:{"@id":`${site.origin}/#person`}},
      {"@type":"ItemList",name:"Selected work",itemListElement:projects.map((project,index)=>({"@type":"ListItem",position:index+1,url:`${site.origin}/work/${project.slug}`,name:project.name}))},
    ]}} />
    <main id="main">
      <Hero />
      <TrustSections />
      <ProjectShowcase />
      <AboutSection />
      <Toolboard />
      <ContactSection />
    </main>
    <SiteFooter invite={false} />
  </>;
}
