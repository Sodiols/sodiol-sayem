import type { Metadata, Viewport } from "next";
import { IntroLoader } from "@/components/IntroLoader";
import { Navbar } from "@/components/layout/Navbar";
import { Analytics } from "@/components/seo/Analytics";
import { CookieConsent } from "@/components/privacy/CookieConsent";
import { site } from "@/lib/site-config";
import { pageMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = {
  ...pageMetadata("/"),
  metadataBase: new URL(site.origin),
  applicationName: site.name,
  icons: { icon: [{url:"/favicon.ico",sizes:"any"},{url:"/icon.png",type:"image/png",sizes:"192x192"}],apple:[{url:"/apple-touch-icon.png",sizes:"180x180"}] },
  verification: { google: "iEQ4_JCjqMIA2XScyuNewP0E9x8IZbxG1sdlqgcoWXY" },
};
export const viewport: Viewport = { themeColor: "#262823", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><head>
    <link rel="preload" href="/fonts/instrument-serif.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
    <link rel="preload" href="/fonts/cormorant-garamond-600-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <link rel="preload" href="/fonts/general-sans-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <noscript><style>{`.intro{display:none!important}.portfolio{visibility:visible!important}`}</style></noscript>
  </head><body><IntroLoader><a className="skip-link" href="#main">Skip to content</a><Navbar />{children}<Analytics /><CookieConsent /></IntroLoader></body></html>;
}
