import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Demo: hardcode one admin, everyone else is user
  if (email === "admin@test.com" && password === "123") {
    const token = jwt.sign({ email, role: "ADMIN" }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });
    return res.json({ token });
  }

  // Normal user
  if (email && password) {
    const token = jwt.sign({ email, role: "USER" }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1h" });
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

export default router;