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
import leadRoutes from "./routes/leadRoutes.js";

//Import Routes For Content
import testimonialRoutes from "./routes/TestimonialRoutes.js";
import courseRoutes from "./routes/Content/courseRoutes.js";
import chapterRoutes from "./routes/Content/chapterRoutes.js";
import topicRoutes from "./routes/Content/topicRoutes.js";
import quizRoutes from "./routes/Content/quizRoutes.js";
import categoryRoutes from "./routes/Content/categoryRoutes.js";
import LiveSessionRoutes from "./routes/LiveSessionRoutes/LiveSessionRoutes.js";

//Extra Routes
import metaTagRoutes from "./routes/metatagsRoute.js";
import jobRoutes from "./routes/jobRoutes.js";
import aboutRoutes from "./routes/WebsiteRoutes/aboutRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

//TicketRoutes
import ticketRoutes from "./routes/TicketRoutes.js";
import certificationRoutes from "./routes/certificationRoutes.js";

//Individual Routes
import individualRoutes from "./routes/individualRoutes.js";

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
app.use("/api/live-sessions", LiveSessionRoutes);
app.use("/", JobApplyRoutes);

//Content Routes
app.use("/testimonials", testimonialRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/metatags", metaTagRoutes);
app.use("/api/tickets", ticketRoutes);

// Internal Jobs
app.use("/jobs-internal", jobRoutes);

//About Routes
app.use("/api/about", aboutRoutes);

//Ticket Routes
app.use("/api/tickets", ticketRoutes);
app.use("/api/bookings", bookingRoutes);

//Certification Requests
app.use("/api/certification-requests", certificationRoutes);
app.use("/api/v1/individual", individualRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
