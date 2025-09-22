// Test Rating Approval API
import axios from 'axios';

async function testRatingApproval() {
  console.log('🧪 Testing Rating Approval API...\n');

  try {
    // First, get pending ratings
    console.log('1️⃣ Getting pending ratings...');
    const pendingResponse = await axios.get('http://localhost:8080/api/v1/course-ratings/admin/pending', {
      headers: {
        'Authorization': 'Bearer test-admin-token',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Pending ratings:', pendingResponse.data);

    if (pendingResponse.data.data && pendingResponse.data.data.length > 0) {
      const ratingId = pendingResponse.data.data[0]._id;
      console.log(`\n2️⃣ Testing approval for rating: ${ratingId}`);

      // Test approval
      const approveResponse = await axios.patch(
        `http://localhost:8080/api/v1/course-ratings/admin/approve/${ratingId}`,
        { adminId: 'test-admin-id' },
        {
          headers: {
            'Authorization': 'Bearer test-admin-token',
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✅ Rating approved:', approveResponse.data);
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testRatingApproval();
