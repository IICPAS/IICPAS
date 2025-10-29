import UniversityCourse from "../models/UniversityCourse.js";

// @desc    Get all university courses
// @route   GET /api/university-courses
export const getAllUniversityCourses = async (req, res) => {
  try {
    const courses = await UniversityCourse.find().sort({
      category: 1,
      name: 1,
    });
    res.json(courses);
  } catch (error) {
    console.error("Error fetching university courses:", error);
    res.status(500).json({ error: "Failed to fetch university courses" });
  }
};

// @desc    Get university course by slug
// @route   GET /api/university-courses/:slug
export const getUniversityCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await UniversityCourse.findOne({ slug });

    if (!course) {
      return res.status(404).json({ error: "University course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching university course:", error);
    res.status(500).json({ error: "Failed to fetch university course" });
  }
};

// @desc    Create new university course
// @route   POST /api/university-courses
export const createUniversityCourse = async (req, res) => {
  try {
    const courseData = req.body;

    // Check if slug already exists
    const existingCourse = await UniversityCourse.findOne({
      slug: courseData.slug,
    });
    if (existingCourse) {
      return res
        .status(400)
        .json({ error: "Course with this slug already exists" });
    }

    const newCourse = new UniversityCourse(courseData);
    await newCourse.save();

    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating university course:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Course with this slug already exists" });
    }
    res
      .status(400)
      .json({ error: error.message || "Failed to create university course" });
  }
};

// @desc    Update university course by slug
// @route   PUT /api/university-courses/:slug
export const updateUniversityCourse = async (req, res) => {
  try {
    const { slug } = req.params;
    const updateData = req.body;

    // If slug is being updated, check if new slug already exists
    if (updateData.slug && updateData.slug !== slug) {
      const existingCourse = await UniversityCourse.findOne({
        slug: updateData.slug,
      });
      if (existingCourse) {
        return res
          .status(400)
          .json({ error: "Course with this slug already exists" });
      }
    }

    const updatedCourse = await UniversityCourse.findOneAndUpdate(
      { slug },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "University course not found" });
    }

    res.json(updatedCourse);
  } catch (error) {
    console.error("Error updating university course:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "Course with this slug already exists" });
    }
    res
      .status(400)
      .json({ error: error.message || "Failed to update university course" });
  }
};

// @desc    Delete university course by slug
// @route   DELETE /api/university-courses/:slug
export const deleteUniversityCourse = async (req, res) => {
  try {
    const { slug } = req.params;
    const deletedCourse = await UniversityCourse.findOneAndDelete({ slug });

    if (!deletedCourse) {
      return res.status(404).json({ error: "University course not found" });
    }

    res.json({ message: "University course deleted successfully" });
  } catch (error) {
    console.error("Error deleting university course:", error);
    res.status(500).json({ error: "Failed to delete university course" });
  }
};
