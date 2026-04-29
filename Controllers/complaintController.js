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

// DELETE COMPLAINT (Admin only)
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOneAndDelete({ trackingId: req.params.trackingId });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
