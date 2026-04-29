import express from "express";
import {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
  trackComplaint,
  deleteComplaint,   // ✅ add this
} from "../Controllers/complaintController.js";
import { authenticate, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route to create complaint
router.post("/", createComplaint);

// Public route to track complaint by ID
router.get("/:trackingId", trackComplaint);

// Admin-only route to get all complaints
router.get("/", authenticate, adminOnly, getComplaints);

// Admin-only route to update status
router.put("/:trackingId/status", authenticate, adminOnly, updateComplaintStatus);

// ✅ Admin-only route to delete complaint
router.delete("/:trackingId", authenticate, adminOnly, deleteComplaint);

export default router;
