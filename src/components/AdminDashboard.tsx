'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Inquiry, PortfolioData, Skill, Project } from '../types';
import { 
  Shield, 
  Lock, 
  Inbox, 
  FileText, 
  CheckCircle, 
  Archive, 
  Trash2, 
  RefreshCw, 
  Plus, 
  TrendingUp, 
  Globe, 
  LogOut, 
  User, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminDashboardProps {
  portfolio: PortfolioData;
  onPortfolioUpdate: (data: PortfolioData) => void;
}

export default function AdminDashboard({ portfolio, onPortfolioUpdate }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Active view inside admin panel
  const [activeTab, setActiveTab] = useState<'inquiries' | 'portfolio' | 'skills'>('inquiries');

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState<boolean>(false);

  // Live editable portfolio values
  const [editablePortfolio, setEditablePortfolio] = useState<PortfolioData>({ ...portfolio });

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('sodiol_admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Sync state if portfolio updates externally
  useEffect(() => {
    setEditablePortfolio({ ...portfolio });
  }, [portfolio]);

  // Fetch inquiries once authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchInquiries();
    }
  }, [isAuthenticated, token]);

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const response = await fetch('/api/inquiries', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      } else {
        // Token might have expired or is invalid
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to load inquiries', err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setToken(data.token);
      localStorage.setItem('sodiol_admin_token', data.token);
      setIsAuthenticated(true);
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Unauthorized admin password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sodiol_admin_token');
    setToken('');
    setIsAuthenticated(false);
  };

  // Inquiry actions
  const updateInquiryStatus = async (id: string, status: 'read' | 'archived') => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        // Update locally
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
      }
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message? This is permanent.')) return;
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setInquiries(prev => prev.filter(inq => inq.id !== id));
      }
    } catch (err) {
      console.error('Error deleting inquiry', err);
    }
  };

  // Save updated portfolio config to server
  const savePortfolioDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editablePortfolio)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update portfolio');
      }

      onPortfolioUpdate(editablePortfolio);
      alert('Portfolio updated successfully!');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Helper counters
  const unreadCount = inquiries.filter(i => i.status === 'new').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 pt-28 pb-16 overflow-x-clip">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[min(350px,85vw)] h-[min(350px,85vw)] bg-zinc-200/5 rounded-none blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white border border-slate-200 rounded-none p-5 sm:p-8 relative overflow-hidden shadow-none"
        >
          {/* Padlock Icon */}
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="bg-zinc-50 text-black p-4 rounded-none border border-slate-200">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Gatekeeper</h2>
              <p className="text-slate-600 text-sm mt-1">
                Enter your security password to log in and manage your Sodiol Sayem personal dashboard.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-700 font-semibold uppercase tracking-wider">
                Dashboard Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border-b border-t-0 border-l-0 border-r-0 border-slate-200 rounded-none px-1 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-black transition-colors focus:ring-0"
              />
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                Use the password saved in your ADMIN_PASSWORD environment variable.
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-none text-xs flex items-center space-x-2"
                >
                  <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-black hover:bg-zinc-800 text-white text-sm font-bold rounded-none shadow-none transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-none animate-spin" />
              ) : (
                <span>Access Workspace</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 overflow-x-clip">
      <div className="site-container">
        
        {/* Admin Dashboard Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-slate-200 gap-4 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-black font-mono text-xs mb-1">
              <Shield className="w-4.5 h-4.5" />
              <span className="font-semibold break-safe">AUTHENTICATED SECURE CONTENT MANAGEMENT</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight break-safe">
              Sodiol Sayem Control Dashboard
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={fetchInquiries}
              className="p-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-zinc-50 text-slate-700 rounded-none transition-all cursor-pointer shadow-none"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-red-50 hover:text-red-600 text-slate-500 border border-slate-200 rounded-none text-sm font-medium transition-all cursor-pointer shadow-none"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Dynamic Overview Bento Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Bento box: New inquiries */}
          <div className="bg-white border border-slate-200 rounded-none p-6 flex flex-col justify-between shadow-none">
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block font-medium">Unread Inquiries</span>
              <span className="text-4xl font-extrabold text-black font-mono block mt-2">
                {unreadCount}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Newly submitted project scopes requiring response tags.
            </p>
          </div>

          {/* Bento box: Total Inquiries */}
          <div className="bg-white border border-slate-200 rounded-none p-6 flex flex-col justify-between shadow-none">
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block font-medium">Total Inquiries</span>
              <span className="text-4xl font-extrabold text-slate-800 font-mono block mt-2">
                {inquiries.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Full historic communications tracked in database.
            </p>
          </div>

          {/* Bento box: SEO Checklist indicator */}
          <div className="bg-white border border-slate-200 rounded-none p-6 flex flex-col justify-between shadow-none">
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block font-medium">SEO Performance</span>
              <span className="text-4xl font-extrabold text-zinc-800 font-mono block mt-2">
                98%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Configured metadata, semantic structure, schema tags.
            </p>
          </div>

          {/* Bento box: Core Projects count */}
          <div className="bg-white border border-slate-200 rounded-none p-6 flex flex-col justify-between shadow-none">
            <div>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block font-medium">Registered projects</span>
              <span className="text-4xl font-extrabold text-zinc-700 font-mono block mt-2">
                {portfolio.projects.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Showcased digital products on live portfolio list.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 mb-8 gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`shrink-0 px-4 sm:px-5 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === 'inquiries'
                ? 'border-black text-black bg-zinc-50/50 font-bold'
                : 'border-transparent text-slate-500 hover:text-black'
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <Inbox className="w-4 h-4" />
              <span>Project Inquiries</span>
              {unreadCount > 0 && (
                <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-none font-bold">
                  {unreadCount}
                </span>
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`shrink-0 px-4 sm:px-5 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
              activeTab === 'portfolio'
                ? 'border-black text-black bg-zinc-50/50 font-bold'
                : 'border-transparent text-slate-500 hover:text-black'
            }`}
          >
            <span className="flex items-center space-x-1.5">
              <FileText className="w-4 h-4" />
              <span>Modify Portfolio Data</span>
            </span>
          </button>
        </div>

        {/* CONTENT TABS PANEL */}
        <div>
          {/* Tab 1: Inquiries management */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              {inquiriesLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-black rounded-none animate-spin" />
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-slate-200 rounded-none bg-zinc-50">
                  <Inbox className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-700 font-semibold text-base">No contact inquiries yet</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    When visitors submit the contact form, messages will be immediately logged on this control panel.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className={`p-4 sm:p-6 border rounded-none transition-all min-w-0 ${
                        inq.status === 'new'
                          ? 'bg-zinc-50 border-slate-400 shadow-none'
                          : inq.status === 'archived'
                          ? 'bg-white border-slate-100 opacity-60 shadow-none'
                          : 'bg-white border-slate-200 shadow-none'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-900 break-safe">{inq.name}</span>
                            <span className="text-xs text-slate-500 font-mono break-safe">{inq.email}</span>
                            {inq.status === 'new' && (
                              <span className="bg-black text-white px-2 py-0.5 rounded-none text-[10px] font-semibold tracking-wider uppercase">
                                New Inquiry
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-semibold text-slate-800 break-safe">
                            Subject: {inq.subject}
                          </h4>
                        </div>

                        <div className="flex flex-col sm:items-end gap-1.5 font-mono text-xs text-slate-500 break-safe">
                          <span>{new Date(inq.createdAt).toLocaleString()}</span>
                          {inq.budget && (
                            <span className="bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded-none text-[10px] font-semibold border border-zinc-200 w-fit">
                              Budget: {inq.budget}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-700 text-sm leading-relaxed mb-6 whitespace-pre-wrap break-safe bg-zinc-50/50 p-4 rounded-none border border-slate-100 font-sans">
                        {inq.message}
                      </p>

                      {/* Controls bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-100">
                        <div className="flex flex-wrap items-center gap-2">
                          {inq.status === 'new' && (
                            <button
                              onClick={() => updateInquiryStatus(inq.id, 'read')}
                              className="flex items-center space-x-1.5 px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-slate-800 rounded-none text-xs font-semibold tracking-wide cursor-pointer transition-all"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Mark as Read</span>
                            </button>
                          )}

                          {inq.status !== 'archived' && (
                            <button
                              onClick={() => updateInquiryStatus(inq.id, 'archived')}
                              className="flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-zinc-50 text-slate-500 hover:text-black rounded-none text-xs font-medium cursor-pointer transition-all border border-slate-200 shadow-none"
                            >
                              <Archive className="w-4 h-4" />
                              <span>Archive</span>
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => deleteInquiry(inq.id)}
                          className="flex items-center space-x-1 px-3 py-2 text-slate-400 hover:text-red-600 transition-all cursor-pointer rounded-none"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-xs">Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Portfolio CMS Modifier Form */}
          {activeTab === 'portfolio' && (
            <div className="bg-white border border-slate-200 rounded-none p-4 sm:p-8 shadow-none min-w-0">
              <form onSubmit={savePortfolioDetails} className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">Core Metadata</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-700 font-semibold uppercase tracking-wider">
                        Full Developer Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editablePortfolio.name}
                        onChange={(e) => setEditablePortfolio({ ...editablePortfolio, name: e.target.value })}
                        className="w-full bg-white border-b border-t-0 border-l-0 border-r-0 border-slate-200 rounded-none px-1 py-3 text-sm text-slate-900 focus:outline-none focus:border-black transition-colors focus:ring-0"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-700 font-semibold uppercase tracking-wider">
                        Professional Heading / Title
                      </label>
                      <input
                        type="text"
                        required
                        value={editablePortfolio.title}
                        onChange={(e) => setEditablePortfolio({ ...editablePortfolio, title: e.target.value })}
                        className="w-full bg-white border-b border-t-0 border-l-0 border-r-0 border-slate-200 rounded-none px-1 py-3 text-sm text-slate-900 focus:outline-none focus:border-black transition-colors focus:ring-0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-700 font-semibold uppercase tracking-wider">
                      Biography Description
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={editablePortfolio.bio}
                      onChange={(e) => setEditablePortfolio({ ...editablePortfolio, bio: e.target.value })}
                      className="w-full bg-white border-b border-t-0 border-l-0 border-r-0 border-slate-200 rounded-none px-1 py-3 text-sm text-slate-900 focus:outline-none focus:border-black transition-colors focus:ring-0"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">Core Stats Bento Highlight values</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-700 font-semibold uppercase tracking-wider">
                        Completed Projects
                      </label>
                      <input
                        type="number"
                        required
                        value={editablePortfolio.stats.completedProjects}
                        onChange={(e) => setEditablePortfolio({
                          ...editablePortfolio,
                          stats: { ...editablePortfolio.stats, completedProjects: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full bg-white border-b border-t-0 border-l-0 border-r-0 border-slate-200 rounded-none px-1 py-3 text-sm text-slate-900 focus:outline-none focus:border-black transition-colors focus:ring-0"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-700 font-semibold uppercase tracking-wider">
                        Happy Clients
                      </label>
                      <input
                        type="number"
                        required
                        value={editablePortfolio.stats.happyClients}
                        onChange={(e) => setEditablePortfolio({
                          ...editablePortfolio,
                          stats: { ...editablePortfolio.stats, happyClients: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full bg-white border-b border-t-0 border-l-0 border-r-0 border-slate-200 rounded-none px-1 py-3 text-sm text-slate-900 focus:outline-none focus:border-black transition-colors focus:ring-0"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-700 font-semibold uppercase tracking-wider">
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        required
                        value={editablePortfolio.stats.yearsExperience}
                        onChange={(e) => setEditablePortfolio({
                          ...editablePortfolio,
                          stats: { ...editablePortfolio.stats, yearsExperience: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full bg-white border-b border-t-0 border-l-0 border-r-0 border-slate-200 rounded-none px-1 py-3 text-sm text-slate-900 focus:outline-none focus:border-black transition-colors focus:ring-0"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">Social Accounts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-700 font-semibold uppercase tracking-wider">
                        GitHub Profile Link
                      </label>
                      <input
                        type="url"
                        value={editablePortfolio.github}
                        onChange={(e) => setEditablePortfolio({ ...editablePortfolio, github: e.target.value })}
                        className="w-full bg-white border-b border-t-0 border-l-0 border-r-0 border-slate-200 rounded-none px-1 py-3 text-sm text-slate-900 focus:outline-none focus:border-black transition-colors focus:ring-0"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-700 font-semibold uppercase tracking-wider">
                        Facebook Profile Link
                      </label>
                      <input
                        type="url"
                        value={editablePortfolio.facebook || ''}
                        onChange={(e) => setEditablePortfolio({ ...editablePortfolio, facebook: e.target.value })}
                        className="w-full bg-white border-b border-t-0 border-l-0 border-r-0 border-slate-200 rounded-none px-1 py-3 text-sm text-slate-900 focus:outline-none focus:border-black transition-colors focus:ring-0"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-700 font-semibold uppercase tracking-wider">
                        Instagram Profile Link
                      </label>
                      <input
                        type="url"
                        value={editablePortfolio.instagram || ''}
                        onChange={(e) => setEditablePortfolio({ ...editablePortfolio, instagram: e.target.value })}
                        className="w-full bg-white border-b border-t-0 border-l-0 border-r-0 border-slate-200 rounded-none px-1 py-3 text-sm text-slate-900 focus:outline-none focus:border-black transition-colors focus:ring-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full sm:w-auto items-center justify-center space-x-2 px-6 py-3 bg-black hover:bg-zinc-800 text-white text-sm font-bold rounded-none shadow-none transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Shield className="w-4.5 h-4.5" />
                        <span>Commit Portfolio Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
