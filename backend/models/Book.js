const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true
  },
  ISBN: {
    type: String,
    required: [true, 'Please add an ISBN'],
    unique: true,
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Please add a genre'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity stock'],
    min: [0, 'Quantity cannot be negative'],
    default: 1
  },
  availableCopies: {
    type: Number,
    required: [true, 'Please add available copies'],
    min: [0, 'Available copies cannot be negative'],
    default: 1
  },
  shelfLocation: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  gutenbergId: {
    type: Number,
    default: null
  },
  language: {
    type: String,
    default: 'English'
  },
  readOnline: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', bookSchema);
