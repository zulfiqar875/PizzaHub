🍕 Pizza Hub — Full Stack Online Ordering System

Author: Zulfiqar BHi
Stack: React (Frontend) · PHP (Backend) · MySQL (Database) · Bootstrap (UI)

🧠 Project Motivation

Food ordering has become a daily digital activity. Most systems either focus on restaurants or require third-party integration for delivery tracking. Pizza Hub was built as a complete standalone platform — allowing both users and administrators to perform all operations inside one ecosystem.

The motivation was to design a modern, responsive, and secure full-stack web app where:

Users can browse food categories, order online, and track delivery status.

Admins can manage menu items, monitor orders, and analyze daily performance.

This project demonstrates core full-stack development concepts, including:

Session-based authentication

CRUD operations with relational databases

RESTful API design

Role-based access control (Admin/User)

Real-time order tracking simulation

🎯 Objectives

Develop a responsive food ordering platform using React & PHP.

Implement user authentication and session management.

Provide a complete admin dashboard for order, product, and category management.

Allow users to track their orders visually.

Display daily/weekly/monthly reports for administrators.

Maintain clean code organization with scalable folder structure.

✨ Key Features
👤 User Panel

Register / Login / Logout (with validation)

Browse menu by categories: Pizza, Fast Food, Drinks

Add / Remove products from cart

Review order before placing it

Enter delivery address

Receive visual order confirmation and tracking updates

My Orders: View all orders + live status progress bar

Auto-refreshing order updates

👑 Admin Panel

Secure Login / Logout

Dashboard with analytics cards:

Total Categories · Total Products · Total Users · Today’s Orders

Manage Categories (Add/Edit/Delete)

Manage Products (CRUD + Image URLs)

Manage Orders (View, Update Status, Comments)

Generate Daily · Weekly · Monthly Reports

Invoice / Billing View

🧾 System Features

Session-based authentication (PHP sessions)

Role-based access control (Admin/User)

MySQL-based persistent data storage

Bootstrap-based responsive UI

REST-style JSON API endpoints

🏗️ Tech Stack
Layer	Technology
Frontend	React 18 (Vite) + Bootstrap 5 + Bootstrap Icons
Backend	PHP 8.2 (XAMPP)
Database	MySQL
Authentication	PHP Sessions
Server Environment	Apache (XAMPP)
Communication	JSON API via fetch/axios
Styling	Bootstrap 5 · Custom CSS
🗂️ Folder Structure
pizza-hub/
│
├── frontend/                   # React UI (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/                # API client helper (fetch wrapper)
│   │   ├── components/         # Navbar, Footer, Layout, etc.
│   │   ├── context/            # Auth context (session management)
│   │   ├── pages/              # All pages (Cart, Menu, Tracker, Admin, etc.)
│   │   ├── styles.css          # Custom global styles
│   │   └── main.jsx            # React entry point
│   ├── vite.config.js          # Vite dev server + proxy config
│   └── package.json
│
└── backend/                    # PHP API
    ├── config/
    │   ├── db.php              # Database connection (MySQL)
    │   └── session.php         # Session start & cookie configuration
    ├── lib/
    │   └── auth.php            # Authentication helper (require_login / require_admin)
    ├── public/                 # Public API endpoints
    │   ├── register.php
    │   ├── login.php
    │   ├── logout.php
    │   ├── products.php
    │   ├── categories.php
    │   ├── cart.php
    │   ├── orders.php
    │   ├── order_status.php
    │   ├── admin_stats.php
    │   └── reports.php
    └── pizzahub.sql            # Database schema & seed data

🗃️ Database Design

Database: pizzahub

Tables
Table	Description	Key Columns
users	Stores user and admin accounts	id, name, email, password_hash, role
categories	Menu categories	id, name
products	Menu items	id, category_id, name, description, price, image_url
carts	Active cart per user	id, user_id
cart_items	Items in each cart	id, cart_id, product_id, quantity
orders	Orders placed	id, user_id, status, subtotal, tax, delivery_fee, total, delivery_address, tracker_code, placed_at
order_items	Items within each order	id, order_id, product_id, name_snapshot, price_snapshot, quantity
order_status_history	Status updates timeline	id, order_id, status, note, changed_at
invoices	Order billing info	id, order_id, invoice_number, paid
⚙️ Installation Guide
1️⃣ Prerequisites

Node v16 +

XAMPP (Apache + MySQL)

Browser (Chrome recommended)

2️⃣ Backend Setup (PHP + MySQL)

Copy the backend folder into XAMPP:

C:\xampp\htdocs\pizzahub-api\


Start Apache and MySQL from XAMPP Control Panel.

Import the database:

Open http://localhost/phpmyadmin

Create a database named pizzahub

Import the file pizzahub.sql

Edit DB config in backend/config/db.php:

$mysqli = new mysqli("localhost", "root", "", "pizzahub");


Test:
Visit http://localhost:88/pizzahub-api/public/register.php

→ should return {"error":"Method not allowed"} ✅

3️⃣ Frontend Setup (React Vite)

Open terminal in project root:

cd frontend


Install dependencies:

npm install


Run dev server:

npm run dev


Visit: http://localhost:5173

4️⃣ API Proxy Configuration

In vite.config.js, ensure:

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/pizzahub-api': {
        target: 'http://localhost:88',
        changeOrigin: true,
      },
    },
  },
});

👑 Default Admin Account
Email	Password	Role
admin@pizzahub.local	admin123	admin
💻 Development Commands
Task	Command
Install Dependencies	npm install
Run Development Server	npm run dev
Build Production	npm run build
Preview Build	npm run preview
🚀 Usage Workflow
For Users

Register or Login.

Browse menu by category.

Add items to cart.

Open Cart → click Review & Checkout.

Enter address → Confirm Order.

View Order Confirmation screen.

Track status via My Orders page (with icons and progress bar).

For Admin

Login as Admin.

Manage categories and products.

View orders and update status (Pending → Delivered).

Monitor dashboard cards & reports.

Generate invoices and analyze performance.

🖼️ UI Highlights
Screen	Description
Home	Menu list by category
Cart	Editable cart + checkout modal
Confirmation	Animated success screen
My Orders	Visual status progress bar
Admin Dashboard	Cards + Recent Orders
Product Management	CRUD interface
🔒 Security Implementation

All backend APIs require session authentication.

Admin APIs protected via require_admin().

Passwords hashed using password_hash() and password_verify().

Session cookies set with httponly + samesite=Lax.

Basic input validation for user inputs (email, password, name, etc).

📈 Reporting and Invoice Module

Admin can view sales for any period (daily, weekly, monthly).

Each order auto-generates an invoice (INV-YYYYMMDD-<id>).

Unpaid/Paid status supported.

Reports summarized with totals and counts.

🧠 Learning Outcomes

From this project, students learn to:

Build and structure a modern React frontend.

Implement secure session-based PHP APIs.

Handle CRUD and authentication flows end-to-end.

Design normalized MySQL schemas.

Manage roles and authorization logic.

Integrate Bootstrap UI for responsive design.

🧭 Future Enhancements

✅ Online payment gateway integration

✅ Push/email notifications for status updates

✅ Multi-restaurant support

✅ Real-time updates (WebSocket)

✅ Dark mode theme

✅ Mobile-first PWA support

🧾 License

Free for educational and non-commercial use.
