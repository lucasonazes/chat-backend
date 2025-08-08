# Real-Time Chat Backend

A robust, scalable backend for a real-time chat application supporting text, image, and document messages. Built with Node.js, Express, TypeScript, Socket.IO, Prisma, and PostgreSQL. Features JWT authentication, Zod validation and a clean, maintainable architecture.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, TypeScript, Socket.IO, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **Password Hashing:** bcrypt
- **Development Tools:** ESLint, Prettier, EditorConfig, Commitlint, Husky, tsconfig

---

## 🚀 Features

- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Real-time messaging (text, images, documents) via Socket.IO
- File uploads with validation
- API validation using Zod schemas
- Centralized error handling with custom middleware
- Session expiration and auto logout on token expiration
- Clean architecture: controllers, routes, middleware and services
- Developer workflow: linting, formatting, commit hooks and strict TypeScript

---

## 📋 Requirements

- Node.js >= 18
- PostgreSQL >= 14

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd project-folder
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
# .env.example
DATABASE_URL=postgresql://user:password@localhost:5432/chatdb
JWT_SECRET=your_jwt_secret
PORT=3001
FRONT_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Start the development server

```bash
yarn dev
```

---

## 🗂️ API Endpoints

### Auth

- `POST /register` — Register a new user
- `POST /login` — Login and receive JWT

### Users

- `GET /users` — List all users (auth required)
- `GET /users/me` — Get current user profile (auth required)
- `GET /users/:userId` — Get user by ID (auth required)

### Messages

- `POST /messages` — Send a message (auth required)
- `GET /messages/:user1/:user2` — Get conversation between two users (auth required)

---

## 🔌 Socket.IO Events

- `connection` — Client connects (must send JWT in handshake)
- `join` — Join a user room
- `sendMessage` — Send a message (text, image, or document)
- `receiveMessage` — Receive a message
- `disconnect` — Client disconnects

---

## 📦 Scripts

- `yarn dev` — Start server in development mode
- `yarn build` — Build TypeScript for production
- `yarn start` — Start server in production mode
- `yarn lint` — Run ESLint
- `yarn format` — Run Prettier
- `yarn prepare` — Run Husky

---

## 📝 License

This project is licensed under the MIT License.
