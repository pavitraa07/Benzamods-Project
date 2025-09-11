import express from "express";
import PriorityService from "../models/PriorityServicesSchema.js";

const router = express.Router();

// Add new priority service
router.post("/", async (req, res) => {
  try {
    const service = new PriorityService(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Count priority services 
router.get("/count", async (req, res) => {
  try {
    const count = await PriorityService.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to count priority services" });
  }
});

// Get all priority services
router.get("/", async (req, res) => {
  try {
    const services = await PriorityService.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single priority service by ID
router.get("/:id", async (req, res) => {
  try {
    const service = await PriorityService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a service
router.put("/:id", async (req, res) => {
  try {
    const updated = await PriorityService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a service
router.delete("/:id", async (req, res) => {
  try {
    await PriorityService.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
