const axios = require("axios");

async function addCourseToStudent(studentId, courseId) {
  try {
    console.log(`🎓 Adding course ${courseId} to student ${studentId}...`);

    const response = await axios.post(
      `http://localhost:8080/api/v1/students/add-course/${studentId}`,
      {
        courseId: courseId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Course added successfully!");
    console.log("Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Failed to add course:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

// Example usage:
// addCourseToStudent('689ebbbb9120c7ef8043a31b', '68828b16b3e4bed1e024de43');

// Export for use in other files
module.exports = { addCourseToStudent };

// If running directly, you can uncomment the line below and modify the IDs
// addCourseToStudent('YOUR_STUDENT_ID', 'YOUR_COURSE_ID');
