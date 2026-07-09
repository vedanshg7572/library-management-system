"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, BookOpen, Search, Star, Users, Library } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* ── Typewriter words ──────────────────────────────────────── */
const WORDS = ['Fiction', 'Science', 'History', 'Biography', 'Technology', 'Philosophy', 'Mystery', 'Self-Help'];

const Typewriter = () => {
  const [idx, setIdx]     = useState(0);
  const [text, setText]   = useState('');
  const [del, setDel]     = useState(false);
  const word = WORDS[idx];

  useEffect(() => {
    const speed = del ? 60 : 120;
    const timer = setTimeout(() => {
      if (!del) {
        setText(word.slice(0, text.length + 1));
        if (text.length + 1 === word.length) setTimeout(() => setDel(true), 1200);
      } else {
        setText(word.slice(0, text.length - 1));
        if (text.length === 0) { setDel(false); setIdx(i => (i + 1) % WORDS.length); }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [text, del, word]);

  return (
    <span className="relative">
      <span
        className="bg-clip-text text-transparent"
        style={{ backgroundImage: 'linear-gradient(120deg, #fbbf24 0%, #f97316 40%, #ec4899 80%)' }}
      >
        {text || '\u00a0'}
      </span>
      <span className="inline-block w-0.5 h-[0.9em] bg-amber-400 ml-1 animate-pulse align-middle" />
    </span>
  );
};

/* ── Floating book component ───────────────────────────────── */
const FloatingBook = ({ color1, color2, delay, x, y, rotate, scale = 1 }) => (
  <motion.div
    animate={{ y: [y, y - 14, y], rotate: [rotate, rotate + 3, rotate] }}
    transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    style={{ position: 'absolute', left: x, top: y, zIndex: 15 }}
  >
    <div
      style={{
        width: 44 * scale,
        height: 60 * scale,
        perspective: 600,
        cursor: 'pointer',
        filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))',
      }}
    >
      {/* Book spine */}
      <div style={{
        width: '100%', height: '100%',
        background: `linear-gradient(160deg, ${color1}, ${color2})`,
        borderRadius: '2px 8px 8px 2px',
        position: 'relative',
        boxShadow: `inset -4px 0 8px rgba(0,0,0,0.3), 4px 4px 16px rgba(0,0,0,0.4)`,
        transform: `rotate(${rotate}deg) scale(${scale})`,
      }}>
        <div style={{ position: 'absolute', left: 4, top: '50%', width: '60%', height: 1.5, background: 'rgba(255,255,255,0.25)', transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', left: 4, top: '40%', width: '40%', height: 1, background: 'rgba(255,255,255,0.15)' }} />
        <div style={{ position: 'absolute', left: 4, top: '60%', width: '50%', height: 1, background: 'rgba(255,255,255,0.15)' }} />
        {/* Spine highlight */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 4, height: '100%', background: 'rgba(255,255,255,0.15)', borderRadius: '2px 0 0 2px' }} />
      </div>
    </div>
  </motion.div>
);

/* ── Central open book ─────────────────────────────────────── */
const OpenBook = () => {
  const [page, setPage] = useState(0);
  const lines = [
    ['Once upon a time,', 'in a land of words,', 'stories waited to be', 'discovered...'],
    ['Knowledge is power.', 'Books are windows', 'to infinite worlds', 'beyond imagination.'],
    ['"Not all those who', 'wander are lost."', '— J.R.R. Tolkien', ''],
    ['Every book you read', 'opens a new door.', 'Start your journey', 'today.'],
  ];
  useEffect(() => {
    const t = setInterval(() => setPage(p => (p + 1) % lines.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ perspective: 1200 }}
      className="relative"
    >
      {/* Shadow */}
      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-48 h-4 bg-black/40 blur-xl rounded-full" />

      {/* Book outer */}
      <div
        className="relative"
        style={{
          width: 280, height: 200,
          background: 'linear-gradient(135deg, #1e1028 0%, #2d1b4e 100%)',
          borderRadius: '4px 12px 12px 4px',
          boxShadow: '0 30px 80px -10px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.06)',
          display: 'flex',
        }}
      >
        {/* Left page */}
        <div style={{
          flex: 1, background: 'linear-gradient(160deg, #fefcf3 0%, #fdf6e3 100%)',
          borderRadius: '4px 0 0 4px',
          padding: '16px 12px',
          position: 'relative',
          boxShadow: 'inset -3px 0 8px rgba(0,0,0,0.15)',
        }}>
          <AnimatePresence mode="wait">
            <motion.div key={page}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {lines[page].map((l, i) => (
                <p key={i} style={{ fontSize: 10, color: '#5c4a2a', lineHeight: 1.7, fontFamily: 'Georgia, serif', marginBottom: 2 }}>
                  {l}
                </p>
              ))}
            </motion.div>
          </AnimatePresence>
          {/* Page lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ height: 0.5, background: 'rgba(180,140,80,0.15)', marginBottom: 8, marginTop: i === 0 ? 48 : 0 }} />
          ))}
        </div>

        {/* Spine */}
        <div style={{ width: 12, background: 'linear-gradient(180deg, #4c1d95, #7c3aed)', boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.3), inset 2px 0 4px rgba(255,255,255,0.05)' }} />

        {/* Right page */}
        <div style={{
          flex: 1, background: 'linear-gradient(160deg, #fdf6e3 0%, #faf0d4 100%)',
          borderRadius: '0 12px 12px 0',
          padding: '16px 12px',
          position: 'relative',
          boxShadow: 'inset 2px 0 6px rgba(0,0,0,0.1)',
        }}>
          <div style={{ height: 60, background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(99,102,241,0.1))', borderRadius: 6, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen style={{ width: 24, height: 24, color: 'rgba(124,58,237,0.5)' }} />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 0.5, background: 'rgba(180,140,80,0.15)', marginBottom: 10 }} />
          ))}
        </div>

        {/* Glow */}
        <div className="absolute inset-0 rounded-[4px_12px_12px_4px] pointer-events-none"
          style={{ boxShadow: '0 0 60px -10px rgba(124,58,237,0.5)' }} />
      </div>
    </motion.div>
  );
};

/* ── Particle canvas (letters/words floating) ──────────────── */
const useParticles = (ref) => {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let id;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      char: chars[Math.floor(Math.random() * chars.length)],
      opacity: Math.random() * 0.15 + 0.03,
      speed: Math.random() * 0.3 + 0.1,
      size: Math.floor(Math.random() * 10) + 8,
      color: Math.random() > 0.5 ? '#f59e0b' : '#a78bfa',
    }));

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    const loop = () => {
      id = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px 'Georgia', serif`;
        ctx.fillStyle = p.color;
        ctx.fillText(p.char, p.x, p.y);
        p.y -= p.speed;
        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
          p.char = chars[Math.floor(Math.random() * chars.length)];
        }
      });
      ctx.globalAlpha = 1;
    };
    loop();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(id); };
  }, [ref]);
};

/* ════════════════════════════════════════════════════════════
   MAIN HERO
════════════════════════════════════════════════════════════ */
const AetherFlowHero = () => {
  const canvasRef = useRef(null);
  const { user } = useAuth();
  useParticles(canvasRef);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateY.set(((e.clientX - cx) / rect.width) * 12);
    rotateX.set(-((e.clientY - cy) / rect.height) * 12);
  };
  const handleMouseLeave = () => { rotateX.set(0); rotateY.set(0); };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex items-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Deep dark BG */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 40%, #1a0a2e 0%, #0a0612 50%, #03001e 100%)' }} />

      {/* Floating letter particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, #03001e, transparent)' }} />

      {/* Floating books decoration */}
      <FloatingBook color1="#7c3aed" color2="#4c1d95" delay={0}   x="6%"  y="15%" rotate={-12} />
      <FloatingBook color1="#0891b2" color2="#0e7490" delay={0.8} x="10%" y="60%" rotate={8}  scale={0.8}/>
      <FloatingBook color1="#b45309" color2="#92400e" delay={1.6} x="88%" y="20%" rotate={10} />
      <FloatingBook color1="#059669" color2="#065f46" delay={0.4} x="85%" y="65%" rotate={-8} scale={0.9}/>
      <FloatingBook color1="#be185d" color2="#9d174d" delay={1.2} x="3%"  y="80%" rotate={6}  scale={0.7}/>
      <FloatingBook color1="#1d4ed8" color2="#1e3a8a" delay={2.0} x="92%" y="45%" rotate={-6} scale={0.75}/>

      {/* ── MAIN LAYOUT ────────────────────────────────────── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-6">

        {/* ── LEFT: Text ──────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/8 mb-8"
            style={{ backdropFilter: 'blur(12px)' }}
          >
            <Library className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 tracking-widest uppercase">VedLibrary — E-Library</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute h-full w-full rounded-full bg-amber-400 opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-amber-400" />
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-black tracking-tighter leading-[0.9] mb-5"
            style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5rem)' }}
          >
            <span className="block text-white">Read Any</span>
            <span className="block text-white">Book, Anytime.</span>
            <span className="block mt-2 text-slate-400 font-extrabold" style={{ fontSize: '0.55em' }}>
              Explore <Typewriter /> and more.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-slate-400 text-base md:text-lg leading-relaxed max-w-md mb-8 font-medium"
          >
            Thousands of ebooks from the world's greatest authors — classics, science,
            philosophy, and more. Read online, track progress, discover new worlds.
          </motion.p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-md mb-7"
          >
            <Link
              to={user ? '/student-dashboard' : '/signup'}
              className="group flex items-center gap-3 px-5 py-4 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all duration-300"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
            >
              <Search className="h-5 w-5 text-slate-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
              <span className="text-slate-500 group-hover:text-slate-300 text-sm flex-grow text-left transition-colors">
                Search 1,000+ books...
              </span>
              <span className="text-xs font-bold text-amber-500/70 group-hover:text-amber-400 border border-amber-500/20 group-hover:border-amber-500/50 px-2.5 py-1 rounded-lg transition-all flex-shrink-0">
                Browse
              </span>
            </Link>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-3 mb-12 justify-center lg:justify-start"
          >
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'}
                className="group glow-btn inline-flex items-center gap-3 px-8 py-4 font-bold rounded-2xl text-sm text-white shadow-2xl shadow-amber-700/25"
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 40%, #7c3aed 100%)' }}
              >
                <BookOpen className="h-4 w-4" />
                Start Reading
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="group glow-btn inline-flex items-center gap-3 px-8 py-4 font-bold rounded-2xl text-sm text-white shadow-2xl shadow-amber-700/25"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 40%, #7c3aed 100%)' }}
                >
                  <Sparkles className="h-4 w-4" />
                  Start Reading Free
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 hover:border-white/25 font-semibold rounded-2xl text-sm text-slate-300 hover:text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
                >
                  Sign In
                </Link>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-6 flex-wrap justify-center lg:justify-start"
          >
            {[
              { icon: BookOpen, val: '1,000+', label: 'E-Books', color: 'text-amber-400' },
              { icon: Users,    val: '500+',   label: 'Readers', color: 'text-violet-400' },
              { icon: Star,     val: 'Free',   label: 'to Read', color: 'text-emerald-400' },
            ].map(({ icon: Icon, val, label, color }) => (
              <div key={label} className="flex items-center gap-2 group">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="text-white font-extrabold text-sm">{val}</span>
                <span className="text-slate-500 text-xs font-semibold">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: Interactive Open Book ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="flex-1 flex flex-col items-center justify-center relative"
        >
          {/* Glow behind book */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 rounded-full opacity-30"
              style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', filter: 'blur(40px)' }} />
          </div>

          {/* Open book */}
          <OpenBook />

          {/* Genre tags floating around */}
          {[
            { label: '📖 Fiction',    top: '-10%',  left: '5%',   delay: 0.6 },
            { label: '🔬 Science',    top: '10%',   right: '-5%', delay: 1.0 },
            { label: '🏛️ History',   bottom: '15%',left: '0%',   delay: 0.8 },
            { label: '💡 Self-Help', bottom: '5%', right: '0%',  delay: 1.2 },
          ].map(({ label, delay, ...pos }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
              transition={{
                opacity: { delay, duration: 0.5 },
                scale: { delay, duration: 0.5, type: 'spring' },
                y: { delay: delay + 0.5, duration: 3 + delay, repeat: Infinity, ease: 'easeInOut' },
              }}
              style={{ position: 'absolute', ...pos }}
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 text-white/70"
              css={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}
            >
              <span style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', padding: '6px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block' }}>
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-slate-700 tracking-[0.25em] uppercase font-bold">Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-slate-800 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-amber-500/60" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AetherFlowHero;
