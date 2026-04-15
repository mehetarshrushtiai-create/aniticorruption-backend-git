import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    trackingId: { type: String, unique: true }, // removed required (OK)
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Maintenance", "Security", "Cleanliness", "General"],
      required: true,
    },
    place: { type: String },
    flatNumber: { type: String },
    date: { type: String },
    time: { type: String },
    whatsapp: { type: String },
    email: { type: String, required: true },

    // ⚠️ FIX 1: match frontend/dashboard format (important)
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"],
      default: "PENDING",
      uppercase: true, // ensures consistency
    },
  },
  { timestamps: true }
);

// Auto-generate trackingId before saving
complaintSchema.pre("save", function (next) {
  if (!this.trackingId) {
    this.trackingId = "CMP-" + Math.random().toString(36).substring(2, 10);
  }

  // ⚠️ FIX 2: ensure status is always uppercase consistent
  if (this.status) {
    this.status = this.status.toUpperCase();
  }

  next();
});

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;