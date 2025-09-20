import mongoose from "mongoose";
import Course from "./models/Content/Course.js";
import Chapter from "./models/Content/Chapter.js";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/iicpa";

async function addSampleChapters() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // List all courses to see what's available
    const allCourses = await Course.find({});
    console.log(
      "All courses in database:",
      allCourses.map((c) => ({ _id: c._id, title: c.title, slug: c.slug }))
    );

    // Find or create the AAT JHAT course
    let course = await Course.findOne({ slug: "aat-jhat" });
    if (!course) {
      // Create the AAT JHAT course
      course = new Course({
        title: "AAT JHAT",
        slug: "aat-jhat",
        category: "Easy",
        price: 20000,
        level: "Professional Level",
        discount: 10,
        status: "Active",
        description: "<p>Case Study</p><p><br></p>",
        examCert: "<p>Case Study</p>",
        caseStudy: "<p>Case Study</p>",
        seoTitle:
          "IICPA – Best Accounting Institute with Job Guarantee in India",
        seoKeywords:
          "IICPA – Best Accounting Institute with Job Guarantee in India",
        chapters: [],
      });
      await course.save();
      console.log("Created new course:", course.title);
    }

    console.log("Found course:", course.title);

    // Sample chapters for AAT JHAT course
    const sampleChapters = [
      {
        title: "Introduction to AAT",
        order: 1,
        status: "Active",
      },
      {
        title: "Basic Accounting Principles",
        order: 2,
        status: "Active",
      },
      {
        title: "Financial Statements",
        order: 3,
        status: "Active",
      },
      {
        title: "Taxation Fundamentals",
        order: 4,
        status: "Active",
      },
      {
        title: "Audit and Assurance",
        order: 5,
        status: "Active",
      },
    ];

    // Clear existing chapters
    course.chapters = [];
    await course.save();

    // Create and add new chapters
    for (const chapterData of sampleChapters) {
      const chapter = new Chapter(chapterData);
      const savedChapter = await chapter.save();

      course.chapters.push(savedChapter._id);
      console.log("Added chapter:", chapterData.title);
    }

    await course.save();
    console.log("Successfully added all chapters to the course");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

addSampleChapters();
