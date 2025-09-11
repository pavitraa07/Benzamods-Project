import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const otpStore = {};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"BenzaMods" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for BenzaMods Registration",
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error(" Error in sendOtp:", error);
    return res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (otpStore[email] && otpStore[email] === otp) {
      return res.status(200).json({ success: true, message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error(" Error in verifyOtp:", error);
    return res.status(500).json({ message: "Error verifying OTP" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, contact, address, password } = req.body;

    if (!otpStore[email]) {
      return res.status(400).json({ message: "Email not verified with OTP" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      contact,
      address,
      password: hashedPassword,
      isVerified: true,
    });

    await newUser.save();

    delete otpStore[email];

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("🔥 Error in registerUser:", error);
    return res.status(500).json({ message: "Error registering user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("🔥 Error in loginUser:", error);
    return res.status(500).json({ message: "Error logging in" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("🔥 Error in getAllUsers:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("🔥 Error in getUserById:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, contact, address, password } = req.body;
    const updateFields = { name, contact, address };

    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

export const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Error in getUserCount:", error);
    res.status(500).json({ message: "Error fetching user count" });
  }
};
