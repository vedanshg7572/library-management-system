const Book = require('../models/Book');

// @desc    Get all catalog books
// @route   GET /api/books
// @access  Private
const getBooks = async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get book details by ID
// @route   GET /api/books/:id
// @access  Private
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book catalog entry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new book to catalog
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res) => {
  const { title, author, ISBN, genre, quantity, shelfLocation } = req.body;

  try {
    // Check if ISBN already exists
    const isbnExists = await Book.findOne({ ISBN });
    if (isbnExists) {
      return res.status(400).json({ message: 'A book with this ISBN already exists in the catalog' });
    }

    const newBook = new Book({
      title,
      author,
      ISBN,
      genre,
      quantity: Number(quantity),
      availableCopies: Number(quantity), // Initially all copies are available
      shelfLocation
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update book details
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res) => {
  const { title, author, ISBN, genre, quantity, shelfLocation } = req.body;

  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      // Calculate change in stock quantity to update availableCopies
      const diff = Number(quantity) - book.quantity;
      const newAvailable = Math.max(0, book.availableCopies + diff);

      book.title = title || book.title;
      book.author = author || book.author;
      book.ISBN = ISBN || book.ISBN;
      book.genre = genre || book.genre;
      book.quantity = Number(quantity);
      book.availableCopies = newAvailable;
      book.shelfLocation = shelfLocation || book.shelfLocation;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete book from catalog
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      await Book.deleteOne({ _id: req.params.id });
      res.json({ message: 'Book removed from library catalog' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
