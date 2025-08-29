import RevisionTest from "../../models/Content/RevisionTest.js";
import Course from "../../models/Content/Course.js";

// Get all revision tests
const getAllRevisionTests = async (req, res) => {
  try {
    const revisionTests = await RevisionTest.find()
      .populate("course", "name category level")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: revisionTests });
  } catch (error) {
    console.error("Error fetching revision tests:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get revision tests by course
const getRevisionTestsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const revisionTests = await RevisionTest.find({
      course: courseId,
      status: "active",
    }).populate("course", "name category level");

    res.json({ success: true, data: revisionTests });
  } catch (error) {
    console.error("Error fetching revision tests by course:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get single revision test
const getRevisionTest = async (req, res) => {
  try {
    const { id } = req.params;
    const revisionTest = await RevisionTest.findById(id).populate(
      "course",
      "name category level"
    );

    if (!revisionTest) {
      return res
        .status(404)
        .json({ success: false, message: "Revision test not found" });
    }

    res.json({ success: true, data: revisionTest });
  } catch (error) {
    console.error("Error fetching revision test:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create revision test
const createRevisionTest = async (req, res) => {
  try {
    const { course, level, title, timeLimit, questions } = req.body;

    const revisionTest = new RevisionTest({
      course,
      level,
      title,
      timeLimit,
      questions,
      totalQuestions: questions.length,
    });

    await revisionTest.save();

    const populatedTest = await RevisionTest.findById(
      revisionTest._id
    ).populate("course", "name category level");

    res.status(201).json({ success: true, data: populatedTest });
  } catch (error) {
    console.error("Error creating revision test:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update revision test
const updateRevisionTest = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.questions) {
      updateData.totalQuestions = updateData.questions.length;
    }

    updateData.updatedAt = new Date();

    const revisionTest = await RevisionTest.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("course", "name category level");

    if (!revisionTest) {
      return res
        .status(404)
        .json({ success: false, message: "Revision test not found" });
    }

    res.json({ success: true, data: revisionTest });
  } catch (error) {
    console.error("Error updating revision test:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete revision test
const deleteRevisionTest = async (req, res) => {
  try {
    const { id } = req.params;
    const revisionTest = await RevisionTest.findByIdAndDelete(id);

    if (!revisionTest) {
      return res
        .status(404)
        .json({ success: false, message: "Revision test not found" });
    }

    res.json({ success: true, message: "Revision test deleted successfully" });
  } catch (error) {
    console.error("Error deleting revision test:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Toggle revision test status
const toggleRevisionTestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const revisionTest = await RevisionTest.findById(id);

    if (!revisionTest) {
      return res
        .status(404)
        .json({ success: false, message: "Revision test not found" });
    }

    revisionTest.status =
      revisionTest.status === "active" ? "inactive" : "active";
    revisionTest.updatedAt = new Date();
    await revisionTest.save();

    const populatedTest = await RevisionTest.findById(id).populate(
      "course",
      "name category level"
    );

    res.json({ success: true, data: populatedTest });
  } catch (error) {
    console.error("Error toggling revision test status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get available courses for revision tests
const getAvailableCourses = async (req, res) => {
  try {
    console.log("Fetching courses...");
    console.log("Course model:", Course);

    // Test if we can find any documents
    const count = await Course.countDocuments();
    console.log("Total course count:", count);

    const allCourses = await Course.find({});
    console.log("All courses:", allCourses.length);
    console.log("Sample course status:", allCourses[0]?.status);

    // Try different status values
    const activeCourses = await Course.find({ status: "Active" });
    console.log("Active courses (exact):", activeCourses.length);

    const activeCoursesLower = await Course.find({ status: "active" });
    console.log("Active courses (lowercase):", activeCoursesLower.length);

    // Get all courses regardless of status for now
    const courses = await Course.find({})
      .select("title category level status")
      .sort({ title: 1 });

    console.log("Final courses:", courses.length);
    console.log("Courses data:", courses);

    res.json({ success: true, data: courses });
  } catch (error) {
    console.error("Error fetching available courses:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export {
  getAllRevisionTests,
  getRevisionTestsByCourse,
  getRevisionTest,
  createRevisionTest,
  updateRevisionTest,
  deleteRevisionTest,
  toggleRevisionTestStatus,
  getAvailableCourses,
};
