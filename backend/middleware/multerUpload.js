import multer from "multer";
import fs from "fs";

const dir = "uploads/companies";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, dir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const uploadCompanyDoc = multer({ storage });
