import multer from "multer";
import path from "path";
import fs from "fs";

// Create upload directory if not exists
const uploadDir = "uploads/individual_docs";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  // Allow docx files
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.originalname.toLowerCase().endsWith(".docx")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .docx files are allowed!"), false);
  }
};

const uploadIndividualDoc = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default uploadIndividualDoc;
