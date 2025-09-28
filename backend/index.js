import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import collegeRoutes from "./routes/collegeRoutes.js";
import cookieParser from "cookie-parser";
import companyRoutes from "./routes/CompanyRoutes.js";
import cors from "cors";
import contactRoutesOld from "./routes/contactRoutes.js";
import connectDB from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";
import paymentRoutes from "./routes/PaymentRoutes/paymentRoutes.js";
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
import revisionTestRoutes from "./routes/Content/revisionTestRoutes.js";
import categoryRoutes from "./routes/Content/categoryRoutes.js";
import LiveSessionRoutes from "./routes/LiveSessionRoutes/LiveSessionRoutes.js";
import courseLevelsRoutes from "./routes/courseLevelsRoutes.js";
import groupPricingRoutes from "./routes/groupPricingRoutes.js";

//Extra Routes
import metaTagRoutes from "./routes/metatagsRoute.js";
import jobRoutes from "./routes/jobRoutes.js";
import aboutRoutes from "./routes/WebsiteRoutes/aboutRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

//TicketRoutes
import ticketRoutes from "./routes/TicketRoutes.js";
import certificationRoutes from "./routes/certificationRoutes.js";
import ipWhitelistRoutes from "./routes/ipWhitelistRoutes.js";

//Individual Routes
import individualRoutes from "./routes/individualRoutes.js";

//Jobs Controllers
import JobsCompanyRoutes from "./routes/jobCompanyRoutes.js";
import JobApplicationRoute from "./routes/jobApplicationRoutes.js";
import UploadRoutes from "./routes/uploadRoutes.js";
import centerRoutes from "./routes/centerRoutes.js";

//Topic Routes
import TopicTrainingRoutes from "./routes/TopicRoutes/TopicRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

//Guide Routes
import guideRoutes from "./routes/guideRoutes.js";

//Kit Routes
import kitRoutes from "./routes/kitRoutes.js";

//Newsletter Subscription Routes
import newsletterSubscriptionRoutes from "./routes/newsletterSubscriptionRoutes.js";

//Kit Order Routes
import kitOrderRoutes from "./routes/kitOrderRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

//Import employee routes
import employeeRoutes from "./routes/employeeRoutes.js";

//Contact Info Routes
import contactInfoRoutes from "./routes/contactInfoRoutes.js";

//Contact Form Routes
import contactFormRoutes from "./routes/contactFormRoutes.js";

//App Configuration
dotenv.config();
connectDB();

const app = express();

// CORS configuration

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://www.iicpa.in",
    ], // your frontend URL
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "OK", status: 200 });
});

// Middleware
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res, path) => {
      if (path.endsWith(".mp4")) {
        res.setHeader("Content-Type", "video/mp4");
      } else if (path.endsWith(".webm")) {
        res.setHeader("Content-Type", "video/webm");
      } else if (path.endsWith(".avi")) {
        res.setHeader("Content-Type", "video/x-msvideo");
      }
    },
  })
); // Make uploaded files accessible

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/college", collegeRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/contact-old", contactRoutesOld);
app.use("/api/compaHnies", companyRoutes);
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
app.use("/api/revision-tests", revisionTestRoutes);
app.use("/api/categories", categoryRoutes);

// Assignment and Case Study Routes
import assignmentRoutes from "./routes/assignmentRoutes.js";
import caseStudyRoutes from "./routes/caseStudyRoutes.js";
import gstSimulationRoutes from "./routes/gstSimulationRoutes.js";
app.use("/api/assignments", assignmentRoutes);
app.use("/api/case-studies", caseStudyRoutes);
app.use("/api/gst-simulations", gstSimulationRoutes);

app.use("/metatags", metaTagRoutes);
app.use("/api/tickets", ticketRoutes);

// Internal Jobs
app.use("/api/jobs-internal", jobRoutes);

//About Routes
app.use("/api/about", aboutRoutes);

//Hero Routes
import heroRoutes from "./routes/WebsiteRoutes/heroRoutes.js";
app.use("/api/hero", heroRoutes);

//WhyIICPA Routes
import whyIICPARoutes from "./routes/WebsiteRoutes/whyIICPARoutes.js";
app.use("/api/why-iicpa", whyIICPARoutes);

//Contact Routes
import contactRoutes from "./routes/WebsiteRoutes/contactRoutes.js";
app.use("/api/contact", contactRoutes);

//Footer Routes
import footerRoutes from "./routes/WebsiteRoutes/footerRoutes.js";
import aboutUsRoutes from "./routes/WebsiteRoutes/aboutUsRoutes.js";
app.use("/api/footer", footerRoutes);
app.use("/api/about-us", aboutUsRoutes);

//YellowStatsStrip Routes
import yellowStatsStripRoutes from "./routes/WebsiteRoutes/yellowStatsStripRoutes.js";
app.use("/api/yellow-stats-strip", yellowStatsStripRoutes);

//NewsletterSection Routes
import newsletterSectionRoutes from "./routes/WebsiteRoutes/newsletterSectionRoutes.js";
app.use("/api/newsletter-section", newsletterSectionRoutes);
app.use("/api/newsletter-subscriptions", newsletterSubscriptionRoutes);

//Study Material Routes
import studyMaterialRoutes from "./routes/WebsiteRoutes/studyMaterialRoutes.js";
app.use("/api/v1/website/study-material", studyMaterialRoutes);

//FAQ Routes
import faqRoutes from "./routes/WebsiteRoutes/faqRoutes.js";
app.use("/api/v1/website/faq", faqRoutes);

//Ticket Routes
app.use("/api/tickets", ticketRoutes);
app.use("/api/bookings", bookingRoutes);

//IP Whitelist Routes
app.use("/api/ip-whitelist", ipWhitelistRoutes);

//Certification Requestsimport messageRoutes from "./routes/messageRoutes.js";
app.use("/api/certification-requests", certificationRoutes);
app.use("/api/v1/individual", individualRoutes);

//Jobs External
app.use("/api/jobs-external", JobsCompanyRoutes);
app.use("/api/apply/jobs-external", JobApplicationRoute);

//Student Routes
app.use("/api/v1/students", studentRoutes);

//Center Routes
app.use("/api/v1/centers", centerRoutes);

//Video Routes
app.use("/api/upload", UploadRoutes);

//Payment Routes
app.use("/api/v1/payments", paymentRoutes);

//Topic Routes
app.use("/api/v1/topics-trainings", TopicTrainingRoutes);
app.use("/api/messages", messageRoutes);

//Guide Routes
app.use("/api/v1/guides", guideRoutes);

//Kit Routes
app.use("/api/v1/kits", kitRoutes);

//Kit Order Routes
app.use("/api/v1/kit-orders", kitOrderRoutes);

//Teacher Routes
app.use("/api/v1/teachers", teacherRoutes);

// Use employee routes
app.use("/api/employees", employeeRoutes);

// Course Rating Routes
import courseRatingRoutes from "./routes/courseRatingRoutes.js";
app.use("/api/v1/course-ratings", courseRatingRoutes);

// Course Levels Routes
app.use("/api/course-levels", courseLevelsRoutes);
app.use("/api/group-pricing", groupPricingRoutes);

// Create HTTP server and Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join live session room
  socket.on("join-session", (sessionId) => {
    socket.join(`session-${sessionId}`);
    console.log(`User ${socket.id} joined session ${sessionId}`);
  });

  // Leave live session room
  socket.on("leave-session", (sessionId) => {
    socket.leave(`session-${sessionId}`);
    console.log(`User ${socket.id} left session ${sessionId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io available globally for use in controllers
global.io = io;
//Contact Info Routes
app.use("/api/contact-info", contactInfoRoutes);

//Contact Form Routes
app.use("/api/contact-form", contactFormRoutes);

//Chat Routes
import chatRoutes from "./routes/chatRoutes.js";
app.use("/api/chat", chatRoutes);

//Chatbot Settings Routes
import chatbotSettingsRoutes from "./routes/chatbotSettingsRoutes.js";
app.use("/api/chatbot", chatbotSettingsRoutes);

//Privacy Policy Routes
import privacyPolicyRoutes from "./routes/privacyPolicy.js";
app.use("/api/privacy-policy", privacyPolicyRoutes);

//Refund Policy Routes
import refundPolicyRoutes from "./routes/refundPolicy.js";
app.use("/api/refund-policy", refundPolicyRoutes);

//Terms of Service Routes
import termsOfServiceRoutes from "./routes/termsOfService.js";
app.use("/api/terms-of-service", termsOfServiceRoutes);

//Terms and Conditions Routes
import termsAndConditionsRoutes from "./routes/termsAndConditions.js";
app.use("/api/terms-and-conditions", termsAndConditionsRoutes);

//Confidentiality Policy Routes
import confidentialityPolicyRoutes from "./routes/confidentialityPolicy.js";
app.use("/api/confidentiality-policy", confidentialityPolicyRoutes);

//Disclaimer Policy Routes
import disclaimerPolicyRoutes from "./routes/disclaimerPolicy.js";
app.use("/api/disclaimer-policy", disclaimerPolicyRoutes);

//IICPA Review Routes
import iicpaReviewRoutes from "./routes/iicpaReview.js";
app.use("/api/iicpa-review", iicpaReviewRoutes);

//Cookie Policy Routes
import cookiePolicyRoutes from "./routes/cookiePolicy.js";
app.use("/api/cookie-policy", cookiePolicyRoutes);

// Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
