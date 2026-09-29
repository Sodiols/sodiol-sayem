import Link from "next/link";
import { Roboto_Flex } from "next/font/google";
import { HeroTypography } from "@/components/home/HeroTypography";
import { site } from "@/data/site";

// Scoped to the hero: its width and weight axes drive the interactive letterforms.
const display = Roboto_Flex({
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  variable: "--font-hero-display",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  adjustFontFallback: false,
});

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className={`hero page-x ${display.variable}`}>
      <p className="hero-eyebrow label text-muted">
        <span>{site.role}</span><span aria-hidden="true">/</span><span>{site.location}</span>
      </p>
      <HeroTypography />
      <div className="hero-bottom">
        <p className="hero-introduction text-muted">
          I’m {site.name}, a web developer from {site.country} building thoughtful digital products with
          Next.js, TypeScript, Node.js and Supabase.
        </p>
        <div className="hero-actions">
          <a href="#work" className="hero-primary group">
            Explore Work <span aria-hidden="true" className="arrow">→</span>
          </a>
          <Link href="/contact" className="hero-secondary group">
            Let’s Talk <span aria-hidden="true" className="arrow">→</span>
          </Link>
        </div>
      </div>
      <a href="#work" className="hero-scroll label hit text-muted" aria-label="Scroll to selected work">
        <span>Scroll to explore</span><span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
