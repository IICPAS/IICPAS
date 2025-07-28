# 📘 LMS Backend API – Student Flow

This document lists all REST API routes implemented for the LMS student backend, including authentication, profile, cart, payment, sessions, tickets, and course access.

---

## 🔐 Authentication

| Method | Route                       | Description                       |
| ------ | --------------------------- | --------------------------------- |
| POST   | `/api/v1/student/login`     | Login and set JWT cookie          |
| GET    | `/api/v1/student/isstudent` | Check if student is authenticated |
| GET    | `/api/v1/student/logout`    | Logout and clear cookie           |

---

## 👤 Student Profile

| Method | Route                         | Description                                    |
| ------ | ----------------------------- | ---------------------------------------------- |
| PATCH  | `/api/v1/student/profile/:id` | Update phone, mode, location, center, password |
| GET    | `/api/v1/student/:id/courses` | List all courses the student is enrolled in    |

---

## 🛒 Cart

| Method | Route                     | Description                 |
| ------ | ------------------------- | --------------------------- |
| POST   | `/api/v1/add-cart/:id`    | Add course to cart          |
| GET    | `/api/v1/get-cart/:id`    | Get all cart courses        |
| DELETE | `/api/v1/remove-cart/:id` | Remove one course from cart |
| DELETE | `/api/v1/clear-cart/:id`  | Clear all courses from cart |

---

## 💳 Course Purchase (PhonePe)

| Method | Route                                 | Description                                |
| ------ | ------------------------------------- | ------------------------------------------ |
| POST   | `/api/v1/course-buy/:id`              | Initiate course purchase (ID = studentId)  |
| POST   | `/api/v1/verify-buy/:id`              | Verify payment, store course, send receipt |
| GET    | `/api/v1/list-receipts/:id`           | Get student's receipt history              |
| GET    | `/api/v1/download-receipt/:receiptId` | Download a PDF receipt                     |

---

## 📘 Course Listing

| Method | Route                      | Description                                 |
| ------ | -------------------------- | ------------------------------------------- |
| GET    | `/api/v1/list-courses/:id` | List all active courses (marks if enrolled) |

---

## 📅 Live Session Booking

| Method | Route                            | Description                           |
| ------ | -------------------------------- | ------------------------------------- |
| POST   | `/api/v1/session-buy/:id`        | Initiate live session payment         |
| POST   | `/api/v1/verify-session-buy/:id` | Verify session payment, email receipt |

---

## 🎟 Support Tickets

| Method | Route                             | Description                                      |
| ------ | --------------------------------- | ------------------------------------------------ |
| POST   | `/api/v1/ticket/:id`              | Create support ticket from student ID            |
| GET    | `/api/v1/ticket/:email`           | Get tickets by student email                     |
| GET    | `/api/v1/ticket-name/:ticketId`   | Get ticket details and name by ID                |
| POST   | `/api/v1/ticket-from-student/:id` | Submit ticket using only message from student ID |

---

## 📝 Notes

- All protected routes use **JWT in httpOnly cookies** with secure `sameSite` settings.
- PDF receipts are generated and emailed for course/session purchases.
- All `:id` parameters refer to `studentId` unless otherwise specified.
- Mongoose models: `Student`, `Course`, `LiveSession`, `Receipt`, `Ticket`

---

## 📦 Tech Stack

- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT + Cookie Auth**
- **PDFKit for receipts**
- **Nodemailer for emails**
- **PhonePe API (simulated)**
