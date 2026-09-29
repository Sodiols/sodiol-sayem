import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { site } from "@/data/site";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const title = `${site.name} — ${site.longRole}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "Sodiol Sayem",
    "Web Developer",
    "Full Stack Developer",
    "Next.js Developer",
    "Web Application Developer",
    "Bangladesh",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title,
    description: site.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f5f5f2",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      jobTitle: site.longRole,
      url: site.url,
      email: `mailto:${site.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Sylhet", addressCountry: "BD" },
      sameAs: [site.github, site.linkedin].filter(Boolean),
      knowsAbout: ["Next.js", "React", "TypeScript", "Node.js", "Supabase", "PostgreSQL"],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      url: site.url,
      author: { "@id": `${site.url}/#person` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Browser extensions (e.g. ColorZilla's cz-shortcut-listen) add attributes to <html>/<body> before
    // React hydrates. suppressHydrationWarning only ignores these two elements' own attributes.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <noscript>
          {/* Scroll reveals start hidden; without JavaScript they would never appear. */}
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body suppressHydrationWarning>
        <a
          href="#main"
          className="caps fixed top-3 left-3 z-[60] -translate-y-20 bg-ink px-4 py-3.5 text-paper focus:translate-y-0"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
