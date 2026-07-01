'use client';

import { Skill } from '../types';
import { motion } from 'motion/react';
import { Cpu, Terminal, Laptop, Settings } from 'lucide-react';

interface SkillsProps {
  skills: Skill[];
}

export default function Skills({ skills }: SkillsProps) {
  const categories = {
    Frontend: {
      icon: <Laptop className="w-5 h-5 text-black" />,
      color: 'bg-black',
      borderColor: 'group-hover:border-black/30',
      textColor: 'text-black font-semibold',
    },
    Backend: {
      icon: <Cpu className="w-5 h-5 text-zinc-800" />,
      color: 'bg-zinc-800',
      borderColor: 'group-hover:border-zinc-800/30',
      textColor: 'text-zinc-800 font-semibold',
    },
    Tools: {
      icon: <Settings className="w-5 h-5 text-zinc-600" />,
      color: 'bg-zinc-600',
      borderColor: 'group-hover:border-zinc-600/30',
      textColor: 'text-zinc-600 font-semibold',
    },
  };

  const getSkillsByCategory = (cat: 'Frontend' | 'Backend' | 'Tools') => {
    return skills.filter((s) => s.category === cat);
  };

  return (
    <section className="relative w-full py-12 md:py-16">
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-zinc-200/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 text-black font-mono text-sm mb-2">
            <Terminal className="w-4 h-4" />
            <span className="font-semibold">ENGINEERED TO PERFECTION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Technical Arsenal
          </h2>
          <p className="text-slate-600 mt-2 max-w-xl">
            My proficiency spans client experience optimization, resilient state models, and scalable database layers.
          </p>
        </div>

        {/* Bento Grid layout for Skills Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(['Frontend', 'Backend', 'Tools'] as const).map((categoryName) => {
            const catMeta = categories[categoryName];
            const catSkills = getSkillsByCategory(categoryName);

            return (
              <div
                key={categoryName}
                className="group bg-white hover:bg-zinc-50/50 border border-slate-200 rounded-none p-6 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-zinc-50 p-2.5 rounded-none border border-slate-200 text-slate-800">
                        {catMeta.icon}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {categoryName}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {catSkills.length} SKILLS
                    </span>
                  </div>

                  {/* Skills List with Levels */}
                  <div className="space-y-4">
                    {catSkills.map((skill) => (
                      <div key={skill.id} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-700 font-medium">{skill.name}</span>
                          <span className={`font-mono text-[10px] ${catMeta.textColor}`}>
                            {skill.level}%
                          </span>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="h-1.5 bg-slate-100 rounded-none overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full rounded-none ${catMeta.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer text of bento box */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  <span>Sodiol Sayem</span>
                  <span>Stack Configured</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
