import mongoose from 'mongoose';
import Book from '../models/Book';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/book_rental_system';

const users = [
  { name: 'Aarav Patel', email: 'aarav@example.com' },
  { name: 'Diya Sharma', email: 'diya@example.com' },
  { name: 'Arjun Singh', email: 'arjun@example.com' },
  { name: 'Ananya Gupta', email: 'ananya@example.com' },
  { name: 'Rohan Mehta', email: 'rohan@example.com' }
];

const books = [
  { name: 'Midnight\'s Children', category: 'Fiction', rentPerDay: 50 },
  { name: 'The White Tiger', category: 'Fiction', rentPerDay: 45 },
  { name: 'The God of Small Things', category: 'Fiction', rentPerDay: 55 },
  { name: 'Train to Pakistan', category: 'Historical Fiction', rentPerDay: 40 },
  { name: 'The Immortals of Meluha', category: 'Mythology', rentPerDay: 60 },
  { name: 'The Palace of Illusions', category: 'Mythology', rentPerDay: 65 },
  { name: 'The Discovery of India', category: 'Non-fiction', rentPerDay: 70 },
  { name: 'Wings of Fire', category: 'Autobiography', rentPerDay: 55 },
  { name: 'A Suitable Boy', category: 'Fiction', rentPerDay: 75 },
  { name: 'The Guide', category: 'Fiction', rentPerDay: 45 },
  { name: 'The Namesake', category: 'Fiction', rentPerDay: 50 },
  { name: 'The Interpreter of Maladies', category: 'Short Stories', rentPerDay: 40 },
  { name: 'Malgudi Days', category: 'Short Stories', rentPerDay: 35 },
  { name: 'The Great Indian Novel', category: 'Satire', rentPerDay: 60 },
  { name: 'Five Point Someone', category: 'Fiction', rentPerDay: 30 },
  { name: 'The Lowland', category: 'Fiction', rentPerDay: 55 },
  { name: 'An Era of Darkness', category: 'Non-fiction', rentPerDay: 65 },
  { name: 'The Argumentative Indian', category: 'Non-fiction', rentPerDay: 70 },
  { name: 'Gitanjali', category: 'Poetry', rentPerDay: 40 },
  { name: 'The Jungle Book', category: 'Children\'s Literature', rentPerDay: 35 }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Book.deleteMany({});

    await User.insertMany(users);
    await Book.insertMany(books);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();