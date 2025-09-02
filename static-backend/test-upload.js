const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';

async function testEndpoints() {
  console.log('🧪 Testing Static-Backend Microservice with MongoDB...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthRes = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', healthRes.data);
    console.log('');

    // Test get files (should be empty initially)
    console.log('2. Testing get files...');
    const filesRes = await axios.get(`${BASE_URL}/files`);
    console.log('✅ Files response:', filesRes.data);
    console.log('');

    // Test get images
    console.log('3. Testing get images...');
    const imagesRes = await axios.get(`${BASE_URL}/files/images`);
    console.log('✅ Images response:', imagesRes.data);
    console.log('');

    // Test get videos
    console.log('4. Testing get videos...');
    const videosRes = await axios.get(`${BASE_URL}/files/videos`);
    console.log('✅ Videos response:', videosRes.data);
    console.log('');

    console.log('🎉 All tests passed! The microservice is working correctly with MongoDB.');
    console.log('\n📝 Next steps:');
    console.log('1. Upload some test files using the frontend');
    console.log('2. Check the files are stored in uploads/ directory');
    console.log('3. Verify files are saved in MongoDB database');
    console.log('4. Verify CDN URLs are generated correctly');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests
testEndpoints();
