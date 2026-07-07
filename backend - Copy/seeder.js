const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');
const User = require('./models/User');

dotenv.config();

const defaultBooks = [
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    ISBN: '978-0132350884',
    genre: 'Technology',
    quantity: 5,
    availableCopies: 5,
    shelfLocation: 'Aisles A-3'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    ISBN: '978-0261103344',
    genre: 'Fiction',
    quantity: 8,
    availableCopies: 7,
    shelfLocation: 'Aisles B-1'
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    ISBN: '978-0553380163',
    genre: 'Science',
    quantity: 3,
    availableCopies: 3,
    shelfLocation: 'Aisles C-2'
  },
  {
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma',
    ISBN: '978-0201633610',
    genre: 'Technology',
    quantity: 4,
    availableCopies: 4,
    shelfLocation: 'Aisles A-4'
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    ISBN: '978-0061120084',
    genre: 'Fiction',
    quantity: 6,
    availableCopies: 6,
    shelfLocation: 'Aisles B-4'
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing books
    await Book.deleteMany();
    console.log('Existing books cleared.');

    // Insert default books
    await Book.insertMany(defaultBooks);
    console.log('Database seeded with default books catalog successfully!');

    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
