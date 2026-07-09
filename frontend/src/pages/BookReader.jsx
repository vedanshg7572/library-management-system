import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ArrowLeftCircle, BookOpen, Settings,
  Sun, Moon, Minus, Plus, Bookmark, BookMarked, Home,
  ChevronLeft, ChevronRight, Loader, AlertCircle, List, X
} from 'lucide-react';
import { useBooks } from '../context/BookContext';
import { fetchGutenbergText, paginateText, getCoverUrl, genreGradient } from '../services/gutenberg';

/* ── Reading settings from localStorage ─────────────────────── */
const loadSettings = () => {
  try {
    return JSON.parse(localStorage.getItem('readerSettings') || '{}');
  } catch { return {}; }
};
const saveSettings = (s) => localStorage.setItem('readerSettings', JSON.stringify(s));

const loadProgress = (bookId) => {
  try {
    const all = JSON.parse(localStorage.getItem('readingProgress') || '{}');
    return all[bookId] || 0;
  } catch { return 0; }
};
const saveProgress = (bookId, page) => {
  try {
    const all = JSON.parse(localStorage.getItem('readingProgress') || '{}');
    all[bookId] = page;
    localStorage.setItem('readingProgress', JSON.stringify(all));
  } catch {}
};

/* ════════════════════════════════════════════════════════════ */
const BookReader = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { books } = useBooks();
  const book = books.find(b => b._id === bookId);

  const [pages, setPages]       = useState([]);
  const [currentPage, setPage]  = useState(0);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showTOC, setShowTOC]   = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Settings
  const stored = loadSettings();
  const [fontSize, setFontSize]  = useState(stored.fontSize || 18);
  const [darkMode, setDarkMode]  = useState(stored.darkMode !== false);
  const [fontFamily, setFont]    = useState(stored.fontFamily || 'serif');
  const [lineHeight, setLineH]   = useState(stored.lineHeight || 1.9);

  const contentRef = useRef(null);

  // Persist settings
  useEffect(() => {
    saveSettings({ fontSize, darkMode, fontFamily, lineHeight });
  }, [fontSize, darkMode, fontFamily, lineHeight]);

  // Fetch and paginate text
  useEffect(() => {
    if (!book) return;
    setLoading(true);
    setError('');

    if (!book.gutenbergId) {
      setError('This book is not available for online reading.');
      setLoading(false);
      return;
    }

    fetchGutenbergText(book.gutenbergId)
      .then(text => {
        const pgs = paginateText(text, 280);
        setPages(pgs);
        const saved = loadProgress(bookId);
        setPage(Math.min(saved, pgs.length - 1));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [book, bookId]);

  // Save progress on page change
  useEffect(() => {
    if (pages.length > 0) saveProgress(bookId, currentPage);
  }, [currentPage, bookId, pages.length]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const goNext = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setPage(p => p + 1);
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, pages.length]);

  const goPrev = useCallback(() => {
    if (currentPage > 0) {
      setPage(p => p - 1);
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const progress = pages.length > 0 ? ((currentPage + 1) / pages.length) * 100 : 0;
  const coverUrl = book ? getCoverUrl(book.ISBN) : '';
  const gradient = book ? (genreGradient[book.genre] || 'from-violet-700 to-purple-900') : '';

  const bg    = darkMode ? '#0d0d14' : '#faf7f2';
  const text  = darkMode ? '#e8e0d5' : '#2d2416';
  const panel = darkMode ? 'rgba(18,18,28,0.96)' : 'rgba(250,247,242,0.97)';

  if (!book) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d14]">
      <div className="text-center">
        <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
        <p className="text-white font-bold mb-2">Book not found</p>
        <Link to="/student-dashboard" className="text-indigo-400 text-sm hover:underline">← Back to Library</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bg, color: text, transition: 'all 0.3s ease' }}>

      {/* ── Top Reading Bar ──────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 py-3 border-b"
        style={{ background: panel, borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)', backdropFilter: 'blur(20px)' }}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student-dashboard')}
            className="flex items-center gap-2 text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Library</span>
          </button>
          <div className="w-px h-5 opacity-20" style={{ background: text }} />
          <div className="flex items-center gap-2">
            <div className={`w-6 h-8 rounded-sm bg-gradient-to-b ${gradient} shadow-sm flex-shrink-0`} />
            <div>
              <p className="text-xs font-bold line-clamp-1 max-w-[180px] md:max-w-xs">{book.title}</p>
              <p className="text-[10px] opacity-50">{book.author}</p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBookmarked(b => !b)}
            title="Bookmark"
            className={`p-2 rounded-xl transition-all ${bookmarked ? 'text-amber-400' : 'opacity-40 hover:opacity-80'}`}
          >
            {bookmarked ? <BookMarked className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setShowSettings(s => !s)}
            className="p-2 rounded-xl opacity-50 hover:opacity-100 transition-opacity"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDarkMode(d => !d)}
            className="p-2 rounded-xl opacity-50 hover:opacity-100 transition-opacity"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Reading progress bar */}
      <div className="h-0.5 w-full" style={{ background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #6366f1)' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* ── Settings Panel ───────────────────────────────────── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 right-4 z-50 w-64 rounded-2xl shadow-2xl border p-5"
            style={{ background: panel, borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
          >
            <div className="flex justify-between items-center mb-4">
              <p className="font-bold text-sm">Reading Settings</p>
              <button onClick={() => setShowSettings(false)}><X className="h-4 w-4 opacity-50" /></button>
            </div>

            {/* Font size */}
            <div className="mb-4">
              <p className="text-xs opacity-50 mb-2 font-semibold uppercase tracking-wider">Font Size</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setFontSize(f => Math.max(12, f - 1))} className="p-1.5 rounded-lg border opacity-60 hover:opacity-100"><Minus className="h-3 w-3" /></button>
                <span className="text-sm font-bold flex-1 text-center">{fontSize}px</span>
                <button onClick={() => setFontSize(f => Math.min(28, f + 1))} className="p-1.5 rounded-lg border opacity-60 hover:opacity-100"><Plus className="h-3 w-3" /></button>
              </div>
            </div>

            {/* Font family */}
            <div className="mb-4">
              <p className="text-xs opacity-50 mb-2 font-semibold uppercase tracking-wider">Font</p>
              <div className="grid grid-cols-2 gap-2">
                {['serif', 'sans-serif', 'Georgia', 'Palatino'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFont(f)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${fontFamily === f ? 'border-violet-500 bg-violet-500/20 text-violet-400' : 'opacity-50 hover:opacity-80'}`}
                    style={{ fontFamily: f }}
                  >
                    {f === 'sans-serif' ? 'Sans' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Line height */}
            <div>
              <p className="text-xs opacity-50 mb-2 font-semibold uppercase tracking-wider">Line Spacing</p>
              <div className="flex gap-2">
                {[1.5, 1.9, 2.3].map(l => (
                  <button
                    key={l}
                    onClick={() => setLineH(l)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${lineHeight === l ? 'border-violet-500 bg-violet-500/20 text-violet-400' : 'opacity-50 hover:opacity-80'}`}
                  >
                    {l === 1.5 ? 'Tight' : l === 1.9 ? 'Normal' : 'Loose'}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              <Loader className="h-8 w-8 text-violet-500" />
            </motion.div>
            <p className="text-sm opacity-50 font-medium">Loading book...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 max-w-md text-center">
            <AlertCircle className="h-10 w-10 text-rose-400" />
            <p className="font-bold text-lg">Unable to Load</p>
            <p className="text-sm opacity-60">{error}</p>
            <button
              onClick={() => navigate('/student-dashboard')}
              className="mt-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold transition-colors"
            >
              Back to Library
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              ref={contentRef}
              className="w-full max-w-2xl"
            >
              {/* Page content */}
              <div
                className="whitespace-pre-wrap"
                style={{
                  fontFamily,
                  fontSize,
                  lineHeight,
                  color: text,
                }}
              >
                {pages[currentPage]}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* ── Bottom Navigation ────────────────────────────────── */}
      {!loading && !error && pages.length > 0 && (
        <footer
          className="sticky bottom-0 z-30 flex items-center justify-between px-4 md:px-8 py-4 border-t"
          style={{ background: panel, borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)', backdropFilter: 'blur(20px)' }}
        >
          {/* Prev */}
          <button
            onClick={goPrev}
            disabled={currentPage === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-25"
            style={{ background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Page info */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold opacity-60">
              Page {currentPage + 1} of {pages.length}
            </span>
            <div className="flex items-center gap-1">
              {/* Mini page dots */}
              {Array.from({ length: Math.min(7, pages.length) }).map((_, i) => {
                const idx = Math.floor((i / 6) * (pages.length - 1));
                const active = Math.abs(idx - currentPage) < pages.length / 7;
                return (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full transition-all"
                    style={{ background: active ? '#7c3aed' : (darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)') }}
                  />
                );
              })}
            </div>
          </div>

          {/* Next */}
          <button
            onClick={goNext}
            disabled={currentPage === pages.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-25"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </footer>
      )}
    </div>
  );
};

export default BookReader;
