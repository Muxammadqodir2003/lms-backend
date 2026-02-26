# 🎓 Advanced LMS Backend (NestJS Enterprise Edition)

This is a high-performance, scalable Learning Management System (LMS) backend built with **NestJS**. It features a robust architecture, real-time monitoring, and advanced security measures, fully containerized and production-ready.

---

## 🏗 Project Structure
The project follows the standard NestJS modular architecture for high maintainability and scalability:

```text
src/
├── auth/               # JWT, Google & GitHub OAuth2, Recovery logic
├── users/              # Profile & RBAC (Admin, Instructor, Student)
├── courses/            # Course CRUD & Drag-and-Drop Curriculum logic
├── lessons/            # Video content & Quill Rich Text integration
├── enrollment/         # Enroll course
├── mail/               # SMTP integration (Nodemailer) for security alerts
└── common/             # Guards, Interceptors, and Custom Rate-limiters
├── database/           # PostgreSQL configuration (TypeORM/Prisma)
├── redis/              # Caching, Blacklisting, and Attack Protection logic
└── main.ts             # Bootstrap with Swagger & Security configurations

✨ Key Features
🔐 Advanced Security & Auth
Multi-Auth: Supports Email/Password, Google OAuth, and GitHub OAuth.

Smart Rate Limiting (Redis): * 3 failed login attempts → 30-minute IP & Email block.

Automatic "Security Alert" email sent to the user notifying them of a potential attack.

Instructor Guard: Instructors are limited to deleting only 2 courses per 24 hours. A 3rd attempt triggers an automatic 24-hour ban and a policy notification email.

📡 Real-time & Interactive UX
Admin Monitor: Real-time WebSocket updates via Socket.io. Admin receives instant notifications (with UI Toasters) when a student requests to "Become Instructor".

Dynamic Curriculum: Backend logic to handle Drag-and-Drop sorting for both course sections and individual lessons.

Progress Tracking: Real-time progress calculation (percentage-based) as students complete each lesson.

📝 Content Management
Rich Text Editor: Full integration with Quill for lesson descriptions and link binding.

Cloud Integration: Media handling via Supabase storage.

🛠 Tech Stack & DevOps
Framework: NestJS (Node.js)

Database: PostgreSQL (Relational data) & Redis (Security/Caching)

Documentation: Swagger UI (OpenAPI)

Containerization: Docker & Docker Compose

Deployment: AWS EC2 instance

Reverse Proxy: Nginx with HTTPS (SSL/TLS) and Custom Domain

⚙️ Environment Configuration (.env)
To run this project, you will need to add the following variables to your .env file:

Code snippet

PORT=4000
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=mydb
DATABASE_URL=postgresql://postgres:secret@localhost:5432/mydb?schema=public

CLIENT_URL=http://localhost:3000

REFRESH_JWT_SECRET=your_refresh_secret
ACCESS_JWT_SECRET=your_access_secret
RECOVERY_TOKEN=your_recovery_secret

# OAuth 2.0
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_SECRET=your_google_secret
GITHUB_CLIENT_ID=your_github_id
GITHUB_SECRET=your_github_secret

# Storage & Mail
SUPABASE_PROJECT_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
🚀 Deployment & Installation
Running with Docker (Recommended)
The project is fully dockerized. To start the entire stack (NestJS, Postgres, Redis):

Bash

docker-compose up -d --build
Manual Installation
Bash

# 1. Install dependencies
npm install

# 2. Run migrations
npm run migration:run

# 3. Start the application
npm run start:dev
API Documentation
Once the server is running, you can explore the API endpoints via Swagger:

Local: http://localhost:4000/api

Production: https://your-domain.com/api/docs

🛡 Security Monitoring
All security incidents (failed logins, unauthorized deletion attempts) are logged into the database. The Admin has a dedicated view to monitor these logs in real-time to ensure the platform's integrity.
