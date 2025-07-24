import Category from "../../models/Content/Category.js";

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { category, status } = req.body;

    const newCategory = new Category({ category, status });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update category by ID
export const updateCategory = async (req, res) => {
  try {
    const { category, status } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { category, status },
      { new: true, runValidators: true }
    );
    if (!updatedCategory)
      return res.status(404).json({ error: "Category not found" });
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete category by ID
export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory)
      return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
