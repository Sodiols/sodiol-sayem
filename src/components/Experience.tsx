'use client';

import { Experience } from '../types';
import { Briefcase, Calendar, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface ExperienceProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceProps) {
  return (
    <section className="relative w-full py-12 md:py-16">
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-zinc-200/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center space-x-2 text-black font-mono text-sm mb-2">
            <Briefcase className="w-4 h-4" />
            <span className="font-semibold">MY JOURNEY SO FAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Professional Experience
          </h2>
          <p className="text-slate-600 mt-2 max-w-xl">
            A history of building responsive, robust modern client frameworks and shipping secure server applications.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative max-w-3xl mx-auto pl-6 sm:pl-8 border-l border-slate-200 space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Floating Node Circle */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-6 h-6 rounded-none bg-white border border-slate-200 flex items-center justify-center text-black shadow-none">
                <Star className="w-3 h-3 text-black fill-black" />
              </div>

              {/* Box Details */}
              <div className="bg-white p-6 rounded-none border border-slate-200 hover:border-black/30 transition-all duration-300 shadow-none">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-950 tracking-tight">
                      {exp.role}
                    </h3>
                    <p className="text-black font-semibold text-sm font-sans mt-0.5">
                      {exp.company}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-600 bg-zinc-50 px-3 py-1 rounded-none border border-slate-200 w-fit">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{exp.duration}</span>
                  </div>
                </div>

                {/* Bullets List */}
                <ul className="space-y-2 text-slate-600 text-sm leading-relaxed list-disc list-inside">
                  {exp.description.map((bullet, idx) => (
                    <li key={idx} className="marker:text-black">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
