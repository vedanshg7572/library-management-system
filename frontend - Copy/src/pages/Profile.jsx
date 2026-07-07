import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import Sidebar from '../components/Sidebar';
import { User, Mail, Calendar, Shield, BookOpen, Clock, AlertTriangle, BadgeAlert } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { books, transactions } = useBooks();

  if (!user) return null;

  // Filter transactions for this student/user
  const myTransactions = transactions.filter((t) => t.studentId === user.id);
  const activeTransactions = myTransactions.filter((t) => t.status === 'borrowed' || t.status === 'overdue');
  const pastTransactions = myTransactions.filter((t) => t.status === 'returned');
  
  // Format Account Age / Date
  const joinDate = new Date(user.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]"></div>
        <div className="space-y-1 relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display">
            My Library Profile
          </h2>
          <p className="text-slate-400 text-sm font-semibold">View account credentials, role designations, and active borrowings.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <Sidebar />

        {/* Profile Content Body */}
        <div className="flex-grow space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Profile Info Details Card */}
            <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-6">
              <h3 className="text-base font-bold text-white font-display flex items-center space-x-2 pb-3 border-b border-slate-800">
                <User className="h-4.5 w-4.5 text-indigo-400" />
                <span>Account Credentials</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</span>
                  <p className="text-sm font-bold text-white flex items-center space-x-2">
                    <span>{user.name}</span>
                  </p>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</span>
                  <p className="text-sm font-bold text-white flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-slate-450 shrink-0" />
                    <span>{user.email}</span>
                  </p>
                </div>

                {/* Role */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">User Designation</span>
                  <p className="text-sm font-bold text-indigo-400 flex items-center space-x-2 capitalize">
                    <Shield className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>{user.role}</span>
                  </p>
                </div>

                {/* Created At */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Registration Date</span>
                  <p className="text-sm font-bold text-white flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-450 shrink-0" />
                    <span>{joinDate}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Brief Borrowings Stats Card */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center space-x-2 pb-3 border-b border-slate-800 mb-4">
                  <BookOpen className="h-4.5 w-4.5 text-indigo-400" />
                  <span>Borrow Stats</span>
                </h3>
                <div className="space-y-4 text-xs font-semibold text-slate-300">
                  <div className="flex justify-between">
                    <span>Active Borrowings:</span>
                    <span className="text-white font-bold">{activeTransactions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Returned Items:</span>
                    <span className="text-white font-bold">{pastTransactions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accumulated Fines:</span>
                    <span className={`font-bold ${activeTransactions.reduce((sum, t) => sum + t.fine, 0) > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      ${activeTransactions.reduce((sum, t) => sum + t.fine, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-[10px] text-slate-550 leading-relaxed font-medium">
                Please make sure to return all books before their respective due dates to avoid fine penalties ($1.00/day).
              </div>
            </div>
          </div>

          {/* User History Logs */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center space-x-2 pb-3 border-b border-slate-800">
              <Clock className="h-4.5 w-4.5 text-indigo-400" />
              <span>Borrowing Checkout Logs History</span>
            </h3>

            {myTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500">
                      <th className="pb-3 font-bold uppercase tracking-wider">Book Title</th>
                      <th className="pb-3 font-bold uppercase tracking-wider">Borrow Date</th>
                      <th className="pb-3 font-bold uppercase tracking-wider">Due Date</th>
                      <th className="pb-3 font-bold uppercase tracking-wider">Return Date</th>
                      <th className="pb-3 font-bold uppercase tracking-wider">Fine Paid</th>
                      <th className="pb-3 font-bold uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {myTransactions.map((t) => {
                      const book = t.bookId && typeof t.bookId === 'object' ? t.bookId : books.find((b) => b._id === t.bookId);
                      return (
                        <tr key={t._id} className="hover:bg-slate-800/10 transition-colors">
                          <td className="py-4 font-bold text-white max-w-[200px] truncate">{book?.title || 'Unknown Book'}</td>
                          <td className="py-4 text-slate-400">{new Date(t.borrowDate).toLocaleDateString()}</td>
                          <td className="py-4 text-slate-400">{new Date(t.dueDate).toLocaleDateString()}</td>
                          <td className="py-4 text-slate-400">{t.returnDate ? new Date(t.returnDate).toLocaleDateString() : '—'}</td>
                          <td className="py-4 text-slate-400">${t.fine.toFixed(2)}</td>
                          <td className="py-4 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              t.status === 'returned'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : t.status === 'overdue'
                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                            }`}>
                              {t.status === 'returned' ? 'Returned' : t.status === 'overdue' ? 'Overdue' : 'Borrowed'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">No transaction history recorded yet.</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
