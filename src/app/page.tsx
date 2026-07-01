import type { Metadata } from 'next';
import PortfolioClient from '@/components/PortfolioClient';
import { getPortfolio } from '@/lib/data';
import { seoKeywords, siteUrl } from '@/lib/site';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const portfolio = await getPortfolio();

  return {
    title: `${portfolio.name} | ${portfolio.title}`,
    description: portfolio.bio,
    alternates: {
      canonical: '/'
    },
    openGraph: {
      title: `${portfolio.name} | ${portfolio.title}`,
      description: portfolio.bio,
      url: '/',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${portfolio.name} portfolio preview`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${portfolio.name} | ${portfolio.title}`,
      description: portfolio.bio,
      images: ['/og-image.png']
    }
  };
}

export default async function HomePage() {
  const portfolio = await getPortfolio();

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: portfolio.name,
      jobTitle: portfolio.title,
      description: portfolio.bio,
      url: siteUrl,
      image: `${siteUrl}/logo.png`,
      email: `mailto:${portfolio.email}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sylhet',
        addressCountry: 'Bangladesh'
      },
      sameAs: [portfolio.github, portfolio.facebook, portfolio.instagram].filter(Boolean),
      knowsAbout: seoKeywords
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: `${portfolio.name} Portfolio`,
      url: siteUrl,
      description: portfolio.bio,
      inLanguage: 'en'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Selected web development projects',
      itemListElement: portfolio.projects.map((project, index) => ({
        '@type': 'CreativeWork',
        position: index + 1,
        name: project.title,
        description: project.description,
        url: project.demoUrl && project.demoUrl !== 'null' ? project.demoUrl : siteUrl,
        image: `${siteUrl}${project.imageUrl}`
      }))
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PortfolioClient initialPortfolio={portfolio} />
    </>
  );
}
