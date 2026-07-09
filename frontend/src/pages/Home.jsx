import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  ShieldCheck,
  Zap,
  Sparkles,
  BookMarked,
  ArrowRight,
  Library,
  Users,
  BarChart3,
  Clock,
  Mail,
  Phone,
  Code2,
} from 'lucide-react';
import AetherFlowHero from '../components/ui/aether-flow-hero';


/* ── Genre data for Explorer section ───────────────────────── */
const genres = [
  { emoji: '📖', name: 'Fiction',     desc: 'Novels, stories & imagination', count: '18+ books', from: '#7c3aed', to: '#4c1d95', glow: '#7c3aed' },
  { emoji: '🔬', name: 'Science',     desc: 'Cosmos, biology & discovery',   count: '10+ books', from: '#06b6d4', to: '#0e7490', glow: '#06b6d4' },
  { emoji: '💻', name: 'Technology',  desc: 'Code, AI & the digital world',  count: '12+ books', from: '#3b82f6', to: '#1d4ed8', glow: '#3b82f6' },
  { emoji: '🏛️', name: 'History',    desc: 'Civilizations, wars & leaders', count: '8+ books',  from: '#f59e0b', to: '#b45309', glow: '#f59e0b' },
  { emoji: '🌱', name: 'Self-Help',   desc: 'Habits, mindset & growth',      count: '10+ books', from: '#10b981', to: '#065f46', glow: '#10b981' },
  { emoji: '➕', name: 'Mathematics', desc: 'Numbers, logic & patterns',      count: '6+ books',  from: '#ef4444', to: '#991b1b', glow: '#ef4444' },
  { emoji: '👤', name: 'Biography',   desc: 'Lives that changed the world',  count: '14+ books', from: '#f97316', to: '#c2410c', glow: '#f97316' },
  { emoji: '💰', name: 'Economics',   desc: 'Money, markets & finance',      count: '8+ books',  from: '#6366f1', to: '#3730a3', glow: '#6366f1' },
];

// Stagger container
const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' },
  },
};

const features = [
  {
    icon: Zap,
    color: 'indigo',
    title: 'Instant Borrowing',
    desc: 'Check out books with a single click. Availability updates instantly with real-time checkout logs on your dashboard.',
  },
  {
    icon: ShieldCheck,
    color: 'emerald',
    title: 'Role-Based Access',
    desc: 'Separate dashboards for Students and Librarians. Admins control inventory, return approvals, and fine processing securely.',
  },
  {
    icon: BookMarked,
    color: 'violet',
    title: 'Smart Transactions',
    desc: 'Automatic overdue flagging, return calculations, and fine accumulators keep library assets returning on time.',
  },
  {
    icon: BarChart3,
    color: 'sky',
    title: 'Live Analytics',
    desc: 'Real-time dashboards show borrowing trends, popular titles, and student activity at a glance.',
  },
  {
    icon: Clock,
    color: 'amber',
    title: 'Due Date Reminders',
    desc: 'Never miss a return. Automated due date tracking ensures students are always aware of pending returns.',
  },
  {
    icon: Library,
    color: 'rose',
    title: 'Vast Catalogue',
    desc: 'Browse thousands of catalogued titles with powerful search and filter capabilities for any subject.',
  },
];

const colorMap = {
  indigo: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    text: 'text-indigo-400',
    glow: 'rgba(99,102,241,0.25)',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    glow: 'rgba(16,185,129,0.25)',
  },
  violet: {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    text: 'text-violet-400',
    glow: 'rgba(139,92,246,0.25)',
  },
  sky: {
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    text: 'text-sky-400',
    glow: 'rgba(14,165,233,0.25)',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    glow: 'rgba(245,158,11,0.25)',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-400',
    glow: 'rgba(244,63,94,0.25)',
  },
};


/* ── Genre Explorer Component ───────────────────────────────── */
const GenreExplorer = () => {
  const { user } = useAuth();
  const target = user ? '/student-dashboard' : '/signup';

  return (
    <section
      className="relative py-24 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #03001e 0%, #07002e 50%, #03001e 100%)' }}
    >
      {/* Ambient background orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/25 bg-amber-500/8 mb-5">
            <span className="text-[10px] font-black text-amber-400 tracking-[0.2em] uppercase">Browse by Genre</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
            What will you read{' '}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(120deg, #fbbf24, #f97316, #a78bfa)' }}>
              today?
            </span>
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto font-medium">
            95+ books across 8 genres — classics, modern hits & everything in between.
          </p>
        </motion.div>

        {/* Genre Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {genres.map((g, i) => (
            <motion.div
              key={g.name}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, scale: 1.03 }}
            >
              <Link to={target} className="group block h-full">
                <div
                  className="relative h-full p-5 rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    background: `linear-gradient(145deg, ${g.from}18, ${g.to}28)`,
                    border: `1px solid ${g.from}30`,
                    boxShadow: `0 0 0 0 ${g.glow}00`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 40px -8px ${g.glow}60, 0 0 0 1px ${g.from}50`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 0 0 ${g.glow}00`}
                >
                  {/* Animated gradient top bar */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                    style={{ background: `linear-gradient(90deg, ${g.from}, ${g.to})` }} />

                  {/* Glow orb behind emoji */}
                  <div className="absolute top-4 left-4 w-14 h-14 rounded-full pointer-events-none transition-all duration-300"
                    style={{ background: `radial-gradient(circle, ${g.glow}35 0%, transparent 70%)`, filter: 'blur(8px)' }} />

                  {/* Emoji */}
                  <div
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `linear-gradient(145deg, ${g.from}30, ${g.to}20)`, border: `1px solid ${g.from}40` }}
                  >
                    {g.emoji}
                  </div>

                  {/* Text */}
                  <h3 className="font-extrabold text-white text-base mb-1 leading-tight">{g.name}</h3>
                  <p className="text-slate-500 text-[11px] font-medium leading-relaxed mb-3 line-clamp-2">{g.desc}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: `${g.from}20`, color: g.from, border: `1px solid ${g.from}30` }}
                    >
                      {g.count}
                    </span>
                    <motion.span
                      className="text-[11px] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: g.from }}
                    >
                      Explore <ArrowRight className="h-3 w-3" />
                    </motion.span>
                  </div>

                  {/* Corner sparkle */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none">
                    <Sparkles className="h-4 w-4" style={{ color: g.from }} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            to={target}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-white shadow-2xl transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316, #7c3aed)', boxShadow: '0 8px 32px rgba(124,58,237,0.4)' }}
          >
            <BookOpen className="h-4 w-4" />
            Browse All 95+ Books
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const Home = () => {

  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Main Hero ──────────────────────────────────────── */}
      <AetherFlowHero />

      {/* ── Genre Explorer ────────────────────────────────── */}
      <GenreExplorer />

      {/* ============ FEATURES SECTION ============ */}
      <section className="relative bg-[#03001e] py-28 px-6 overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-800/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-800/10 blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-20"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-300 tracking-widest uppercase">
                Everything You Need
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5"
            >
              <span className="text-white">Built for </span>
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #c084fc 0%, #6366f1 50%, #38bdf8 100%)',
                }}
              >
                Modern Libraries
              </span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-slate-400 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
              Powerful features designed to simplify library operations and enhance the student reading experience.
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => {
              const colors = colorMap[feature.color];
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  className="glass-card glow-border group p-7 rounded-2xl cursor-default"
                  style={{ '--glow-color': colors.glow }}
                >
                  <div
                    className={`p-3 ${colors.bg} border ${colors.border} ${colors.text} rounded-xl w-fit mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-display mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============ HOW IT WORKS SECTION ============ */}
      <section className="relative bg-gradient-to-b from-[#03001e] to-[#0a0020] py-28 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
              Get started in{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #a78bfa, #38bdf8)' }}
              >
                3 simple steps
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-base">
              From signup to borrowing your first book in under 2 minutes.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-0"
          >
            {[
              {
                step: '01',
                title: 'Create your account',
                desc: 'Sign up as a student in seconds. Your profile is instantly created with a personalized dashboard.',
                icon: Users,
              },
              {
                step: '02',
                title: 'Browse the catalogue',
                desc: 'Search thousands of books by title, author, or genre. Real-time availability shown for every book.',
                icon: BookOpen,
              },
              {
                step: '03',
                title: 'Borrow & return',
                desc: 'Request a book with one click. Track due dates and return seamlessly from your dashboard.',
                icon: BookMarked,
              },
            ].map((item, idx) => (
              <React.Fragment key={item.step}>
                <motion.div variants={fadeUp} className="flex-1 text-center px-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/20 mb-5">
                    <item.icon className="h-6 w-6 text-purple-300" />
                  </div>
                  <span className="block text-xs font-bold text-indigo-500 tracking-[0.2em] uppercase mb-2">
                    Step {item.step}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
                {idx < 2 && (
                  <div className="hidden md:flex items-center justify-center px-2 mt-8">
                    <ArrowRight className="h-5 w-5 text-slate-700" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="relative bg-[#0a0020] py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-sky-900/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-indigo-700/10 blur-[100px] rounded-full pointer-events-none" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-xs font-semibold text-purple-300 tracking-widest uppercase">
              Join Today — It's Free
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6"
          >
            Ready to explore{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #c084fc, #6366f1, #38bdf8)',
                backgroundSize: '200% auto',
                animation: 'gradient-shift 4s linear infinite',
              }}
            >
              VedLibrary?
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-slate-400 text-lg mb-10 leading-relaxed"
          >
            Thousands of books await. Sign up for free and start your reading journey today.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'}
                className="glow-btn btn-zoom inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-2xl shadow-indigo-700/40 text-sm"
              >
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="glow-btn btn-zoom inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-2xl shadow-indigo-700/40 text-sm"
                >
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="btn-zoom inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-200 font-semibold rounded-2xl backdrop-blur-sm text-sm transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* ============ ABOUT DEVELOPER ============ */}
      <section className="relative bg-[#03001e] border-t border-slate-900/80 py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-transparent to-indigo-950/20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-purple-800/8 blur-[80px] rounded-full pointer-events-none" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto relative z-10"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-4">
              <Code2 className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-xs font-semibold text-violet-300 tracking-widest uppercase">
                About the Developer
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Built with ❤️ by
            </h2>
          </motion.div>

          {/* Developer Card */}
          <motion.div
            variants={fadeUp}
            className="glass-card rounded-3xl p-8 md:p-10 border border-violet-500/10 hover:border-violet-500/25 transition-all duration-500"
            style={{ boxShadow: '0 0 60px -20px rgba(139,92,246,0.2)' }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-700/40">
                  <span className="text-4xl font-extrabold text-white">V</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg">
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-extrabold text-white mb-1 tracking-tight">Vedansh Gupta</h3>
                <p className="text-sm font-medium text-violet-400 mb-4">Full Stack Developer · React · Node.js · MongoDB</p>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Passionate developer who designed and built VedLibrary from scratch — from the database architecture to the interactive UI. Always building something cool. 🚀
                </p>

                {/* Contact Links */}
                <div className="flex flex-col sm:flex-row items-center md:items-start gap-3">
                  <a
                    href="mailto:vedanshg7572@gmail.com"
                    className="btn-zoom inline-flex items-center gap-2.5 px-5 py-2.5 bg-violet-500/10 border border-violet-500/20 hover:border-violet-500/50 hover:bg-violet-500/20 text-violet-300 hover:text-violet-100 rounded-xl text-sm font-semibold transition-all duration-300"
                  >
                    <Mail className="h-4 w-4" />
                    vedanshg7572@gmail.com
                  </a>
                  <a
                    href="tel:+917572001500"
                    className="btn-zoom inline-flex items-center gap-2.5 px-5 py-2.5 bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/50 hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-100 rounded-xl text-sm font-semibold transition-all duration-300"
                  >
                    <Phone className="h-4 w-4" />
                    +91 7572001500
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="w-full text-center py-5 border-t border-slate-900/60 bg-[#020018] relative z-10">
        <p className="text-xs text-slate-600 font-medium">
          © {new Date().getFullYear()} <span className="text-slate-500">VedLibrary</span> · Crafted by{' '}
          <span className="text-violet-500 font-semibold">Vedansh Gupta</span> · All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
