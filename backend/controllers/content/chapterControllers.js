import Chapter from "../../models/Content/Chapter.js";
import Course from "../../models/Content/Course.js";

export const getChaptersByCourse = async (req, res) => {
  const chapters = await Chapter.find({
    _id: { $in: (await Course.findById(req.params.courseId)).chapters },
  }).populate("topics");
  res.json(chapters);
};

export const getChapter = async (req, res) => {
  const chapter = await Chapter.findById(req.params.id).populate("topics");
  if (!chapter) return res.status(404).json({ error: "Chapter not found" });
  res.json(chapter);
};

export const createChapter = async (req, res) => {
  const chapter = new Chapter(req.body);
  await chapter.save();
  // Add chapter to course
  await Course.findByIdAndUpdate(req.params.courseId, {
    $push: { chapters: chapter._id },
  });
  res.status(201).json(chapter);
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
