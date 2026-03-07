# StayLux — Luxury Room Booking System

A full-stack hotel room booking system built with Node.js, Express,
MySQL, React, and Tailwind CSS.

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS      |
| Backend   | Node.js, Express.js (ES6 modules) |
| Database  | MySQL 8.0                         |
| Auth      | JWT + bcryptjs                    |
| HTTP      | Axios                             |

---

## Prerequisites

Make sure you have these installed:

- Node.js v18 or higher  ->  https://nodejs.org
- MySQL 8.0 or higher    ->  https://dev.mysql.com/downloads
- Git                    ->  https://git-scm.com

Check versions:
  node --version
  mysql --version
  git --version

---

## Setup Instructions

STEP 1 — Clone the Repository

  git clone https://github.com/YOUR_USERNAME/room-booking.git
  cd room-booking

STEP 2 — Setup the Database

Open MySQL in CMD (NOT PowerShell):
  mysql -u root -p

Run inside MySQL:
  CREATE DATABASE room_booking;
  EXIT;

Load the schema (still in CMD):
  cd backend
  mysql -u root -p room_booking < config/schema.sql

STEP 3 — Setup Backend

  cd backend
  npm install

Create a file called .env inside the backend folder:

  PORT=5000
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=root
  DB_PASSWORD=your_mysql_password
  DB_NAME=room_booking
  JWT_SECRET=mysupersecretkey123
  JWT_EXPIRES_IN=7d
  FRONTEND_URL=http://localhost:5173

STEP 4 — Setup Frontend

  cd frontend
  npm install

Create a file called .env inside the frontend folder:

  VITE_API_URL=http://localhost:5000/api

---

## Running the App

Open TWO CMD windows:

Window 1 — Backend:
  cd C:\Users\DELL\Desktop\room-booking\backend
  npm run dev

You should see:
  MySQL connected successfully
  Server running on http://localhost:5000

Window 2 — Frontend:
  cd C:\Users\DELL\Desktop\room-booking\frontend
  npm run dev

You should see:
  VITE ready
  Local: http://localhost:5173

Open browser: http://localhost:5173

---

## API Endpoints

AUTH
  POST   /api/auth/register      Register new user
  POST   /api/auth/login         Login user
  GET    /api/auth/me            Get current user (auth required)

ROOMS
  GET    /api/rooms              Get all rooms
  GET    /api/rooms/:id          Get room by ID
  GET    /api/rooms/:id/availability   Check dates availability

BOOKINGS (all require auth token)
  POST   /api/bookings           Create new booking
  GET    /api/bookings/my        Get my bookings
  DELETE /api/bookings/:id       Cancel booking

---

## Database Tables

users:    id, name, email, password, role, created_at
rooms:    id, name, description, price_per_night, capacity,
          amenities, image_url, is_available, created_at
bookings: id, user_id, room_id, check_in_date, check_out_date,
          total_price, status, created_at

---

## Project Structure

room-booking/
  backend/
    config/         database.js, schema.sql
    controllers/    authController.js, bookingController.js, roomController.js
    middleware/     auth.js, validate.js
    routes/         auth.js, bookings.js, rooms.js
    services/       authService.js, bookingService.js, roomService.js
    utils/          response.js
    server.js
    package.json
    .env

  frontend/
    src/
      api/          client.js, index.js
      components/   Navbar.jsx, RoomCard.jsx, BookingCard.jsx
      context/      AuthContext.jsx
      pages/        Login.jsx, Register.jsx, Dashboard.jsx,
                    RoomDetail.jsx, MyBookings.jsx
      App.jsx
      main.jsx
      index.css
    package.json
    .env

---

## Postman

Import StayLux.postman_collection.json into Postman.
Run Register first — token saves automatically.
All other requests use the token automatically.

---

Built with Node.js + React + MySQL