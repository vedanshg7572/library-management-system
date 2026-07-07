import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { 
  BookOpen, 
  CheckCircle, 
  DollarSign, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Search, 
  Calendar, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { 
    books, 
    transactions, 
    addBook, 
    updateBook, 
    deleteBook, 
    returnBook, 
    payFine 
  } = useBooks();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editingBookId, setEditingBookId] = useState(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formISBN, setFormISBN] = useState('');
  const [formGenre, setFormGenre] = useState('Fiction');
  const [formQuantity, setFormQuantity] = useState(1);
  const [formShelf, setFormShelf] = useState('');

  // Search/Filters State
  const [inventorySearch, setInventorySearch] = useState('');
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'transactions'
  
  // Alert logs
  const [alertMsg, setAlertMsg] = useState('');

  if (!user) return null;

  // Retrieve user names for transactions
  const users = JSON.parse(localStorage.getItem('lib_users')) || [];
  const getStudentName = (student) => {
    if (student && typeof student === 'object') {
      return student.name;
    }
    const matched = users.find(u => u.id === student);
    return matched ? matched.name : 'Unknown Student';
  };

  // Filter book list
  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    b.author.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    b.ISBN.includes(inventorySearch)
  );

  // Statistics calculation
  const totalBooks = books.reduce((sum, b) => sum + b.quantity, 0);
  const totalStudents = users.filter(u => u.role === 'student').length;
  const activeCheckouts = transactions.filter(t => t.status === 'borrowed' || t.status === 'overdue');
  const overdueCount = transactions.filter(t => t.status === 'overdue' || (t.status === 'borrowed' && new Date(t.dueDate) < new Date())).length;
  
  // Handlers
  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingBookId(null);
    setFormTitle('');
    setFormAuthor('');
    setFormISBN('');
    setFormGenre('Fiction');
    setFormQuantity(1);
    setFormShelf('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book) => {
    setModalMode('edit');
    setEditingBookId(book._id);
    setFormTitle(book.title);
    setFormAuthor(book.author);
    setFormISBN(book.ISBN);
    setFormGenre(book.genre);
    setFormQuantity(book.quantity);
    setFormShelf(book.shelfLocation || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookData = {
      title: formTitle,
      author: formAuthor,
      ISBN: formISBN,
      genre: formGenre,
      quantity: Number(formQuantity),
      shelfLocation: formShelf
    };

    if (modalMode === 'add') {
      addBook(bookData);
      setAlertMsg('Book added to inventory!');
    } else {
      updateBook(editingBookId, bookData);
      setAlertMsg('Book details updated!');
    }
    
    setIsModalOpen(false);
    setTimeout(() => setAlertMsg(''), 4000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this book from circulation?')) {
      deleteBook(id);
      setAlertMsg('Book deleted from system.');
      setTimeout(() => setAlertMsg(''), 4000);
    }
  };

  const handleApproveReturn = (transactionId) => {
    try {
      returnBook(transactionId);
      setAlertMsg('Return approved successfully.');
      setTimeout(() => setAlertMsg(''), 4000);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleClearFine = (transactionId) => {
    payFine(transactionId);
    setAlertMsg('Fine cleared successfully.');
    setTimeout(() => setAlertMsg(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Toast Alert */}
      {alertMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-indigo-600/20 text-xs font-bold animate-fade-in">
          <CheckCircle className="h-4.5 w-4.5" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]"></div>
        <div className="space-y-1 relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-display">
            Librarian Overview
          </h2>
          <p className="text-slate-400 text-sm font-semibold">Monitor checkout statistics, update database catalogs, and process returns.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="glow-btn flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 text-xs transition-all mt-4 md:mt-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Book</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          
          {/* Stats Counters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard title="Total Inventory" value={totalBooks} icon={BookOpen} color="indigo" />
            <StatCard title="Active Checkouts" value={activeCheckouts.length} icon={Calendar} color="violet" />
            <StatCard title="Overdue Books" value={overdueCount} icon={AlertCircle} color={overdueCount > 0 ? 'rose' : 'emerald'} />
            <StatCard title="Registered Students" value={totalStudents} icon={Users} color="emerald" />
          </div>

          {/* Section Selector Tab Controllers */}
          <div className="flex border-b border-slate-800/80">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'border-indigo-500 text-indigo-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Books Inventory
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'transactions'
                  ? 'border-indigo-500 text-indigo-400 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Checkout History Logs
            </button>
          </div>

          {/* Tab Content 1: Books Inventory Table */}
          {activeTab === 'inventory' && (
            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-base font-bold text-white font-display">Inventory Catalog</h3>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search inventory..."
                    className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500 text-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs outline-none transition-all placeholder:text-slate-650 font-semibold"
                  />
                </div>
              </div>

              {filteredBooks.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500">
                        <th className="pb-3 font-bold uppercase tracking-wider">Book Info</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">ISBN</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Genre</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Stock</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Shelf</th>
                        <th className="pb-3 font-bold uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {filteredBooks.map((book) => (
                        <tr key={book._id} className="hover:bg-slate-800/10 transition-colors">
                          <td className="py-4 pr-3">
                            <p className="font-bold text-white max-w-[220px] truncate">{book.title}</p>
                            <p className="text-slate-500 text-[10px] mt-0.5">by {book.author}</p>
                          </td>
                          <td className="py-4 font-mono text-slate-400">{book.ISBN}</td>
                          <td className="py-4">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/40">
                              {book.genre}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className={book.availableCopies === 0 ? 'text-rose-400' : 'text-slate-200'}>
                              {book.availableCopies} available
                            </span>
                            <span className="text-slate-500 text-[10px] block">out of {book.quantity} total</span>
                          </td>
                          <td className="py-4 text-slate-400">{book.shelfLocation || 'Unassigned'}</td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleOpenEditModal(book)}
                                className="bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white p-2 rounded-xl transition-all cursor-pointer"
                                title="Edit Details"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(book._id)}
                                className="bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white p-2 rounded-xl transition-all cursor-pointer"
                                title="Delete Book"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">No matching books found.</div>
              )}
            </div>
          )}

          {/* Tab Content 2: Checkout History Logs */}
          {activeTab === 'transactions' && (
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white font-display">System Transactions Log</h3>
              
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500">
                        <th className="pb-3 font-bold uppercase tracking-wider">Student Name</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Book Title</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Borrow Date</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Due Date</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Status</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Accumulated Fine</th>
                        <th className="pb-3 font-bold uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {transactions.map((t) => {
                        const book = books.find(b => b._id === t.bookId);
                        const studentName = getStudentName(t.studentId);
                        const isOverdue = t.status === 'overdue' || (t.status === 'borrowed' && new Date(t.dueDate) < new Date());
                        
                        return (
                          <tr key={t._id} className="hover:bg-slate-800/10 transition-colors">
                            <td className="py-4 font-bold text-white">{studentName}</td>
                            <td className="py-4 text-slate-300 max-w-[150px] truncate">{book?.title || 'Unknown Catalog Title'}</td>
                            <td className="py-4">{new Date(t.borrowDate).toLocaleDateString()}</td>
                            <td className="py-4">{new Date(t.dueDate).toLocaleDateString()}</td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                t.status === 'returned'
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                  : isOverdue
                                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse'
                                  : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                              }`}>
                                {t.status === 'returned' ? 'Returned' : isOverdue ? 'Overdue' : 'Borrowed'}
                              </span>
                            </td>
                            <td className="py-4">
                              {t.fine > 0 ? (
                                <span className="text-rose-400 font-bold flex items-center space-x-1">
                                  <DollarSign className="h-3 w-3 shrink-0" />
                                  <span>{t.fine.toFixed(2)}</span>
                                </span>
                              ) : (
                                <span className="text-slate-500">$0.00</span>
                              )}
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {t.status !== 'returned' && (
                                  <button
                                    onClick={() => handleApproveReturn(t._id)}
                                    className="bg-indigo-600 border border-indigo-500 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                                  >
                                    Approve Return
                                  </button>
                                )}
                                {t.fine > 0 && (
                                  <button
                                    onClick={() => handleClearFine(t._id)}
                                    className="bg-emerald-600 border border-emerald-500 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                                    title="Collect fine payments"
                                  >
                                    Collect Fine
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">No checkout transactions recorded yet.</div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Add / Edit Book Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-800 space-y-6 relative animate-scale-up">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Title */}
            <div>
              <h3 className="text-lg font-bold text-white font-display">
                {modalMode === 'add' ? 'Add New Catalog Book' : 'Modify Book Details'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Provide information to update inventory databases.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Title */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Book Title</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Clean Architecture"
                    className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500 text-slate-200 px-4 py-2.5 rounded-xl text-xs outline-none transition-all placeholder:text-slate-600 font-semibold"
                  />
                </div>

                {/* Author */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Author Name</label>
                  <input
                    type="text"
                    required
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="e.g. Robert C. Martin"
                    className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500 text-slate-200 px-4 py-2.5 rounded-xl text-xs outline-none transition-all placeholder:text-slate-650 font-semibold"
                  />
                </div>

                {/* ISBN */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">ISBN Number</label>
                  <input
                    type="text"
                    required
                    value={formISBN}
                    onChange={(e) => setFormISBN(e.target.value)}
                    placeholder="e.g. 978-0134494166"
                    className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500 text-slate-200 px-4 py-2.5 rounded-xl text-xs outline-none transition-all placeholder:text-slate-650 font-semibold"
                  />
                </div>

                {/* Genre */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Category Genre</label>
                  <select
                    value={formGenre}
                    onChange={(e) => setFormGenre(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500 text-slate-200 px-4 py-2.5 rounded-xl text-xs outline-none transition-all font-semibold cursor-pointer"
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Technology">Technology</option>
                    <option value="Science">Science</option>
                  </select>
                </div>

                {/* Stock Quantity */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Quantity Stock</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formQuantity}
                    onChange={(e) => setFormQuantity(Number(e.target.value))}
                    className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500 text-slate-200 px-4 py-2.5 rounded-xl text-xs outline-none transition-all font-semibold"
                  />
                </div>

                {/* Shelf Location */}
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Shelf Location</label>
                  <input
                    type="text"
                    value={formShelf}
                    onChange={(e) => setFormShelf(e.target.value)}
                    placeholder="e.g. Aisles A-5"
                    className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500 text-slate-200 px-4 py-2.5 rounded-xl text-xs outline-none transition-all placeholder:text-slate-600 font-semibold"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800/65">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glow-btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  {modalMode === 'add' ? 'Save Book' : 'Update Details'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
