import { ProjectShowcase } from "@/components/home/ProjectShowcase";
import { Toolboard } from "@/components/home/Toolboard";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import type { Viewport } from "next";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site-config";
import { socialProfiles } from "@/data/navigation";

export const metadata = pageMetadata("/");

export const viewport: Viewport = { themeColor: "#262823" };

export default function Home() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@graph":[
      {"@type":"Person","@id":`${site.origin}/#person`,name:site.name,url:site.origin,jobTitle:"Full-Stack Developer",worksFor:{"@type":"Organization",name:"Meka Agency"},homeLocation:{"@type":"Place",name:"Sylhet, Bangladesh"},sameAs:Object.values(socialProfiles).map(profile=>profile.url).filter(Boolean)},
      {"@type":"WebSite","@id":`${site.origin}/#website`,name:site.name,url:site.origin,inLanguage:"en",author:{"@id":`${site.origin}/#person`}},
    ]}).replace(/</g,"\\u003c")}} />
    <main id="main">
      <ProjectShowcase />
      <AboutSection />
      <Toolboard />
      <ContactSection />
    </main>
    <SiteFooter />
  </>;
}
