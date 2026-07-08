import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Star, Users, BookMarked, Sparkles, Search, Library } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* ── Book spine data for the shelf ──────────────────────────── */
const shelf1 = [
  { title: 'Python', color: '#3b82f6', w: 28 },
  { title: 'Design', color: '#a855f7', w: 22 },
  { title: 'History', color: '#b45309', w: 32 },
  { title: 'Maths', color: '#059669', w: 24 },
  { title: 'Physics', color: '#dc2626', w: 30 },
  { title: 'Art', color: '#d97706', w: 20 },
  { title: 'Science', color: '#0891b2', w: 26 },
  { title: 'Law', color: '#7c3aed', w: 22 },
];
const shelf2 = [
  { title: 'React', color: '#06b6d4', w: 26 },
  { title: 'Chemistry', color: '#16a34a', w: 34 },
  { title: 'Bio', color: '#65a30d', w: 22 },
  { title: 'Fiction', color: '#9333ea', w: 30 },
  { title: 'Economy', color: '#ca8a04', w: 28 },
  { title: 'Geo', color: '#0284c7', w: 24 },
  { title: 'Music', color: '#e11d48', w: 22 },
];
const shelf3 = [
  { title: 'English', color: '#7c3aed', w: 30 },
  { title: 'Algebra', color: '#b45309', w: 26 },
  { title: 'Ethics', color: '#0f766e', w: 24 },
  { title: 'Drama', color: '#dc2626', w: 28 },
  { title: 'CS', color: '#1d4ed8', w: 22 },
  { title: 'Poetry', color: '#be185d', w: 32 },
  { title: 'Logic', color: '#6d28d9', w: 24 },
];

/* ── A single book spine ─────────────────────────────────────── */
const Spine = ({ book, delay }) => (
  <motion.div
    initial={{ scaleY: 0, opacity: 0 }}
    animate={{ scaleY: 1, opacity: 1 }}
    transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    style={{
      width: book.w,
      background: `linear-gradient(160deg, ${book.color}dd 0%, ${book.color}88 100%)`,
      originY: 1,
    }}
    className="relative h-full rounded-t-sm flex items-end justify-center pb-2 shadow-lg hover:scale-y-105 hover:-translate-y-1 transition-transform duration-200 cursor-default group"
  >
    {/* Spine label */}
    <span
      className="text-white/80 font-bold group-hover:text-white transition-colors"
      style={{
        fontSize: 9,
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        transform: 'rotate(180deg)',
        letterSpacing: '0.05em',
        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        maxHeight: '80%',
      }}
    >
      {book.title}
    </span>
    {/* Spine shine */}
    <div
      className="absolute left-0 top-0 w-1.5 h-full rounded-tl-sm"
      style={{ background: 'rgba(255,255,255,0.18)' }}
    />
  </motion.div>
);

/* ── Shelf row ───────────────────────────────────────────────── */
const ShelfRow = ({ books, height, baseDelay }) => (
  <div className="relative w-full">
    {/* Books */}
    <div className="flex items-end gap-0.5 px-2" style={{ height }}>
      {books.map((b, i) => (
        <Spine key={b.title + i} book={b} delay={baseDelay + i * 0.04} />
      ))}
    </div>
    {/* Shelf plank */}
    <div
      className="w-full h-3 rounded-sm shadow-md"
      style={{
        background: 'linear-gradient(180deg, #92400e 0%, #78350f 60%, #451a03 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      }}
    />
  </div>
);

/* ── Particle canvas ─────────────────────────────────────────── */
const useParticleCanvas = (ref) => {
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let id, particles = [];
    const mouse = { x: null, y: null, r: 150 };

    class P {
      constructor(x, y, dx, dy, s, c) { Object.assign(this, { x, y, dx, dy, s, c }); }
      draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2); ctx.fillStyle = this.c; ctx.fill(); }
      update() {
        if (this.x > canvas.width || this.x < 0) this.dx *= -1;
        if (this.y > canvas.height || this.y < 0) this.dy *= -1;
        if (mouse.x) {
          const dx = mouse.x - this.x, dy = mouse.y - this.y, d = Math.sqrt(dx*dx+dy*dy);
          if (d < mouse.r) { const f = (mouse.r-d)/mouse.r; this.x -= dx/d*f*3; this.y -= dy/d*f*3; }
        }
        this.x += this.dx; this.y += this.dy; this.draw();
      }
    }
    const pal = ['rgba(167,139,250,0.6)','rgba(99,102,241,0.6)','rgba(196,132,252,0.5)','rgba(217,119,6,0.3)','rgba(139,92,246,0.6)'];
    const init = () => {
      particles = [];
      const n = (canvas.width * canvas.height) / 11000;
      for (let i = 0; i < n; i++) particles.push(new P(
        Math.random()*canvas.width, Math.random()*canvas.height,
        (Math.random()-.5)*.45, (Math.random()-.5)*.45,
        Math.random()*1.5+.5, pal[Math.floor(Math.random()*pal.length)]
      ));
    };
    const connect = () => {
      const th = (canvas.width/8)*(canvas.height/8);
      for (let a=0;a<particles.length;a++) for (let b=a+1;b<particles.length;b++) {
        const d=(particles[a].x-particles[b].x)**2+(particles[a].y-particles[b].y)**2;
        if (d<th) {
          const op=(1-d/th)*0.35;
          ctx.strokeStyle=`rgba(139,92,246,${op})`; ctx.lineWidth=0.6;
          ctx.beginPath(); ctx.moveTo(particles[a].x,particles[a].y); ctx.lineTo(particles[b].x,particles[b].y); ctx.stroke();
        }
      }
    };
    const resize = () => { canvas.width=innerWidth; canvas.height=innerHeight; init(); };
    window.addEventListener('resize',resize);
    window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
    window.addEventListener('mouseout',()=>{mouse.x=null;mouse.y=null;});
    resize();
    const loop=()=>{ id=requestAnimationFrame(loop); ctx.fillStyle='rgba(3,0,30,1)'; ctx.fillRect(0,0,canvas.width,canvas.height); particles.forEach(p=>p.update()); connect(); };
    loop();
    return ()=>{ window.removeEventListener('resize',resize); cancelAnimationFrame(id); };
  }, [ref]);
};

/* ════════════════════════════════════════════════════════════ */
const AetherFlowHero = () => {
  const canvasRef = React.useRef(null);
  const { user } = useAuth();
  useParticleCanvas(canvasRef);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#03001e] to-transparent z-10 pointer-events-none" />

      {/* Warm amber + purple glow orbs */}
      <div className="absolute top-1/3 left-0 w-[600px] h-[600px] rounded-full bg-amber-700/8 blur-[120px] pointer-events-none z-10" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-700/12 blur-[100px] pointer-events-none z-10" />
      <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-700/10 blur-[90px] pointer-events-none z-10" />

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 py-24 flex flex-col lg:flex-row items-center gap-12">

        {/* ── LEFT: Text ───────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/8 backdrop-blur-md mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
            <Library className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 tracking-[0.12em] uppercase">
              Digital Library System
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-black leading-[0.93] tracking-tighter mb-6"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5.2rem)' }}
          >
            <span className="block text-white">Discover.</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(120deg, #fbbf24 0%, #f59e0b 20%, #c084fc 55%, #818cf8 100%)',
                backgroundSize: '200% auto',
                animation: 'gradient-shift 5s linear infinite',
              }}
            >
              Borrow.
            </span>
            <span className="block text-white">Return.</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-slate-400 text-lg leading-relaxed max-w-lg mb-4 font-medium"
          >
            VedLibrary brings your entire school library online — browse thousands of books,
            borrow in one click, and track everything from your personal dashboard.
          </motion.p>

          {/* Search bar UI (decorative but clickable) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="w-full max-w-md mb-10"
          >
            <Link
              to={user ? (user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard') : '/signup'}
              className="btn-zoom flex items-center gap-3 px-4 py-3.5 bg-white/6 border border-white/12 hover:border-amber-500/40 hover:bg-amber-500/8 rounded-2xl backdrop-blur-md transition-all duration-300 group"
            >
              <Search className="h-4 w-4 text-slate-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
              <span className="text-slate-500 group-hover:text-slate-300 text-sm font-medium transition-colors flex-grow text-left">
                Search books, authors, genres...
              </span>
              <span className="text-xs text-slate-600 group-hover:text-amber-500 font-semibold border border-white/10 group-hover:border-amber-500/30 px-2 py-1 rounded-lg transition-all flex-shrink-0">
                Browse →
              </span>
            </Link>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-3 mb-12 w-full sm:w-auto"
          >
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'}
                className="glow-btn btn-zoom group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-bold rounded-2xl shadow-2xl shadow-amber-700/30 text-sm"
              >
                <BookMarked className="h-4 w-4" />
                Open My Dashboard
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="glow-btn btn-zoom group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 text-white font-bold rounded-2xl shadow-2xl shadow-amber-700/30 text-sm"
                >
                  <Sparkles className="h-4 w-4" />
                  Get Library Access
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="btn-zoom inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/10 hover:border-amber-500/40 bg-white/4 hover:bg-amber-500/8 text-slate-300 hover:text-white font-semibold rounded-2xl backdrop-blur-sm text-sm transition-all"
                >
                  Librarian Sign In
                </Link>
              </>
            )}
          </motion.div>

          {/* Mini stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-6 flex-wrap justify-center lg:justify-start"
          >
            {[
              { icon: BookOpen, val: '10,000+', label: 'Books', color: 'text-amber-400' },
              { icon: Users, val: '500+', label: 'Students', color: 'text-purple-400' },
              { icon: Star, val: '4.9★', label: 'Rated', color: 'text-indigo-400' },
            ].map(({ icon: Icon, val, label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="text-white font-bold text-sm">{val}</span>
                <span className="text-slate-500 text-xs">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: Bookshelf ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 flex items-center justify-center w-full max-w-md lg:max-w-lg"
        >
          {/* Bookshelf container */}
          <div
            className="relative w-full rounded-3xl overflow-hidden p-5 pb-0"
            style={{
              background: 'linear-gradient(145deg, rgba(30,20,10,0.85) 0%, rgba(15,10,5,0.9) 100%)',
              border: '1px solid rgba(161,120,60,0.2)',
              boxShadow: '0 30px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Library header inside the shelf box */}
            <div className="flex items-center justify-between mb-5 px-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center">
                  <Library className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-xs font-bold">VedLibrary</p>
                  <p className="text-amber-600/80 text-[10px]">Book Catalogue</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
            </div>

            {/* Shelf backing wall */}
            <div
              className="rounded-t-xl overflow-hidden px-3 pt-3 flex flex-col gap-4"
              style={{ background: 'linear-gradient(180deg, #1c1008 0%, #120b04 100%)' }}
            >
              {/* Back wall texture */}
              <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)' }}
              />

              <ShelfRow books={shelf1} height={90} baseDelay={0.5} />
              <ShelfRow books={shelf2} height={80} baseDelay={0.9} />
              <ShelfRow books={shelf3} height={85} baseDelay={1.3} />

              {/* Bottom floor */}
              <div className="h-4 rounded-b-none"
                style={{ background: 'linear-gradient(180deg, #92400e 0%, #451a03 100%)' }} />
            </div>

            {/* Floating "Available now" chip */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              10,000+ Books Available
            </motion.div>

            {/* Bottom label */}
            <div className="flex items-center justify-between px-1 py-3">
              <span className="text-amber-700/60 text-[10px] font-semibold uppercase tracking-widest">
                School Library Catalogue
              </span>
              <span className="text-amber-600/60 text-[10px] font-bold">
                3 Shelves Shown
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-slate-700 tracking-[0.25em] uppercase font-bold">Explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-slate-800 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-amber-500/60" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AetherFlowHero;
