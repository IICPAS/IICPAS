// Add New Demo Course Script
import mongoose from 'mongoose';
import Course from './models/Content/Course.js';
import CourseRating from './models/CourseRating.js';

async function addDemoCourse() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/iicpas');
    console.log('Connected to MongoDB');

    // Create new demo course
    const demoCourse = new Course({
      _id: new mongoose.Types.ObjectId(),
      title: 'Digital Marketing Masterclass',
      description: 'Complete digital marketing course covering SEO, SEM, Social Media Marketing, Content Marketing, and Analytics.',
      instructor: 'John Smith',
      duration: '8 weeks',
      level: 'Intermediate',
      price: 2999,
      originalPrice: 4999,
      discount: 40,
      category: 'Marketing',
      tags: ['Digital Marketing', 'SEO', 'Social Media', 'Analytics'],
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
      videoUrl: 'https://www.youtube.com/watch?v=demo',
      rating: 0,
      reviewCount: 0,
      studentsEnrolled: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await demoCourse.save();
    console.log('✅ Demo course created:', demoCourse.title);
    console.log('📝 Course ID:', demoCourse._id);

    // Add demo ratings for this course
    const demoRatings = [
      {
        _id: new mongoose.Types.ObjectId(),
        studentId: new mongoose.Types.ObjectId('68cba03ff6d6e18d9a7588f1'),
        courseId: demoCourse._id,
        rating: 5,
        review: 'Amazing course! Learned so much about digital marketing strategies.',
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        studentId: new mongoose.Types.ObjectId('68cba03ff6d6e18d9a7588f2'),
        courseId: demoCourse._id,
        rating: 4,
        review: 'Great content and practical examples. Highly recommended!',
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        studentId: new mongoose.Types.ObjectId('68cba03ff6d6e18d9a7588f3'),
        courseId: demoCourse._id,
        rating: 5,
        review: 'Best digital marketing course I have taken. Instructor is excellent!',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        studentId: new mongoose.Types.ObjectId('68cba03ff6d6e18d9a7588f4'),
        courseId: demoCourse._id,
        rating: 3,
        review: 'Good course but could use more hands-on projects.',
        status: 'rejected',
        rejectedReason: 'Review needs to be more constructive',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert demo ratings
    await CourseRating.insertMany(demoRatings);
    console.log('✅ Demo ratings added for new course');

    // Update course with average rating
    await Course.findByIdAndUpdate(demoCourse._id, {
      rating: 4.5,
      reviewCount: 2,
      studentsEnrolled: 4
    });
    console.log('✅ Course rating updated: 4.5 stars (2 reviews)');

    console.log('\n🎉 Demo Course Setup Completed!');
    console.log('\n📊 Course Details:');
    console.log(`- Title: ${demoCourse.title}`);
    console.log(`- ID: ${demoCourse._id}`);
    console.log(`- Rating: 4.5 stars`);
    console.log(`- Reviews: 2 approved, 1 pending, 1 rejected`);
    console.log(`- Price: ₹${demoCourse.price} (${demoCourse.discount}% off)`);

    console.log('\n🧪 Test URLs:');
    console.log(`1. Course Page: http://localhost:3000/course/${demoCourse._id}`);
    console.log(`2. Course Ratings API: http://localhost:8080/api/v1/course-ratings/course/${demoCourse._id}`);
    console.log('3. Admin Dashboard: http://localhost:3000/admin-dashboard');
    console.log('4. Student Dashboard: http://localhost:3000/student-dashboard');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  addDemoCourse();
}

export { addDemoCourse };
