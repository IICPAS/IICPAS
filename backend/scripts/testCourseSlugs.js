import mongoose from "mongoose";
import Course from "../models/Content/Course.js";
import connectDB from "../config/db.js";

/**
 * Test script to verify course slugs and navigation
 */
async function testCourseSlugs() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Create test courses with proper slugs
    const testCourses = [
      {
        title: "Basic Accounting & Tally Foundation",
        slug: "basic-accounting-tally-foundation",
        category: "Accounting",
        price: 5000,
        level: "Professional Level",
        discount: 5,
        status: "Active",
        description: "Master the fundamentals of accounting and Tally software",
      },
      {
        title: "HR Certification Course",
        slug: "hr-certification-course",
        category: "HR",
        price: 1000,
        level: "Professional Level",
        discount: 10,
        status: "Active",
        description: "Comprehensive HR certification with practical skills",
      },
      {
        title: "Excel Certification Course",
        slug: "excel-certification-course",
        category: "Accounting",
        price: 2000,
        level: "Professional Level",
        discount: 0,
        status: "Active",
        description: "Advanced Excel skills for professionals",
      },
    ];

    console.log("🧪 Creating test courses with slugs:\n");

    for (const courseData of testCourses) {
      // Check if course already exists
      const existingCourse = await Course.findOne({ slug: courseData.slug });

      if (existingCourse) {
        console.log(
          `✅ Course already exists: "${courseData.title}" → ${courseData.slug}`
        );
      } else {
        const course = new Course(courseData);
        await course.save();
        console.log(
          `✅ Created course: "${courseData.title}" → ${courseData.slug}`
        );
      }
    }

    // Test finding courses by slug
    console.log("\n🔍 Testing course lookup by slug:\n");

    for (const courseData of testCourses) {
      const foundCourse = await Course.findOne({ slug: courseData.slug });
      if (foundCourse) {
        console.log(
          `✅ Found course by slug "${courseData.slug}": "${foundCourse.title}"`
        );
      } else {
        console.log(`❌ Course not found by slug: ${courseData.slug}`);
      }
    }

    // Test the API endpoint simulation
    console.log("\n🌐 Testing API endpoint simulation:\n");

    const allCourses = await Course.find({ status: "Active" });
    console.log(`Total active courses: ${allCourses.length}`);

    allCourses.forEach((course) => {
      console.log(`- "${course.title}" → /course/${course.slug}`);
    });

    console.log("\n✅ Course slug testing completed successfully!");
    console.log("\n📝 Frontend navigation URLs:");
    allCourses.forEach((course) => {
      console.log(
        `- Clicking on "${course.title}" will navigate to: /course/${course.slug}`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during testing:", error);
    process.exit(1);
  }
}

// Run the test
testCourseSlugs();
