import express from "express";
import {
  registerCompany,
  loginCompany,
  sendOtp,
  resetPassword,
  getAllCompanies,
  approveCompany,
  logoutCompany,
} from "../controllers/companyControllers.js";
import { uploadCompanyDoc } from "../middleware/multerUpload.js";
import { isCompany } from "../middleware/isCompany.js";
const router = express.Router();

router.post("/register", uploadCompanyDoc.single("document"), registerCompany);
router.post("/login", loginCompany);
router.post("/forgot-password", sendOtp);
router.post("/reset-password", resetPassword);
router.post("/logout", logoutCompany);
router.get("/iscompany", isCompany, (req, res) => {
  res.status(200).json({
    message: "Authenticated company",
    company: req.company, // { id, role }
  });
});
// Admin routes
router.get("/", getAllCompanies);
router.put("/approve/:id", approveCompany);

export default router;
