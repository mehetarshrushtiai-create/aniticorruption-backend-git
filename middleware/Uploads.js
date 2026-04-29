

// middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/"); // folder where files are stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const Upload = multer({ storage });
export default Upload;