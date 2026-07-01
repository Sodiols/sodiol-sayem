'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Shield, CodeXml, ExternalLink, Facebook, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  currentSection: string;
  isDashboardActive: boolean;
  setIsDashboardActive: (active: boolean) => void;
  portfolioName: string;
  facebook?: string;
  instagram?: string;
}

export default function Header({
  currentSection,
  isDashboardActive,
  setIsDashboardActive,
  portfolioName,
  facebook,
  instagram,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'FAQ', href: '#faq', id: 'faq' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    setIsDashboardActive(false);
    setIsOpen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 bg-white border-b border-slate-200 shadow-none ${
        scrolled || isDashboardActive
          ? 'py-3'
          : 'py-4.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-2 font-mono group"
            >
              <div className="bg-black text-white p-2 rounded-none border border-black group-hover:bg-zinc-800 transition-all">
                <CodeXml className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-zinc-600 transition-colors">
                {portfolioName || 'Sodiol Sayem'}
              </span>
            </button>
          </div>

          {/* Desktop Nav */}
          {!isDashboardActive ? (
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-2 rounded-none text-sm font-medium transition-all duration-200 hover:bg-slate-100/60 ${
                      isActive
                        ? 'text-black font-semibold border-b-2 border-black bg-zinc-100/50'
                        : 'text-slate-600 hover:text-black'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="hidden md:flex items-center">
              <span className="text-xs bg-zinc-100 text-zinc-800 px-3 py-1.5 rounded-none border border-zinc-200 font-mono tracking-wider font-medium">
                SECURE ADMIN SESSION
              </span>
            </div>
          )}

          {/* Right Action / Control Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isDashboardActive && (
              <div className="flex items-center space-x-3.5 mr-2">
                <a
                  href={facebook || "https://facebook.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-black transition-all hover:scale-105"
                  title="Facebook"
                >
                  <Facebook className="w-4.5 h-4.5" />
                </a>
                <a
                  href={instagram || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-black transition-all hover:scale-105"
                  title="Instagram"
                >
                  <Instagram className="w-4.5 h-4.5" />
                </a>
              </div>
            )}
            {isDashboardActive && (
              <button
                onClick={() => setIsDashboardActive(false)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-none text-sm font-medium transition-all duration-300 border bg-black text-white border-black hover:bg-zinc-800 cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>View Portfolio</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {isDashboardActive && (
              <button
                onClick={() => setIsDashboardActive(false)}
                className="p-2 rounded-none border bg-black text-white border-black"
                title="View Portfolio"
              >
                <Shield className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-none text-slate-600 hover:text-black hover:bg-slate-100 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-slate-200/80 shadow-none"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {!isDashboardActive ? (
                navItems.map((item) => {
                  const isActive = currentSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`block w-full text-left px-4 py-3 rounded-none text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-zinc-100 text-black border-l-4 border-black font-semibold'
                          : 'text-slate-600 hover:bg-zinc-50 hover:text-black'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-3 bg-zinc-50 rounded-none border border-zinc-200 text-center mb-2">
                  <span className="text-xs text-zinc-700 font-mono tracking-wider font-semibold">
                    ADMIN MODE
                  </span>
                </div>
              )}

              {!isDashboardActive && (
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-center space-x-6">
                  <a
                    href={facebook || "https://facebook.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-slate-600 hover:text-black transition-colors text-sm font-mono"
                  >
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                  <a
                    href={instagram || "https://instagram.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-slate-600 hover:text-black transition-colors text-sm font-mono"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </a>
                </div>
              )}

              {isDashboardActive && (
                <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      setIsDashboardActive(false);
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-black hover:bg-zinc-800 border border-black rounded-none text-base font-medium text-white transition-colors cursor-pointer"
                  >
                    <Shield className="w-5 h-5 text-white" />
                    <span>View Portfolio</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
