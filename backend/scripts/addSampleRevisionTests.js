import mongoose from "mongoose";
import dotenv from "dotenv";
import RevisionTest from "../models/Content/RevisionTest.js";
import Course from "../models/Content/Course.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const addSampleRevisionTests = async () => {
  try {
    // Get all courses
    const courses = await Course.find({ status: "Active" });
    console.log(`Found ${courses.length} active courses`);

    if (courses.length === 0) {
      console.log("No active courses found. Please create courses first.");
      return;
    }

    const sampleTests = [];

    // Create revision tests for each course
    for (const course of courses) {
      const levels = ["Level 1", "Level 2", "Level 3", "Pro"];
      
      for (const level of levels) {
        const test = {
          course: course._id,
          level: level,
          title: `${course.title} - ${level}`,
          timeLimit: 15, // 15 minutes
          questions: [
            {
              question: `What is the main topic of ${course.title}?`,
              options: ["Topic A", "Topic B", "Topic C", "Topic D"],
              correctAnswer: "Topic A",
              explanation: "This is the main topic covered in this course."
            },
            {
              question: `Which level is ${level}?`,
              options: ["Beginner", "Intermediate", "Advanced", "Expert"],
              correctAnswer: level === "Level 1" ? "Beginner" : level === "Level 2" ? "Intermediate" : level === "Level 3" ? "Advanced" : "Expert",
              explanation: `${level} corresponds to this difficulty level.`
            },
            {
              question: "How many questions are in this test?",
              options: ["3", "4", "5", "6"],
              correctAnswer: "3",
              explanation: "This test contains 3 questions."
            }
          ],
          status: "active"
        };
        
        sampleTests.push(test);
      }
    }

    // Clear existing revision tests
    await RevisionTest.deleteMany({});
    console.log("Cleared existing revision tests");

    // Insert new revision tests
    const insertedTests = await RevisionTest.insertMany(sampleTests);
    console.log(`✅ Added ${insertedTests.length} revision tests`);

    // Display summary
    for (const course of courses) {
      const courseTests = insertedTests.filter(test => test.course.toString() === course._id.toString());
      console.log(`📚 ${course.title}: ${courseTests.length} tests (${courseTests.map(t => t.level).join(", ")})`);
    }

  } catch (error) {
    console.error("❌ Error adding sample revision tests:", error);
  }
};

const main = async () => {
  await connectDB();
  await addSampleRevisionTests();
  mongoose.connection.close();
  console.log("✅ Script completed");
};

main();
