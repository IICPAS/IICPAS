import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../controllers/content/categoryController.js";

const router = express.Router();

// GET /api/categories — get all categories
router.get("/", getAllCategories);

// GET /api/categories/:id — get single category by ID
router.get("/:id", getCategoryById);

// POST /api/categories — create new category
router.post("/", createCategory);

// PUT /api/categories/:id — update category
router.put("/:id", updateCategory);

// DELETE /api/categories/:id — delete category
router.delete("/:id", deleteCategory);

export default router;
