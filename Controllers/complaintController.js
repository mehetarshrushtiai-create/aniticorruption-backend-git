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
import Complaint from "../Models/Complaint.js";
import OpenAI from "openai";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// PREVIEW COMPLAINT (AI Summary)
export const previewComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Summarize complaints clearly." },
        { role: "user", content: `Title: ${title}\nDescription: ${description}` },
      ],
    });

    res.json({ summary: aiResponse.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE COMPLAINT (No Auth, Email Optional)
export const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      email,        // optional
      societyName,
      address,
      flatNumber,
      date,
      time,
      whatsapp,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Title, description, and category are required",
      });
    }

    // Generate tracking ID
    const trackingId = "CMP-" + Date.now().toString().slice(-6);

    const complaint = new Complaint({
      title,
      description,
      category,
      email,
      societyName,
      address,
      flatNumber,
      date,
      time,
      whatsapp,
      trackingId,
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully",
      trackingId: complaint.trackingId,
      complaint,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL COMPLAINTS (Public)
export const getComplaints = async (req, res) => {
  try {
    const data = await Complaint.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

