// Test Center Management API
import axios from 'axios';

async function testCenterAPI() {
  try {
    console.log('🧪 Testing Center Management API...\n');

    // Test 1: Get available courses
    console.log('1️⃣ Testing available courses...');
    const coursesResponse = await axios.get('http://localhost:8080/api/v1/centers/courses');
    console.log('✅ Available courses:', coursesResponse.data);

    // Test 2: Get public centers
    console.log('\n2️⃣ Testing public centers...');
    const centersResponse = await axios.get('http://localhost:8080/api/v1/centers/public');
    console.log('✅ Public centers:', centersResponse.data);

    console.log('\n🎉 Center Management API is working!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testCenterAPI();
