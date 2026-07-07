const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

// @desc    Borrow a book
// @route   POST /api/transactions/borrow
// @access  Private/Student
const borrowBook = async (req, res) => {
  const { bookId } = req.body;
  const studentId = req.user._id;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book is currently out of stock!' });
    }

    // Check if user already borrowed this book and hasn't returned it yet
    const alreadyBorrowed = await Transaction.findOne({
      bookId,
      studentId,
      status: { $in: ['borrowed', 'overdue'] }
    });

    if (alreadyBorrowed) {
      return res.status(400).json({ message: 'You already have an active checkout of this book!' });
    }

    // Decrement available copies
    book.availableCopies = book.availableCopies - 1;
    await book.save();

    // Create borrowing transaction
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days loan period

    const transaction = await Transaction.create({
      bookId,
      studentId,
      dueDate
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Return a borrowed book
// @route   POST /api/transactions/return/:id
// @access  Private
const returnBook = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction record not found' });
    }

    if (transaction.status === 'returned') {
      return res.status(400).json({ message: 'Book has already been returned' });
    }

    // Increment available copies of book in database
    const book = await Book.findById(transaction.bookId);
    if (book) {
      book.availableCopies = Math.min(book.quantity, book.availableCopies + 1);
      await book.save();
    }

    // Calculate overdue fine (e.g. $1 per day)
    const dueDate = new Date(transaction.dueDate);
    const returnDate = new Date();
    let fine = 0;

    if (returnDate > dueDate) {
      const diffTime = Math.abs(returnDate - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * 1; // $1.00 fine per day
    }

    // Update transaction log
    transaction.returnDate = returnDate;
    transaction.status = 'returned';
    transaction.fine = fine;
    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's own checkout history
// @route   GET /api/transactions/my-borrowings
// @access  Private/Student
const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ studentId: req.user._id })
      .populate('bookId')
      .sort({ borrowDate: -1 });
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all checkouts in the library system
// @route   GET /api/transactions/all
// @access  Private/Admin
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate('bookId')
      .populate('studentId', 'name email')
      .sort({ borrowDate: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Settle/pay fines
// @route   PUT /api/transactions/fine/:id/pay
// @access  Private/Admin
const collectFine = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction record not found' });
    }

    transaction.fine = 0;
    await transaction.save();

    res.json({ message: 'Fine cleared successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  borrowBook,
  returnBook,
  getMyTransactions,
  getAllTransactions,
  collectFine
};
