import mongoose from "mongoose";
import Course from "./models/Content/Course.js";
import Chapter from "./models/Content/Chapter.js";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/iicpa";

async function fixCourseChapters() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Find the AAT JHAT course by the ObjectId from the API response
    const course = await Course.findById("68cd11866c98555400c47d40");
    if (!course) {
      console.log("Course not found with ObjectId, trying by slug...");
      const courseBySlug = await Course.findOne({ slug: "aat-jhat" });
      if (!courseBySlug) {
        console.log("Course not found by slug either");
        return;
      }
      console.log(
        "Found course by slug:",
        courseBySlug.title,
        "ID:",
        courseBySlug._id
      );

      // Add chapters to this course
      const sampleChapters = [
        { title: "Introduction to AAT", order: 1, status: "Active" },
        { title: "Basic Accounting Principles", order: 2, status: "Active" },
        { title: "Financial Statements", order: 3, status: "Active" },
        { title: "Taxation Fundamentals", order: 4, status: "Active" },
        { title: "Audit and Assurance", order: 5, status: "Active" },
      ];

      // Clear existing chapters and add new ones
      courseBySlug.chapters = [];
      for (const chapterData of sampleChapters) {
        const chapter = new Chapter(chapterData);
        const savedChapter = await chapter.save();
        courseBySlug.chapters.push(savedChapter._id);
        console.log("Added chapter:", chapterData.title);
      }

      await courseBySlug.save();
      console.log("Successfully updated course with chapters");
      return;
    }

    console.log("Found course by ObjectId:", course.title);

    // Add chapters to this course
    const sampleChapters = [
      { title: "Introduction to AAT", order: 1, status: "Active" },
      { title: "Basic Accounting Principles", order: 2, status: "Active" },
      { title: "Financial Statements", order: 3, status: "Active" },
      { title: "Taxation Fundamentals", order: 4, status: "Active" },
      { title: "Audit and Assurance", order: 5, status: "Active" },
    ];

    // Clear existing chapters and add new ones
    course.chapters = [];
    for (const chapterData of sampleChapters) {
      const chapter = new Chapter(chapterData);
      const savedChapter = await chapter.save();
      course.chapters.push(savedChapter._id);
      console.log("Added chapter:", chapterData.title);
    }

    await course.save();
    console.log("Successfully updated course with chapters");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

fixCourseChapters();
