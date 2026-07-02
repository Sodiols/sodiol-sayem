'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Send, Mail, MapPin, Phone, MessageSquare, AlertCircle, CheckCircle2, DollarSign, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    budget: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const budgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (budgetRef.current && !budgetRef.current.contains(event.target as Node)) {
        setIsBudgetOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const budgetOptions = [
    'Less than $1,000',
    '$1,000 - $3,000',
    '$3,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000+',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Name, email, and message are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit inquiry.');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        budget: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full max-w-full py-12 md:py-16 overflow-x-clip">
      {/* Background blobs */}
      <div className="absolute top-1/3 right-0 md:right-1/4 w-[min(300px,80vw)] h-[min(300px,80vw)] bg-zinc-200/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="site-container relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 text-black font-mono text-sm mb-2 justify-center">
            <MessageSquare className="w-4 h-4" />
            <span className="font-semibold">LET'S BUILD SOMETHING GREAT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Start a Project Inquiry
          </h2>
          <p className="text-slate-600 mt-2 break-safe">
            Have an application, UI feature, or business need? Share your scope details and let's transform it together.
          </p>
        </div>

        {/* Form and Contact Cards layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-w-0">
          
          {/* Left Block info cards */}
          <div className="lg:col-span-4 space-y-4 min-w-0">
            
            {/* Quick Contact Info */}
            <div className="bg-white border border-slate-200 rounded-none p-6 space-y-6 shadow-none">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Say Hello directly
              </h3>
              
              <div className="space-y-4">
                <a
                  href="mailto:itssayem2023@gmail.com"
                  className="flex min-w-0 items-start space-x-3.5 group hover:text-black text-slate-600 transition-colors"
                >
                  <div className="bg-zinc-50 p-2.5 rounded-none border border-slate-200 text-black group-hover:bg-zinc-100 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs text-slate-400 font-mono">EMAIL</span>
                    <span className="text-sm font-medium text-slate-800 break-safe">itssayem2023@gmail.com</span>
                  </div>
                </a>

                <div className="flex min-w-0 items-start space-x-3.5 text-slate-600">
                  <div className="bg-zinc-50 p-2.5 rounded-none border border-slate-200 text-black">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs text-slate-400 font-mono">LOCATION</span>
                    <span className="text-sm font-medium text-slate-800 break-safe">Sylhet, Bangladesh</span>
                  </div>
                </div>

                <a
                  href="https://wa.me/8801626974965"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 items-start space-x-3.5 group hover:text-black text-slate-600 transition-colors"
                >
                  <div className="bg-zinc-50 p-2.5 rounded-none border border-slate-200 text-black group-hover:bg-zinc-100 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs text-slate-400 font-mono">WHATSAPP / PHONE</span>
                    <span className="text-sm font-medium text-slate-800 group-hover:underline break-safe">01626974965</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Notice Card */}
            <div className="bg-white border border-slate-200 rounded-none p-6 shadow-none">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-2">Notice for Inquiries</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                I strictly review all inquiry submissions within 12 hours. Confirmed proposals receive standard Slack / Discord dashboard triggers to coordinate active development streams.
              </p>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-none p-4 sm:p-8 shadow-none min-w-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="form-name" className="block text-xs font-mono text-slate-700 font-semibold uppercase tracking-wider">Your Name *</label>
                  <input
                    id="form-name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border-b border-t-0 border-l-0 border-r-0 border-slate-200 rounded-none px-1 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black transition-colors focus:ring-0"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="form-email" className="block text-xs font-mono text-slate-700 font-semibold uppercase tracking-wider">Your Email *</label>
                  <input
                    id="form-email"
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border-b border-t-0 border-l-0 border-r-0 border-slate-200 rounded-none px-1 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black transition-colors focus:ring-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Subject */}
                <div className="space-y-1.5">
                  <label htmlFor="form-subject" className="block text-xs font-mono text-slate-700 font-semibold uppercase tracking-wider">Subject</label>
                  <input
                    id="form-subject"
                    type="text"
                    placeholder="I would like to talk about "
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white border-b border-t-0 border-l-0 border-r-0 border-slate-200 rounded-none px-1 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black transition-colors focus:ring-0"
                  />
                </div>

                {/* Project Budget Dropdown */}
                <div className="space-y-1.5" ref={budgetRef}>
                  <label htmlFor="form-budget" className="block text-xs font-mono text-slate-700 font-semibold uppercase tracking-wider">Project Budget</label>
                  <div className="relative">
                    <button
                      id="form-budget"
                      type="button"
                      onClick={() => setIsBudgetOpen(!isBudgetOpen)}
                      className="w-full bg-white border-b border-t-0 border-l-0 border-r-0 border-slate-200 rounded-none pl-6 pr-10 py-3 text-sm text-slate-900 text-left focus:outline-none focus:border-black transition-colors cursor-pointer flex items-center justify-between gap-2"
                    >
                      <span className="flex items-center">
                        <DollarSign className="absolute left-0 w-4 h-4 text-slate-500" />
                        <span className={`truncate ${formData.budget ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                          {formData.budget || 'Select scope budget'}
                        </span>
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isBudgetOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isBudgetOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute left-0 right-0 top-full z-50 mt-1 bg-white border border-slate-200/90 shadow-xl rounded-none py-1"
                        >
                          <div className="max-h-60 overflow-y-auto font-sans">
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, budget: '' });
                                setIsBudgetOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs text-slate-400 hover:bg-zinc-50 hover:text-black transition-colors font-mono uppercase tracking-wider"
                            >
                              Clear selection
                            </button>
                            {budgetOptions.map((opt) => {
                              const isSelected = formData.budget === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, budget: opt });
                                    setIsBudgetOpen(false);
                                  }}
                                  className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${
                                    isSelected
                                      ? 'bg-zinc-100 text-black font-semibold'
                                      : 'text-slate-700 hover:bg-zinc-50 hover:text-black'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {isSelected && <span className="w-1.5 h-1.5 bg-black" />}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="form-message" className="block text-xs font-mono text-slate-700 font-semibold uppercase tracking-wider">Project Details *</label>
                <textarea
                  id="form-message"
                  required
                  rows={4}
                  placeholder="Outline your layout objectives, requested features, or timelines here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white border-b border-t-0 border-l-0 border-r-0 border-slate-200 rounded-none px-1 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black transition-colors resize-none focus:ring-0"
                />
              </div>

              {/* Status Notifications */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-none text-xs sm:text-sm flex items-start space-x-2"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-none text-xs sm:text-sm flex items-start space-x-2"
                  >
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Inquiry submitted successfully!</p>
                      <p className="text-xs text-emerald-700/80 mt-0.5">Thank you for your response. Sodiol Sayem's admin dashboard was alerted of your prompt message.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-black hover:bg-zinc-800 text-white font-bold rounded-none shadow-none transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-none animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry Proposal</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
