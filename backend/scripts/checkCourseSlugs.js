import mongoose from "mongoose";
import Course from "../models/Content/Course.js";
import connectDB from "../config/db.js";

/**
 * Script to check existing course slugs in the database
 */
async function checkCourseSlugs() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    const courses = await Course.find({});
    console.log(`\n📋 Found ${courses.length} courses in database:\n`);

    if (courses.length === 0) {
      console.log("No courses found in database.");
      return;
    }

    courses.forEach((course, index) => {
      console.log(`${index + 1}. Course Details:`);
      console.log(`   Title: "${course.title}"`);
      console.log(`   Slug: "${course.slug || '❌ NO SLUG'}"`);
      console.log(`   ID: ${course._id}`);
      console.log(`   Category: ${course.category}`);
      console.log(`   Status: ${course.status}`);
      console.log(`   Price: ₹${course.price}`);
      console.log("");
    });

    // Check which courses have slugs
    const coursesWithSlugs = courses.filter(course => course.slug && course.slug.trim());
    const coursesWithoutSlugs = courses.filter(course => !course.slug || !course.slug.trim());

    console.log("📊 Summary:");
    console.log(`- Total courses: ${courses.length}`);
    console.log(`- Courses with slugs: ${coursesWithSlugs.length}`);
    console.log(`- Courses without slugs: ${coursesWithoutSlugs.length}`);

    if (coursesWithoutSlugs.length > 0) {
      console.log("\n❌ Courses missing slugs:");
      coursesWithoutSlugs.forEach(course => {
        console.log(`   - "${course.title}" (ID: ${course._id})`);
      });
    }

    if (coursesWithSlugs.length > 0) {
      console.log("\n✅ Courses with slugs:");
      coursesWithSlugs.forEach(course => {
        console.log(`   - "${course.title}" → ${course.slug}`);
      });
    }

    process.exit(0);

  } catch (error) {
    console.error("❌ Error checking course slugs:", error);
    process.exit(1);
  }
}

// Run the check
checkCourseSlugs();
