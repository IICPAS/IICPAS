// Test script to verify job application system
const axios = require('axios');

const API_URL = 'http://localhost:8080/api/v1';

async function testJobApplicationSystem() {
  try {
    console.log('🧪 Testing Job Application System...\n');

    // 1. Test creating a job application
    console.log('1. Testing job application creation...');
    const testApplication = {
      jobId: '507f1f77bcf86cd799439011', // Replace with actual job ID
      name: 'Test Applicant',
      email: 'test@example.com',
      phone: '1234567890',
      resumeLink: 'https://example.com/resume.pdf',
      companyEmail: 'company@example.com'
    };

    try {
      const createResponse = await axios.post(`${API_URL}/apply/jobs-external`, testApplication);
      console.log('✅ Application created successfully:', createResponse.data);
    } catch (error) {
      console.log('❌ Error creating application:', error.response?.data || error.message);
    }

    // 2. Test fetching applications by company
    console.log('\n2. Testing fetching applications by company...');
    try {
      const fetchResponse = await axios.get(`${API_URL}/apply/jobs-external/company/company@example.com`);
      console.log('✅ Applications fetched successfully:', fetchResponse.data);
      console.log(`📊 Total applications: ${fetchResponse.data.length}`);
    } catch (error) {
      console.log('❌ Error fetching applications:', error.response?.data || error.message);
    }

    // 3. Test fetching all applications
    console.log('\n3. Testing fetching all applications...');
    try {
      const allResponse = await axios.get(`${API_URL}/apply/jobs-external`);
      console.log('✅ All applications fetched successfully:', allResponse.data);
      console.log(`📊 Total applications: ${allResponse.data.length}`);
    } catch (error) {
      console.log('❌ Error fetching all applications:', error.response?.data || error.message);
    }

    console.log('\n🎉 Job Application System Test Complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testJobApplicationSystem();
