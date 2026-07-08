const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');

dotenv.config();

const defaultBooks = [
  // ── TECHNOLOGY ──────────────────────────────────────────────
  {
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    ISBN: '978-0132350884',
    genre: 'Technology',
    quantity: 5,
    availableCopies: 5,
    shelfLocation: 'Aisle A-1'
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    ISBN: '978-0135957059',
    genre: 'Technology',
    quantity: 4,
    availableCopies: 4,
    shelfLocation: 'Aisle A-1'
  },
  {
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma',
    ISBN: '978-0201633610',
    genre: 'Technology',
    quantity: 4,
    availableCopies: 3,
    shelfLocation: 'Aisle A-2'
  },
  {
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    ISBN: '978-0262033848',
    genre: 'Technology',
    quantity: 6,
    availableCopies: 6,
    shelfLocation: 'Aisle A-2'
  },
  {
    title: 'You Don\'t Know JS: Up & Going',
    author: 'Kyle Simpson',
    ISBN: '978-1491924464',
    genre: 'Technology',
    quantity: 5,
    availableCopies: 5,
    shelfLocation: 'Aisle A-3'
  },
  {
    title: 'Python Crash Course',
    author: 'Eric Matthes',
    ISBN: '978-1593279288',
    genre: 'Technology',
    quantity: 7,
    availableCopies: 6,
    shelfLocation: 'Aisle A-3'
  },
  {
    title: 'Cracking the Coding Interview',
    author: 'Gayle Laakmann McDowell',
    ISBN: '978-0984782857',
    genre: 'Technology',
    quantity: 5,
    availableCopies: 4,
    shelfLocation: 'Aisle A-4'
  },
  {
    title: 'The Web Application Hacker\'s Handbook',
    author: 'Dafydd Stuttard',
    ISBN: '978-1118026472',
    genre: 'Technology',
    quantity: 3,
    availableCopies: 3,
    shelfLocation: 'Aisle A-4'
  },

  // ── FICTION ─────────────────────────────────────────────────
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    ISBN: '978-0261103344',
    genre: 'Fiction',
    quantity: 8,
    availableCopies: 7,
    shelfLocation: 'Aisle B-1'
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    ISBN: '978-0061120084',
    genre: 'Fiction',
    quantity: 6,
    availableCopies: 6,
    shelfLocation: 'Aisle B-1'
  },
  {
    title: '1984',
    author: 'George Orwell',
    ISBN: '978-0451524935',
    genre: 'Fiction',
    quantity: 7,
    availableCopies: 5,
    shelfLocation: 'Aisle B-2'
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    ISBN: '978-0743273565',
    genre: 'Fiction',
    quantity: 5,
    availableCopies: 5,
    shelfLocation: 'Aisle B-2'
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    ISBN: '978-0439708180',
    genre: 'Fiction',
    quantity: 10,
    availableCopies: 8,
    shelfLocation: 'Aisle B-3'
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    ISBN: '978-0062315007',
    genre: 'Fiction',
    quantity: 6,
    availableCopies: 6,
    shelfLocation: 'Aisle B-3'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    ISBN: '978-0141439518',
    genre: 'Fiction',
    quantity: 5,
    availableCopies: 4,
    shelfLocation: 'Aisle B-4'
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    ISBN: '978-0316769174',
    genre: 'Fiction',
    quantity: 4,
    availableCopies: 4,
    shelfLocation: 'Aisle B-4'
  },
  {
    title: 'Animal Farm',
    author: 'George Orwell',
    ISBN: '978-0451526342',
    genre: 'Fiction',
    quantity: 6,
    availableCopies: 6,
    shelfLocation: 'Aisle B-5'
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    ISBN: '978-0060850524',
    genre: 'Fiction',
    quantity: 4,
    availableCopies: 3,
    shelfLocation: 'Aisle B-5'
  },

  // ── SCIENCE ─────────────────────────────────────────────────
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    ISBN: '978-0553380163',
    genre: 'Science',
    quantity: 3,
    availableCopies: 3,
    shelfLocation: 'Aisle C-1'
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    ISBN: '978-0198788607',
    genre: 'Science',
    quantity: 4,
    availableCopies: 4,
    shelfLocation: 'Aisle C-1'
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    ISBN: '978-0062316097',
    genre: 'Science',
    quantity: 5,
    availableCopies: 4,
    shelfLocation: 'Aisle C-2'
  },
  {
    title: 'The Origin of Species',
    author: 'Charles Darwin',
    ISBN: '978-0140432053',
    genre: 'Science',
    quantity: 3,
    availableCopies: 3,
    shelfLocation: 'Aisle C-2'
  },
  {
    title: 'Cosmos',
    author: 'Carl Sagan',
    ISBN: '978-0345539434',
    genre: 'Science',
    quantity: 4,
    availableCopies: 4,
    shelfLocation: 'Aisle C-3'
  },
  {
    title: 'The Gene: An Intimate History',
    author: 'Siddhartha Mukherjee',
    ISBN: '978-1476733500',
    genre: 'Science',
    quantity: 3,
    availableCopies: 2,
    shelfLocation: 'Aisle C-3'
  },

  // ── HISTORY ─────────────────────────────────────────────────
  {
    title: 'Guns, Germs, and Steel',
    author: 'Jared Diamond',
    ISBN: '978-0393354323',
    genre: 'History',
    quantity: 4,
    availableCopies: 4,
    shelfLocation: 'Aisle D-1'
  },
  {
    title: 'The Diary of a Young Girl',
    author: 'Anne Frank',
    ISBN: '978-0553296983',
    genre: 'History',
    quantity: 6,
    availableCopies: 5,
    shelfLocation: 'Aisle D-1'
  },
  {
    title: 'Homo Deus: A Brief History of Tomorrow',
    author: 'Yuval Noah Harari',
    ISBN: '978-0062464316',
    genre: 'History',
    quantity: 4,
    availableCopies: 4,
    shelfLocation: 'Aisle D-2'
  },
  {
    title: 'The Story of Civilization',
    author: 'Will Durant',
    ISBN: '978-1567310238',
    genre: 'History',
    quantity: 3,
    availableCopies: 3,
    shelfLocation: 'Aisle D-2'
  },
  {
    title: 'India After Gandhi',
    author: 'Ramachandra Guha',
    ISBN: '978-0330396110',
    genre: 'History',
    quantity: 5,
    availableCopies: 5,
    shelfLocation: 'Aisle D-3'
  },
  {
    title: 'Freedom at Midnight',
    author: 'Larry Collins & Dominique Lapierre',
    ISBN: '978-0007109234',
    genre: 'History',
    quantity: 4,
    availableCopies: 3,
    shelfLocation: 'Aisle D-3'
  },

  // ── SELF-HELP ────────────────────────────────────────────────
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    ISBN: '978-0735211292',
    genre: 'Self-Help',
    quantity: 8,
    availableCopies: 6,
    shelfLocation: 'Aisle E-1'
  },
  {
    title: 'Deep Work',
    author: 'Cal Newport',
    ISBN: '978-1455586691',
    genre: 'Self-Help',
    quantity: 5,
    availableCopies: 5,
    shelfLocation: 'Aisle E-1'
  },
  {
    title: 'The 7 Habits of Highly Effective People',
    author: 'Stephen R. Covey',
    ISBN: '978-0743269513',
    genre: 'Self-Help',
    quantity: 6,
    availableCopies: 4,
    shelfLocation: 'Aisle E-2'
  },
  {
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    ISBN: '978-1585424337',
    genre: 'Self-Help',
    quantity: 5,
    availableCopies: 5,
    shelfLocation: 'Aisle E-2'
  },
  {
    title: 'How to Win Friends and Influence People',
    author: 'Dale Carnegie',
    ISBN: '978-0671027032',
    genre: 'Self-Help',
    quantity: 6,
    availableCopies: 5,
    shelfLocation: 'Aisle E-3'
  },
  {
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    ISBN: '978-1577314806',
    genre: 'Self-Help',
    quantity: 4,
    availableCopies: 4,
    shelfLocation: 'Aisle E-3'
  },
  {
    title: 'Rich Dad Poor Dad',
    author: 'Robert T. Kiyosaki',
    ISBN: '978-1612680194',
    genre: 'Self-Help',
    quantity: 7,
    availableCopies: 6,
    shelfLocation: 'Aisle E-4'
  },
  {
    title: 'Ikigai: The Japanese Secret to a Long Life',
    author: 'Hector Garcia',
    ISBN: '978-0143130727',
    genre: 'Self-Help',
    quantity: 5,
    availableCopies: 5,
    shelfLocation: 'Aisle E-4'
  },

  // ── MATHEMATICS ─────────────────────────────────────────────
  {
    title: 'Fermat\'s Last Theorem',
    author: 'Simon Singh',
    ISBN: '978-1857025217',
    genre: 'Mathematics',
    quantity: 3,
    availableCopies: 3,
    shelfLocation: 'Aisle F-1'
  },
  {
    title: 'The Man Who Knew Infinity',
    author: 'Robert Kanigel',
    ISBN: '978-0671750615',
    genre: 'Mathematics',
    quantity: 4,
    availableCopies: 4,
    shelfLocation: 'Aisle F-1'
  },
  {
    title: 'Mathematics for the Million',
    author: 'Lancelot Hogben',
    ISBN: '978-0393310719',
    genre: 'Mathematics',
    quantity: 3,
    availableCopies: 3,
    shelfLocation: 'Aisle F-2'
  },
  {
    title: 'How to Solve It',
    author: 'George Pólya',
    ISBN: '978-0691164076',
    genre: 'Mathematics',
    quantity: 4,
    availableCopies: 4,
    shelfLocation: 'Aisle F-2'
  },

  // ── BIOGRAPHY ───────────────────────────────────────────────
  {
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    ISBN: '978-1451648539',
    genre: 'Biography',
    quantity: 5,
    availableCopies: 4,
    shelfLocation: 'Aisle G-1'
  },
  {
    title: 'Elon Musk',
    author: 'Walter Isaacson',
    ISBN: '978-1982181284',
    genre: 'Biography',
    quantity: 6,
    availableCopies: 5,
    shelfLocation: 'Aisle G-1'
  },
  {
    title: 'Wings of Fire',
    author: 'A.P.J. Abdul Kalam',
    ISBN: '978-8173711466',
    genre: 'Biography',
    quantity: 8,
    availableCopies: 7,
    shelfLocation: 'Aisle G-2'
  },
  {
    title: 'The Story of My Experiments with Truth',
    author: 'Mahatma Gandhi',
    ISBN: '978-0807059098',
    genre: 'Biography',
    quantity: 5,
    availableCopies: 5,
    shelfLocation: 'Aisle G-2'
  },
  {
    title: 'Long Walk to Freedom',
    author: 'Nelson Mandela',
    ISBN: '978-0316548182',
    genre: 'Biography',
    quantity: 4,
    availableCopies: 3,
    shelfLocation: 'Aisle G-3'
  },

  // ── ECONOMICS ───────────────────────────────────────────────
  {
    title: 'Freakonomics',
    author: 'Steven D. Levitt & Stephen J. Dubner',
    ISBN: '978-0060731335',
    genre: 'Economics',
    quantity: 4,
    availableCopies: 4,
    shelfLocation: 'Aisle H-1'
  },
  {
    title: 'The Wealth of Nations',
    author: 'Adam Smith',
    ISBN: '978-0140432084',
    genre: 'Economics',
    quantity: 3,
    availableCopies: 3,
    shelfLocation: 'Aisle H-1'
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    ISBN: '978-0374533557',
    genre: 'Economics',
    quantity: 5,
    availableCopies: 4,
    shelfLocation: 'Aisle H-2'
  },
  {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    ISBN: '978-0307887894',
    genre: 'Economics',
    quantity: 4,
    availableCopies: 4,
    shelfLocation: 'Aisle H-2'
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');

    await Book.deleteMany();
    console.log('Existing books cleared.');

    await Book.insertMany(defaultBooks);
    console.log(`✅ Database seeded with ${defaultBooks.length} books successfully!`);

    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
