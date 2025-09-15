import express from "express";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import User from "../models/User.js"; // 👈 import User schema

const router = express.Router();

// Get all admins
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new admin
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username already exists" });

    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete admin
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    res.json({ message: "Admin deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Count admins
router.get("/count", async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to count admins" });
  }
});

// Login route (extended for Users with admin role)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔹 1. First check in Admins table
    const admin = await Admin.findOne({ username });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      return res.json({
        message: "Login successful (Admin collection)",
        adminId: admin._id,
        username: admin.username,
        role: "admin",
      });
    }

    // 🔹 2. If not found, check in Users table (email + admin role)
    const user = await User.findOne({ email: username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.role !== "admin" && user.role !== "both") {
      return res.status(403).json({ message: "User is not registered as admin" });
    }

    return res.json({
      message: "Login successful (User collection with admin role)",
      userId: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
