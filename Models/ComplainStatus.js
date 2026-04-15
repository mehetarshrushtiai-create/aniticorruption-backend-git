import mongoose from "mongoose";

const complainStatusSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true, index: true },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "In Progress", "Resolved", "Rejected"],
  },
  updatedAt: { type: Date, default: Date.now },
});

// ✅ auto-update timestamp on save
complainStatusSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("ComplainStatus", complainStatusSchema);