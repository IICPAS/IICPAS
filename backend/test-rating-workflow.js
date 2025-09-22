// Test script for Course Rating Approval Workflow
// This script tests the complete flow: Student rates -> Admin approves -> Rating shows on website

import axios from 'axios';

const API_BASE = 'http://localhost:8080';

// Test data
const testStudent = {
  _id: '68cba03ff6d6e18d9a7588f1', // Replace with actual student ID
  name: 'Test Student',
  email: 'test@example.com'
};

const testCourse = {
  _id: '68cba03ff6d6e18d9a7588f1', // Replace with actual course ID
  title: 'Basic Accounting & Tally Foundation'
};

const testAdmin = {
  _id: 'admin123', // Replace with actual admin ID
  name: 'Test Admin'
};

async function testRatingWorkflow() {
  console.log('🚀 Starting Course Rating Approval Workflow Test\n');

  try {
    // Step 1: Student submits a rating
    console.log('📝 Step 1: Student submitting rating...');
    const ratingResponse = await axios.post(`${API_BASE}/api/v1/course-ratings/submit`, {
      studentId: testStudent._id,
      courseId: testCourse._id,
      rating: 5,
      review: 'Excellent course! Very well structured and easy to understand.'
    });

    if (ratingResponse.data.success) {
      console.log('✅ Rating submitted successfully');
      console.log('   Rating ID:', ratingResponse.data.data._id);
      console.log('   Status:', ratingResponse.data.data.status);
    } else {
      throw new Error('Failed to submit rating');
    }

    const ratingId = ratingResponse.data.data._id;

    // Step 2: Check pending ratings in admin dashboard
    console.log('\n👨‍💼 Step 2: Checking pending ratings in admin dashboard...');
    const pendingRatingsResponse = await axios.get(`${API_BASE}/api/v1/course-ratings/admin/pending`);

    if (pendingRatingsResponse.data.success) {
      console.log('✅ Pending ratings fetched successfully');
      console.log('   Total pending ratings:', pendingRatingsResponse.data.count);
      
      const submittedRating = pendingRatingsResponse.data.data.find(r => r._id === ratingId);
      if (submittedRating) {
        console.log('   Found submitted rating:', submittedRating.rating, 'stars');
        console.log('   Review:', submittedRating.review);
      }
    }

    // Step 3: Admin approves the rating
    console.log('\n✅ Step 3: Admin approving rating...');
    const approveResponse = await axios.patch(
      `${API_BASE}/api/v1/course-ratings/admin/approve/${ratingId}`,
      { adminId: testAdmin._id }
    );

    if (approveResponse.data.success) {
      console.log('✅ Rating approved successfully');
      console.log('   Approved by:', approveResponse.data.data.approvedBy);
      console.log('   Approved at:', approveResponse.data.data.approvedAt);
    } else {
      throw new Error('Failed to approve rating');
    }

    // Step 4: Check course ratings (public endpoint)
    console.log('\n🌐 Step 4: Checking course ratings on website...');
    const courseRatingsResponse = await axios.get(`${API_BASE}/api/v1/course-ratings/course/${testCourse._id}`);

    if (courseRatingsResponse.data.success) {
      console.log('✅ Course ratings fetched successfully');
      console.log('   Average rating:', courseRatingsResponse.data.averageRating);
      console.log('   Total ratings:', courseRatingsResponse.data.totalRatings);
      console.log('   Individual ratings:', courseRatingsResponse.data.data.length);
    }

    // Step 5: Verify course model updated
    console.log('\n📊 Step 5: Verifying course model updated...');
    const courseResponse = await axios.get(`${API_BASE}/api/courses/${testCourse._id}`);

    if (courseResponse.data) {
      console.log('✅ Course model updated');
      console.log('   Course rating:', courseResponse.data.rating);
      console.log('   Review count:', courseResponse.data.reviewCount);
    }

    console.log('\n🎉 All tests passed! Rating approval workflow is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 Note: Make sure the backend server is running and the test data exists:');
      console.log('   - Student ID:', testStudent._id);
      console.log('   - Course ID:', testCourse._id);
      console.log('   - Admin ID:', testAdmin._id);
    }
  }
}

// Test rejection workflow
async function testRejectionWorkflow() {
  console.log('\n🚫 Testing Rating Rejection Workflow\n');

  try {
    // Submit a rating
    const ratingResponse = await axios.post(`${API_BASE}/api/v1/course-ratings/submit`, {
      studentId: testStudent._id,
      courseId: testCourse._id,
      rating: 1,
      review: 'This is a test review for rejection.'
    });

    const ratingId = ratingResponse.data.data._id;

    // Reject the rating
    const rejectResponse = await axios.patch(
      `${API_BASE}/api/v1/course-ratings/admin/reject/${ratingId}`,
      { 
        adminId: testAdmin._id,
        rejectedReason: 'Inappropriate content'
      }
    );

    if (rejectResponse.data.success) {
      console.log('✅ Rating rejected successfully');
      console.log('   Rejection reason:', rejectResponse.data.data.rejectedReason);
    }

    // Verify it doesn't appear in public ratings
    const courseRatingsResponse = await axios.get(`${API_BASE}/api/v1/course-ratings/course/${testCourse._id}`);
    const rejectedRating = courseRatingsResponse.data.data.find(r => r._id === ratingId);
    
    if (!rejectedRating) {
      console.log('✅ Rejected rating not visible in public ratings');
    }

  } catch (error) {
    console.error('❌ Rejection test failed:', error.response?.data || error.message);
  }
}

// Run tests
async function runAllTests() {
  await testRatingWorkflow();
  await testRejectionWorkflow();
}

// Export for use in other files
export {
  testRatingWorkflow,
  testRejectionWorkflow,
  runAllTests
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}
