import express from "express";
import path from "path";

import dotenv from "dotenv";
import collegeRoutes from "./routes/collegeRoutes.js";
import cookieParser from "cookie-parser";
import companyRoutes from "./routes/CompanyRoutes.js";
import cors from "cors";
import contactRoutes from "./routes/contactRoutes.js";
import connectDB from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // your frontend URL
    credentials: true,
  })
);

// Middleware
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/college", collegeRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/companies", companyRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
