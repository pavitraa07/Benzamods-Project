import express from "express";
import Inquiry from "../models/Inquiry.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const created = await Inquiry.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { serviceId } = req.query;
    const filter = serviceId ? { service: serviceId } : {};
    const list = await Inquiry.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/count", async (req, res) => {
  try {
    const { serviceId } = req.query;
    const filter = serviceId ? { service: serviceId } : {};
    const total = await Inquiry.countDocuments(filter);
    res.json({ count: total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Inquiry.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
