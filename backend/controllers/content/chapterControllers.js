import Chapter from "../../models/Content/Chapter.js";
import Course from "../../models/Content/Course.js";

export const getChaptersByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Handle course lookup by both ObjectId and slug
    let course;
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(courseId);

    if (isValidObjectId) {
      course = await Course.findById(courseId);
    } else {
      course = await Course.findOne({ slug: courseId });
    }

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const chapters = await Chapter.find({
      _id: { $in: course.chapters },
    }).populate("topics");
    res.json(chapters);
  } catch (error) {
    console.error("Error fetching chapters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChapter = async (req, res) => {
  const chapter = await Chapter.findById(req.params.id).populate("topics");
  if (!chapter) return res.status(404).json({ error: "Chapter not found" });
  res.json(chapter);
};

export const createChapter = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Handle course lookup by both ObjectId and slug
    let course;
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(courseId);

    if (isValidObjectId) {
      course = await Course.findById(courseId);
    } else {
      course = await Course.findOne({ slug: courseId });
    }

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const chapter = new Chapter(req.body);
    await chapter.save();

    // Add chapter to course using the course's _id
    await Course.findByIdAndUpdate(course._id, {
      $push: { chapters: chapter._id },
    });
    res.status(201).json(chapter);
  } catch (error) {
    console.error("Error creating chapter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateChapter = async (req, res) => {
  const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!chapter) return res.status(404).json({ error: "Chapter not found" });
  res.json(chapter);
};

export const deleteChapter = async (req, res) => {
  const chapter = await Chapter.findByIdAndDelete(req.params.id);
  if (!chapter) return res.status(404).json({ error: "Chapter not found" });
  // Remove chapter from any course
  await Course.updateMany({}, { $pull: { chapters: chapter._id } });
  res.json({ message: "Chapter deleted" });
};
