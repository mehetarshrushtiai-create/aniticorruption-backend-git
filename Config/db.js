// backend/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = "mongodb://localhost:27017/complaints"; // update if using Atlas
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("⚠️ MongoDB connection error:", err.message);
    process.exit(1); // stop app if DB fails
  }
};

export default connectDB;