// Test script to verify student deletion API
const axios = require('axios');

async function testStudentDeletion() {
  try {
    // First, get all students
    console.log('Fetching students...');
    const response = await axios.get('http://localhost:8080/api/v1/students');
    const students = response.data.students;
    
    console.log('Students found:', students.length);
    console.log('First student ID:', students[0]._id);
    
    // Try to delete the first student
    const studentId = students[0]._id;
    console.log('Attempting to delete student with ID:', studentId);
    
    const deleteResponse = await axios.delete(`http://localhost:8080/api/v1/students/${studentId}`);
    console.log('Delete successful:', deleteResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testStudentDeletion();
