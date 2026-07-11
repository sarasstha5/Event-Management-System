# EventFlow — Event Management System

EventFlow is a full-stack Event Management System built with a React & Tailwind CSS frontend and a Node.js & Express backend using a MySQL database.

---

## Project Structure

*   **`backend/`**: Node.js & Express REST API managing authentication, categories, events, registrations, and user roles.
*   **`Frontend/`**: React, Tailwind CSS, and Lucide Icons frontend application.

---

## 1. Backend Installation & Setup

### A. Database Initialization
This application requires **MySQL**. Set up the schema by executing the following queries in your MySQL client (e.g. phpMyAdmin, MySQL Workbench, or Command Line) to set up the database and tables:

```sql
-- Create and Select Database
CREATE DATABASE IF NOT EXISTS `event_management_db`;
USE `event_management_db`;

-- 1. Users Table (Stores admin and participant accounts)
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `fullname` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'user', -- 'admin' or 'user'
  `profile_image` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Categories Table
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_name` VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Events Table
CREATE TABLE `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `event_name` VARCHAR(255) NOT NULL,
  `category_id` INT NOT NULL,
  `organizer` VARCHAR(255) NOT NULL,
  `event_date` DATE NOT NULL,
  `event_time` TIME NOT NULL,
  `venue` VARCHAR(255) NOT NULL,
  `registration_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `max_participants` INT NOT NULL DEFAULT 0,
  `description` TEXT NOT NULL,
  `banner` VARCHAR(255) NULL,
  FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Registrations Table
CREATE TABLE `registrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `event_id` INT NOT NULL,
  `registration_date` DATE NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Cancelled'
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Default Categories
INSERT INTO `categories` (`category_name`) VALUES 
('Seminar'),
('Workshop'),
('Hackathon'),
('Conference'),
('Sports'),
('Cultural Program');

-- Seed Default Admin Account
-- Password is 'admin123' (hashed using bcryptjs)
INSERT INTO `users` (`fullname`, `email`, `password`, `phone`, `role`, `profile_image`) VALUES
('System Admin', 'admin@event.com', '$2a$10$wN8Ww8M2hF27fB7G.12KBe3y.O0V59s1uS460K7xR4Q9c5yZ9h8.a', '9876543210', 'admin', NULL);
```

### B. Environment Configuration (`.env`)
Create a file named `.env` in the `backend/` directory and populate it with your local configurations:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_DATABASE=event_management_db
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

### C. Run the Backend Server
```bash
cd backend
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

---

## 2. Frontend Installation & Setup

### Run the Development Client
```bash
cd Frontend
npm install
npm run dev
```
The application will start on `http://localhost:5173`.

---

## Key Features

### 🎨 Cvent Navy Color Theme
The styling has been fully adapted to the modern, professional **Cvent Navy** brand palette:
*   **Primary Navy** (`#0F2A4A`) for headers, primary text, and container fills.
*   **Primary Dark Deep Navy** (`#1E4A7A`) for hover actions and page depth.
*   **Steel Blue** (`#8EABC3`) for tags, secondary backgrounds, and card accents.
*   **Accent Orange** (`#FF6A39`) used sparingly for primary buttons, active navigation markers, and call-to-action highlights.

### 🎟️ Ticket-Stub Event Cards
Event list cards are designed like perforated ticket stubs. If an event has a custom banner image, the card dynamically loads it in the background with a dark overlay to maintain text readability. Otherwise, it falls back to a clean Navy gradient style.

### 🔑 User & Admin Roles
*   **Participants**: Register, update profiles, upload profile images, search/filter events, and register for events.
*   **Administrators**: Add/Edit/Delete events and categories, manage registrants, approve or reject registrations, and **promote other users to administrators** directly from the participant dashboard.
