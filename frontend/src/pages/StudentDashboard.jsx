import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SmartBookSearch from '../components/SmartBookSearch';
import {
  Search, BookOpen, CheckCircle, Clock,
  AlertCircle, ChevronLeft, ChevronRight, Star, BookMarked,
  Bookmark, ArrowRight, Play, Eye, X, Filter
} from 'lucide-react';
import { getCoverUrl, genreGradient } from '../services/gutenberg';

/* ── Genre color map ─────────────────────────────────────── */
const genreColors = {
  Technology:  { from: '#3b82f6', to: '#1d4ed8', emoji: '💻' },
  Fiction:     { from: '#8b5cf6', to: '#6d28d9', emoji: '📖' },
  Science:     { from: '#06b6d4', to: '#0891b2', emoji: '🔬' },
  History:     { from: '#f59e0b', to: '#d97706', emoji: '🏛️' },
  'Self-Help': { from: '#10b981', to: '#059669', emoji: '🌱' },
  Mathematics: { from: '#ef4444', to: '#dc2626', emoji: '➕' },
  Biography:   { from: '#f97316', to: '#ea580c', emoji: '👤' },
  Economics:   { from: '#6366f1', to: '#4f46e5', emoji: '💰' },
};

/* ── Book cover card ─────────────────────────────────────── */
const BookCover = ({ book, onBorrow, compact = false }) => {
  const [imgErr, setImgErr] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const gc = genreColors[book.genre] || { from: '#6366f1', to: '#4f46e5', emoji: '📚' };
  const isAvail = book.availableCopies > 0;
  const canRead = book.readOnline && book.gutenbergId;

  const h = compact ? 140 : 180;
  const w = compact ? 96  : 120;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -6 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative flex-shrink-0 cursor-pointer"
      style={{ width: w }}
    >
      {/* Book cover */}
      <div
        className="relative overflow-hidden rounded-lg shadow-xl"
        style={{ height: h, width: w }}
      >
        {!imgErr ? (
          <img
            src={getCoverUrl(book.ISBN)}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-2 text-center"
            style={{ background: `linear-gradient(160deg, ${gc.from}, ${gc.to})` }}
          >
            <span className="text-2xl mb-1">{gc.emoji}</span>
            <p className="text-white text-[9px] font-bold leading-tight line-clamp-4">{book.title}</p>
            <p className="text-white/60 text-[8px] mt-1 line-clamp-1">{book.author}</p>
          </div>
        )}

        {/* Read online badge */}
        {canRead && (
          <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
            READ
          </div>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2"
              style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)' }}
            >
              {canRead && (
                <button
                  onClick={() => navigate(`/read/${book._id}`)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-amber-500 hover:bg-amber-400 text-white text-[10px] font-bold rounded-lg transition-colors"
                >
                  <Play className="h-3 w-3" />
                  Read Now
                </button>
              )}
              {isAvail && !canRead && (
                <button
                  onClick={() => onBorrow(book._id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-white text-[10px] font-bold rounded-lg transition-colors"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}
                >
                  <BookMarked className="h-3 w-3" />
                  Borrow
                </button>
              )}
              <p className="text-white/60 text-[9px] text-center line-clamp-2">{book.author}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Title below */}
      <p className="text-white text-[10px] font-bold mt-2 line-clamp-2 leading-tight">{book.title}</p>
      <p className="text-slate-500 text-[9px] mt-0.5 line-clamp-1">{book.author}</p>
    </motion.div>
  );
};

/* ── Horizontal scrolling shelf ──────────────────────────── */
const BookShelf = ({ title, emoji, books, onBorrow, compact = false }) => {
  const ref = useRef(null);
  const scroll = (dir) => {
    ref.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };
  if (!books.length) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <span>{emoji}</span>
          {title}
          <span className="text-xs text-slate-600 font-semibold">({books.length})</span>
        </h3>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => scroll(1)} className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {books.map(book => (
          <BookCover key={book._id} book={book} onBorrow={onBorrow} compact={compact} />
        ))}
      </div>
    </div>
  );
};

/* ── Featured book spotlight ─────────────────────────────── */
const FeaturedBook = ({ book, onBorrow }) => {
  const [imgErr, setImgErr] = useState(false);
  const navigate = useNavigate();
  if (!book) return null;
  const gc = genreColors[book.genre] || { from: '#6366f1', to: '#4f46e5', emoji: '📚' };
  const canRead = book.readOnline && book.gutenbergId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-3xl overflow-hidden mb-8 p-6 md:p-10 flex flex-col md:flex-row items-center gap-8"
      style={{
        background: `linear-gradient(135deg, rgba(${gc.from.replace('#','')},0.15) 0%, rgba(3,0,30,0.95) 60%)`,
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: `0 0 80px -20px ${gc.from}40`,
      }}
    >
      {/* BG gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(120deg, ${gc.from}18 0%, transparent 60%)` }} />

      {/* Book cover */}
      <div className="relative flex-shrink-0 z-10">
        <div className="w-32 h-44 rounded-xl overflow-hidden shadow-2xl" style={{ boxShadow: `0 20px 60px ${gc.from}60` }}>
          {!imgErr ? (
            <img src={getCoverUrl(book.ISBN)} alt={book.title} className="w-full h-full object-cover" onError={() => setImgErr(true)} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3" style={{ background: `linear-gradient(160deg, ${gc.from}, ${gc.to})` }}>
              <span className="text-3xl mb-2">{gc.emoji}</span>
              <p className="text-white text-[10px] font-bold text-center line-clamp-4">{book.title}</p>
            </div>
          )}
        </div>
        {canRead && (
          <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-lg">
            FREE READ
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border mb-3"
          style={{ background: `${gc.from}20`, borderColor: `${gc.from}40`, color: gc.from }}>
          ✨ Featured Book
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight mb-1">{book.title}</h2>
        <p className="text-slate-400 text-sm font-medium mb-3">by {book.author}</p>
        <p className="text-slate-500 text-xs leading-relaxed mb-5 max-w-lg line-clamp-3">
          {book.description || `A timeless work by ${book.author} that has captivated readers worldwide. Explore this masterpiece in our digital library.`}
        </p>
        <div className="flex gap-3 flex-wrap">
          {canRead && (
            <button
              onClick={() => navigate(`/read/${book._id}`)}
              className="group flex items-center gap-2 px-6 py-3 font-bold text-sm text-white rounded-xl shadow-lg transition-all"
              style={{ background: `linear-gradient(135deg, ${gc.from}, ${gc.to})`, boxShadow: `0 8px 24px ${gc.from}50` }}
            >
              <Play className="h-4 w-4" />
              Read Now
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
          {book.availableCopies > 0 && (
            <button
              onClick={() => onBorrow(book._id)}
              className="flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-xl border border-white/10 hover:border-white/25 text-slate-300 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <BookMarked className="h-4 w-4" />
              Borrow Copy
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════════
   MAIN DASHBOARD
════════════════════════════════════════════════════════════ */
const StudentDashboard = () => {
  const { user } = useAuth();
  const { books, transactions, borrowBook, returnBook } = useBooks();
  const navigate = useNavigate();

  const [search, setSearch]         = useState('');
  const [activeGenre, setActiveGenre] = useState('All');
  const [successMsg, setSuccessMsg]  = useState('');
  const [errorMsg, setErrorMsg]      = useState('');
  const [activeTab, setActiveTab]    = useState('browse'); // 'browse' | 'mybooks'

  if (!user) return null;

  const myTransactions   = transactions.filter(t => t.studentId === user.id || t.studentId?._id === user.id);
  const activeBorrowings = myTransactions.filter(t => t.status === 'borrowed' || t.status === 'overdue');
  const returnedCount    = myTransactions.filter(t => t.status === 'returned').length;

  const handleBorrow = async (bookId) => {
    setSuccessMsg(''); setErrorMsg('');
    try {
      await borrowBook(bookId, user.id);
      const book = books.find(b => b._id === bookId);
      setSuccessMsg(`"${book?.title}" borrowed! Return within 14 days.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      setErrorMsg(e.message);
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleReturn = async (transactionId) => {
    setSuccessMsg(''); setErrorMsg('');
    try {
      const t = transactions.find(t => t._id === transactionId);
      const b = books.find(b => b._id === (t?.bookId?._id || t?.bookId));
      await returnBook(transactionId);
      setSuccessMsg(`"${b?.title}" returned!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      setErrorMsg(e.message);
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // Group books by genre
  const genres = ['All', ...Array.from(new Set(books.map(b => b.genre))).sort()];
  const readableBooks = books.filter(b => b.readOnline && b.gutenbergId);
  const featuredBook = readableBooks[Math.floor(readableBooks.length * 0.3)] || books[0];

  const genreGroups = {};
  books.forEach(b => {
    if (!genreGroups[b.genre]) genreGroups[b.genre] = [];
    genreGroups[b.genre].push(b);
  });

  const filteredBooks = books.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.ISBN.includes(q);
    const matchGenre = activeGenre === 'All' || b.genre === activeGenre;
    return matchSearch && matchGenre;
  });

  const readingProgress = (() => {
    try { return JSON.parse(localStorage.getItem('readingProgress') || '{}'); } catch { return {}; }
  })();
  const continueReading = books.filter(b => readingProgress[b._id] !== undefined && b.readOnline);

  return (
    <div className="min-h-screen" style={{ background: '#06040f' }}>

      {/* Toast notifications */}
      <AnimatePresence>
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold">
            <CheckCircle className="h-4 w-4" />{successMsg}
          </motion.div>
        )}
        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-rose-500 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold">
            <AlertCircle className="h-4 w-4" />{errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Welcome back, <span className="text-amber-400">{user.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Your personal digital library awaits.</p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4">
            {[
              { icon: BookOpen,   val: activeBorrowings.length, label: 'Active',  color: 'text-indigo-400' },
              { icon: CheckCircle,val: returnedCount,            label: 'Returned',color: 'text-emerald-400' },
            ].map(({ icon: Icon, val, label, color }) => (
              <div key={label} className="flex flex-col items-center px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/40">
                <Icon className={`h-3.5 w-3.5 ${color} mb-0.5`} />
                <span className="text-white font-extrabold text-sm">{val}</span>
                <span className="text-slate-600 text-[9px] uppercase tracking-wider">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────── */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'browse',  label: '📚 Browse Library' },
            { id: 'mybooks', label: `🔖 My Books (${activeBorrowings.length})` },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── MY BOOKS TAB ──────────────────────────────── */}
        {activeTab === 'mybooks' && (
          <div className="space-y-4">
            {activeBorrowings.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 font-bold">No active borrowings</p>
                <p className="text-slate-600 text-sm mt-1">Go browse the library and borrow a book!</p>
                <button onClick={() => setActiveTab('browse')} className="mt-4 px-6 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold">
                  Browse Library
                </button>
              </div>
            ) : (
              activeBorrowings.map(t => {
                const book = t.bookId && typeof t.bookId === 'object' ? t.bookId : books.find(b => b._id === t.bookId);
                const isOverdue = t.status === 'overdue' || new Date(t.dueDate) < new Date();
                const gc = genreColors[book?.genre] || { from: '#6366f1', to: '#4f46e5', emoji: '📚' };
                return (
                  <motion.div
                    key={t._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900/40"
                  >
                    <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ background: `linear-gradient(160deg, ${gc.from}, ${gc.to})` }}>
                      <img src={getCoverUrl(book?.ISBN)} alt={book?.title} className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{book?.title}</p>
                      <p className="text-slate-500 text-xs">{book?.author}</p>
                      <div className="flex gap-2 mt-1.5">
                        <span className="text-[9px] text-slate-500">Due: {new Date(t.dueDate).toLocaleDateString()}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isOverdue ? 'bg-rose-500/15 text-rose-400' : 'bg-indigo-500/15 text-indigo-400'}`}>
                          {isOverdue ? 'Overdue' : 'On Time'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {book?.readOnline && (
                        <button onClick={() => navigate(`/read/${book._id}`)} className="px-3 py-1.5 text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-lg hover:bg-amber-500 hover:text-white transition-all">
                          Read
                        </button>
                      )}
                      <button onClick={() => handleReturn(t._id)} className="px-3 py-1.5 text-[10px] font-bold bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-all">
                        Return
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* ── BROWSE TAB ────────────────────────────────── */}
        {activeTab === 'browse' && (
          <>
            {/* Featured book */}
            <FeaturedBook book={featuredBook} onBorrow={handleBorrow} />

            {/* Smart search */}
            <SmartBookSearch books={books} onBorrow={handleBorrow} />

            {/* Continue reading shelf */}
            {continueReading.length > 0 && (
              <BookShelf
                title="Continue Reading"
                emoji="▶️"
                books={continueReading}
                onBorrow={handleBorrow}
                compact
              />
            )}

            {/* Readable ebooks shelf */}
            {readableBooks.length > 0 && (
              <BookShelf
                title="Free E-Books — Read Online Now"
                emoji="🌐"
                books={readableBooks}
                onBorrow={handleBorrow}
              />
            )}

            {/* Genre shelves */}
            {Object.entries(genreGroups).map(([genre, gBooks]) => {
              const gc = genreColors[genre] || { emoji: '📚' };
              return (
                <BookShelf
                  key={genre}
                  title={genre}
                  emoji={gc.emoji}
                  books={gBooks}
                  onBorrow={handleBorrow}
                />
              );
            })}

            {/* Search/filter all books */}
            <div className="mt-6 pt-6 border-t border-slate-800/60">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                <h3 className="text-base font-extrabold text-white">🔍 All Books</h3>
                <div className="flex gap-2 items-center w-full sm:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 sm:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Title, author, ISBN..."
                      className="w-full bg-slate-900/60 border border-slate-800 focus:border-amber-500/50 text-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs outline-none transition-all placeholder:text-slate-600 font-semibold"
                    />
                  </div>
                  {/* Genre filter */}
                  <select
                    value={activeGenre}
                    onChange={e => setActiveGenre(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold py-2 px-3 rounded-xl outline-none focus:border-amber-500/50"
                  >
                    {genres.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              {/* Grid of all books */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredBooks.map(book => (
                  <BookCover key={book._id} book={book} onBorrow={handleBorrow} />
                ))}
              </div>

              {filteredBooks.length === 0 && (
                <div className="text-center py-16">
                  <BookOpen className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-400 font-bold text-sm">No books found</p>
                  <p className="text-slate-600 text-xs mt-1">Try different keywords or genre</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
