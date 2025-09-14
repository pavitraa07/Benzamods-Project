import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import priorityServiceRoutes from "./routes/priorityServicesRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();
const allowedOrigins = [
  "http://localhost:3000",  
  "https://benzamods-project.vercel.app", 
  "https://benzamods-project-orfks9mzp-pavitra-s-projects-c7769bb9.vercel.app"
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsRoot, { recursive: true });

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed from this origin: " + origin), false);
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(uploadsRoot));

app.use("/api/products", productRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/priority-services", priorityServiceRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/admins", adminRoutes);

// Health check route
app.get("/", (_req, res) => {
  res.json({ ok: true, message: "Benzamods API running 🚀" });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err);
    process.exit(1);
  });
