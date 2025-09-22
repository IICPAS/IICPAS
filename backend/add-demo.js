// Quick Demo Data Insertion Script
import mongoose from 'mongoose';
import CourseRating from './models/CourseRating.js';
import Course from './models/Content/Course.js';

async function addDemoData() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/iicpas');
    console.log('Connected to MongoDB');

    // Add demo ratings directly
    const demoRatings = [
      {
        _id: new mongoose.Types.ObjectId(),
        studentId: new mongoose.Types.ObjectId('68cba03ff6d6e18d9a7588f1'),
        courseId: new mongoose.Types.ObjectId('68cba03ff6d6e18d9a7588f1'),
        rating: 5,
        review: 'Excellent course! Very well structured and informative.',
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        studentId: new mongoose.Types.ObjectId('68cba03ff6d6e18d9a7588f2'),
        courseId: new mongoose.Types.ObjectId('68cba03ff6d6e18d9a7588f1'),
        rating: 4,
        review: 'Good course, learned a lot about accounting principles.',
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: new mongoose.Types.ObjectId(),
        studentId: new mongoose.Types.ObjectId('68cba03ff6d6e18d9a7588f3'),
        courseId: new mongoose.Types.ObjectId('68cba03ff6d6e18d9a7588f1'),
        rating: 5,
        review: 'Amazing content and great instructor support!',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert demo ratings
    await CourseRating.insertMany(demoRatings);
    console.log('Demo ratings added successfully');

    // Update course with average rating
    await Course.findByIdAndUpdate('68cba03ff6d6e18d9a7588f1', {
      rating: 4.5,
      reviewCount: 2
    });
    console.log('Course rating updated');

    console.log('✅ Demo data setup completed!');
    console.log('📊 Added 3 ratings: 2 approved, 1 pending');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

addDemoData();
