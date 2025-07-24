import Course from "../../models/Content/Course.js";

export const getAllCourses = async (req, res) => {
  const courses = await Course.find().populate("chapters");
  res.json(courses);
};

export const getCourse = async (req, res) => {
  const course = await Course.findById(req.params.id).populate("chapters");
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json(course);
};

export const createCourse = async (req, res) => {
  try {
    const {
      category,
      title,
      price,
      level,
      discount,
      status,
      description,
      chapters,
    } = req.body;

    let imageUrl = "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const course = new Course({
      category,
      title,
      price,
      image: imageUrl, // Store file path/url
      level,
      discount,
      status,
      description,
      chapters,
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCourse = async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json(course);
};

export const deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  res.json({ message: "Course deleted" });
};
