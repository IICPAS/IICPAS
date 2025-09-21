// Test Course Levels API
import axios from 'axios';

async function testCourseLevels() {
  try {
    console.log('Testing Course Levels API...');
    const response = await axios.get('http://localhost:8080/api/course-levels');
    console.log('✅ Course Levels API Response:', response.data);
  } catch (error) {
    console.error('❌ Course Levels API Error:', error.response?.data || error.message);
  }
}

testCourseLevels();
