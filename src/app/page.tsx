import { ProjectShowcase } from "@/components/home/ProjectShowcase";
import { Toolboard } from "@/components/home/Toolboard";
import Link from "next/link";
import type { Viewport } from "next";

export const viewport: Viewport = { themeColor: "#111111" };

export default function Home() {
  return <>
    <main id="main">
      <ProjectShowcase />
      <section className="about section" id="about" aria-labelledby="about-title"><h2 id="about-title">A feel for the details.<br />An eye on the whole.</h2><div><p>I’m a full stack developer from Sylhet, Bangladesh. I care how a website looks, and how it works.</p><Link className="about-page-link" href="/about">More about me <span aria-hidden="true">↗</span></Link></div></section>
      <Toolboard />
      <section className="contact section" id="contact"><p>Have an idea in mind?</p><h2>Let’s make it happen.</h2><p>Find me on <a href="https://github.com/Sodiols" target="_blank" rel="noopener noreferrer">GitHub ↗</a></p></section>
    </main>
    <footer><a className="wordmark" href="#home">sodiol.</a><p>Designed & built in Sylhet, Bangladesh.</p><a href="#home">Back to top ↑</a></footer>
  </>;
}
