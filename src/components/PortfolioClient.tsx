'use client';

import { useEffect, useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import Skills from './Skills';
import Projects from './Projects';
import ExperienceSection from './Experience';
import Contact from './Contact';
import Faq from './Faq';
import InteractiveGrid from './InteractiveGrid';
import type { PortfolioData } from '@/types';
import { ArrowUp } from 'lucide-react';

interface PortfolioClientProps {
  initialPortfolio: PortfolioData;
}

export default function PortfolioClient({ initialPortfolio }: PortfolioClientProps) {
  const [portfolio, setPortfolio] = useState<PortfolioData>(initialPortfolio);
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const response = await fetch('/api/portfolio', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setPortfolio(data);
        }
      } catch (error) {
        console.error('Error loading portfolio:', error);
      }
    }

    loadPortfolio();
  }, []);

  useEffect(() => {
    const sections = ['home', 'skills', 'projects', 'experience', 'faq', 'contact'];

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setCurrentSection(sectionId);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="site-shell min-h-screen bg-[#fcfcfc] text-slate-900 flex flex-col font-sans selection:bg-black selection:text-white">
      <InteractiveGrid />

      <Header
        currentSection={currentSection}
        isDashboardActive={false}
        setIsDashboardActive={() => undefined}
        portfolioName={portfolio.name}
        facebook={portfolio.facebook}
        instagram={portfolio.instagram}
      />

      <main className="flex-grow relative z-10 min-w-0">
        <div className="relative z-10 space-y-16 md:space-y-24 pb-20 min-w-0">
          <div id="home" className="w-full min-h-[90vh] flex flex-col justify-center">
            <Hero portfolio={portfolio} />
          </div>

          <div id="skills" className="w-full pt-12 md:pt-16 border-t border-slate-200/40">
            <Skills skills={portfolio.skills} />
          </div>

          <div id="projects" className="w-full pt-12 md:pt-16 border-t border-slate-200/40">
            <Projects projects={portfolio.projects} />
          </div>

          <div id="experience" className="w-full pt-12 md:pt-16 border-t border-slate-200/40">
            <ExperienceSection experiences={portfolio.experiences} />
          </div>

          <div id="faq" className="w-full pt-12 md:pt-16 border-t border-slate-200/40">
            <Faq />
          </div>

          <div id="contact" className="w-full pt-12 md:pt-16 border-t border-slate-200/40">
            <Contact />
          </div>
        </div>
      </main>

      <footer className="bg-[#fcfcfc] border-t border-slate-200/80 py-12 relative z-[60] text-xs text-slate-500 overflow-x-clip">
        <div className="site-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 min-w-0 text-center md:text-left">
              <span className="w-2 h-2 shrink-0 rounded-full bg-zinc-900 animate-pulse" />
              <span className="font-mono uppercase tracking-wider text-[10px] break-safe">
                Located in Sylhet, Bangladesh • Global Remote Delivery
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-widest">
              <a href={portfolio.github} target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                GitHub
              </a>
              <a href={portfolio.facebook || 'https://facebook.com'} target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                Facebook
              </a>
              <a href={portfolio.instagram || 'https://instagram.com'} target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                Instagram
              </a>
            </div>

            <div className="font-mono text-[10px] text-center break-safe">
              &copy; {new Date().getFullYear()} {portfolio.name} Portfolio • Fully Optimized
            </div>
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 bg-black hover:bg-zinc-800 text-white rounded-full shadow-lg border border-zinc-200 transition-all focus:outline-none cursor-pointer"
          title="Scroll to Top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
