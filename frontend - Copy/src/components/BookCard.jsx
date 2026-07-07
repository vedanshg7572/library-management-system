import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Bookmark, Edit3, Trash2, ArrowRight } from 'lucide-react';

const BookCard = ({ book, onBorrow, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isAvailable = book.availableCopies > 0;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="glass-card flex flex-col justify-between p-5 rounded-2xl relative overflow-hidden group">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-300"></div>

      <div>
        {/* Genre Pill & Status Badge */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-indigo-400 border border-indigo-500/10">
            {book.genre}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isAvailable 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {isAvailable ? 'Available' : 'Out of Stock'}
          </span>
        </div>

        {/* Title & Author */}
        <h4 className="text-base font-bold text-white leading-tight font-display mb-1 group-hover:text-indigo-300 transition-colors duration-300 line-clamp-2">
          {book.title}
        </h4>
        <p className="text-xs text-slate-400 mb-3 font-medium">by {book.author}</p>

        {/* Meta Stats */}
        <div className="space-y-1.5 py-3 border-y border-slate-800/60 text-[11px] text-slate-400">
          <div className="flex justify-between">
            <span>ISBN:</span>
            <span className="font-semibold text-slate-300">{book.ISBN}</span>
          </div>
          <div className="flex justify-between">
            <span>Location:</span>
            <span className="font-semibold text-slate-300">{book.shelfLocation || 'Main Hall'}</span>
          </div>
          <div className="flex justify-between">
            <span>Availability:</span>
            <span className="font-semibold text-slate-200">
              {book.availableCopies} / {book.quantity} copies
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-2">
        {isAdmin ? (
          <div className="flex items-center space-x-2 w-full">
            <button
              onClick={() => onEdit(book)}
              className="flex-1 flex items-center justify-center space-x-1.5 bg-slate-800/80 border border-slate-700/60 hover:bg-slate-700/80 hover:border-indigo-500/30 text-slate-200 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDelete(book._id)}
              className="flex items-center justify-center bg-red-950/20 border border-red-900/30 hover:bg-red-900/30 text-red-400 p-2.5 rounded-xl transition-all cursor-pointer"
              title="Delete Book"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onBorrow(book._id)}
            disabled={!isAvailable}
            className={`w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
              isAvailable
                ? 'glow-btn bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 cursor-pointer'
                : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Borrow Book</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
