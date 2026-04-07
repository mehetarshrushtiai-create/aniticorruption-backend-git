import mongoose from "mongoose";

const complainStatusSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  status: { type: String, default: "Pending" },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("ComplainStatus", complainStatusSchema);