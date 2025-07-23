import Blog from "../models/Blogs.js";

// CREATE
export const createBlog = async (req, res) => {
  try {
    const { title, author, content } = req.body;
    console.log(req.body);
    let imageUrl = "";
    if (req.file) {
      imageUrl = req.file.path.replace(/\\/g, "/"); // fix for windows path
    }
    const blog = new Blog({ title, author, content, imageUrl });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateBlog = async (req, res) => {
  try {
    const { title, author, content } = req.body;
    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path.replace(/\\/g, "/");
    }
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not found" });
    blog.title = title ?? blog.title;
    blog.author = author ?? blog.author;
    blog.content = content ?? blog.content;
    if (imageUrl) blog.imageUrl = imageUrl;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
