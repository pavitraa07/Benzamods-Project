import express from "express";
import {
  sendOtp,
  verifyOtp,
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserCount,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/check-transporter", async (req, res) => {
  try {
    const transporter = require("nodemailer").createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    res.json({ success: true, message: "Transporter is working fine" });
  } catch (err) {
    console.error("Transporter error:", err);
    res.status(500).json({ success: false, message: "Transporter failed", error: err });
  }
});

router.get("/users/count", getUserCount);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
