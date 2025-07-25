import express from "express";
import {
  createCertificationRequest,
  getAllCertificationRequests,
  getCertificationRequestById,
  updateCertificationRequest,
  deleteCertificationRequest,
  upload, // multer middleware
} from "../controllers/certificationRequestControllers.js";

const router = express.Router();

// File upload for both POST and PUT
router.post("/", upload.single("document"), createCertificationRequest);
router.get("/", getAllCertificationRequests);
router.get("/:id", getCertificationRequestById);
router.put("/:id", upload.single("document"), updateCertificationRequest);
router.delete("/:id", deleteCertificationRequest);

export default router;
