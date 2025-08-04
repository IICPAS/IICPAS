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

// File upload for both POST and PUT - multiple files
router.post(
  "/",
  upload.fields([
    { name: "brochure", maxCount: 1 },
    { name: "sampleCertificate", maxCount: 1 },
  ]),
  createCertificationRequest
);
router.get("/", getAllCertificationRequests);
router.get("/:id", getCertificationRequestById);
router.put(
  "/:id",
  upload.fields([
    { name: "brochure", maxCount: 1 },
    { name: "sampleCertificate", maxCount: 1 },
  ]),
  updateCertificationRequest
);
router.delete("/:id", deleteCertificationRequest);

export default router;
