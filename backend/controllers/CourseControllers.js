import Course from "../models/Content/Course.js";
import Subject from "../models/Content/Subject.js";
import Chapter from "../models/Content/Chapter.js";
import Subchapter from "../models/Content/SubChapter.js";
import Topic from "../models/Content/Topic.js";
import Quiz from "../models/Content/Quiz.js";

// controllers/courseController.js
export const createCourse = async (req, res) => {
  try {
    const { title, price } = req.body;
    const previewImage = req.file?.filename || null;

    const subjects = JSON.parse(req.body.subjects); // ✅ fix

    const subjectIds = [];

    for (const subjectData of subjects) {
      const chapterIds = [];

      for (const chapterData of subjectData.chapters || []) {
        const subchapterIds = [];

        for (const subchapterData of chapterData.subchapters || []) {
          const topicIds = [];

          for (const topicData of subchapterData.topics || []) {
            let quiz = null;

            if (topicData.quiz) {
              quiz = await Quiz.create({ questions: topicData.quiz.questions });
            }

            const topic = await Topic.create({
              title: topicData.title,
              contents: topicData.contents,
              quiz: quiz ? quiz._id : null,
            });

            topicIds.push(topic._id);
          }

          const subchapter = await Subchapter.create({
            title: subchapterData.title,
            topics: topicIds,
          });

          subchapterIds.push(subchapter._id);
        }

        const chapter = await Chapter.create({
          title: chapterData.title,
          subchapters: subchapterIds,
        });

        chapterIds.push(chapter._id);
      }

      const subject = await Subject.create({
        title: subjectData.title,
        chapters: chapterIds,
      });

      subjectIds.push(subject._id);
    }

    const course = await Course.create({
      title,
      price,
      previewImage,
      subjects: subjectIds,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("Error saving course:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate({
      path: "subjects",
      populate: {
        path: "chapters",
        populate: {
          path: "subchapters",
          populate: {
            path: "topics",
            populate: {
              path: "quiz",
            },
          },
        },
      },
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
