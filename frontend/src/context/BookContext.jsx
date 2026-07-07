import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API from '../services/api';

const BookContext = createContext();

export const useBooks = () => useContext(BookContext);

export const BookProvider = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch books and transactions from database when user logs in
  const fetchData = async () => {
    if (!user) {
      setBooks([]);
      setTransactions([]);
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch books (Available to both roles)
      const booksRes = await API.get('/books');
      setBooks(booksRes.data);

      // 2. Fetch transactions based on role
      if (user.role === 'admin') {
        const transRes = await API.get('/transactions/all');
        setTransactions(transRes.data);
      } else {
        const transRes = await API.get('/transactions/my-borrowings');
        setTransactions(transRes.data);
      }
    } catch (error) {
      console.error('Error fetching library data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Add Book (Admin)
  const addBook = async (bookData) => {
    try {
      const res = await API.post('/books', bookData);
      setBooks((prev) => [res.data, ...prev]);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add book');
    }
  };

  // Edit Book (Admin)
  const updateBook = async (bookId, updatedData) => {
    try {
      const res = await API.put(`/books/${bookId}`, updatedData);
      setBooks((prev) => prev.map((b) => (b._id === bookId ? res.data : b)));
      
      // Re-fetch transactions to refresh title/stock labels if quantity edited
      fetchData();
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update book');
    }
  };

  // Delete Book (Admin)
  const deleteBook = async (bookId) => {
    try {
      await API.delete(`/books/${bookId}`);
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete book');
    }
  };

  // Borrow Book (Student)
  const borrowBook = async (bookId, studentId) => {
    try {
      const res = await API.post('/transactions/borrow', { bookId });
      
      // Update books stock in local state
      setBooks((prev) =>
        prev.map((b) =>
          b._id === bookId
            ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) }
            : b
        )
      );

      // Refresh transactions list
      fetchData();
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to borrow book');
    }
  };

  // Return Book (Student/Admin)
  const returnBook = async (transactionId) => {
    try {
      const res = await API.post(`/transactions/return/${transactionId}`);
      
      // Update books stock locally by finding the transaction detail
      const transObj = transactions.find(t => t._id === transactionId);
      if (transObj) {
        const bookId = transObj.bookId._id || transObj.bookId;
        setBooks((prev) =>
          prev.map((b) =>
            b._id === bookId
              ? { ...b, availableCopies: Math.min(b.quantity, b.availableCopies + 1) }
              : b
          )
        );
      }

      // Refresh lists
      fetchData();
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to return book');
    }
  };

  // Pay/Clear Fine (Admin)
  const payFine = async (transactionId) => {
    try {
      await API.put(`/transactions/fine/${transactionId}/pay`);
      
      // Update local state
      setTransactions((prev) =>
        prev.map((t) => (t._id === transactionId ? { ...t, fine: 0 } : t))
      );
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to pay fine');
    }
  };

  const getBookById = (id) => books.find((b) => b._id === id);

  const value = {
    books,
    transactions,
    loading,
    addBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook,
    payFine,
    getBookById,
    refreshData: fetchData
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};
