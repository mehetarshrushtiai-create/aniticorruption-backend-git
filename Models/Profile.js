import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // ✅ ensures one profile per user
    index: true,
  },
  complaints: [{ type: mongoose.Schema.Types.ObjectId, ref: "Complaint" }],
  updatedAt: { type: Date, default: Date.now },
});

// ✅ auto-update timestamp
profileSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Profile", profileSchema);