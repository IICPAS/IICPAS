import CourseRating from "../models/CourseRating.js";
import Course from "../models/Content/Course.js";
import Student from "../models/Students.js";
import mongoose from "mongoose";

// Get all pending ratings for admin approval
export const getPendingRatings = async (req, res) => {
  try {
    const pendingRatings = await CourseRating.find({ status: "pending" })
      .populate("studentId", "name email")
      .populate("courseId", "title category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: pendingRatings,
      count: pendingRatings.length,
    });
  } catch (error) {
    console.error("Error fetching pending ratings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending ratings",
      error: error.message,
    });
  }
};

// Get all ratings (approved, pending, rejected) for admin
export const getAllRatings = async (req, res) => {
  try {
    const { status, courseId, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (courseId) filter.courseId = courseId;

    const ratings = await CourseRating.find(filter)
      .populate("studentId", "name email")
      .populate("courseId", "title category")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CourseRating.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: ratings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total,
      },
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ratings",
      error: error.message,
    });
  }
};

// Approve a rating
export const approveRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { adminId } = req.body;

    const rating = await CourseRating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }

    if (rating.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Rating is not pending for approval",
      });
    }

    // Update rating status
    rating.status = "approved";
    rating.approvedBy = adminId || new mongoose.Types.ObjectId();
    rating.approvedAt = new Date();
    await rating.save();

    // Update course average rating
    await updateCourseRating(rating.courseId);

    res.status(200).json({
      success: true,
      message: "Rating approved successfully",
      data: rating,
    });
  } catch (error) {
    console.error("Error approving rating:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve rating",
      error: error.message,
    });
  }
};

// Reject a rating
export const rejectRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { adminId, rejectedReason } = req.body;

    const rating = await CourseRating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }

    if (rating.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Rating is not pending for approval",
      });
    }

    // Update rating status
    rating.status = "rejected";
    rating.approvedBy = adminId || new mongoose.Types.ObjectId();
    rating.approvedAt = new Date();
    rating.rejectedReason = rejectedReason || "Rating rejected by admin";
    await rating.save();

    res.status(200).json({
      success: true,
      message: "Rating rejected successfully",
      data: rating,
    });
  } catch (error) {
    console.error("Error rejecting rating:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject rating",
      error: error.message,
    });
  }
};

// Student submits a rating
export const submitRating = async (req, res) => {
  try {
    const { studentId, courseId, rating, review } = req.body;

    // Validate input
    if (!studentId || !courseId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Student ID, Course ID, and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if student is enrolled in the course
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.course.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Student is not enrolled in this course",
      });
    }

    // Check if student has already rated this course
    const existingRating = await CourseRating.findOne({
      studentId: studentId,
      courseId: courseId,
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this course",
      });
    }

    // Create new rating
    const newRating = new CourseRating({
      studentId,
      courseId,
      rating,
      review: review || "",
      status: "pending",
    });

    await newRating.save();

    // Populate the response
    await newRating.populate("studentId", "name email");
    await newRating.populate("courseId", "title category");

    res.status(201).json({
      success: true,
      message: "Rating submitted successfully and is pending approval",
      data: newRating,
    });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit rating",
      error: error.message,
    });
  }
};

// Get approved ratings for a course (for public display)
export const getCourseRatings = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    let actualCourseId = courseId;

    // Check if courseId is a valid ObjectId, if not, treat it as a slug and find the course
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      const Course = (await import("../models/Content/Course.js")).default;
      const course = await Course.findOne({ slug: courseId });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
      actualCourseId = course._id;
    }

    const ratings = await CourseRating.find({
      courseId: actualCourseId,
      status: "approved",
    })
      .populate("studentId", "name")
      .sort({ approvedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CourseRating.countDocuments({
      courseId: actualCourseId,
      status: "approved",
    });

    // Calculate average rating
    const avgRating = await CourseRating.aggregate([
      {
        $match: {
          courseId: new mongoose.Types.ObjectId(actualCourseId),
          status: "approved",
        },
      },
      {
        $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } },
      },
    ]);

    res.status(200).json({
      success: true,
      data: ratings,
      averageRating: avgRating[0]?.average || 0,
      totalRatings: avgRating[0]?.count || 0,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total,
      },
    });
  } catch (error) {
    console.error("Error fetching course ratings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch course ratings",
      error: error.message,
    });
  }
};

// Helper function to update course average rating
const updateCourseRating = async (courseId) => {
  try {
    const avgRating = await CourseRating.aggregate([
      {
        $match: {
          courseId: new mongoose.Types.ObjectId(courseId),
          status: "approved",
        },
      },
      {
        $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } },
      },
    ]);

    if (avgRating.length > 0) {
      await Course.findByIdAndUpdate(courseId, {
        rating: Math.round(avgRating[0].average * 10) / 10, // Round to 1 decimal
        reviewCount: avgRating[0].count,
      });
    } else {
      // If no approved ratings, reset course rating
      await Course.findByIdAndUpdate(courseId, {
        rating: 0,
        reviewCount: 0,
      });
    }
  } catch (error) {
    console.error("Error updating course rating:", error);
    // Don't throw error, just log it
  }
};

// Get student's ratings
export const getStudentRatings = async (req, res) => {
  try {
    const { studentId } = req.params;

    const ratings = await CourseRating.find({ studentId })
      .populate("courseId", "title category image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: ratings,
    });
  } catch (error) {
    console.error("Error fetching student ratings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student ratings",
      error: error.message,
    });
  }
};
