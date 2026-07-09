// ── Project Gutenberg text fetcher ───────────────────────────
// Uses direct Gutenberg URLs (CORS supported) with allorigins fallback

const PROXY = 'https://api.allorigins.win/raw?url=';

/**
 * Fetch the full text of a book from Project Gutenberg.
 * @param {number} gutenbergId
 * @returns {Promise<string>} raw text content
 */
export const fetchGutenbergText = async (gutenbergId) => {
  const directUrl = `https://www.gutenberg.org/cache/epub/${gutenbergId}/pg${gutenbergId}.txt`;
  
  // Try direct first
  try {
    const res = await fetch(directUrl, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const text = await res.text();
      return cleanGutenbergText(text);
    }
  } catch (_) {
    // fall through to proxy
  }

  // Fallback: allorigins proxy
  try {
    const res = await fetch(`${PROXY}${encodeURIComponent(directUrl)}`);
    if (res.ok) {
      const text = await res.text();
      return cleanGutenbergText(text);
    }
  } catch (err) {
    throw new Error('Could not load book text. Please check your connection.');
  }

  throw new Error('Book text unavailable.');
};

/**
 * Strip Gutenberg header/footer boilerplate and normalize whitespace.
 */
const cleanGutenbergText = (raw) => {
  // Remove header up to "START OF" marker
  const startMarkers = [
    '*** START OF THE PROJECT GUTENBERG EBOOK',
    '*** START OF THIS PROJECT GUTENBERG EBOOK',
    '*END*THE SMALL PRINT',
    'START OF THE PROJECT GUTENBERG',
  ];
  let text = raw;
  for (const m of startMarkers) {
    const idx = text.indexOf(m);
    if (idx !== -1) {
      text = text.slice(idx + m.length);
      // skip the rest of that line
      const nl = text.indexOf('\n');
      if (nl !== -1) text = text.slice(nl + 1);
      break;
    }
  }

  // Remove footer from "END OF" marker
  const endMarkers = [
    '*** END OF THE PROJECT GUTENBERG EBOOK',
    '*** END OF THIS PROJECT GUTENBERG EBOOK',
    'End of the Project Gutenberg',
    'End of Project Gutenberg',
  ];
  for (const m of endMarkers) {
    const idx = text.indexOf(m);
    if (idx !== -1) {
      text = text.slice(0, idx);
      break;
    }
  }

  return text.trim();
};

/**
 * Split text into pages (approx wordsPerPage words each).
 */
export const paginateText = (text, wordsPerPage = 300) => {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const pages = [];
  let currentPage = [];
  let wordCount = 0;

  for (const para of paragraphs) {
    const words = para.trim().split(/\s+/).length;
    if (wordCount + words > wordsPerPage && currentPage.length > 0) {
      pages.push(currentPage.join('\n\n'));
      currentPage = [para.trim()];
      wordCount = words;
    } else {
      currentPage.push(para.trim());
      wordCount += words;
    }
  }

  if (currentPage.length > 0) pages.push(currentPage.join('\n\n'));
  return pages;
};

/**
 * Get book cover from Open Library by ISBN.
 */
export const getCoverUrl = (isbn, size = 'L') =>
  `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;

/**
 * Fallback gradient covers by genre.
 */
export const genreGradient = {
  Fiction:     'from-violet-700 to-purple-900',
  Technology:  'from-blue-700 to-indigo-900',
  Science:     'from-cyan-700 to-teal-900',
  History:     'from-amber-700 to-orange-900',
  'Self-Help': 'from-emerald-700 to-green-900',
  Mathematics: 'from-rose-700 to-pink-900',
  Biography:   'from-orange-700 to-red-900',
  Economics:   'from-indigo-700 to-blue-900',
};
