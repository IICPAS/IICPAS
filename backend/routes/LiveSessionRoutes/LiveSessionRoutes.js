import express from "express";
import {
  createLiveSession,
  getAllLiveSessions,
  updateLiveSession,
  deleteLiveSession,
  toggleStatus,
} from "../../controllers/LiveSessionController/LiveSesionController.js";

const router = express.Router();

router.get("/", getAllLiveSessions);
router.post("/", createLiveSession);
router.patch("/:id", updateLiveSession);
router.delete("/:id", deleteLiveSession);
router.patch("/toggle/:id", toggleStatus);

export default router;
