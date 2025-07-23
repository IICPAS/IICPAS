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
import blogRoutes from "./routes/blogRoutes.js";
import JobAdminRoutes from "./routes/JobAdminRoutes.js";
import JobApplyRoutes from "./routes/JobApplyRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
//App Configuration
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

app.get("/", (req, res) => {
  res.json({ message: "OK", status: 200 });
});

// Middleware
app.use("/uploads", express.static("uploads")); // Make uploaded images accessible

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/courses", courseRoutes);
app.use("/api/college", collegeRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api", alertRoutes);
app.use("/api/news", newsRoutes);
app.use("/api", leadRoutes);
app.use("/", JobAdminRoutes);
app.use("/", JobApplyRoutes);
// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
