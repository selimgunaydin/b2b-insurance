# Antigravity InsurTech Platform

This is a B2B Insurance Platform built with **NestJS** (Backend) and **Next.js** (Frontend).

## Prerequisites
- Node.js (v18+)
- Docker & Docker Compose

## Quick Start

### 1. Start the Database
Run the following command in the root directory to start the PostgreSQL database:
```bash
docker-compose up -d
```

### 2. Setup Backend
Navigate to the `backend` directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Run database migrations and seed data:
```bash
npx prisma migrate dev
npx prisma db seed
```
*This will create an Admin user (`admin@antigravity.com` / `admin123`) and default commission rates.*

Start the backend server:
```bash
npm run start:dev
```
The backend will run on `http://localhost:3000`.

### 3. Setup Frontend
Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the frontend development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:3001` (or 3000 if backend is on a different port, usually Next.js detects port usage).

## Project Structure
- `backend/`: NestJS application (API, Database, Auth).
- `frontend/`: Next.js application (UI, Dashboard, Admin Panel).
- `docker-compose.yml`: Database configuration.

## Default Credentials
- **Admin**: `admin@antigravity.com` / `admin123`
- **Tali (Agent)**: Register a new account via `/auth/register`.
