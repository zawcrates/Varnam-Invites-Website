"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FolderHeart, 
  ExternalLink, 
  Clipboard, 
  Check, 
  Clock, 
  Sparkles,
  ChevronRight,
  LogOut,
  Calendar
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoginModal from '@/components/LoginModal';
import { TEMPLATES, InviteData } from '@/data/templates';

interface PublishedInvitation {
  id: string;
  templateSlug: string;
  inviteData: Partial<InviteData>;
  billingDetails: {
    name: string;
    email: string;
    phone: string;
  };
  userEmail?: string;
  purchaseDate: string;
  isPaid: boolean;
}

interface SavedDraft {
  slug: string;
  template: typeof TEMPLATES[number];
  inviteData: Partial<InviteData>;
}

export default function MyInvitesPage() {
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [publishedInvites, setPublishedInvites] = useState<PublishedInvitation[]>([]);
  const [drafts, setDrafts] = useState<SavedDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Check if logged in
    const checkUser = () => {
      const userStr = localStorage.getItem("current_user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
          loadUserInvites(user.email);
        } catch (e) {
          console.error(e);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    };

    checkUser();

    // Listen for storage events (e.g. login/logout in other tabs or through Navbar state)
    const handleStorageChange = () => {
      checkUser();
    };

    window.addEventListener('storage', handleStorageChange);
    // Poll localstorage briefly because Navbar might login without triggering native storage event in the same tab
    const interval = setInterval(checkUser, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadUserInvites = (email: string) => {
    const userEmail = email.toLowerCase();
    
    // 1. Load Published
    try {
      const published = JSON.parse(localStorage.getItem('varnam_published_invitations') || '{}');
      const filteredPublished = (Object.values(published) as PublishedInvitation[]).filter((record) => {
        const recordEmail = record.userEmail || record.billingDetails?.email || '';
        return recordEmail.toLowerCase() === userEmail;
      });
      setPublishedInvites(filteredPublished);
    } catch (e) {
      console.error(e);
    }

    // 2. Load Drafts (Any local customizable edits in localStorage)
    try {
      const loadedDrafts: SavedDraft[] = [];
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('varnam_custom_')) {
          const slug = key.replace('varnam_custom_', '');
          const dataStr = localStorage.getItem(key);
          if (dataStr) {
            const data = JSON.parse(dataStr) as Partial<InviteData>;
            const template = TEMPLATES.find(t => t.slug === slug);
            if (template) {
              loadedDrafts.push({
                slug,
                template,
                inviteData: data
              });
            }
          }
        }
      });
      setDrafts(loadedDrafts);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = (inviteId: string) => {
    if (typeof window !== 'undefined') {
      const link = `${window.location.origin}/invitation/${inviteId}`;
      navigator.clipboard.writeText(link);
      setCopiedId(inviteId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("current_user");
    setCurrentUser(null);
    setPublishedInvites([]);
    setDrafts([]);
  };

  // If loading user state initially
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f7f5f0]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-32">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-gold-medium/20 border-t-gold-dark rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gold-dark font-sansflex text-sm tracking-widest uppercase font-semibold">
              Loading workspace...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If not logged in
  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f7f5f0]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-6 pt-40 pb-24">
          <div className="bg-white border border-gold-medium/15 p-8 md:p-12 rounded-2xl max-w-md w-full text-center shadow-xl shadow-luxury-dark/5 flex flex-col justify-center items-center">
            <div className="w-16 h-16 bg-gold-medium/10 rounded-full flex items-center justify-center mx-auto text-gold-dark mb-6">
              <FolderHeart className="w-8 h-8" />
            </div>
            
            <span className="text-gold-dark text-[10px] uppercase tracking-[0.2em] font-bold mb-2 block text-center">
              Private Workspace
            </span>
            <h1 className="font-sansflex text-2xl font-bold text-luxury-dark text-center tracking-tight mb-3">
              Access Your Invites
            </h1>
            <p className="text-xs text-foreground/60 text-center mb-8 leading-relaxed max-w-sm">
              Create an account or log in to view, edit, and share your personalized luxury wedding invitations.
            </p>
            
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full py-3.5 rounded-full bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white text-xs uppercase tracking-widest font-bold font-sansflex transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-luxury-dark/15 cursor-pointer"
            >
              Log In / Register
            </button>
            
            <Link
              href="/"
              className="mt-4 text-xs font-semibold text-foreground/50 hover:text-luxury-dark transition-colors uppercase tracking-widest font-sansflex"
            >
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />

        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            loadUserInvites(user.email);
            setShowLoginModal(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f5f0] text-luxury-dark select-none">
      <Navbar />

      <main className="flex-grow pt-40 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full text-left">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gold-medium/15 pb-8 mb-12">
          <div>
            <span className="text-gold-dark text-xs uppercase tracking-[0.25em] font-semibold mb-2 block">
              Dashboard
            </span>
            <h1 className="font-sansflex text-2xl md:text-3xl text-luxury-dark tracking-wide font-bold uppercase">
              Hello, {currentUser.name.split(' ')[0]}
            </h1>
            <p className="text-xs text-foreground/65 mt-1 font-sansflex">
              Manage your published invitations and customize saved drafts.
            </p>
          </div>

          <div className="flex items-center gap-3 font-sansflex">
            <div className="bg-white/45 backdrop-blur-md border border-gold-medium/20 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-sm shadow-luxury-dark/5">
              <div className="w-8 h-8 rounded-full bg-white/40 border border-gold-medium/25 text-luxury-dark flex items-center justify-center shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-luxury-dark/85"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div className="text-xs text-left">
                <p className="font-bold text-luxury-dark leading-tight truncate max-w-[150px]">{currentUser.name}</p>
                <p className="text-[10px] text-foreground/45 truncate max-w-[150px] font-mono">{currentUser.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-3 border border-red-200 hover:border-red-400 bg-white/45 backdrop-blur-md text-red-655 hover:bg-red-50 hover:text-red-750 rounded-xl transition-all cursor-pointer shadow-sm shadow-luxury-dark/5"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Tabs switcher */}
        <div className="flex border-b border-gold-medium/10 mb-8 gap-6 shrink-0">
          <button
            onClick={() => setActiveTab('published')}
            className={`pb-4 text-xs sm:text-sm uppercase tracking-widest font-bold transition-all relative cursor-pointer ${
              activeTab === 'published' 
                ? 'text-luxury-dark' 
                : 'text-foreground/45 hover:text-luxury-dark/75'
            }`}
          >
            <span>Live Invitations ({publishedInvites.length})</span>
            {activeTab === 'published' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-dark" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('drafts')}
            className={`pb-4 text-xs sm:text-sm uppercase tracking-widest font-bold transition-all relative cursor-pointer ${
              activeTab === 'drafts' 
                ? 'text-luxury-dark' 
                : 'text-foreground/45 hover:text-luxury-dark/75'
            }`}
          >
            <span>Saved Drafts ({drafts.length})</span>
            {activeTab === 'drafts' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-dark" />
            )}
          </button>
        </div>

        {/* Dynamic content cards list */}
        {activeTab === 'published' ? (
          publishedInvites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              {publishedInvites.map((invite) => {
                const template = TEMPLATES.find(t => t.slug === invite.templateSlug) || TEMPLATES[0];
                return (
                  <div 
                    key={invite.id}
                    className="bg-white border border-gold-medium/10 rounded-2xl overflow-hidden shadow-md shadow-luxury-dark/5 hover:shadow-xl hover:shadow-luxury-dark/10 transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Preview Thumbnail */}
                      <div className="h-44 overflow-hidden relative">
                        <img 
                          src={template.thumbnail} 
                          alt={template.name} 
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-5">
                          <span className="text-gold-medium text-[9px] font-bold uppercase tracking-widest mb-0.5">Style</span>
                          <h3 className="text-white text-base font-sansflex font-bold tracking-wide">{template.name}</h3>
                        </div>
                        <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span>Live</span>
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-6 text-left">
                        <h4 className="font-sansflex text-lg font-bold text-luxury-dark mb-1 leading-tight">
                          {invite.inviteData?.groomName} & {invite.inviteData?.brideName}
                        </h4>
                        <p className="text-[10px] text-foreground/50 uppercase tracking-wider font-semibold font-mono mb-4">
                          Order ID: {invite.id}
                        </p>

                        <div className="space-y-2.5 text-xs font-sansflex border-t border-gold-medium/5 pt-4">
                          <div className="flex items-center gap-2 text-foreground/70">
                            <Calendar className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                            <span>{invite.inviteData?.month} {invite.inviteData?.dateDetails?.split('|')[1] || ''}</span>
                          </div>
                          <div className="flex items-center gap-2 text-foreground/70">
                            <Clock className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                            <span>Published {new Date(invite.purchaseDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions footer */}
                    <div className="p-6 pt-0 flex gap-2">
                      <Link
                        href={`/invitation/${invite.id}`}
                        target="_blank"
                        className="flex-grow inline-flex items-center justify-center gap-1.5 bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white text-[10px] uppercase tracking-wider font-bold py-3 px-4 rounded-xl transition-all"
                      >
                        <span>View Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <button
                        onClick={() => handleCopyLink(invite.id)}
                        className="inline-flex items-center justify-center gap-1.5 bg-white border border-gold-medium/20 hover:border-gold-medium/55 text-luxury-dark text-[10px] uppercase tracking-wider font-bold py-3 px-4 rounded-xl transition-all cursor-pointer"
                        title="Copy Invitation URL"
                      >
                        {copiedId === invite.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Clipboard className="w-3 h-3" />}
                        <span>{copiedId === invite.id ? 'Copied' : 'Share'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty Live Invites state */
            <div className="bg-white border border-gold-medium/15 p-12 rounded-2xl text-center shadow-sm max-w-xl mx-auto my-6 flex flex-col justify-center items-center animate-fade-in">
              <Sparkles className="w-12 h-12 text-gold-medium/30 mb-4 animate-pulse" />
              <h3 className="font-sansflex text-base font-bold text-luxury-dark mb-1">No Live Invitations Yet</h3>
              <p className="text-xs text-foreground/60 leading-relaxed max-w-sm mb-6">
                Your premium invitations will appear here as soon as you customize a template and complete the checkout process.
              </p>
              <Link
                href="/templates"
                className="inline-flex items-center gap-1.5 bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white text-xs uppercase tracking-widest font-bold px-6 py-3.5 rounded-full transition-all duration-300 hover:scale-105 shadow-md"
              >
                <span>Browse & Create</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )
        ) : (
          /* Drafts Tab content */
          drafts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              {drafts.map((draft) => {
                const namesText = (draft.inviteData?.groomName && draft.inviteData?.brideName) 
                  ? `${draft.inviteData.groomName} & ${draft.inviteData.brideName}`
                  : "Draft Invitation";
                return (
                  <div 
                    key={draft.slug}
                    className="bg-white border border-gold-medium/10 rounded-2xl overflow-hidden shadow-md shadow-luxury-dark/5 hover:shadow-xl hover:shadow-luxury-dark/10 transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Preview Thumbnail */}
                      <div className="h-44 overflow-hidden relative">
                        <img 
                          src={draft.template.thumbnail} 
                          alt={draft.template.name} 
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-5">
                          <span className="text-gold-medium text-[9px] font-bold uppercase tracking-widest mb-0.5">Style Draft</span>
                          <h3 className="text-white text-base font-sansflex font-bold tracking-wide">{draft.template.name}</h3>
                        </div>
                        <div className="absolute top-4 right-4 bg-gold-dark/85 text-white text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full shadow-md">
                          Draft
                        </div>
                      </div>

                      {/* Content Card Body */}
                      <div className="p-6 text-left">
                        <h4 className="font-sansflex text-lg font-bold text-luxury-dark mb-1 leading-tight">
                          {namesText}
                        </h4>
                        <p className="text-[10px] text-foreground/50 uppercase tracking-wider font-semibold font-mono mb-4">
                          Template: {draft.slug}
                        </p>

                        <div className="space-y-2.5 text-xs font-sansflex border-t border-gold-medium/5 pt-4">
                          <div className="flex items-center gap-2 text-foreground/70">
                            <Clock className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                            <span>Saved on this browser</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions footer */}
                    <div className="p-6 pt-0">
                      <Link
                        href={`/customize/${draft.slug}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white text-[10px] uppercase tracking-wider font-bold py-3.5 px-4 rounded-xl transition-all"
                      >
                        <span>Continue Customizing</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty Drafts state */
            <div className="bg-white border border-gold-medium/15 p-12 rounded-2xl text-center shadow-sm max-w-xl mx-auto my-6 flex flex-col justify-center items-center animate-fade-in">
              <FolderHeart className="w-12 h-12 text-gold-medium/30 mb-4 animate-pulse" />
              <h3 className="font-sansflex text-base font-bold text-luxury-dark mb-1">No Saved Drafts</h3>
              <p className="text-xs text-foreground/60 leading-relaxed max-w-sm mb-6">
                You haven&apos;t started customizing any invitations on this browser yet. Browse our luxury cards and begin your design!
              </p>
              <Link
                href="/templates"
                className="inline-flex items-center gap-1.5 bg-luxury-dark hover:bg-gold-dark text-gold-light hover:text-white text-xs uppercase tracking-widest font-bold px-6 py-3.5 rounded-full transition-all duration-300 hover:scale-105 shadow-md"
              >
                <span>Browse Templates</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )
        )}

      </main>

      <Footer />
    </div>
  );
}
