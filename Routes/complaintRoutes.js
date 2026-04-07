import express from "express";
import Complaint from "../Models/Complaint.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to check token
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ Create complaint
router.post("/", authMiddleware, async (req, res) => {
  try {
    const complaint = new Complaint({
      ...req.body,
      email: req.user.email,
    });
    await complaint.save();
    res.json({
      message: "Complaint submitted successfully!",
      trackingId: complaint.trackingId,
    });
  } catch (err) {
    console.error("Complaint save error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get complaints for current user
router.get("/me", authMiddleware, async (req, res) => {
  const complaints = await Complaint.find({ email: req.user.email });
  res.json(complaints);
});

// ✅ Admin: get all complaints
router.get("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }
  const complaints = await Complaint.find();
  res.json(complaints);
});

// ✅ Track complaint by trackingId (public)
router.get("/:trackingId", async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ trackingId: req.params.trackingId });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin: update complaint status
router.put("/:trackingId/status", authMiddleware, async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const allowedStatuses = ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"];
  const newStatus = req.body.status;

  if (!allowedStatuses.includes(newStatus)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const complaint = await Complaint.findOneAndUpdate(
      { trackingId: req.params.trackingId },
      { status: newStatus },
      { new: true }
    );
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json({ message: "Status updated", complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;