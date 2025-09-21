// Simple Test Script for Course Rating System
import axios from 'axios';

const API_BASE = 'http://localhost:8080';

async function testCourseRatingAPI() {
  console.log('🧪 Testing Course Rating System...\n');

  try {
    // Test 1: Get course ratings
    console.log('1️⃣ Testing Course Ratings API...');
    const response = await axios.get(`${API_BASE}/api/v1/course-ratings/course/68cba03ff6d6e18d9a7588f1`);
    console.log('✅ Course Ratings API Response:', response.data);
    
    // Test 2: Submit a test rating
    console.log('\n2️⃣ Testing Rating Submission...');
    const submitResponse = await axios.post(`${API_BASE}/api/v1/course-ratings/submit`, {
      studentId: '68cba03ff6d6e18d9a7588f1',
      courseId: '68cba03ff6d6e18d9a7588f1',
      rating: 5,
      review: 'Test rating from demo script'
    });
    console.log('✅ Rating Submission Response:', submitResponse.data);

    // Test 3: Get student ratings
    console.log('\n3️⃣ Testing Student Ratings API...');
    const studentResponse = await axios.get(`${API_BASE}/api/v1/course-ratings/student/68cba03ff6d6e18d9a7588f1`);
    console.log('✅ Student Ratings Response:', studentResponse.data);

    console.log('\n🎉 All tests passed! System is working properly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testCourseRatingAPI();
