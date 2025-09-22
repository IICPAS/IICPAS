// Demo Data Setup Script for Course Rating System
// This script adds sample data for testing the rating workflow

import mongoose from 'mongoose';
import CourseRating from './models/CourseRating.js';
import Course from './models/Content/Course.js';
import Student from './models/Students.js';

const API_BASE = 'http://localhost:8080';

// Demo data
const demoRatings = [
  {
    studentId: '68cba03ff6d6e18d9a7588f1',
    courseId: '68cba03ff6d6e18d9a7588f1',
    rating: 5,
    review: 'Excellent course! Very well structured and informative.',
    status: 'approved'
  },
  {
    studentId: '68cba03ff6d6e18d9a7588f2',
    courseId: '68cba03ff6d6e18d9a7588f1',
    rating: 4,
    review: 'Good course, learned a lot about accounting principles.',
    status: 'approved'
  },
  {
    studentId: '68cba03ff6d6e18d9a7588f3',
    courseId: '68cba03ff6d6e18d9a7588f1',
    rating: 5,
    review: 'Amazing content and great instructor support!',
    status: 'pending'
  },
  {
    studentId: '68cba03ff6d6e18d9a7588f4',
    courseId: '68cba03ff6d6e18d9a7588f1',
    rating: 3,
    review: 'Average course, could be better.',
    status: 'rejected',
    rejectedReason: 'Inappropriate language used in review'
  }
];

async function setupDemoData() {
  try {
    console.log('🚀 Setting up demo data for Course Rating System...\n');

    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/iicpas', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing ratings
    await CourseRating.deleteMany({});
    console.log('🧹 Cleared existing ratings');

    // Add demo ratings
    for (const ratingData of demoRatings) {
      const rating = new CourseRating(ratingData);
      await rating.save();
      console.log(`✅ Added ${ratingData.status} rating: ${ratingData.rating} stars`);
    }

    // Update course with average rating
    const approvedRatings = await CourseRating.find({ 
      courseId: '68cba03ff6d6e18d9a7588f1', 
      status: 'approved' 
    });

    if (approvedRatings.length > 0) {
      const averageRating = approvedRatings.reduce((sum, r) => sum + r.rating, 0) / approvedRatings.length;
      
      await Course.findByIdAndUpdate('68cba03ff6d6e18d9a7588f1', {
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: approvedRatings.length
      });
      
      console.log(`✅ Updated course rating: ${Math.round(averageRating * 10) / 10} stars (${approvedRatings.length} reviews)`);
    }

    console.log('\n🎉 Demo data setup completed!');
    console.log('\n📊 Summary:');
    console.log(`- Total ratings: ${demoRatings.length}`);
    console.log(`- Approved: ${demoRatings.filter(r => r.status === 'approved').length}`);
    console.log(`- Pending: ${demoRatings.filter(r => r.status === 'pending').length}`);
    console.log(`- Rejected: ${demoRatings.filter(r => r.status === 'rejected').length}`);

    console.log('\n🧪 Test URLs:');
    console.log('1. Course Ratings API: http://localhost:8080/api/v1/course-ratings/course/68cba03ff6d6e18d9a7588f1');
    console.log('2. Admin Dashboard: http://localhost:3000/admin-dashboard');
    console.log('3. Course Page: http://localhost:3000/course/hr-certification');
    console.log('4. Student Dashboard: http://localhost:3000/student-dashboard');

  } catch (error) {
    console.error('❌ Error setting up demo data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDemoData();
}

export { setupDemoData };
