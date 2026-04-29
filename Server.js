/*import express from "express";
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

// =======================
// AUTH ROUTES (FIXED)
// =======================

// REGISTER (basic working version)
app.post("/api/auth/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const token = jwt.sign(
    { email, role: "USER" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.json({ token });
});

// LOGIN (fixed + consistent with register)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@test.com" && password === "123") {
    const token = jwt.sign(
      { email, role: "ADMIN" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.json({ token });
  }

  if (email && password) {
    const token = jwt.sign(
      { email, role: "USER" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

// =======================
// MongoDB CONNECTION
// =======================
mongoose
  .connect(process.env.MONGO_URI, {
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
  */
 // Server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import complaintRoutes from "./Routes/complaintRoutes.js";

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded files (proof documents/images)
app.use("/uploads", express.static("uploads"));

// =======================
// Complaint Routes
// =======================
app.use("/api/complaints", complaintRoutes);

// =======================
// AUTH ROUTES
// =======================

// REGISTER (basic working version)
app.post("/api/auth/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const token = jwt.sign(
    { email, role: "USER" },
    process.env.JWT_SECRET || "secretkey",
    { expiresIn: "1h" }
  );

  return res.json({ token });
});

// LOGIN (admin + user)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Simple hardcoded admin login
  if (email === "admin@test.com" && password === "123") {
    const token = jwt.sign(
      { email, role: "ADMIN" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );
    return res.json({ token });
  }

  // Normal user login
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

// =======================
// MongoDB CONNECTION
// =======================
mongoose
  .connect(process.env.MONGO_URI, {
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
