// Add ratings for the new demo course
import mongoose from 'mongoose';

async function addRatingsForNewCourse() {
  try {
    await mongoose.connect('mongodb://localhost:27017/iicpas');
    console.log('Connected to MongoDB');

    const CourseRating = mongoose.model('CourseRating', new mongoose.Schema({
      studentId: mongoose.Schema.Types.ObjectId,
      courseId: mongoose.Schema.Types.ObjectId,
      rating: Number,
      review: String,
      status: String,
      rejectedReason: String
    }));

    const courseId = '68d02d9650e72fd791996223';
    
    const ratings = [
      {
        studentId: new mongoose.Types.ObjectId('68cba03ff6d6e18d9a7588f1'),
        courseId: new mongoose.Types.ObjectId(courseId),
        rating: 5,
        review: 'Amazing course! Learned so much about digital marketing strategies.',
        status: 'approved'
      },
      {
        studentId: new mongoose.Types.ObjectId('68cba03ff6d6e18d9a7588f2'),
        courseId: new mongoose.Types.ObjectId(courseId),
        rating: 4,
        review: 'Great content and practical examples. Highly recommended!',
        status: 'approved'
      },
      {
        studentId: new mongoose.Types.ObjectId('68cba03ff6d6e18d9a7588f3'),
        courseId: new mongoose.Types.ObjectId(courseId),
        rating: 5,
        review: 'Best digital marketing course I have taken. Instructor is excellent!',
        status: 'pending'
      }
    ];

    await CourseRating.insertMany(ratings);
    console.log('✅ Ratings added for new course');
    console.log('📊 Added 3 ratings: 2 approved, 1 pending');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

addRatingsForNewCourse();
