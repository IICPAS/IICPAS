import CertificationRequest from "../models/CertificationRequest.js";
import multer from "multer";
import path from "path";

// ===== MULTER SETUP =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/certification-docs"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "_" + file.fieldname + ext);
  },
});
export const upload = multer({ storage });

// ===== CONTROLLERS =====

// Create (with file upload support)
export const createCertificationRequest = async (req, res) => {
  try {
    const data = { ...req.body };

    // Handle file uploads
    if (req.files) {
      if (req.files.brochure) {
        data.brochure = req.files.brochure[0].path.replace(/\\/g, "/");
      }
      if (req.files.sampleCertificate) {
        data.sampleCertificate = req.files.sampleCertificate[0].path.replace(
          /\\/g,
          "/"
        );
      }
    }

    // Convert fees to number
    if (data.fees) {
      data.fees = Number(data.fees);
    }

    const newRequest = new CertificationRequest(data);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all
export const getAllCertificationRequests = async (req, res) => {
  try {
    const requests = await CertificationRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
export const getCertificationRequestById = async (req, res) => {
  try {
    const request = await CertificationRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Not found" });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update (admin sets status and/or updates files)
export const updateCertificationRequest = async (req, res) => {
  try {
    const data = { ...req.body };

    // Handle file uploads
    if (req.files) {
      if (req.files.brochure) {
        data.brochure = req.files.brochure[0].path.replace(/\\/g, "/");
      }
      if (req.files.sampleCertificate) {
        data.sampleCertificate = req.files.sampleCertificate[0].path.replace(
          /\\/g,
          "/"
        );
      }
    }

    // Convert fees to number
    if (data.fees) {
      data.fees = Number(data.fees);
    }

    const updated = await CertificationRequest.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
export const deleteCertificationRequest = async (req, res) => {
  try {
    const deleted = await CertificationRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
