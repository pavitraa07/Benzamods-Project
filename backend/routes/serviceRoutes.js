import express from "express";
import Service from "../models/Service.js";

const router = express.Router();

// Create service 
router.post("/", async (req, res) => {
  try {
    const { name, price, description, image } = req.body;

    const service = await Service.create({
      name,
      price: price ? Number(price) : undefined,
      description,
      image, 
    });

    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create service" });
  }
});

// Get all services
router.get("/", async (req, res) => {
  try {
    const list = await Service.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

// Update service
router.put("/:id", async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update service" });
  }
});

// Count services
router.get("/count", async (req, res) => {
  try {
    const count = await Service.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to count services" });
  }
});

// Delete service
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete service" });
  }
});

export default router;
