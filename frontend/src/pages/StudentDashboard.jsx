import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import BookCard from '../components/BookCard';
import SmartBookSearch from '../components/SmartBookSearch';
import { 
  Search, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  ArrowLeftRight, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { books, transactions, borrowBook, returnBook } = useBooks();

  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!user) return null;

  // Filter book list
  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.ISBN.includes(search);
    
    const matchesGenre = activeGenre === 'All' || book.genre === activeGenre;

    return matchesSearch && matchesGenre;
  });

  // Calculate statistics
  const myTransactions = transactions.filter((t) => t.studentId === user.id);
  const activeBorrowings = myTransactions.filter((t) => t.status === 'borrowed' || t.status === 'overdue');
  const returnedCount = myTransactions.filter((t) => t.status === 'returned').length;
  const totalFines = activeBorrowings.reduce((sum, t) => sum + t.fine, 0);

  // Genre Options — dynamic from actual books
  const genres = ['All', ...Array.from(new Set(books.map((b) => b.genre))).sort()];


  const handleBorrow = (bookId) => {
    setSuccessMsg('');
    setErrorMsg('');
    try {
      borrowBook(bookId, user.id);
      const book = books.find(b => b._id === bookId);
      setSuccessMsg(`"${book?.title}" borrowed successfully! Return by 14 days.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      setErrorMsg(error.message);
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleReturn = (transactionId) => {
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const trans = transactions.find(t => t._id === transactionId);
      const book = books.find(b => b._id === trans.bookId);
      returnBook(transactionId);
      setSuccessMsg(`"${book?.title}" returned successfully!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error) {
      setErrorMsg(error.message);
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      
      {/* Toast Alert Messages */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-xl shadow-emerald-500/20 text-xs font-bold animate-fade-in">
          <CheckCircle className="h-4.5 w-4.5" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-rose-500 text-white px-5 py-3 rounded-2xl shadow-xl shadow-rose-500/20 text-xs font-bold animate-fade-in">
          <AlertCircle className="h-4.5 w-4.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]"></div>
        <div className="space-y-1 relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display">
            Welcome back, <span className="text-indigo-400">{user.name}</span>
          </h2>
          <p className="text-slate-400 text-sm font-semibold">Browse books, view borrowings, and keep track of due dates.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Panel Content */}
        <div className="flex-1 space-y-8">
          
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatCard 
              title="Currently Borrowed" 
              value={activeBorrowings.length} 
              icon={BookOpen} 
              color="indigo" 
            />
            <StatCard 
              title="Books Returned" 
              value={returnedCount} 
              icon={CheckCircle} 
              color="emerald" 
            />
            <StatCard 
              title="Pending Fines" 
              value={`$${totalFines.toFixed(2)}`} 
              icon={DollarSign} 
              color={totalFines > 0 ? 'rose' : 'emerald'} 
            />
          </div>

          {/* Active Borrowing List (if any) */}
          {activeBorrowings.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white font-display flex items-center space-x-2">
                <Clock className="h-4.5 w-4.5 text-indigo-400" />
                <span>My Active Checkouts</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500">
                      <th className="pb-3 font-bold uppercase tracking-wider">Book Details</th>
                      <th className="pb-3 font-bold uppercase tracking-wider">Borrow Date</th>
                      <th className="pb-3 font-bold uppercase tracking-wider">Due Date</th>
                      <th className="pb-3 font-bold uppercase tracking-wider">Status</th>
                      <th className="pb-3 font-bold uppercase tracking-wider">Fine</th>
                      <th className="pb-3 font-bold uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {activeBorrowings.map((t) => {
                      const book = t.bookId && typeof t.bookId === 'object' ? t.bookId : books.find((b) => b._id === t.bookId);
                      const isOverdue = t.status === 'overdue' || new Date(t.dueDate) < new Date();
                      return (
                        <tr key={t._id} className="hover:bg-slate-800/20 transition-colors">
                          <td className="py-4 pr-3">
                            <p className="font-bold text-white max-w-[200px] truncate">{book?.title || 'Unknown Book'}</p>
                            <p className="text-slate-500 text-[10px] mt-0.5">ISBN: {book?.ISBN}</p>
                          </td>
                          <td className="py-4">{new Date(t.borrowDate).toLocaleDateString()}</td>
                          <td className="py-4">{new Date(t.dueDate).toLocaleDateString()}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              isOverdue
                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                            }`}>
                              {isOverdue ? 'Overdue' : 'Borrowed'}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className={t.fine > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                              ${t.fine.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleReturn(t._id)}
                              className="bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Return Book
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Smart Book Search */}
          <SmartBookSearch
            books={books}
            onBorrow={handleBorrow}
          />

          {/* Book Catalog Search & Filter Grid */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg font-bold text-white font-display">Library Catalog</h3>
              
              {/* Search bar */}
              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Search className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, author, ISBN..."
                  className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500 text-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs outline-none transition-all placeholder:text-slate-600 font-semibold"
                />
              </div>
            </div>

            {/* Genre Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => setActiveGenre(g)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeGenre === g
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900/80 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Book Cards Grid */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBooks.map((book) => (
                  <BookCard 
                    key={book._id} 
                    book={book} 
                    onBorrow={handleBorrow} 
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card flex flex-col items-center justify-center p-12 text-center rounded-2xl">
                <BookOpen className="h-10 w-10 text-slate-650 mb-3" />
                <p className="text-sm font-bold text-slate-300">No books found</p>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your search keywords or category filters.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
