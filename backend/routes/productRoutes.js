import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, price, category, description, image } = req.body;

    const product = await Product.create({
      name,
      price: Number(price),
      category,
      description,
      image,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create product" });
  }
});

router.get("/", async (req, res) => {
  try {
    const list = await Product.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

router.get("/count", async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to count products" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update product" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete product" });
  }
});

export default router;
