// Comprehensive API Test
import axios from 'axios';

async function testAllAPIs() {
  console.log('🧪 Testing All APIs...\n');

  // Test 1: Basic server
  try {
    const response = await axios.get('http://localhost:8080');
    console.log('✅ Server Status:', response.data);
  } catch (error) {
    console.error('❌ Server Error:', error.message);
  }

  // Test 2: Course Levels API
  try {
    const response = await axios.get('http://localhost:8080/api/course-levels');
    console.log('✅ Course Levels API:', response.data);
  } catch (error) {
    console.error('❌ Course Levels API Error:', error.response?.status, error.response?.data);
  }

  // Test 3: Course Ratings API
  try {
    const response = await axios.get('http://localhost:8080/api/v1/course-ratings/course/68cba03ff6d6e18d9a7588f1');
    console.log('✅ Course Ratings API:', response.data);
  } catch (error) {
    console.error('❌ Course Ratings API Error:', error.response?.status, error.response?.data);
  }

  // Test 4: Admin Ratings API (without auth)
  try {
    const response = await axios.get('http://localhost:8080/api/v1/course-ratings/admin/pending');
    console.log('✅ Admin Ratings API:', response.data);
  } catch (error) {
    console.error('❌ Admin Ratings API Error:', error.response?.status, error.response?.data);
  }
}

testAllAPIs();
