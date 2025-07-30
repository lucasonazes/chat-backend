# Real-Time Chat Backend

This is a Node.js backend for a real-time chat application built with Express, Socket.IO, and Prisma (PostgreSQL). It provides REST APIs for user and message management, authentication, and real-time messaging via websockets.

## Features

- User registration and login with JWT authentication
- RESTful endpoints for users and messages
- Real-time messaging using Socket.IO
- Secure password hashing with bcrypt
- Prisma ORM for database access (PostgreSQL)
- Environment-based configuration
- Linting and formatting with ESLint and Prettier
- Commit message linting with Husky and Commitlint

## Project Structure

```
src/
  index.ts                # Entry point
  config/prisma.ts        # Prisma client setup
  controllers/            # Route and socket controllers
  middleware/             # Authentication middleware
  routes/                 # Express route definitions
  sockets/                # Socket.IO setup
  types/                  # Type definitions
  utils/                  # Utility functions
prisma/
  schema.prisma           # Database schema
  migrations/             # Prisma migrations
```

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL database

### Installation

```sh
git clone https://github.com/lucasonazes/chat-backend.git
cd chat-backend
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
FRONT_URL=http://localhost:3000
PORT=3001
```

### Database Setup

Run Prisma migrations:

```sh
npx prisma migrate dev
```

### Running the Server

```sh
npm run dev
```

### Linting & Formatting

```sh
npm run lint
npm run format
```

## API Endpoints

- `POST /register` - Register a new user
- `POST /login` - Login and receive JWT
- `GET /users` - Get all users (auth required)
- `GET /users/me` - Get current user (auth required)
- `GET /users/:userId` - Get user by ID (auth required)
- `POST /messages` - Send a message (auth required)
- `GET /messages/:user1/:user2` - Get conversation between two users (auth required)

## Real-Time Messaging

Clients connect via Socket.IO and authenticate using JWT. Events:

- `join` - Join a user room
- `sendMessage` - Send a message to another user
- `receiveMessage` - Receive a message

## License

MIT

## Author

Lucas Onazes Fensterseifer
