import express from "express";
import {
  getAllNews,
  createNews,
  deleteNews,
} from "../controllers/newsController.js";

const router = express.Router();

router.get("/", getAllNews);
router.post("/", createNews);
router.delete("/:id", deleteNews);

export default router;
