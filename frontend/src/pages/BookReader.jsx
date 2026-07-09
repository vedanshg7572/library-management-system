import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Settings, Sun, Moon, Minus, Plus,
  Bookmark, BookMarked, ChevronLeft, ChevronRight,
  Loader, AlertCircle, X, ExternalLink, Globe
} from 'lucide-react';
import { useBooks } from '../context/BookContext';
import { fetchGutenbergText, paginateText, getCoverUrl, genreGradient } from '../services/gutenberg';

/* ── Persist reading settings ────────────────────────────── */
const loadSettings = () => { try { return JSON.parse(localStorage.getItem('readerSettings') || '{}'); } catch { return {}; } };
const saveSettings = (s) => localStorage.setItem('readerSettings', JSON.stringify(s));
const loadProgress = (id) => { try { return JSON.parse(localStorage.getItem('readingProgress') || '{}')[id] || 0; } catch { return 0; } };
const saveProgress = (id, page) => { try { const a = JSON.parse(localStorage.getItem('readingProgress') || '{}'); a[id] = page; localStorage.setItem('readingProgress', JSON.stringify(a)); } catch {} };

/* ── Genre-based sample opening text ────────────────────── */
const genreSamples = {
  Technology: (book) => `CHAPTER 1\n\n${book.title}\n\n${'─'.repeat(40)}\n\nIn the ever-evolving landscape of modern software, few challenges are as fundamental — and as frequently overlooked — as the art of writing code that endures. ${book.author} opens this landmark work with a deceptively simple premise: code is read far more often than it is written.\n\nConsider the last time you opened a file you hadn't touched in months. Or sat down with a colleague's work for the first time. The feeling of clarity — or confusion — you experienced in those first moments is precisely what ${book.author} means when speaking of "clean" code.\n\nThis book is not about making software work. Any sufficiently determined programmer can make code function. This book is about making code communicate — to the machine, yes, but more importantly, to the humans who will inevitably follow in your footsteps.\n\nAs we journey through these pages, we will encounter principles that seem obvious in hindsight yet are violated thousands of times every day in codebases around the world. We will examine real examples, dissect their failures, and reconstruct them into something worthy of admiration.\n\nThe path to mastery is long and humbling. But it begins with a single commitment: to care about your craft. To refuse to settle for code that merely works, when you could write code that sings.\n\nLet us begin.\n\n${'─'.repeat(40)}\n\nThe first principle we must internalize is deceptively simple: names matter. Every variable, every function, every class — each carries within its name either a promise or a deception. When we name a variable "d" to represent elapsed time in days, we have chosen deception. When we name it "elapsedTimeInDays," we have chosen truth.\n\n"What's in a name?" Shakespeare's Juliet famously asks. In software, the answer is: everything.\n\nA function named "process" tells us nothing. A function named "calculateMonthlyInterest" tells us exactly what to expect. The cognitive burden on the reader — the time spent puzzling over intent — drops to near zero when names are chosen with care.\n\n${book.author} illustrates this with dozens of examples drawn from real production code. The patterns are illuminating: the rushed developer who uses abbreviations nobody else understands; the perfectionist who writes comments explaining what the code does, rather than renaming the code to explain itself; the architect who names things after their implementation rather than their purpose.`,

  Fiction: (book) => `CHAPTER I\n\nTHE BEGINNING\n\n${'─'.repeat(40)}\n\nIt was the kind of morning that made you believe the world had been freshly invented overnight.\n\nEleanor stood at the window of her grandmother's cottage, watching the mist rise from the valley below. The village of Ashford seemed to float in a sea of white, its stone church spire the only solid thing in a dissolving world. She pressed her palm flat against the cold glass and left a ghost of a handprint as she pulled away.\n\nShe had come here to forget. That was what she had told herself on the long train journey, watching the grey suburbs give way to green hills, watching the green hills grow wilder and the sky wider. She had come to forget the life she had so carefully constructed — the flat in the city, the career she had climbed toward with the determination of someone who mistakes ambition for purpose, the relationship that had slowly run out of air like a room with no windows.\n\nBut forgetting, Eleanor was discovering, was not so simple as changing one's postcode.\n\nShe turned from the window and looked at the room her grandmother had left her. Books everywhere — on shelves, in stacks on the floor, balanced on the arms of chairs. The smell of old paper and lavender and something else she couldn't name but recognized as the particular scent of a life fully lived. On the mantelpiece, a photograph: her grandmother as a young woman, laughing at something beyond the frame, caught in a moment of pure, uncomplicated joy.\n\nEleanor wondered when she had last laughed like that.\n\nA knock at the door pulled her from her thoughts.\n\n${'─'.repeat(40)}\n\n"I saw your light," said the man on the doorstep. He was tall, perhaps sixty, with the weathered look of someone who spent more time outdoors than in. He held a jar of honey in one hand and a hat in the other. "I'm Thomas Aldridge. I keep bees on the hill behind you. Your grandmother used to take a jar every autumn."\n\n"She mentioned you," Eleanor said, which was true in the way that most things she said these days were true: technically accurate, emotionally evacuated.\n\n"I was sorry to hear about Margaret," Thomas said. He didn't offer the usual platitudes. He simply let the sorrow be there between them, acknowledged and undecorated. Eleanor found she was grateful for it.\n\n"Come in," she said. "I'll put the kettle on."`,

  Science: (book) => `CHAPTER 1\n\nTHE QUESTION THAT STARTED EVERYTHING\n\n${'─'.repeat(40)}\n\nScience begins not with answers, but with the courage to ask uncomfortable questions.\n\n${book.author} opens this groundbreaking exploration with a confession: for years, like most of us, they had accepted certain facts about the universe without truly understanding them. The force that holds you in your chair as you read these words. The light by which you read them. The very atoms that compose both you and this page.\n\nWe live, in other words, surrounded by profound mysteries we have learned to call ordinary.\n\nThis book is an invitation to see those mysteries again with fresh eyes.\n\n${'─'.repeat(40)}\n\nConsider, for a moment, the simple act of looking at a star.\n\nThe light entering your eyes right now left its source years — sometimes thousands of years — before you were born. You are not seeing the star as it is. You are seeing the star as it was. In a very real sense, every time we look at the night sky, we are looking into the past.\n\nThis fact, once understood, transforms the experience of stargazing from a pleasant hobby into something closer to time travel. The universe, it turns out, is not a static painting hung on a dark wall. It is a vast, dynamic, still-unfolding story — and we are reading it in fragments, each fragment delayed by the finite speed of light.\n\n${book.author} spent years studying these phenomena, and in this book, shares not just the conclusions but the journey: the false starts, the eureka moments, the elegant experiments that revealed nature's secrets. Science, as these pages demonstrate, is not a collection of facts. It is a method — a way of asking questions that the universe can actually answer.\n\nThe story of how we came to understand the cosmos is, in many ways, the story of humanity at its best: curious, persistent, willing to be wrong, and always reaching for the next horizon.\n\nLet us begin that journey together.`,

  History: (book) => `CHAPTER ONE\n\nTHE WORLD BEFORE\n\n${'─'.repeat(40)}\n\nHistory does not begin. It simply continues.\n\nEvery moment we call "the beginning" is, on closer examination, merely a moment we have chosen to start our story — a convenient cut in the continuous fabric of human experience. ${book.author} understood this better than most historians of their era, and it is why this account begins not with events, but with context.\n\nBefore the upheaval that reshaped the world, there was a different world. A world of assumptions so deeply embedded that those who lived within them could no more see them than a fish can see water. To understand what changed, we must first understand what was.\n\n${'─'.repeat(40)}\n\nThe year our story properly begins, most people lived within ten miles of where they had been born. They knew their neighbours by name, their neighbours' parents by memory, their neighbours' grandparents by reputation. The world was intimate in ways we can barely imagine.\n\nNews, when it arrived, arrived slowly. A battle fought in the south might not be known in the north for weeks. Rumour travelled faster than fact, and fact, when it finally arrived, was often unrecognizable beneath the weight of the stories told about it.\n\nInto this world, something new was coming.\n\nThe tremors were barely perceptible at first. A change in trade patterns here. A new idea spreading through correspondence between scholars there. A restlessness among people who had previously known only stillness. Looking back, with all the clarity that hindsight cruelly provides, the signs were everywhere. But to those living through it, the future remained — as it always does — completely and utterly invisible.\n\n${book.author}'s genius was to interview dozens of survivors of this period decades later, when the shape of what had happened had finally become clear. Their testimonies, woven together throughout this book, give us something rare in historical writing: the texture of lived experience.`,

  'Self-Help': (book) => `INTRODUCTION\n\nWHY SMALL CHANGES MAKE A BIG DIFFERENCE\n\n${'─'.repeat(40)}\n\nThe fate of British Cycling changed one day in 2003.\n\nThe organization was in desperate need of help. In the 108-year history of the Tour de France, no British cyclist had ever won the race. In the past 110 years, British cyclists had managed to win a single Olympic gold medal.\n\n${book.author} was brought in to try to change things.\n\nThe approach was unconventional, to say the least. Rather than looking for massive improvements — better bikes, better training regimens, better recruitment — the focus was on improving everything by just one percent.\n\nOne percent better pedaling technique. One percent better handlebars. One percent better pillows — yes, pillows, because athletes sleep for roughly a third of their lives and better sleep leads to better recovery. One percent better in dozens, then hundreds of tiny areas.\n\nThe results were shocking.\n\n${'─'.repeat(40)}\n\nFive years later, the British cycling team dominated the Beijing Olympics, winning sixty percent of the gold medals available in track cycling. Four years after that, they set nine Olympic records and seven world records at the London Olympics. During the same period, British riders won the Tour de France — and then won it again the following year, and the year after that.\n\nThis is the power of marginal gains. And it is the central idea of this book.\n\nWe all know that massive success requires massive action. What ${book.author} wants to show you is that this intuition is wrong — or at least, deeply incomplete. Improving by one percent is not particularly notable. But it adds up to something remarkable over time.\n\nIf you can get one percent better each day for one year, you'll end up thirty-seven times better by the time you're done. Conversely, if you get one percent worse each day for one year, you'll decline nearly down to zero.\n\nThe habits you repeat every day are the compound interest of self-improvement.\n\nThis book is about how to change them.`,

  Mathematics: (book) => `CHAPTER 1\n\nTHE UNREASONABLE EFFECTIVENESS OF NUMBERS\n\n${'─'.repeat(40)}\n\nMathematics is the language in which God has written the universe.\n— Galileo Galilei\n\nThere is a mystery at the heart of mathematics that has puzzled philosophers and scientists for centuries: why does it work?\n\nNot just in the obvious sense — of course a well-applied formula gives correct results. The mystery runs deeper. Why is the universe mathematical in the first place? Why do abstract patterns discovered by pure mathematicians, working with no application in mind, turn out decades or centuries later to describe physical reality with uncanny precision?\n\n${book.author} spent a career wrestling with this question, and in these pages shares both the struggle and the insights that emerged from it.\n\n${'─'.repeat(40)}\n\nConsider the number π — that ancient ratio of a circle's circumference to its diameter. Human beings have been calculating π for over four thousand years. The Babylonians approximated it. The ancient Egyptians used a value close to it. Archimedes bounded it between two fractions. Today, computers have calculated it to trillions of decimal places.\n\nBut π doesn't just describe circles. It appears in probability theory, in the description of waves, in quantum mechanics, in the distribution of prime numbers. It shows up in places where there isn't a circle in sight. Why?\n\nThe answer, ${book.author} argues, reveals something profound about the relationship between the human mind and the physical universe. Mathematics is not merely a tool we invented to count sheep or build bridges. It is something deeper — a glimpse into the underlying structure of reality itself.\n\nThrough the stories of the great mathematicians — their obsessions, their breakthroughs, their beautiful failures — this book invites you to see numbers not as symbols on a page, but as windows into the infinite.`,

  Biography: (book) => `PROLOGUE\n\nTHE BEGINNING OF A LIFE\n\n${'─'.repeat(40)}\n\nAll lives contain multitudes. The life of ${book.author.split(' ').pop()} — or rather, the subject of this account — contains more than most.\n\nTo write a biography is to make choices. You cannot include everything; a life fully transcribed would take a lifetime to read. You must choose which moments matter, which relationships shaped the person, which failures proved as formative as the successes. In making these choices, every biographer risks imposing a narrative on what was, in experience, the chaos and contingency of an actual human life.\n\nThe subject of this book resisted narrative. They resisted, in fact, most forms of categorization — defying the expectations of their era, their culture, their family, and often enough their own prior commitments. This quality — this restless, probing refusal to be pinned down — is, I would argue, the thread that runs through everything.\n\n${'─'.repeat(40)}\n\nI first encountered this extraordinary person not through their most famous achievements, but through a letter.\n\nThe letter was written late in life, to a young person who had asked for advice. What struck me immediately was not the advice itself — which was characteristically direct and unconventional — but the voice. There was in it a quality of hard-won wisdom combined with genuine humility. This was a person who had learned, through struggle and error and loss, what they did not know.\n\nI spent four years researching this book. I read thousands of letters, dozens of diaries, hundreds of contemporary accounts. I interviewed everyone still living who had known the subject personally. What emerged was a portrait more complex, more human, and ultimately more inspiring than the myth that had grown up around the famous name.\n\nThis is the true story. It begins, as all lives do, at the beginning.`,

  Economics: (book) => `INTRODUCTION\n\nA DIFFERENT WAY OF SEEING THE WORLD\n\n${'─'.repeat(40)}\n\nEconomics is the study of choices.\n\nNot just the choices of governments and corporations — though those matter enormously — but the ten thousand small choices made every day by millions of ordinary people. Why does one coffee shop thrive while another fails? Why do people buy insurance they'll almost certainly never use? Why does the price of oil set in Texas affect the cost of bread in Mumbai?\n\n${book.author} spent decades asking these questions. What emerged was a framework for understanding human behaviour that is simultaneously obvious — once you've seen it — and completely invisible until you have.\n\n${'─'.repeat(40)}\n\nThe first lesson of economics, it is sometimes said, is scarcity: there is never enough of anything to satisfy everyone who wants it. The first lesson of politics, meanwhile, is to ignore the first lesson of economics.\n\nBut this book is not about politics. It is about something more fundamental: incentives. Why people do what they do. How systems — markets, governments, social structures — shape behaviour in ways that are sometimes intended, often unintended, and occasionally absurd.\n\nConsider a simple example. A childcare centre in Israel found that parents were frequently late picking up their children, forcing teachers to stay after hours. Management decided to implement a fine for late pick-ups.\n\nPickups got later.\n\nWhy? ${book.author} uses this example — drawn from a real study — to illustrate one of the book's central insights: when you put a price on something, you change its meaning. The parents had previously felt guilty about being late. The fine replaced guilt with a transaction. Guilt is powerful; a modest fee is easy to absorb.\n\nThe implications of this insight, carried through an entire economic system, are profound.\n\nThis book will show you how to see them.`,
};

const getPreviewText = (book) => {
  const gen = genreSamples[book.genre] || genreSamples['Fiction'];
  return gen(book);
};

/* ════════════════════════════════════════════════════════════
   BOOK READER
════════════════════════════════════════════════════════════ */
const BookReader = () => {
  const { bookId } = useParams();
  const navigate   = useNavigate();
  const { books }  = useBooks();
  const book = books.find(b => b._id === bookId);

  const [pages, setPages]     = useState([]);
  const [currentPage, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarked, setBookmarked]     = useState(false);
  const contentRef = useRef(null);

  // Settings
  const stored = loadSettings();
  const [fontSize,   setFontSize]  = useState(stored.fontSize   || 18);
  const [darkMode,   setDarkMode]  = useState(stored.darkMode   !== false);
  const [fontFamily, setFont]      = useState(stored.fontFamily || 'Georgia, serif');
  const [lineHeight, setLineH]     = useState(stored.lineHeight || 1.9);

  useEffect(() => saveSettings({ fontSize, darkMode, fontFamily, lineHeight }), [fontSize, darkMode, fontFamily, lineHeight]);

  // Load book content
  useEffect(() => {
    if (!book) return;
    setLoading(true); setError('');

    if (book.gutenbergId) {
      // Fetch real Gutenberg text
      fetchGutenbergText(book.gutenbergId)
        .then(text => {
          const pgs = paginateText(text, 280);
          setPages(pgs);
          setPage(Math.min(loadProgress(bookId), pgs.length - 1));
          setIsPreview(false);
          setLoading(false);
        })
        .catch(() => {
          // Fallback to preview if Gutenberg fetch fails
          const preview = getPreviewText(book);
          setPages(paginateText(preview, 280));
          setPage(0);
          setIsPreview(true);
          setLoading(false);
        });
    } else {
      // Preview mode for non-Gutenberg books
      const preview = getPreviewText(book);
      setPages(paginateText(preview, 280));
      setPage(loadProgress(bookId) || 0);
      setIsPreview(true);
      setLoading(false);
    }
  }, [book, bookId]);

  useEffect(() => { if (pages.length > 0) saveProgress(bookId, currentPage); }, [currentPage, bookId, pages.length]);

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

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft')  goPrev();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [goNext, goPrev]);

  const progress   = pages.length > 0 ? ((currentPage + 1) / pages.length) * 100 : 0;
  const gradient   = book ? (genreGradient[book.genre] || 'from-violet-700 to-purple-900') : '';
  const [imgErr, setImgErr] = useState(false);

  const bg    = darkMode ? '#0d0b15' : '#faf7f2';
  const clr   = darkMode ? '#e8e0d0' : '#2d2416';
  const panel = darkMode ? 'rgba(16,13,26,0.97)' : 'rgba(250,247,242,0.98)';
  const border = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)';

  if (!book) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0b15' }}>
      <div className="text-center">
        <BookOpen className="h-12 w-12 text-slate-700 mx-auto mb-4" />
        <p className="text-white font-bold mb-3">Book not found</p>
        <Link to="/student-dashboard" className="text-violet-400 text-sm hover:underline">← Back to Library</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: bg, color: clr, transition: 'background 0.3s, color 0.3s' }}>

      {/* ── Top Bar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 py-3 border-b"
        style={{ background: panel, borderColor: border, backdropFilter: 'blur(20px)' }}>

        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => navigate('/student-dashboard')}
            className="flex items-center gap-1.5 text-sm font-semibold opacity-50 hover:opacity-100 transition-opacity flex-shrink-0">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Library</span>
          </button>
          <div className="w-px h-5 opacity-15" style={{ background: clr }} />
          <div className="flex items-center gap-2 min-w-0">
            {/* Mini cover */}
            <div className={`w-6 h-8 rounded-sm flex-shrink-0 overflow-hidden bg-gradient-to-b ${gradient}`}>
              {!imgErr && <img src={getCoverUrl(book.ISBN)} alt="" className="w-full h-full object-cover" onError={() => setImgErr(true)} />}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold truncate max-w-[140px] sm:max-w-xs">{book.title}</p>
              <p className="text-[10px] opacity-40 truncate">{book.author}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isPreview && (
            <span className="hidden sm:inline text-[9px] font-bold px-2 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25">
              PREVIEW
            </span>
          )}
          <button onClick={() => setBookmarked(b => !b)}
            className={`p-2 rounded-xl transition-all ${bookmarked ? 'text-amber-400' : 'opacity-40 hover:opacity-80'}`}>
            {bookmarked ? <BookMarked className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </button>
          <button onClick={() => setShowSettings(s => !s)}
            className="p-2 rounded-xl opacity-40 hover:opacity-90 transition-opacity">
            <Settings className="h-4 w-4" />
          </button>
          <button onClick={() => setDarkMode(d => !d)}
            className="p-2 rounded-xl opacity-40 hover:opacity-90 transition-opacity">
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 w-full" style={{ background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)' }}>
        <motion.div className="h-full" style={{ background: 'linear-gradient(90deg, #f59e0b, #7c3aed)' }}
          animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
      </div>

      {/* ── Settings Panel ──────────────────────────────── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="absolute top-14 right-4 z-50 w-60 rounded-2xl shadow-2xl border p-5"
            style={{ background: panel, borderColor: border }}>
            <div className="flex justify-between items-center mb-4">
              <p className="font-bold text-sm">Settings</p>
              <button onClick={() => setShowSettings(false)}><X className="h-4 w-4 opacity-40" /></button>
            </div>

            <div className="mb-4">
              <p className="text-[10px] opacity-40 mb-2 font-bold uppercase tracking-wider">Font Size</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setFontSize(f => Math.max(13, f - 1))} className="p-1.5 rounded-lg border opacity-50 hover:opacity-100"><Minus className="h-3 w-3" /></button>
                <span className="text-sm font-bold flex-1 text-center">{fontSize}px</span>
                <button onClick={() => setFontSize(f => Math.min(28, f + 1))} className="p-1.5 rounded-lg border opacity-50 hover:opacity-100"><Plus className="h-3 w-3" /></button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[10px] opacity-40 mb-2 font-bold uppercase tracking-wider">Font Style</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[['Georgia, serif', 'Classic'], ['system-ui, sans-serif', 'Modern'], ['Palatino, serif', 'Elegant'], ['Courier, monospace', 'Mono']].map(([f, label]) => (
                  <button key={f} onClick={() => setFont(f)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition-all ${fontFamily === f ? 'border-violet-500 bg-violet-500/15 text-violet-400' : 'opacity-40 hover:opacity-70'}`}
                    style={{ fontFamily: f }}>{label}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] opacity-40 mb-2 font-bold uppercase tracking-wider">Spacing</p>
              <div className="flex gap-1.5">
                {[[1.5, 'Tight'], [1.9, 'Normal'], [2.4, 'Wide']].map(([l, label]) => (
                  <button key={l} onClick={() => setLineH(l)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${lineHeight === l ? 'border-violet-500 bg-violet-500/15 text-violet-400' : 'opacity-40 hover:opacity-70'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Reading Area ─────────────────────────────────── */}
      <main ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-5 md:px-8 py-10">

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                <Loader className="h-8 w-8 text-violet-500" />
              </motion.div>
              <p className="text-sm opacity-40 font-medium">Loading book content...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
              <AlertCircle className="h-10 w-10 text-rose-400" />
              <p className="font-bold text-lg">Could not load book</p>
              <p className="text-sm opacity-50">{error}</p>
              <button onClick={() => navigate('/student-dashboard')}
                className="mt-2 px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold">
                Back to Library
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={currentPage}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}>

                {/* Preview banner (only on first page of preview books) */}
                {isPreview && currentPage === 0 && (
                  <div className="mb-8 p-4 rounded-2xl border flex items-start gap-3"
                    style={{ background: darkMode ? 'rgba(245,158,11,0.08)' : 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.2)' }}>
                    <BookOpen className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-amber-400 mb-0.5">Sample Preview</p>
                      <p className="text-[11px] opacity-60 leading-relaxed">
                        You're reading a sample chapter of <strong>{book.title}</strong>. For the full book,
                        visit your library or find it online.
                      </p>
                      <a href={`https://www.google.com/search?q=${encodeURIComponent(book.title + ' ' + book.author + ' read online free')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors">
                        <Globe className="h-3 w-3" /> Find full book online
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Book content */}
                <div style={{ fontFamily, fontSize, lineHeight, color: clr }}
                  className="whitespace-pre-wrap">
                  {pages[currentPage]}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* ── Bottom Navigation ────────────────────────────── */}
      {!loading && !error && pages.length > 0 && (
        <footer className="sticky bottom-0 z-30 flex items-center justify-between px-4 md:px-8 py-4 border-t"
          style={{ background: panel, borderColor: border, backdropFilter: 'blur(20px)' }}>
          <button onClick={goPrev} disabled={currentPage === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-20"
            style={{ background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold opacity-50">
              {currentPage + 1} / {pages.length}
            </span>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(9, pages.length) }).map((_, i) => {
                const idx = Math.floor((i / Math.min(8, pages.length - 1)) * (pages.length - 1));
                const near = Math.abs(idx - currentPage) <= 1;
                const active = idx === currentPage;
                return (
                  <button key={i} onClick={() => setPage(idx)}
                    className="rounded-full transition-all"
                    style={{
                      width: active ? 16 : 6, height: 6,
                      background: active ? '#f59e0b' : near ? (darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)') : (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'),
                    }} />
                );
              })}
            </div>
          </div>

          <button onClick={goNext} disabled={currentPage === pages.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-20"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #7c3aed)' }}>
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </footer>
      )}
    </div>
  );
};

export default BookReader;
