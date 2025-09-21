// Simple API Test
import axios from 'axios';

async function testAPI() {
  try {
    console.log('Testing basic server...');
    const response = await axios.get('http://localhost:8080');
    console.log('Server response:', response.data);
    
    console.log('\nTesting course levels...');
    const levelsResponse = await axios.get('http://localhost:8080/api/course-levels');
    console.log('Course levels:', levelsResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAPI();
