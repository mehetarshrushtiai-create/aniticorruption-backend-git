/*import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    trackingId: { type: String, unique: true },

    title: { type: String, required: true },
    description: { type: String, required: true },

    category: {
      type: String,
      enum: ["Maintenance", "Security", "Cleanliness", "General"],
      required: true,
    },

    // ✅ NEW fields (match frontend)
    societyName: { type: String },
    buildingName: { type: String },
    address: { type: String },

    // ✅ Keep old for compatibility
    place: { type: String },

    flatNumber: { type: String },
    date: { type: String },
    time: { type: String },

    whatsapp: { type: String },
    email: { type: String, required: true },

    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"],
      default: "PENDING",
      uppercase: true,
    },
  },
  { timestamps: true }
);

// 🔥 Auto-generate trackingId + fix fields
complaintSchema.pre("save", function (next) {
  if (!this.trackingId) {
    this.trackingId =
      "CMP-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  // ✅ Map address → place automatically
  if (!this.place && this.address) {
    this.place = this.address;
  }

  if (this.status) {
    this.status = this.status.toUpperCase();
  }

  next();
});

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
*/
import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    trackingId: { type: String, unique: true },

    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },

    societyName: { type: String },
    address: { type: String },
    flatNumber: { type: String },

    date: { type: String },
    time: { type: String },

    whatsapp: { type: String },
    email: { type: String, required: true },

    image: { type: String },

    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

// tracking ID auto generate
complaintSchema.pre("save", function (next) {
  if (!this.trackingId) {
    this.trackingId = "CMP-" + Math.random().toString(36).substring(2, 10);
  }
  next();
});

export default mongoose.model("Complaint", complaintSchema);