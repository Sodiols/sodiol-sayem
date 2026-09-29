import { AboutPreview } from "@/components/home/AboutPreview";
import { Capabilities } from "@/components/home/Capabilities";
import { ContactCTA } from "@/components/home/ContactCTA";
import { Hero } from "@/components/home/Hero";
import { SelectedWork } from "@/components/home/SelectedWork";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <AboutPreview />
      <Capabilities />
      <ContactCTA />
    </>
  );
}
