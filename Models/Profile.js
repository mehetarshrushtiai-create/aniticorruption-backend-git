import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  complaints: [{ type: mongoose.Schema.Types.ObjectId, ref: "Complaint" }],
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Profile", profileSchema);