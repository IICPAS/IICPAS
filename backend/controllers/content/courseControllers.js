import Course from "../../models/Content/Course.js";
import Student from "../../models/Students.js";

export const getAllCourses = async (req, res) => {
  const courses = await Course.find().populate("chapters");
  res.json(courses);
};

export const getStudentCourses = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find student and populate their enrolled courses
    const student = await Student.findById(studentId).populate({
      path: "course",
      populate: {
        path: "chapters",
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({
      courses: student.course || [],
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    console.error("Error fetching student courses:", error);
    res.status(500).json({ error: "Failed to fetch student courses" });
  }
};

export const getAvailableCourses = async (req, res) => {
  try {
    // Get all active courses
    const courses = await Course.find({ status: "Active" }).populate(
      "chapters"
    );
    res.json(courses);
  } catch (error) {
    console.error("Error fetching available courses:", error);
    res.status(500).json({ error: "Failed to fetch available courses" });
  }
};

export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the id is a valid ObjectId format
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    let course;
    if (isValidObjectId) {
      // If it's a valid ObjectId, search by _id
      course = await Course.findById(id).populate("chapters");
    } else {
      // If it's not a valid ObjectId, search by slug
      course = await Course.findOne({ slug: id }).populate("chapters");
    }

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

export const createCourse = async (req, res) => {
  try {
    // Destructure all expected fields from req.body
    const {
      category,
      title,
      price,
      slug,
      level,
      discount,
      status,
      description,
      examCert,
      caseStudy,
      video,
      seoTitle,
      seoKeywords,
      seoDescription,
      chapters, // optional
      pricing, // dynamic pricing configuration
      tabs, // dynamic tab configuration
    } = req.body;

    // Handle uploaded image (if present)
    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Create course document
    const course = new Course({
      category,
      title,
      slug,
      price,
      image: imageUrl,
      level,
      discount,
      status,
      description,
      examCert,
      caseStudy,
      video,
      seoTitle,
      seoKeywords,
      seoDescription,
      chapters,
      pricing,
      tabs,
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    // Prepare update data
    const updateData = { ...req.body };

    // Handle uploaded image (if present)
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const course = await Course.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json({ message: "Course deleted" });
};

export const toggleCourseStatus = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Toggle status
    course.status = course.status === "Active" ? "Inactive" : "Active";
    await course.save();

    res.json({
      message: "Course status updated successfully",
      course: course,
      newStatus: course.status,
    });
  } catch (error) {
    console.error("Error toggling course status:", error);
    res.status(500).json({ error: "Failed to toggle course status" });
  }
};
