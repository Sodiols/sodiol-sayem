'use client';

import { ArrowUpRight, Github, Facebook, Instagram, Sparkles, FolderGit, MessageSquare, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioData } from '../types';

interface HeroProps {
  portfolio: PortfolioData;
}

export default function Hero({ portfolio }: HeroProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full max-w-full overflow-x-clip pt-28 pb-12 md:pt-36 md:pb-16">
      {/* Dynamic ambient backdrop light gray spots */}
      <div className="absolute top-1/4 left-1/4 w-[min(350px,80vw)] h-[min(350px,80vw)] bg-zinc-200/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 md:right-1/4 w-[min(400px,85vw)] h-[min(400px,85vw)] bg-zinc-100/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center min-w-0">
          {/* Main Left Bio and CTAs */}
          <div className="lg:col-span-7 flex min-w-0 flex-col space-y-6 text-center lg:text-left">
            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex max-w-full items-center gap-2 bg-black text-white px-3 py-1.5 rounded-none border border-black w-fit mx-auto lg:mx-0 text-xs font-mono font-medium tracking-wide"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-300 animate-pulse" />
              <span>Available for Full-time Roles & Freelance</span>
            </motion.div>

            {/* Sodiol Sayem Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight font-sans break-safe">
                I'm <span className="text-black font-black underline decoration-zinc-300 decoration-wavy underline-offset-4">{portfolio.name}</span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-slate-800 font-sans break-safe">
                {portfolio.title}
              </p>
            </motion.div>

            {/* Subtext description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans break-safe"
            >
              {portfolio.bio}
            </motion.p>

            {/* Social Icons & CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3"
            >
              <button
                onClick={() => scrollToSection('projects')}
                className="flex items-center space-x-2 px-6 py-3.5 bg-black hover:bg-zinc-950 text-white font-medium rounded-none shadow-none transition-all w-full sm:w-auto justify-center cursor-pointer"
              >
                <FolderGit className="w-4 h-4" />
                <span>View My Work</span>
              </button>

              <button
                onClick={() => scrollToSection('contact')}
                className="flex items-center space-x-2 px-6 py-3.5 bg-white hover:bg-zinc-50 text-slate-900 font-medium rounded-none border border-slate-200 shadow-none transition-all w-full sm:w-auto justify-center cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-black" />
                <span>Let's Discuss</span>
              </button>

              {portfolio.resumeUrl && portfolio.resumeUrl !== '#' && (
                <a
                  href={portfolio.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm font-medium text-slate-500 hover:text-black transition-colors py-2"
                >
                  <span>Download Resume</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </motion.div>

            {/* Connect line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center lg:justify-start space-x-5 pt-4 text-slate-400"
            >
              <span className="text-xs font-mono tracking-wider text-slate-400">CONNECT</span>
              <div className="h-px w-8 bg-slate-200" />
              <div className="flex space-x-4">
                <a href={portfolio.github} target="_blank" rel="noreferrer" className="hover:text-black text-slate-700 transition-colors" title="GitHub">
                  <Github className="w-5 h-5" />
                </a>
                <a href={portfolio.facebook || "https://facebook.com"} target="_blank" rel="noreferrer" className="hover:text-black text-slate-700 transition-colors" title="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href={portfolio.instagram || "https://instagram.com"} target="_blank" rel="noreferrer" className="hover:text-black text-slate-700 transition-colors" title="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right Floating Terminal Graphic */}
          <div className="lg:col-span-5 flex min-w-0 justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="w-full max-w-md min-w-0 bg-[#0d0e11] rounded-2xl overflow-hidden border border-zinc-800 shadow-none relative"
            >
              {/* Terminal header */}
              <div className="bg-[#1a1b21] px-4 py-3 border-b border-zinc-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="min-w-0 text-xs font-mono text-slate-400 flex items-center space-x-1">
                  <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="font-semibold tracking-wide truncate">sayem-env.sh</span>
                </div>
                <div className="w-4" /> {/* Spacer */}
              </div>

              {/* Terminal output */}
              <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm space-y-4 bg-[#0d0e11] leading-relaxed min-h-[250px] min-w-0">
                <div>
                  <span className="text-emerald-400">~</span> <span className="text-cyan-400 font-bold">whoami</span>
                  <p className="text-slate-300 mt-1 break-safe">Sodiol Sayem | Creative Full-Stack Engineer & Designer.</p>
                </div>
                <div>
                  <span className="text-emerald-400">~</span> <span className="text-cyan-400 font-bold">cat core_values.json</span>
                  <pre className="text-slate-300 mt-1 max-w-full overflow-x-auto font-medium bg-[#13151a] p-3 rounded-none border border-zinc-800/50">
                    <span className="text-pink-400">{"{"}</span>{"\n"}
                    {"  "}<span className="text-sky-400">"ux_polish"</span>: <span className="text-amber-300">"excellent"</span>,{"\n"}
                    {"  "}<span className="text-sky-400">"clean_architecture"</span>: <span className="text-amber-300">true</span>,{"\n"}
                    {"  "}<span className="text-sky-400">"scalable_express_apis"</span>: <span className="text-amber-300">"99.9%"</span>,{"\n"}
                    {"  "}<span className="text-sky-400">"responsiveness"</span>: <span className="text-amber-300">"mobile_first"</span>{"\n"}
                    <span className="text-pink-400">{"}"}</span>
                  </pre>
                </div>
                <div>
                  <span className="text-emerald-400">~</span> <span className="text-cyan-400 font-bold">npm run skills</span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <span className="bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-none border border-sky-500/20 text-[10px] font-semibold">React v19</span>
                    <span className="bg-zinc-100/10 text-zinc-100 px-2 py-0.5 rounded-none border border-zinc-100/20 text-[10px] font-semibold">Next.js</span>
                    <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-none border border-blue-500/20 text-[10px] font-semibold">TypeScript</span>
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-none border border-emerald-500/20 text-[10px] font-semibold">Express.js</span>
                    <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-none border border-cyan-500/20 text-[10px] font-semibold">Tailwindv4</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bento-style stats highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="grid grid-cols-1 min-[420px]:grid-cols-3 gap-4 md:gap-6 pt-16 mt-8 border-t border-slate-200/60"
        >
          <div className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-none border border-slate-200/60 text-center flex flex-col justify-center shadow-none">
            <span className="text-2xl md:text-4xl font-extrabold text-black font-mono">
              {portfolio.stats.completedProjects}+
            </span>
            <span className="text-[10px] md:text-xs text-slate-500 font-mono uppercase tracking-wider mt-1.5">
              Projects Shipped
            </span>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-none border border-slate-200/60 text-center flex flex-col justify-center shadow-none">
            <span className="text-2xl md:text-4xl font-extrabold text-slate-800 font-mono">
              {portfolio.stats.happyClients}+
            </span>
            <span className="text-[10px] md:text-xs text-slate-500 font-mono uppercase tracking-wider mt-1.5">
              Happy Clients
            </span>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-none border border-slate-200/60 text-center flex flex-col justify-center shadow-none">
            <span className="text-2xl md:text-4xl font-extrabold text-slate-700 font-mono">
              {portfolio.stats.yearsExperience}+
            </span>
            <span className="text-[10px] md:text-xs text-slate-500 font-mono uppercase tracking-wider mt-1.5">
              Years Experience
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
