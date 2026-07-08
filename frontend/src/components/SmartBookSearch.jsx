import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, BookOpen, X, ArrowRight, Star, Mic } from 'lucide-react';

// ── Keyword → Genre/Topic mapping ──────────────────────────────
const keywordMap = {
  // Genre keywords
  fiction:      ['Fiction'],
  novel:        ['Fiction'],
  story:        ['Fiction'],
  kahani:       ['Fiction'],
  fantasy:      ['Fiction'],
  thriller:     ['Fiction'],

  technology:   ['Technology'],
  tech:         ['Technology'],
  coding:       ['Technology'],
  programming:  ['Technology'],
  computer:     ['Technology'],
  software:     ['Technology'],
  python:       ['Technology'],
  javascript:   ['Technology'],
  algorithm:    ['Technology'],

  science:      ['Science'],
  physics:      ['Science', 'Mathematics'],
  biology:      ['Science'],
  chemistry:    ['Science'],
  space:        ['Science'],
  universe:     ['Science'],
  nature:       ['Science'],

  history:      ['History'],
  itihas:       ['History'],
  india:        ['History', 'Biography'],
  war:          ['History'],
  ancient:      ['History'],

  'self-help':  ['Self-Help'],
  motivation:   ['Self-Help'],
  success:      ['Self-Help'],
  habit:        ['Self-Help'],
  growth:       ['Self-Help'],
  productivity: ['Self-Help'],
  mindset:      ['Self-Help'],
  inspire:      ['Self-Help'],
  khud:         ['Self-Help'],

  math:         ['Mathematics'],
  maths:        ['Mathematics'],
  ganit:        ['Mathematics'],
  calculus:     ['Mathematics'],
  number:       ['Mathematics'],

  biography:    ['Biography'],
  life:         ['Biography'],
  jeevan:       ['Biography'],
  kalam:        ['Biography'],
  gandhi:       ['Biography', 'History'],
  elon:         ['Biography'],
  jobs:         ['Biography'],

  economics:    ['Economics'],
  money:        ['Economics', 'Self-Help'],
  finance:      ['Economics', 'Self-Help'],
  business:     ['Economics'],
  paise:        ['Economics', 'Self-Help'],
  invest:       ['Economics'],
  rich:         ['Economics', 'Self-Help'],
};

// ── Get relevant genres from query ──────────────────────────────
const getMatchedGenres = (query) => {
  const lower = query.toLowerCase();
  const matched = new Set();
  Object.entries(keywordMap).forEach(([kw, genres]) => {
    if (lower.includes(kw)) genres.forEach((g) => matched.add(g));
  });
  return Array.from(matched);
};

// ── Score a book against query ──────────────────────────────────
const scoreBook = (book, query, matchedGenres) => {
  const q = query.toLowerCase();
  let score = 0;
  if (book.title.toLowerCase().includes(q))  score += 10;
  if (book.author.toLowerCase().includes(q)) score += 8;
  if (book.ISBN.includes(q))                 score += 6;
  if (matchedGenres.includes(book.genre))    score += 5;
  // partial word match
  q.split(' ').forEach((word) => {
    if (word.length < 2) return;
    if (book.title.toLowerCase().includes(word))  score += 3;
    if (book.author.toLowerCase().includes(word)) score += 2;
    if (book.genre.toLowerCase().includes(word))  score += 2;
  });
  return score;
};

// ── Genre color map ─────────────────────────────────────────────
const genreColor = {
  Technology:  { bg: 'bg-blue-500/15',   text: 'text-blue-400',   border: 'border-blue-500/20' },
  Fiction:     { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/20' },
  Science:     { bg: 'bg-cyan-500/15',   text: 'text-cyan-400',   border: 'border-cyan-500/20' },
  History:     { bg: 'bg-amber-500/15',  text: 'text-amber-400',  border: 'border-amber-500/20' },
  'Self-Help': { bg: 'bg-emerald-500/15',text: 'text-emerald-400',border: 'border-emerald-500/20' },
  Mathematics: { bg: 'bg-rose-500/15',   text: 'text-rose-400',   border: 'border-rose-500/20' },
  Biography:   { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/20' },
  Economics:   { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/20' },
};

const defaultColor = { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/20' };

// ── Example prompts ─────────────────────────────────────────────
const prompts = [
  'Motivational books padhni hai 💪',
  'Science fiction suggestions do 🚀',
  'Coding sikhna hai 💻',
  'Indian history chahiye 🇮🇳',
  'Self improvement books 📈',
  'Money aur finance ke baare mein 💰',
  'Famous biographies dikhao 👤',
  'Mathematics books chahiye ➕',
];

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════ */
const SmartBookSearch = ({ books, onBorrow, onSelectBook }) => {
  const [query, setQuery]           = useState('');
  const [results, setResults]       = useState([]);
  const [matchedGenres, setMatched] = useState([]);
  const [isFocused, setFocused]     = useState(false);
  const [promptIdx, setPromptIdx]   = useState(0);
  const inputRef  = useRef(null);
  const wrapperRef = useRef(null);

  // Cycle through placeholder prompts
  useEffect(() => {
    const id = setInterval(() => setPromptIdx((i) => (i + 1) % prompts.length), 2800);
    return () => clearInterval(id);
  }, []);

  // Click outside → close
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Search logic
  useEffect(() => {
    if (!query.trim()) { setResults([]); setMatched([]); return; }

    const genres = getMatchedGenres(query);
    setMatched(genres);

    const scored = books
      .map((b) => ({ book: b, score: scoreBook(b, query, genres) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ book }) => book);

    setResults(scored);
  }, [query, books]);

  const handlePromptClick = (p) => {
    setQuery(p.replace(/[^\w\s]/gi, '').trim());
    inputRef.current?.focus();
    setFocused(true);
  };

  const clearQuery = () => { setQuery(''); setResults([]); setMatched([]); inputRef.current?.focus(); };

  const showDropdown = isFocused && query.trim().length > 0;

  return (
    <div ref={wrapperRef} className="w-full mb-8">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Sparkles className="h-4 w-4 text-amber-400" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-white">Smart Book Search</h3>
          <p className="text-xs text-slate-500 font-medium">
            Type what you want to read — Hindi ya English mein!
          </p>
        </div>
      </div>

      {/* ── Search Input ───────────────────────────────────────── */}
      <div className="relative">
        <div
          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-300 ${
            isFocused
              ? 'bg-slate-900/80 border-amber-500/50 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Search className={`h-4.5 w-4.5 flex-shrink-0 transition-colors ${isFocused ? 'text-amber-400' : 'text-slate-500'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={prompts[promptIdx]}
            className="flex-1 bg-transparent text-white text-sm font-medium outline-none placeholder:text-slate-600 transition-all"
          />
          {query && (
            <button onClick={clearQuery} className="text-slate-500 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── Dropdown Results ────────────────────────────────── */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl shadow-black/50"
              style={{ background: 'rgba(10,8,30,0.97)', backdropFilter: 'blur(20px)' }}
            >
              {/* Matched genres pill row */}
              {matchedGenres.length > 0 && (
                <div className="flex gap-2 px-4 pt-3 pb-2 flex-wrap border-b border-slate-800/60">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest self-center">Showing:</span>
                  {matchedGenres.map((g) => {
                    const c = genreColor[g] || defaultColor;
                    return (
                      <span key={g} className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                        {g}
                      </span>
                    );
                  })}
                </div>
              )}

              {results.length > 0 ? (
                <div className="max-h-72 overflow-y-auto">
                  {results.map((book, i) => {
                    const c = genreColor[book.genre] || defaultColor;
                    const isAvail = book.availableCopies > 0;
                    return (
                      <motion.div
                        key={book._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-4 px-4 py-3.5 hover:bg-white/4 transition-colors border-b border-slate-800/40 last:border-0 group"
                      >
                        {/* Book icon */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${c.bg} ${c.border}`}>
                          <BookOpen className={`h-4 w-4 ${c.text}`} />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate leading-tight">{book.title}</p>
                          <p className="text-[11px] text-slate-500 font-medium truncate">by {book.author}</p>
                        </div>

                        {/* Genre + availability */}
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                            {book.genre}
                          </span>
                          <span className={`text-[9px] font-bold ${isAvail ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isAvail ? `${book.availableCopies} available` : 'Out of Stock'}
                          </span>
                        </div>

                        {/* Borrow button */}
                        {isAvail && (
                          <button
                            onClick={() => { onBorrow(book._id); setFocused(false); }}
                            className="flex-shrink-0 flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500 hover:border-amber-500 text-amber-400 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            Borrow
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <BookOpen className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-400">Koi book nahi mili</p>
                  <p className="text-xs text-slate-600 mt-1">Alag keywords try karo!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Quick Prompt Chips ─────────────────────────────────── */}
      {!query && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-2 mt-3"
        >
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest self-center">Try:</span>
          {prompts.slice(0, 5).map((p) => (
            <button
              key={p}
              onClick={() => handlePromptClick(p)}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 hover:bg-amber-500/8 hover:text-amber-300 text-slate-400 transition-all duration-200"
            >
              {p}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SmartBookSearch;
