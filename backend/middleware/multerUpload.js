import multer from "multer";
import fs from "fs";

const dir = "uploads/companies";
const imageDir = "uploads/company_images";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, dir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const imageStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, imageDir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const uploadCompanyDoc = multer({ storage });
export const uploadCompanyImage = multer({ 
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});
