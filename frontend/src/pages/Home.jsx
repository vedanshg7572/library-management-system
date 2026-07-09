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
import { HeroParallax } from '../components/ui/hero-parallax';

/* ── Library-themed products for HeroParallax ─────────────── */
const libraryProducts = [
  {
    title: 'Classic Literature',
    link: '/signup',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
    badge: '📖 Fiction', subtitle: 'Timeless stories',
    fallbackGradient: 'linear-gradient(135deg, #7c3aed, #4c1d95)', emoji: '📖',
  },
  {
    title: 'Science & Discovery',
    link: '/signup',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    badge: '🔬 Science', subtitle: 'Explore the universe',
    fallbackGradient: 'linear-gradient(135deg, #06b6d4, #0891b2)', emoji: '🔬',
  },
  {
    title: 'History & Culture',
    link: '/signup',
    thumbnail: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop',
    badge: '🏛️ History', subtitle: 'Learn from the past',
    fallbackGradient: 'linear-gradient(135deg, #f59e0b, #d97706)', emoji: '🏛️',
  },
  {
    title: 'Self Improvement',
    link: '/signup',
    thumbnail: 'https://images.unsplash.com/photo-1456513080867-f67a29d37ed4?w=600&h=400&fit=crop',
    badge: '💡 Self-Help', subtitle: 'Grow every day',
    fallbackGradient: 'linear-gradient(135deg, #10b981, #059669)', emoji: '💡',
  },
  {
    title: 'Technology & Code',
    link: '/signup',
    thumbnail: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&h=400&fit=crop',
    badge: '💻 Tech', subtitle: 'Build the future',
    fallbackGradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', emoji: '💻',
  },
  {
    title: 'Philosophy & Thought',
    link: '/signup',
    thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=400&fit=crop',
    badge: '🧠 Philosophy', subtitle: 'Think deeper',
    fallbackGradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', emoji: '🧠',
  },
  {
    title: 'Biographies',
    link: '/signup',
    thumbnail: 'https://images.unsplash.com/photo-1532012197267-da1a852eb65b?w=600&h=400&fit=crop',
    badge: '👤 Biography', subtitle: 'Inspiring lives',
    fallbackGradient: 'linear-gradient(135deg, #f97316, #ea580c)', emoji: '👤',
  },
  {
    title: 'Mathematics',
    link: '/signup',
    thumbnail: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&h=400&fit=crop',
    badge: '➕ Maths', subtitle: 'The language of universe',
    fallbackGradient: 'linear-gradient(135deg, #ef4444, #dc2626)', emoji: '➕',
  },
  {
    title: 'Economics & Finance',
    link: '/signup',
    thumbnail: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=600&h=400&fit=crop',
    badge: '💰 Economics', subtitle: 'Money & markets',
    fallbackGradient: 'linear-gradient(135deg, #6366f1, #4f46e5)', emoji: '💰',
  },
  {
    title: 'The Grand Library',
    link: '/signup',
    thumbnail: 'https://images.unsplash.com/photo-1442131394-8f33f93dc5e8?w=600&h=400&fit=crop',
    badge: '🏛️ Library', subtitle: 'Thousands of books',
    fallbackGradient: 'linear-gradient(135deg, #0f766e, #115e59)', emoji: '🏛️',
  },
  {
    title: 'Pride & Prejudice',
    link: '/signup',
    thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
    badge: '📚 Classic', subtitle: 'Jane Austen',
    fallbackGradient: 'linear-gradient(135deg, #be185d, #9d174d)', emoji: '📚',
  },
  {
    title: 'Sherlock Holmes',
    link: '/signup',
    thumbnail: 'https://images.unsplash.com/photo-1547155616-554a957f4824?w=600&h=400&fit=crop',
    badge: '🔍 Mystery', subtitle: 'Arthur Conan Doyle',
    fallbackGradient: 'linear-gradient(135deg, #92400e, #78350f)', emoji: '🔍',
  },
  {
    title: 'Atomic Habits',
    link: '/signup',
    thumbnail: 'https://images.unsplash.com/photo-1516979187789-746e4ecdb1b4?w=600&h=400&fit=crop',
    badge: '⚡ Self-Help', subtitle: 'James Clear',
    fallbackGradient: 'linear-gradient(135deg, #059669, #047857)', emoji: '⚡',
  },
  {
    title: 'Cosmos',
    link: '/signup',
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop',
    badge: '🌌 Science', subtitle: 'Carl Sagan',
    fallbackGradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)', emoji: '🌌',
  },
  {
    title: 'Reading Corner',
    link: '/signup',
    thumbnail: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1e63?w=600&h=400&fit=crop',
    badge: '☕ Cozy Read', subtitle: 'Find your spot',
    fallbackGradient: 'linear-gradient(135deg, #d97706, #b45309)', emoji: '☕',
  },
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

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Main Hero ──────────────────────────────────────── */}
      <AetherFlowHero />

      {/* ── HeroParallax — Book Categories Showcase ──────── */}
      <HeroParallax products={libraryProducts} />

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
