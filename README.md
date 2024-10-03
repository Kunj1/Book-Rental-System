# Book Rental System API

This project is a backend API for a Book Rental System.

## Features

- User Management
- Book Management
- Transaction Management (Issue and Return books)
- Search functionality for books based on name, category, and rent price range
- Tracking of book transactions

## Technologies Used

- Node.js
- Express.js
- TypeScript
- MongoDB (with Mongoose ODM)
- Winston (for logging)
- express-mongo-sanitize (for security against NoSQL injection)
- Jest (for testing)

## API Endpoints

### Books

- `GET /api/books`: Get all books
- `GET /api/books/search`: Search books by name, category, or rent price range
- `POST /api/books`: Create a new book

### Users

- `GET /api/users`: Get all users
- `GET /api/users/search`: Search users by name
- `POST /api/users`: Create a new user

### Transactions

- `POST /api/transactions/issue`: Issue a book to a user
- `POST /api/transactions/return`: Return a book
- `GET /api/transactions`: Get all transactions
- `GET /api/transactions/book/:bookId`: Get transactions for a specific book
- `GET /api/transactions/book/:bookId/rent-total`: Get total rent generated by a book
- `GET /api/transactions/user/:userId`: Get books issued to a specific user
- `GET /api/transactions/date-range`: Get transactions within a date range
- `GET /api/transactions/book/:bookId/details`: Get transactions details for a specific book

## Interacting with the Deployed API

The API is deployed at: [https://book-rental-system-lnmk.onrender.com]

#### [Since it is deployed on Render as a free instance, it will spin down with inactivity, which can delay requests by 50 seconds or more.]
#### Update: To fix this, I set up a periodic 13 minute ping service on UpTimeRobot & a 10 minute ping service on Cron-job.org to keep the server active [Render winds down after an inactivity of 15 mins] ;)

You can interact with the API using tools like cURL, Postman, or any HTTP client. Here are some example requests:

1. Get all books:
   ```
   GET https://book-rental-system-lnmk.onrender.com/api/books
   ```

2. Search for books:
   ```
   GET https://book-rental-system-lnmk.onrender.com/api/books/search?name=fiction&minRent=50&maxRent=100
   ```

3. Issue a book:
   ```
   POST https://book-rental-system-lnmk.onrender.com/api/transactions/issue
   Content-Type: application/json

   {
     "bookId": "book_id_here",
     "userId": "user_id_here",
     "issueDate": "2023-05-01"
   }
   ```

4. Return a book:
   ```
   POST https://book-rental-system-lnmk.onrender.com/api/transactions/return
   Content-Type: application/json

   {
     "bookId": "book_id_here",
     "userId": "user_id_here",
     "returnDate": "2023-05-10"
   }
   ```

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your `.env` file with your MongoDB URI
4. Run the development server: `npm run dev`
5. Run tests: `npm test`

## Deployment

This project is deployed on Render.com. Any pushes to the main branch of the GitHub repository will trigger a new deployment.
