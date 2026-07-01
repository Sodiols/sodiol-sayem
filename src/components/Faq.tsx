'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      question: "What services do you provide?",
      answer: "I specialize in end-to-end web application development, including high-fidelity front-end design, secure server-side architectures, API integrations, and cloud database optimization. I construct fast, responsive, and intuitive web solutions."
    },
    {
      question: "What is your typical project timeline?",
      answer: "Timelines vary depending on scope. A standard landing page or portfolio takes 1–2 weeks, while complex full-stack applications with user systems, custom dashboards, or database architectures typically range between 4–8 weeks."
    },
    {
      question: "How do you handle project collaboration and updates?",
      answer: "I prioritize open, continuous communication. I share live progress builds, host weekly check-ins, and maintain structured milestones. This ensures we remain fully aligned from discovery to deployment."
    },
    {
      question: "Are you open to full-time opportunities or freelance contract roles?",
      answer: "Yes, I am available for both long-term full-time roles and high-impact freelance contracts. I thrive in agile development teams and collaborative workspaces."
    },
    {
      question: "What technologies are in your core stack?",
      answer: "My core expertise centers around React, TypeScript, Node.js, Express, Tailwind CSS, and various relational or non-relational database services such as Firestore and PostgreSQL."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header section with minimal badge */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-100 border border-zinc-200 text-[10px] font-mono uppercase tracking-widest text-slate-800 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Got Questions?</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-sm text-slate-500 max-w-lg mx-auto">
          Find clear answers to common inquiries regarding my development workflow, tech stack, and typical timelines.
        </p>
      </div>

      {/* Accordion container */}
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-slate-200 bg-white transition-all duration-300 hover:border-slate-300"
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <span className="flex items-start space-x-3.5">
                  <HelpCircle className={`w-5 h-5 shrink-0 mt-0.5 transition-colors duration-300 ${isOpen ? 'text-black' : 'text-slate-400'}`} />
                  <span className={`text-base font-medium transition-colors duration-200 ${isOpen ? 'text-black' : 'text-slate-800'}`}>
                    {faq.question}
                  </span>
                </span>
                <span className={`p-1 bg-zinc-50 border border-slate-100 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-zinc-100 border-slate-200' : ''}`}>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-1 text-sm text-slate-500 leading-relaxed pl-14 pr-10 border-t border-slate-100">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
