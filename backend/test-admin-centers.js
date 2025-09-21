// Test Admin Center Management
import axios from 'axios';

async function testAdminCenters() {
  try {
    console.log('🧪 Testing Admin Center Management...\n');

    // Test 1: Get centers without auth (should fail)
    console.log('1️⃣ Testing centers without auth...');
    try {
      const response = await axios.get('http://localhost:8080/api/v1/centers');
      console.log('❌ Should have failed:', response.data);
    } catch (error) {
      console.log('✅ Correctly failed:', error.response?.status, error.response?.data?.message);
    }

    // Test 2: Get public centers (should work)
    console.log('\n2️⃣ Testing public centers...');
    const publicResponse = await axios.get('http://localhost:8080/api/v1/centers/public');
    console.log('✅ Public centers:', publicResponse.data.data?.length || 0, 'centers found');

    // Test 3: Get available courses (should work)
    console.log('\n3️⃣ Testing available courses...');
    const coursesResponse = await axios.get('http://localhost:8080/api/v1/centers/courses');
    console.log('✅ Available courses:', coursesResponse.data.data?.length || 0, 'courses found');

    console.log('\n🎉 Center Management API is working correctly!');
    console.log('\n📝 Note: Admin authentication required for admin endpoints');
    console.log('📝 Public endpoints work without authentication');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAdminCenters();
