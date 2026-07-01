import type { Metadata, Viewport } from 'next';
import './globals.css';
import { seoKeywords, siteName, siteUrl } from '@/lib/site';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000'
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: 'Sodiol Sayem | Frontend Developer Portfolio',
    template: '%s | Sodiol Sayem'
  },
  description:
    'Sodiol Sayem is a frontend and full stack web developer building fast, responsive, SEO optimized websites with Next.js, Tailwind CSS, Firebase, and modern UI systems.',
  keywords: seoKeywords,
  authors: [{ name: 'Sodiol Sayem' }],
  creator: 'Sodiol Sayem',
  publisher: 'Sodiol Sayem',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName,
    title: 'Sodiol Sayem | Frontend Developer Portfolio',
    description:
      'Explore responsive websites, Firebase projects, Next.js projects, and frontend development work by Sodiol Sayem.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sodiol Sayem frontend developer portfolio preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sodiol Sayem | Frontend Developer Portfolio',
    description:
      'A clean developer portfolio for Next.js, Tailwind CSS, Firebase, and responsive website projects.',
    images: ['/og-image.png']
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' }
    ],
    apple: [{ url: '/apple-icon.png' }]
  },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
