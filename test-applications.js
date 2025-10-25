// Test script to verify job application system is working
const axios = require('axios');

const API_URL = 'http://localhost:8080';

async function testApplicationSystem() {
  try {
    console.log('🧪 Testing Job Application System...\n');

    // 1. Test fetching all applications
    console.log('1. Testing fetch all applications...');
    try {
      const allResponse = await axios.get(`${API_URL}/api/apply/jobs-external`);
      console.log('✅ All applications fetched:', allResponse.data.length, 'applications');
      console.log('Applications:', allResponse.data);
    } catch (error) {
      console.log('❌ Error fetching all applications:', error.response?.data || error.message);
    }

    // 2. Test fetching applications by company
    console.log('\n2. Testing fetch applications by company...');
    try {
      const companyResponse = await axios.get(`${API_URL}/api/apply/jobs-external/company/admin@iicpa.com`);
      console.log('✅ Company applications fetched:', companyResponse.data.length, 'applications');
      console.log('Company applications:', companyResponse.data);
    } catch (error) {
      console.log('❌ Error fetching company applications:', error.response?.data || error.message);
    }

    // 3. Test creating a new application
    console.log('\n3. Testing create new application...');
    const testApplication = {
      jobId: '507f1f77bcf86cd799439011', // This will fail but we can see the error
      name: 'Test Applicant',
      email: 'test@example.com',
      phone: '1234567890',
      resumeLink: 'https://example.com/resume.pdf',
      companyEmail: 'admin@iicpa.com'
    };

    try {
      const createResponse = await axios.post(`${API_URL}/api/apply/jobs-external`, testApplication);
      console.log('✅ Application created successfully:', createResponse.data);
    } catch (error) {
      console.log('❌ Error creating application:', error.response?.data || error.message);
    }

    console.log('\n🎉 Test Complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testApplicationSystem();
