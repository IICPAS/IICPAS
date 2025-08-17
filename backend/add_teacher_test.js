// Test script to add a teacher to the database
import axios from "axios";

const API_BASE = "http://localhost:8080";

const testTeacher = {
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@example.com",
  password: "password123",
  phone: "+1234567890",
  specialization: "Computer Science",
  experience: 8,
  qualification: "PhD in Computer Science",
  bio: "Experienced computer science professor with expertise in web development, data science, and machine learning. Passionate about teaching and helping students succeed in their careers.",
};

async function addTestTeacher() {
  try {
    console.log("Adding test teacher...");
    const response = await axios.post(
      `${API_BASE}/api/v1/teachers/register`,
      testTeacher
    );
    console.log("Teacher added successfully:", response.data);
    console.log("You can now login with:");
    console.log("Email:", testTeacher.email);
    console.log("Password:", testTeacher.password);
  } catch (error) {
    console.error(
      "Error adding teacher:",
      error.response?.data || error.message
    );
  }
}

addTestTeacher();
