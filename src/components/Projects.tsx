'use client';

import { useState } from 'react';
import { Project } from '../types';
import { ExternalLink, Github, Search, Code, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Gather unique tech tags
  const allTechs = ['All', ...Array.from(new Set(projects.flatMap(p => p.tech)))];

  const filteredProjects = projects.filter(project => {
    const matchesTech = selectedTech === 'All' || project.tech.includes(selectedTech);
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTech && matchesSearch;
  });

  return (
    <section className="relative w-full py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center space-x-2 text-black font-mono text-sm mb-2">
              <Code className="w-4 h-4" />
              <span className="font-semibold">CRAFTED WITH PRECISION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Web Development Projects
            </h2>
            <p className="text-slate-600 mt-2 max-w-xl">
              A curated showcase of highly-responsive web products, engineered with robust cloud backends and lightning fast performance.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-t-0 border-l-0 border-r-0 border-slate-200 rounded-none pl-6 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black transition-colors shadow-none focus:ring-0"
            />
          </div>
        </div>

        {/* Tech Badges / Filters */}
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {allTechs.map((tech) => (
            <button
              key={tech}
              onClick={() => setSelectedTech(tech)}
              className={`px-4 py-2 rounded-none text-xs font-mono font-medium transition-all duration-300 border cursor-pointer whitespace-nowrap ${
                selectedTech === tech
                  ? 'bg-black text-white border-black shadow-none'
                  : 'bg-transparent text-slate-500 border-slate-200 hover:text-black hover:bg-zinc-50'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>

        {/* Bento/Grid Layout for Projects */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-slate-200 rounded-none overflow-hidden hover:border-black/30 transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Image & Overlay */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="bg-white text-slate-950 text-xs font-bold px-4 py-2 rounded-none hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                      Read Technical Case
                    </button>
                  </div>
                </div>

                {/* Info Block */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-black transition-colors">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="text-[10px] font-mono bg-zinc-100 text-zinc-800 border border-zinc-200 px-2 py-0.5 rounded-none uppercase tracking-wider font-semibold">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Tech row */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-zinc-50 text-slate-700 text-[10px] font-mono rounded-none border border-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-mono">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-black hover:text-zinc-600 transition-colors flex items-center space-x-1 font-semibold cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Case details</span>
                      </button>

                      <div className="flex items-center space-x-3 text-slate-400">
                        {project.githubUrl && project.githubUrl !== 'null' && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-black transition-colors text-slate-500"
                            title="GitHub Repo"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.demoUrl && project.demoUrl !== 'null' && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-black transition-colors text-slate-500 flex items-center space-x-1"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-none bg-zinc-50">
            <p className="text-slate-500 font-mono text-sm">No projects match the current search filters.</p>
          </div>
        )}

        {/* Case Study Details Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="fixed inset-0 bg-zinc-950/70 backdrop-blur-md"
              />

              {/* Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white border border-slate-200 rounded-none w-full max-w-2xl overflow-hidden shadow-none relative z-10"
              >
                {/* Header Cover */}
                <div className="relative h-48 sm:h-64 bg-slate-100">
                  <img
                    src={selectedProject.imageUrl}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 bg-white/85 hover:bg-zinc-100 text-slate-800 hover:text-black p-2 rounded-none border border-slate-200 transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Case Details */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-slate-800 font-mono font-semibold">Technical Case Study</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
                      {selectedProject.title}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {selectedProject.detail || selectedProject.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-slate-400 font-mono mb-2">Engineered with</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 bg-zinc-50 text-slate-700 text-xs font-mono rounded-none border border-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
                    {selectedProject.demoUrl && selectedProject.demoUrl !== 'null' && (
                      <a
                        href={selectedProject.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white font-medium rounded-none text-sm w-full sm:w-auto transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Launch App Demo</span>
                      </a>
                    )}
                    {selectedProject.githubUrl && selectedProject.githubUrl !== 'null' && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-white hover:bg-zinc-50 text-slate-800 font-medium rounded-none border border-slate-200 text-sm w-full sm:w-auto transition-all cursor-pointer"
                      >
                        <Github className="w-4 h-4" />
                        <span>View Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
