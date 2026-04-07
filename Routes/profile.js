import express from "express";
import Profile from "../Models/Profile.js";
import Complaint from "../Models/Complaint.js";
import { authenticate, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * User: view own profile + complaints
 */
router.get("/me", authenticate, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id }).populate("complaints");
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Admin: view all profiles with complaints
 */
router.get("/", authenticate, adminOnly, async (req, res) => {
  try {
    const profiles = await Profile.find().populate("complaints");
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Admin: update complaint status + deadline
 */
router.put("/complaint/:id/status", authenticate, adminOnly, async (req, res) => {
  try {
    const { status, deadline } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    // Update fields
    if (status) complaint.status = status;
    if (deadline) complaint.deadline = deadline;
    complaint.lastUpdated = new Date();

    await complaint.save();

    res.json({ message: "✅ Complaint updated successfully", complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;