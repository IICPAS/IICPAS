// Simple Demo Course Addition
import mongoose from 'mongoose';

async function addCourse() {
  try {
    await mongoose.connect('mongodb://localhost:27017/iicpas');
    console.log('Connected to MongoDB');

    const Course = mongoose.model('Course', new mongoose.Schema({
      title: String,
      description: String,
      instructor: String,
      price: Number,
      rating: Number,
      reviewCount: Number,
      studentsEnrolled: Number,
      isActive: Boolean
    }));

    const newCourse = new Course({
      title: 'Digital Marketing Masterclass',
      description: 'Complete digital marketing course covering SEO, SEM, Social Media Marketing, Content Marketing, and Analytics.',
      instructor: 'John Smith',
      price: 2999,
      rating: 4.5,
      reviewCount: 2,
      studentsEnrolled: 4,
      isActive: true
    });

    await newCourse.save();
    console.log('✅ Demo course created:', newCourse.title);
    console.log('📝 Course ID:', newCourse._id);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

addCourse();
