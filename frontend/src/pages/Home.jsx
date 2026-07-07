import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, ShieldCheck, Zap, Sparkles, BookMarked, ArrowRight } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-[calc(100vh-76px)] flex flex-col justify-between overflow-hidden">
      {/* Decorative Blur Background Bulbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[100px] animate-pulse-slow"></div>

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 flex-grow flex flex-col justify-center items-center text-center relative z-10 animate-page-enter">
        
        {/* Header Badge */}
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-semibold mb-8 animate-float animate-badge-pop">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Modern Library System v1.0</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 font-display leading-[1.1] max-w-4xl">
          Empowering Knowledge with{' '}
          <span className="text-gradient">Ved Library</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-slate-400 text-base md:text-xl max-w-2xl mb-10 leading-relaxed font-medium">
          A seamless digital ecosystem for librarians and students. Catalog books, manage borrowings, tracks inventory, and calculates transactions in a stunning, secure interface.
        </p>

        {/* Action Call to Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {user ? (
            <Link
              to={user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'}
              className="glow-btn btn-zoom flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-2xl w-full sm:w-auto shadow-lg shadow-indigo-600/30 text-sm transition-all"
            >
              <span>Go to your Dashboard</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="glow-btn btn-zoom flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-2xl w-full sm:w-auto shadow-lg shadow-indigo-600/30 text-sm transition-all"
              >
                <span>Get Started (Student)</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              <Link
                to="/login"
                className="btn-zoom flex items-center justify-center bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 text-slate-300 hover:text-white font-bold px-8 py-4 rounded-2xl w-full sm:w-auto text-sm transition-all"
              >
                Librarian Access
              </Link>
            </>
          )}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full stagger-children">
          <div className="glass-card glow-border p-6 rounded-2xl text-left">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display mb-2">Instant Borrowing</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Check out books with a single click. Our system updates availability instantly and sends checkout logs directly to your dashboard.
            </p>
          </div>

          <div className="glass-card glow-border p-6 rounded-2xl text-left">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl w-fit mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display mb-2">Role-Based Access</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Separate dashboards for Students and Librarians. Admin controls inventory management, return approvals, and fine processing securely.
            </p>
          </div>

          <div className="glass-card glow-border p-6 rounded-2xl text-left">
            <div className="p-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl w-fit mb-4">
              <BookMarked className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white font-display mb-2">Smart Transactions</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automatic overdue book flagging, return calculations, and fine accumulation trackers keep library assets returning on time.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-slate-900 bg-slate-950/20 relative z-10 text-xs text-slate-500 font-medium">
        &copy; {new Date().getFullYear()} Ved Library Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
