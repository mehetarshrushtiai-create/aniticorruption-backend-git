/*import express from "express";
import Complaint from "../Models/Complaint.js";
import jwt from "jsonwebtoken";
import upload from "../middleware/upload.js";

const router = express.Router();

// AUTH
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ CREATE COMPLAINT (WITH IMAGE + ADDRESS + SOCIETY)
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        title,
        description,
        category,
        societyName,
        address,
        flatNumber,
        date,
        time,
        whatsapp,
      } = req.body;

      if (!title || !description || !category) {
        return res.status(400).json({
          message: "Title, description, category required",
        });
      }

      const complaint = new Complaint({
        title,
        description,
        category,
        societyName,
        address,
        flatNumber,
        date,
        time,
        whatsapp,
        email: req.user.email,
        image: req.file ? req.file.path : null,
      });

      await complaint.save();

      res.status(201).json({
        message: "Complaint submitted successfully!",
        trackingId: complaint.trackingId,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
*/
import express from "express";
import Complaint from "../Models/Complaint.js";
import jwt from "jsonwebtoken";
import upload from "../middleware/Uploads.js";

const router = express.Router();

// AUTH
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// CREATE COMPLAINT
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const complaint = new Complaint({
      ...req.body,
      email: req.user.email,
      image: req.file ? req.file.path : null,
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted",
      trackingId: complaint.trackingId,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;