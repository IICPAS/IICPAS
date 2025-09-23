import mongoose from "mongoose";
import Course from "../models/Content/Course.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/iicpa"
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const dummyCourses = [
  {
    category: "Accounting",
    title: "Basic Accounting & Tally Foundation",
    slug: "basic-accounting-tally",
    price: 5000,
    discount: 5,
    level: "Foundation",
    status: "Active",
    description:
      "<p>Master the fundamentals of accounting and Tally software with practical examples and real-world scenarios.</p>",
    examCert:
      "<p>Get certified in Basic Accounting & Tally with our comprehensive assessment program.</p>",
    caseStudy:
      "<p>Real-world case studies to enhance your practical understanding of accounting principles.</p>",
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    seoTitle: "Basic Accounting & Tally Foundation Course - IICPA",
    seoKeywords: "accounting, tally, foundation, course, certification",
    seoDescription:
      "<p>Learn basic accounting and Tally software from industry experts. Get certified and advance your career.</p>",
    pricing: {
      recordedSession: {
        title: "DIGITAL HUB+RECORDED SESSION",
        buttonText: "Add Digital Hub",
      },
      liveSession: {
        title: "DIGITAL HUB+LIVE SESSION",
        buttonText: "Add Digital Hub+",
        priceMultiplier: 1.5,
      },
    },
    tabs: {
      syllabus: { label: "Syllabus" },
      assignment: { label: "Assignment" },
      assessment: { label: "Assessment & Certificates" },
      schedule: { label: "Live Schedule +" },
      simulator: { label: "Simulator" },
    },
  },
  {
    category: "HR",
    title: "HR Certification Course",
    slug: "hr-certification",
    price: 1000,
    discount: 10,
    level: "Core",
    status: "Active",
    description:
      "<p>Comprehensive HR certification with practical skills and industry insights.</p>",
    examCert:
      "<p>Earn your HR certification with our rigorous assessment program.</p>",
    caseStudy:
      "<p>Case studies from leading HR professionals to enhance your learning.</p>",
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    seoTitle: "HR Certification Course - Professional Development",
    seoKeywords: "hr, human resources, certification, course, professional",
    seoDescription:
      "<p>Advance your HR career with our comprehensive certification course.</p>",
    pricing: {
      recordedSession: {
        title: "DIGITAL HUB+RECORDED SESSION",
        buttonText: "Add Digital Hub",
      },
      liveSession: {
        title: "DIGITAL HUB+LIVE SESSION",
        buttonText: "Add Digital Hub+",
        priceMultiplier: 1.5,
      },
    },
    tabs: {
      syllabus: { label: "Syllabus" },
      assignment: { label: "Assignment" },
      assessment: { label: "Assessment & Certificates" },
      schedule: { label: "Live Schedule +" },
      simulator: { label: "Simulator" },
    },
  },
  {
    category: "Finance",
    title: "Excel Certification Course",
    slug: "excel-certification",
    price: 2000,
    discount: 0,
    level: "Expert",
    status: "Active",
    description:
      "<p>Advanced Excel skills for professionals. Master complex formulas, data analysis, and automation.</p>",
    examCert:
      "<p>Get certified in Excel with our comprehensive testing program.</p>",
    caseStudy: "<p>Real-world Excel projects to showcase your skills.</p>",
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    seoTitle: "Excel Certification Course - Advanced Skills",
    seoKeywords: "excel, certification, advanced, skills, data analysis",
    seoDescription:
      "<p>Master advanced Excel skills and get certified for professional success.</p>",
    pricing: {
      recordedSession: {
        title: "DIGITAL HUB+RECORDED SESSION",
        buttonText: "Add Digital Hub",
      },
      liveSession: {
        title: "DIGITAL HUB+LIVE SESSION",
        buttonText: "Add Digital Hub+",
        priceMultiplier: 1.5,
      },
    },
    tabs: {
      syllabus: { label: "Syllabus" },
      assignment: { label: "Assignment" },
      assessment: { label: "Assessment & Certificates" },
      schedule: { label: "Live Schedule +" },
      simulator: { label: "Simulator" },
    },
  },
  {
    category: "Finance",
    title: "Finance Management Course",
    slug: "finance-management",
    price: 3500,
    discount: 15,
    level: "Core",
    status: "Active",
    description:
      "<p>Complete guide to financial management and analysis for business professionals.</p>",
    examCert:
      "<p>Earn your finance management certification with industry-recognized credentials.</p>",
    caseStudy:
      "<p>Analyze real financial scenarios and develop strategic solutions.</p>",
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    seoTitle: "Finance Management Course - Business Finance",
    seoKeywords: "finance, management, business, analysis, certification",
    seoDescription:
      "<p>Master financial management principles and advance your business career.</p>",
    pricing: {
      recordedSession: {
        title: "DIGITAL HUB+RECORDED SESSION",
        buttonText: "Add Digital Hub",
      },
      liveSession: {
        title: "DIGITAL HUB+LIVE SESSION",
        buttonText: "Add Digital Hub+",
        priceMultiplier: 1.5,
      },
    },
    tabs: {
      syllabus: { label: "Syllabus" },
      assignment: { label: "Assignment" },
      assessment: { label: "Assessment & Certificates" },
      schedule: { label: "Live Schedule +" },
      simulator: { label: "Simulator" },
    },
  },
  {
    category: "Accounting",
    title: "US CMA Certification Prep",
    slug: "us-cma-certification",
    price: 8000,
    discount: 20,
    level: "Expert",
    status: "Active",
    description:
      "<p>Comprehensive preparation for US CMA certification with expert guidance and practice tests.</p>",
    examCert:
      "<p>Prepare for and pass the US CMA exam with our proven methodology.</p>",
    caseStudy:
      "<p>Advanced case studies to prepare you for the CMA exam scenarios.</p>",
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    seoTitle: "US CMA Certification Preparation Course",
    seoKeywords: "cma, certification, us, accounting, management",
    seoDescription:
      "<p>Prepare for US CMA certification with our comprehensive course and expert guidance.</p>",
    pricing: {
      recordedSession: {
        title: "DIGITAL HUB+RECORDED SESSION",
        buttonText: "Add Digital Hub",
      },
      liveSession: {
        title: "DIGITAL HUB+LIVE SESSION",
        buttonText: "Add Digital Hub+",
        priceMultiplier: 1.5,
      },
    },
    tabs: {
      syllabus: { label: "Syllabus" },
      assignment: { label: "Assignment" },
      assessment: { label: "Assessment & Certificates" },
      schedule: { label: "Live Schedule +" },
      simulator: { label: "Simulator" },
    },
  },
];

const addDummyCourses = async () => {
  try {
    await connectDB();

    // Clear existing courses (optional - remove this if you want to keep existing data)
    // await Course.deleteMany({});

    // Add dummy courses
    for (const courseData of dummyCourses) {
      const course = new Course(courseData);
      await course.save();
      console.log(`Added course: ${course.title}`);
    }

    console.log("All dummy courses added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error adding dummy courses:", error);
    process.exit(1);
  }
};

addDummyCourses();
