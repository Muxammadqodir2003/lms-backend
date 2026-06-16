# 🚀 LMS Backend - Enterprise-Grade Learning Management System

> A production-ready, highly scalable Learning Management System backend built with **NestJS 11**, **TypeScript**, **PostgreSQL**, and **Redis**. Designed for high performance, security, and real-time capabilities with comprehensive monitoring and rate limiting.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Docker Deployment](#-docker-deployment)
- [Usage & Scripts](#-usage--scripts)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication & Security](#-authentication--security)
- [Real-time Features](#-real-time-features)
- [Rate Limiting & Security](#-rate-limiting--security)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Functionality

- **Multi-Role User Management**
  - Admin Dashboard: Complete system control and monitoring
  - Instructor Studio: Course creation and management
  - Student Portal: Enrollment and learning progress
  - Role-Based Access Control (RBAC) with granular permissions

- **🏗️ Advanced Course Management**
  - Full CRUD operations for courses, sections, and lessons
  - Drag-and-drop curriculum reordering (via WebSocket)
  - Rich text content with Quill.js integration
  - Media handling and video processing via FFmpeg
  - Hierarchical course structure with version control

- **🔐 Enterprise-Grade Security**
  - **Multi-Auth Support**: Email/Password, Google OAuth2, GitHub OAuth2
  - **Smart Rate Limiting**: Redis-based throttling with IP and email blocking
  - **3-Failed-Login Rule**: 30-minute IP and email block after 3 failed attempts
  - **Instructor Course Deletion Limit**: Max 2 deletions/24hrs, automatic 24-hr ban on 3rd attempt
  - **Security Alerts**: Automated email notifications for suspicious activities
  - **JWT with Refresh Tokens**: Secure token rotation and management
  - **Recovery Tokens**: Account recovery mechanisms

- **📡 Real-time Communication**
  - **Socket.io Integration**: Live WebSocket events
  - **Admin Monitor**: Real-time notifications for instructor requests
  - **Progress Tracking**: Real-time student progress calculation
  - **Event Broadcasting**: Instant updates across all connected clients
  - **Notification System**: Toaster notifications via WebSocket

- **💾 Database & Caching**
  - **PostgreSQL**: Relational data with Prisma ORM
  - **Redis**: Caching, session management, rate limiting
  - **Transaction Support**: ACID compliance for critical operations
  - **Connection Pooling**: Optimized database connections

- **📧 Communication**
  - **SMTP Integration**: Nodemailer for email notifications
  - **Security Alerts**: Email notifications for security events
  - **Welcome Emails**: Automated user onboarding emails
  - **Policy Notifications**: Legal/policy update emails

- **📊 Monitoring & Logging**
  - **Swagger/OpenAPI**: Complete API documentation
  - **Security Audit Logs**: All security incidents logged
  - **Error Tracking**: Comprehensive error handling and logging
  - **Performance Metrics**: API response times and usage stats

- **🛠️ Developer Experience**
  - TypeScript strict mode for type safety
  - ESLint + Prettier for code consistency
  - Jest testing framework with E2E tests
  - Hot module reloading during development
  - Complete API documentation with Swagger

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | NestJS 11.1.11 (Node.js) |
| **Language** | TypeScript 5.1.3 |
| **Runtime** | Node.js 20+ |
| **Database** | PostgreSQL 15+ (Relational) |
| **Cache/Session** | Redis 7 (Caching, Rate Limiting) |
| **ORM** | Prisma 7 (TypeORM compatible) |
| **Authentication** | JWT, Passport.js, OAuth2 |
| **Real-time** | Socket.io 4.8.3 |
| **Documentation** | Swagger/OpenAPI 11.2.6 |
| **Email** | Nodemailer 7 + SMTP |
| **File Storage** | Supabase 2.90.1 |
| **Video Processing** | FFmpeg 2.1.3 |
| **Validation** | Class Validator, Class Transformer |
| **Testing** | Jest 29.5, Supertest 7 |
| **Code Quality** | ESLint 8, Prettier 3 |
| **Containerization** | Docker, Docker Compose |
| **Deployment** | AWS EC2, Nginx, SSL/TLS |

### Package Breakdown

**Production Dependencies** (52 packages):
- NestJS core modules (common, core, platform-express, platform-socket.io, websockets)
- Authentication (passport-jwt, passport-google-oauth20, passport-github2)
- Database (prisma/client, prisma/adapter-pg)
- Caching (ioredis, @nestjs-modules/ioredis)
- Security (bcryptjs, rate limiting, redis storage)
- Email (nodemailer, @nestjs-modules/mailer)
- Validation (class-validator, class-transformer)
- Utilities (rxjs, cookie-parser)

**Dev Dependencies** (18 packages):
- NestJS CLI and testing tools
- Type definitions (@types/node, @types/express, etc.)
- Testing (jest, ts-jest, supertest)
- Linting (eslint, prettier, typescript-eslint)
- Build tools (ts-loader, ts-node, tsconfig-paths)

---

## 🏗 Project Architecture

The backend follows NestJS modular architecture with clear separation of concerns:

```
lms-backend/
├── src/
│   ├── auth/                    # Authentication & Authorization
│   │   ├── auth.controller.ts   # Auth endpoints
│   │   ├── auth.service.ts      # JWT, OAuth, recovery logic
│   │   ├── jwt.strategy.ts      # Passport JWT strategy
│   │   ├── google.strategy.ts   # Google OAuth strategy
│   │   ├── github.strategy.ts   # GitHub OAuth strategy
│   │   └── dto/                 # Data transfer objects
│   │
│   ├── users/                   # User Management
│   │   ├── users.controller.ts  # User endpoints (CRUD, profile)
│   │   ├── users.service.ts     # User business logic
│   │   ├── dto/                 # User DTOs
│   │   └── entities/            # User model
│   │
│   ├── courses/                 # Course Management
│   │   ├── courses.controller.ts # Course endpoints
│   │   ├── courses.service.ts    # Course logic
│   │   ├── dto/                  # Course DTOs
│   │   └── entities/             # Course model
│   │
│   ├── lessons/                 # Lesson Management
│   │   ├── lessons.controller.ts # Lesson endpoints
│   │   ├── lessons.service.ts    # Lesson logic
│   │   ├── dto/                  # Lesson DTOs
│   │   └── entities/             # Lesson model
│   │
│   ├── enrollment/              # Course Enrollment
│   │   ├── enrollment.controller.ts
│   │   ├── enrollment.service.ts
│   │   └── dto/
│   │
│   ├── mail/                    # Email Service
│   │   ├── mail.service.ts      # Nodemailer integration
│   │   ├── mail.module.ts       # Mail configuration
│   │   └── templates/           # Email templates
│   │
│   ├── common/                  # Shared Resources
│   │   ├── guards/              # Auth, Role-based guards
│   │   ├── interceptors/        # Request/Response interceptors
│   │   ├── filters/             # Exception filters
│   │   ├── pipes/               # Validation pipes
│   │   └── decorators/          # Custom decorators
│   │
│   ├── database/                # Database Configuration
│   │   ├── prisma.service.ts    # Prisma client
│   │   └── database.module.ts   # DB module
│   │
│   ├── redis/                   # Redis Integration
│   │   ├── redis.service.ts     # Redis operations
│   │   ├── rate-limiter.ts      # Rate limiting logic
│   │   └── cache.strategy.ts    # Caching strategies
│   │
│   ├── socket/                  # WebSocket (Socket.io)
│   │   ├── socket.gateway.ts    # Socket events
│   │   ├── socket.service.ts    # Socket logic
│   │   └── events/              # Event definitions
│   │
│   ├── config/                  # Configuration
│   │   ├── app.config.ts        # App settings
│   │   ├── database.config.ts   # Database settings
│   │   └── jwt.config.ts        # JWT settings
│   │
│   ├── app.module.ts            # Root module
│   ├── app.controller.ts        # Health check
│   └── main.ts                  # Bootstrap file
│
├── prisma/
│   ├── schema.prisma            # Database schema (ORM)
│   └── migrations/              # Database migrations
│
├── test/
│   ├── jest-e2e.json            # E2E test config
│   └── *.e2e-spec.ts            # End-to-end tests
│
├── Dockerfile                   # Docker image (multi-stage)
├── docker-compose.yml           # Docker Compose (app + DB + Redis)
├── tsconfig.json                # TypeScript configuration
├── nest-cli.json                # NestJS CLI config
├── package.json                 # Dependencies
└── .env.example                 # Environment template
```

### Architecture Diagram

```
┌─────────────────────────────────────────┐
│       Frontend (Next.js React)          │
├─────────────────────────────────────────┤
           ↓        HTTP/REST        ↑
           ↓      Socket.io (WS)     ↑
┌─────────────────────────────────────────┐
│    API Gateway / Load Balancer (Nginx)  │
├─────────────────────────────────────────┤
           ↓                         ↑
┌─────────────────────────────────────────┐
│      NestJS Backend (4000)              │
│  ├── Controllers (API Endpoints)        │
│  ├── Services (Business Logic)          │
│  ├── Guards (Auth/Authorization)        │
│  ├── Interceptors (Logging)             │
│  ├── Pipes (Validation)                 │
│  └── WebSocket (Socket.io)              │
├─────────────────────────────────────────┤
      ↓           ↓           ↓
   PostgreSQL    Redis      Supabase
   (Database)    (Cache)    (Storage)
```

---

## 📋 Prerequisites

Before running the project, ensure you have:

- **Node.js**: v18 or higher
- **npm**: v9 or higher (or yarn/pnpm)
- **Docker & Docker Compose**: For containerized deployment
- **PostgreSQL**: v15 or higher (if running without Docker)
- **Redis**: v7 or higher (if running without Docker)
- **Git**: For version control

### Optional (for full setup)
- **Gmail Account**: For SMTP email testing
- **Google OAuth Credentials**: For social login
- **GitHub OAuth Credentials**: For social login
- **Supabase Account**: For file storage
- **AWS Account**: For production deployment

---

## 💻 Installation & Setup

### Method 1: Using Docker (Recommended)

Docker setup automatically handles PostgreSQL, Redis, and the NestJS application.

#### Step 1: Clone Repository
```bash
git clone https://github.com/Muxammadqodir2003/lms-backend.git
cd lms-backend
```

#### Step 2: Configure Environment
```bash
# Copy example env file
cp .env.example .env.local

# Edit with your configuration
nano .env.local
```

#### Step 3: Start Services
```bash
# Build and start all services (NestJS + PostgreSQL + Redis)
docker-compose up -d --build

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

#### Step 4: Run Database Migrations
```bash
# Inside the running container
docker exec nest_api npx prisma migrate deploy

# Or manually create tables
docker exec nest_api npx prisma db push
```

The API will be available at `http://localhost:4000`

---

### Method 2: Manual Installation

For local development without Docker.

#### Step 1: Clone Repository
```bash
git clone https://github.com/Muxammadqodir2003/lms-backend.git
cd lms-backend
```

#### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

#### Step 3: Configure Environment
```bash
# Create .env.local file
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

#### Step 4: Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed database
npx prisma db seed
```

#### Step 5: Start Application
```bash
# Development mode (with hot reload)
npm run start:dev

# Debug mode
npm run start:debug

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:4000`

---

## 🔧 Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# ============================================
# APP CONFIGURATION
# ============================================
NODE_ENV=development
PORT=4000
APP_NAME=LMS Backend

# ============================================
# DATABASE CONFIGURATION (PostgreSQL)
# ============================================
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_NAME=lms_db
DB_HOST=localhost
DB_PORT=5432
DATABASE_URL=postgresql://postgres:your_secure_password@localhost:5432/lms_db?schema=public

# ============================================
# JWT AUTHENTICATION
# ============================================
ACCESS_JWT_SECRET=your_super_secret_access_key_min_32_chars
ACCESS_JWT_EXPIRATION=15m
REFRESH_JWT_SECRET=your_super_secret_refresh_key_min_32_chars
REFRESH_JWT_EXPIRATION=7d
RECOVERY_TOKEN_SECRET=your_recovery_token_secret_min_32_chars
RECOVERY_TOKEN_EXPIRATION=1h

# ============================================
# OAUTH 2.0 CONFIGURATION
# ============================================
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:4000/auth/github/callback

# ============================================
# CLIENT CONFIGURATION
# ============================================
CLIENT_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# ============================================
# REDIS CONFIGURATION
# ============================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Rate Limiting Settings
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_WINDOW=15m
LOGIN_RATE_LIMIT_MAX=5

# ============================================
# EMAIL/SMTP CONFIGURATION
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password  # Use App Password, not regular password
SMTP_FROM=noreply@lms.com
SMTP_FROM_NAME=LMS System

# ============================================
# FILE STORAGE (Supabase)
# ============================================
SUPABASE_PROJECT_URL=https://your_project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SECRET_KEY=your_secret_key
SUPABASE_BUCKET=lms-files

# ============================================
# VIDEO PROCESSING
# ============================================
FFMPEG_PATH=/usr/bin/ffmpeg
VIDEO_UPLOAD_PATH=/uploads/videos
VIDEO_MAX_SIZE=1000  # MB
ALLOWED_VIDEO_TYPES=mp4,avi,mov,mkv,flv

# ============================================
# SECURITY SETTINGS
# ============================================
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true
HELMET_CSP=true

# Failed Login Security Settings
MAX_LOGIN_ATTEMPTS=3
LOGIN_ATTEMPT_BLOCK_DURATION=30m  # 30 minutes

# Instructor Deletion Limits
MAX_COURSE_DELETIONS_PER_DAY=2
INSTRUCTOR_BAN_DURATION=24h

# ============================================
# LOGGING & MONITORING
# ============================================
LOG_LEVEL=debug
LOG_FORMAT=json
ENABLE_METRICS=true

# ============================================
# PRODUCTION DEPLOYMENT
# ============================================
# API_DOMAIN=api.yourdomain.com
# SSL_CERT_PATH=/etc/ssl/certs/your_cert.pem
# SSL_KEY_PATH=/etc/ssl/private/your_key.pem
```

### Important Notes:
- **JWT Secrets**: Use strong, random secrets (min 32 characters)
- **SMTP**: Use Gmail App Password, not your regular password
- **OAuth**: Register apps on Google Cloud Console and GitHub
- **Supabase**: Create storage bucket for file uploads
- **Production**: Never commit `.env.local` to version control
- **Environment**: Keep separate configs for dev, staging, production

---

## 🐳 Docker Deployment

### Docker Architecture

```
┌──────────────────────────────────────┐
│      docker-compose.yml              │
├──────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌─────┐│
│  │ NestJS   │  │PostgreSQL│  │Redis││
│  │  (4000)  │  │ (5432)   │  │(6379)
│  └──────────┘  └──────────┘  └─────┘│
└──────────────────────────────────────┘
     ↓        ↓         ↓
   Docker   PostgreSQL  Redis
   Build    Container   Container
```

### Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f api
docker-compose logs -f db
docker-compose logs -f redis

# Stop services
docker-compose stop

# Remove services and volumes
docker-compose down -v

# Access PostgreSQL
docker exec -it nest_postgres psql -U postgres -d lms_db

# Access Redis
docker exec -it nest_redis redis-cli

# Run migrations in container
docker exec nest_api npx prisma migrate deploy

# Execute command in container
docker exec nest_api npm run lint
```

### Multi-Stage Docker Build

The `Dockerfile` uses multi-stage build for optimized image size:

```dockerfile
# Stage 1: Builder
# - Install dependencies
# - Generate Prisma client
# - Build TypeScript to JavaScript

# Stage 2: Runtime
# - Copy only necessary files from builder
# - Install FFmpeg for video processing
# - Expose port 4000
# - Run migrations and start app
```

---

## 📦 Usage & Scripts

Available npm scripts:

| Command | Description |
|---------|------------|
| `npm run build` | Build NestJS application to `dist/` |
| `npm run start` | Start production server |
| `npm run start:dev` | Start development server with hot reload |
| `npm run start:debug` | Start debug server with inspector |
| `npm run start:prod` | Run migrations + start production |
| `npm run lint` | Run ESLint and fix issues |
| `npm run format` | Format code with Prettier |
| `npm test` | Run unit tests with Jest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage report |
| `npm run test:debug` | Debug tests with inspector |
| `npm run test:e2e` | Run end-to-end tests |

### Development Workflow

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local with your config

# 3. Start development server
npm run start:dev

# 4. Run linting
npm run lint

# 5. Run tests
npm test

# 6. Format code
npm run format
```

---

## 📁 Project Structure Detailed

### `/src/auth` - Authentication Module

Handles all authentication logic:

```typescript
// JWT Strategy
import { Strategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

// Google OAuth Strategy
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Token generation and refresh logic
```

**Key Files:**
- `auth.controller.ts` - Login, register, refresh token endpoints
- `auth.service.ts` - Authentication business logic
- `jwt.strategy.ts` - JWT validation strategy
- `google.strategy.ts` - Google OAuth strategy
- `github.strategy.ts` - GitHub OAuth strategy

### `/src/users` - User Management Module

Manages user profiles and permissions:

```typescript
// User Entity
{
  id: string;
  email: string;
  password: string; // hashed with bcrypt
  firstName: string;
  lastName: string;
  avatar: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  isVerified: boolean;
  isBanned: boolean;
  bannedUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### `/src/courses` - Course Management Module

Course CRUD and curriculum management:

```typescript
// Course Entity
{
  id: string;
  title: string;
  description: string;
  instructor: User;
  sections: CourseSection[];
  students: User[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// CourseSection Entity
{
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}
```

### `/src/lessons` - Lesson Management Module

Lesson content and video handling:

```typescript
// Lesson Entity
{
  id: string;
  title: string;
  content: string; // Rich text from Quill
  videoUrl: string;
  order: number;
  duration: number; // in minutes
  isCompleted: boolean;
}
```

### `/src/redis` - Caching & Rate Limiting

Redis integration for performance and security:

**Features:**
- Session caching
- Rate limiting on failed logins
- Instructor deletion tracking
- API throttling
- Token blacklisting

### `/src/socket` - WebSocket Gateway

Real-time communication via Socket.io:

**Events:**
- `instructorRequest` - New instructor request notification
- `courseUpdated` - Course changed
- `lessonProgress` - Student progress update
- `userOnline` - User joined
- `userOffline` - User left

### `/src/common` - Shared Resources

**Guards:**
- `JwtAuthGuard` - Validates JWT tokens
- `RolesGuard` - Role-based access control
- `IsOwnerGuard` - Resource ownership verification

**Interceptors:**
- `LoggingInterceptor` - Request/response logging
- `TransformInterceptor` - Response transformation
- `ErrorInterceptor` - Exception handling

**Pipes:**
- `ValidationPipe` - DTO validation with class-validator
- `ParseIntPipe` - Integer parsing

---

## 📚 API Documentation

### Swagger/OpenAPI

Once the server is running, access API documentation:

- **Local**: `http://localhost:4000/api`
- **Production**: `https://yourdomain.com/api`

#### Key Endpoints

**Authentication:**
```
POST   /auth/register              # Register new user
POST   /auth/login                 # Login with email/password
POST   /auth/refresh               # Refresh access token
GET    /auth/google                # Google OAuth login
GET    /auth/google/callback       # Google OAuth callback
GET    /auth/github                # GitHub OAuth login
GET    /auth/github/callback       # GitHub OAuth callback
POST   /auth/forgot-password       # Send recovery email
POST   /auth/reset-password        # Reset password
```

**Users:**
```
GET    /users/:id                  # Get user profile
PATCH  /users/:id                  # Update user profile
DELETE /users/:id                  # Delete user account
GET    /users/:id/courses          # Get user's courses
GET    /users                      # List all users (admin)
```

**Courses:**
```
GET    /courses                    # List all courses
POST   /courses                    # Create new course (instructor)
GET    /courses/:id                # Get course details
PATCH  /courses/:id                # Update course (instructor)
DELETE /courses/:id                # Delete course (instructor)
POST   /courses/:id/enroll         # Enroll in course (student)
GET    /courses/:id/progress       # Get progress (student)
```

**Lessons:**
```
GET    /courses/:courseId/lessons  # Get lessons in course
POST   /courses/:courseId/lessons  # Create lesson (instructor)
PATCH  /lessons/:id                # Update lesson (instructor)
DELETE /lessons/:id                # Delete lesson (instructor)
POST   /lessons/:id/complete       # Mark as complete (student)
```

---

## 🗄️ Database Schema

### Core Tables

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255), -- NULL for OAuth users
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  avatar VARCHAR(500),
  role ENUM('ADMIN', 'INSTRUCTOR', 'STUDENT'),
  isVerified BOOLEAN DEFAULT FALSE,
  isBanned BOOLEAN DEFAULT FALSE,
  bannedUntil TIMESTAMP,
  googleId VARCHAR(255),
  githubId VARCHAR(255),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Courses Table
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructorId UUID NOT NULL REFERENCES users(id),
  isPublished BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Course Sections Table
CREATE TABLE course_sections (
  id UUID PRIMARY KEY,
  courseId UUID NOT NULL REFERENCES courses(id),
  title VARCHAR(255) NOT NULL,
  order INTEGER,
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Lessons Table
CREATE TABLE lessons (
  id UUID PRIMARY KEY,
  sectionId UUID NOT NULL REFERENCES course_sections(id),
  title VARCHAR(255) NOT NULL,
  content TEXT, -- Rich text from Quill
  videoUrl VARCHAR(500),
  duration INTEGER, -- minutes
  order INTEGER,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Enrollments Table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY,
  studentId UUID NOT NULL REFERENCES users(id),
  courseId UUID NOT NULL REFERENCES courses(id),
  progress INTEGER DEFAULT 0,
  completedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(studentId, courseId)
);

-- Security Logs Table
CREATE TABLE security_logs (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  action VARCHAR(100), -- 'FAILED_LOGIN', 'DELETION_ATTEMPT', etc.
  ipAddress VARCHAR(45),
  userAgent TEXT,
  details JSON,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Authentication & Security

### Authentication Flow

```
User ─── Credentials ──→ Login Endpoint
         │
         ├─ Check email/password (bcrypt verify)
         ├─ Check if not banned
         ├─ Check login rate limit (Redis)
         │
         └─ Generate tokens:
            • Access Token (15 min)
            • Refresh Token (7 days)
         
Response ← JWT Tokens ← Backend
         │
         └─ Store in HTTP-only cookies
            (or localStorage)

Future Requests:
User ─── Access Token ──→ Protected Route
         │
         └─ JwtAuthGuard validates:
            • Token signature
            • Token expiration
            • User role/permissions
         
Response ← Protected Data ← Backend
```

### OAuth2 Flow (Google/GitHub)

```
User clicks "Login with Google/GitHub"
         │
         └─ Redirect to provider
            • Send client_id
            • Send redirect_uri
            • Request scopes (email, profile)
         
Provider ← User authorizes app
         │
         └─ Redirect to callback_uri
            • Pass authorization code
         
Backend ─ Exchange code for access token
       ├─ Get user profile from provider
       ├─ Check if user exists
       ├─ Create account if new user
       └─ Generate JWT tokens

Frontend ← Redirect with tokens
```

### Security Features

| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | bcryptjs (rounds: 10) |
| **JWT Signing** | HS256 algorithm |
| **Rate Limiting** | Redis-based throttling |
| **Login Protection** | 3 attempts → 30-min block |
| **Deletion Limit** | Max 2/24hrs for instructors |
| **Automatic Ban** | 3rd deletion attempt → 24-hr ban |
| **Security Alerts** | Email notifications |
| **Session Timeout** | 15 min access token |
| **Token Refresh** | 7-day refresh tokens |
| **CORS Protection** | Whitelist allowed origins |
| **CSRF Protection** | SameSite cookies |
| **Input Validation** | Class-validator DTOs |
| **SQL Injection Prevention** | Parameterized queries (Prisma) |
| **XSS Prevention** | Input sanitization |
| **DDoS Protection** | Rate limiting + Nginx |

---

## ⚡ Real-time Features

### Socket.io Events

```typescript
// Server → Client Events
socket.emit('instructorRequest', {
  userId: string;
  userName: string;
  requestId: string;
  timestamp: Date;
});

socket.emit('courseUpdated', {
  courseId: string;
  changes: object;
  updatedBy: string;
});

socket.emit('progressUpdated', {
  studentId: string;
  progress: number;
  completedLessons: number;
});

// Client → Server Events
socket.on('markLessonComplete', (lessonId: string) => {
  // Mark lesson as complete
  // Broadcast to other students
});

socket.on('updateCurriculumOrder', (sections: object[]) => {
  // Update section/lesson order
  // Only for instructors
});
```

---

## 🛡️ Rate Limiting & Security

### Rate Limiting Strategy

**Using Redis + @nestjs/throttler:**

```typescript
// Global rate limit: 100 requests per 15 minutes
@Throttle({ default: { limit: 100, ttl: 900 } })

// Login endpoint: 5 attempts per 15 minutes
@Throttle({ default: { limit: 5, ttl: 900 } })
POST /auth/login

// Strict: 3 failed attempts → 30-minute IP + email block
// Automatic ban on 3rd failure
```

### Security Incident Handling

1. **Failed Login**
   - Log attempt in security_logs
   - Increment counter in Redis (by email + IP)
   - 3rd attempt: Block IP and email for 30 min
   - Send security alert email

2. **Unauthorized Access**
   - Log attempt with user ID, IP, path
   - Return 403 Forbidden
   - Monitor for repeated attempts

3. **Instructor Deletion Limit**
   - Track deletions per instructor per day
   - Max 2 deletions in 24 hours
   - 3rd attempt: Ban instructor for 24 hours
   - Send policy notification email

---

## 🧪 Testing

### Jest Testing Framework

```bash
# Unit Tests
npm test

# Watch Mode
npm run test:watch

# Coverage Report
npm run test:cov
```

### Example Test

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, UsersService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should register a new user', async () => {
    const dto: RegisterDto = {
      email: 'test@example.com',
      password: 'Test123!',
    };

    const result = await service.register(dto);

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });
});
```

### E2E Testing

```bash
# Run end-to-end tests
npm run test:e2e
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** code style (ESLint + Prettier)
4. **Write** tests for new features
5. **Commit** with clear messages (`git commit -m 'feat: Add amazing feature'`)
6. **Push** to branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### Code Standards
- TypeScript strict mode enforced
- ESLint rules must pass (`npm run lint`)
- Prettier formatting required (`npm run format`)
- Test coverage minimum 80%
- Clear commit messages following Conventional Commits
- Comments for complex logic
- Type annotations for all functions

---

## 📄 License

This project is licensed under the **UNLICENSED** - Proprietary Software

---

## 🔗 Related Repositories

- **Frontend**: [lms-frontend](https://github.com/Muxammadqodir2003/lms-frontend) - Next.js React UI
- **Full Stack**: Learning Management System Complete Stack

---

## 📊 Project Statistics

- **Language**: TypeScript (100%)
- **Repository Size**: ~55.5 MB
- **Created**: December 27, 2025
- **Last Updated**: March 5, 2026
- **Total Commits**: Ongoing development
- **Status**: 🟢 Active Development

---

## 🔧 Troubleshooting

### Common Issues

#### Docker Issues
```bash
# Clear Docker cache
docker-compose down -v
docker system prune -a

# Rebuild images
docker-compose build --no-cache
docker-compose up -d
```

#### Database Connection Error
```bash
# Check PostgreSQL service
docker ps | grep postgres

# Check connection string in .env
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
```

#### Redis Connection Error
```bash
# Test Redis connection
redis-cli ping  # Should return PONG

# Check Redis service
docker ps | grep redis
```

#### Port Already in Use
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or use different port
PORT=5000 npm run start:dev
```

---

## 📞 Support & Contact

- **Issues**: Report bugs on [GitHub Issues](https://github.com/Muxammadqodir2003/lms-backend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Muxammadqodir2003/lms-backend/discussions)
- **Email**: Contact repository owner

---

## 🎯 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Certificate generation system
- [ ] Quiz and assessment module
- [ ] Discussion forums
- [ ] Live streaming support
- [ ] AI-powered recommendations
- [ ] Mobile app API
- [ ] Microservices architecture
- [ ] GraphQL API
- [ ] Event sourcing

---

## 🙏 Acknowledgments

Built with ❤️ using enterprise-grade technologies:
- [NestJS](https://nestjs.com/) - Node.js framework
- [Prisma](https://www.prisma.io/) - ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Redis](https://redis.io/) - Caching
- [Socket.io](https://socket.io/) - Real-time communication
- [Swagger](https://swagger.io/) - API documentation

---

**Made by Muxammadqodir2003** | [GitHub](https://github.com/Muxammadqodir2003) | [Backend](https://github.com/Muxammadqodir2003/lms-backend)