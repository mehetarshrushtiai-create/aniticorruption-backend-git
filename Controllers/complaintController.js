/*import Complaint from "../Models/Complaint.js";
import OpenAI from "openai";
import { authenticate, adminOnly } from "../middleware/authMiddleware.js";

// ✅ FIX 1: ADD openai initialization (IMPORTANT)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Preview complaint (AI summary only)
export const previewComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Summarize complaints clearly." },
        {
          role: "user",
          content: `Title: ${title}\nDescription: ${description}`,
        },
      ],
    });

    res.json({ summary: aiResponse.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Save complaint
export const createComplaint = async (req, res) => {
  try {
    const { rawText, aiText, category, email, phone } = req.body;

    // ✅ Generate tracking ID if not provided
    const trackingId = "CMP-" + Date.now().toString().slice(-6);

    const complaint = new Complaint({
      rawText,
      aiText,
      category,
      email,
      phone,
      trackingId, // ✅ add trackingId to complaint
    });

    await complaint.save();

    // ✅ Return trackingId in response
    res.status(201).json({
      message: "✅ Complaint submitted successfully!",
      trackingId: complaint.trackingId,
      complaint,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all complaints
export const getComplaints = async (req, res) => {
  try {
    const data = await Complaint.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/
// Controllers/complaintController.js
// Controllers/complaintController.js
import Complaint from "../Models/Complaint.js";

// CREATE COMPLAINT
export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, email, whatsapp, societyName, address, flatNumber, date, time } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description, and category are required" });
    }

    const trackingId = "CMP-" + Date.now().toString().slice(-6);

    const complaint = new Complaint({
      title,
      description,
      category,
      email,
      whatsapp,
      societyName,
      address,
      flatNumber,
      date,
      time,
      trackingId,
    });

    await complaint.save();

    const summary = `Complaint "${title}" recorded. Category: ${category}. Description: ${description.substring(0, 80)}...`;

    res.status(201).json({
      message: "Complaint submitted successfully",
      trackingId: complaint.trackingId,
      summary,
    });
  } catch (err) {
    console.error("Complaint save error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET ALL COMPLAINTS (Admin)
export const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// TRACK COMPLAINT BY ID (Public)
export const trackComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ trackingId: req.params.trackingId });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE STATUS (Admin)
export const updateComplaintStatus = async (req, res) => {
  try {
    const allowedStatuses = ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"];
    const newStatus = req.body.status;

    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findOneAndUpdate(
      { trackingId: req.params.trackingId },
      { status: newStatus },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Status updated successfully", complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
