import type { Metadata, Viewport } from "next";
import { IntroLoader } from "@/components/IntroLoader";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sodiol Sayem — Creative Full Stack Developer",
  description: "Sodiol Sayem is a creative full stack developer from Sylhet, Bangladesh. Thoughtful interfaces, dependable systems, and care in the details.",
  openGraph: { title: "Sodiol Sayem", description: "Creative full stack developer. Sylhet, Bangladesh.", type: "website" },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#262823", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><head>
    <link rel="preload" href="/fonts/instrument-serif.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
    <link rel="preload" href="/fonts/cormorant-garamond-600-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <link rel="preload" href="/fonts/general-sans-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <noscript><style>{`.intro{display:none!important}.portfolio{visibility:visible!important}`}</style></noscript>
  </head><body><IntroLoader><a className="skip-link" href="#main">Skip to content</a><Navbar />{children}</IntroLoader></body></html>;
}
