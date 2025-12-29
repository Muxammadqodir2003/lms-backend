# LMS Backend API (NestJS) – Work in Progress

A modular **Learning Management System (LMS) backend** built with **NestJS and TypeScript**,
designed to support educational platforms with role-based access and scalable architecture.

🚧 This project is currently **under active development**.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Instructor, Student)
- Protected routes using NestJS Guards
- Secure password hashing
- Forgot password flow (basic)

### 📚 Core LMS Modules
- User management
- Courses & lessons
- Enrollment system
- Content access control
- Progress tracking (planned)

---

## 🛠 Tech Stack

- Node.js
- NestJS
- TypeScript
- MongoDB / PostgreSQL
- REST API

---

## 📂 Project Structure

src/
├── auth/ # Auth logic (JWT, guards)
├── users/ # User management
├── courses/ # Courses
├── enrollments/ # Enrollment logic
├── section/ # Section
├── lesson/ # Lesson 
├── app.module.ts
└── main.ts


---

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3000
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
```

▶️ How to Run
```bash
npm install
npm run start:dev
