import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import complaintRoutes from "./Routes/complaintRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Mount complaint routes
app.use("/api/complaints", complaintRoutes);

// Simple login route
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Hardcoded admin
  if (email === "admin@test.com" && password === "123") {
    const token = jwt.sign(
      { email, role: "ADMIN" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );
    return res.json({ token });
  }

  // Any other user
  if (email && password) {
    const token = jwt.sign(
      { email, role: "USER" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/societyComplaints", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));