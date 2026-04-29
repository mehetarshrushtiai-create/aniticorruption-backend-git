/*import express from "express";
import Complaint from "../Models/Complaint.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// =======================
// AUTH MIDDLEWARE (SAFE)
// =======================
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// =======================
// CREATE COMPLAINT
// =======================
router.post("/", authMiddleware, async (req, res) => {
  try {
    // 🔥 FIX: ensure email exists
    const email = req.user.email || req.body.email;

    if (!email) {
      return res.status(400).json({
        message: "Email is required (missing in token or body)",
      });
    }

    if (!req.body.title || !req.body.description || !req.body.category) {
      return res.status(400).json({
        message: "Title, description, and category are required",
      });
    }

    const complaint = new Complaint({
      ...req.body,
      email,
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully!",
      trackingId: complaint.trackingId,
      data: complaint,
    });
  } catch (err) {
    console.error("🔥 Complaint save error:", err);
    res.status(500).json({
      message: "Server error while saving complaint",
      error: err.message,
    });
  }
});

// =======================
// GET USER COMPLAINTS
// =======================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      email: req.user.email,
    });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// GET ALL (ADMIN ONLY)
// =======================
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// TRACK BY ID (PUBLIC)
// =======================
router.get("/:trackingId", async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      trackingId: req.params.trackingId,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// UPDATE STATUS (ADMIN)
// =======================
router.put("/:trackingId/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const allowedStatuses = [
      "PENDING",
      "IN_PROGRESS",
      "RESOLVED",
      "REJECTED",
    ];

    const newStatus = req.body.status;

    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const complaint = await Complaint.findOneAndUpdate(
      { trackingId: req.params.trackingId },
      { status: newStatus },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.json({
      message: "Status updated successfully",
      complaint,
    });
  } catch (err) {
    console.error("🔥 Status update error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
*/
import express from "express";
import { createComplaint, getComplaints, updateComplaintStatus } from "../Controllers/complaintController.js";
import { authenticate, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route (no token required)
router.post("/", createComplaint);

// Public route (list complaints)
router.get("/", getComplaints);

// Admin‑only route (token required + must be ADMIN)
router.put("/:trackingId/status", authenticate, adminOnly, updateComplaintStatus);

export default router;
