# Task and Time Tracking App

A full-stack web application to manage tasks and track the time spent on them.

## Tech Stack
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Auth**: JWT stored in httpOnly cookies, bcrypt

## Setup Instructions

### 1. Database Setup
This app requires a PostgreSQL database. You can use a local instance or a cloud provider like [Neon](https://neon.tech) or [Supabase](https://supabase.com).

### 2. Backend Setup
1. Navigate to the `server` directory: `cd server`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env`: `cp .env.example .env`
4. Update the `DATABASE_URL` in the `.env` file with your PostgreSQL connection string.
5. Push the database schema: `npx prisma db push`
6. Start the development server: `npm run dev` (runs on port 5000)

### 3. Frontend Setup
1. Navigate to the `client` directory: `cd client`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev` (runs on port 3000)

## Features
- User authentication (Signup, Login, Logout)
- Create, read, update, and delete tasks
- Start and stop timers for tasks
- View elapsed time and all time logs for a task
- View a daily summary of time tracked and tasks completed
