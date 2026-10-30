import { ProjectShowcase } from "@/components/home/ProjectShowcase";
import { Toolboard } from "@/components/home/Toolboard";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import type { Viewport } from "next";

export const viewport: Viewport = { themeColor: "#111111" };

export default function Home() {
  return <>
    <main id="main">
      <ProjectShowcase />
      <AboutSection />
      <Toolboard />
      <ContactSection />
    </main>
    <SiteFooter />
  </>;
}
