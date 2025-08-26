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
