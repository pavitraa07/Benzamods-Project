import express from "express";
import Order from "../models/Order.js";
import { sendOrderEmail } from "../utils/sendOrderEmail.js";
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.get("/count", async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to count orders" });
  }
});


router.post("/", async (req, res) => {
  try {
    const { customer, items, total } = req.body; 
    if (!customer?.name || !customer?.email || !customer?.address) {
      return res.status(400).json({ message: "Missing required customer fields" });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const mappedItems = items.map((p) => ({
      productId: p.id,
      name: p.name,
      image: p.image,
      quantity: p.quantity,
      price: p.price,
    }));

    const newOrder = new Order({
      customer,
      items: mappedItems,
      total,
      status: "Pending",
    });

    const saved = await newOrder.save();

    const itemsHtml = mappedItems
      .map((p) => `<li>${p.name} (x${p.quantity}) - ₹${p.price * p.quantity}</li>`)
      .join("");

    const customerHtml = `
      <h2>Thank you for your order!</h2>
      <p>Hello ${customer.name},</p>
      <p>Your order has been placed successfully.</p>
      <h3>Order Details</h3>
      <ul>${itemsHtml}</ul>
      <p><strong>Total:</strong> ₹${total}</p>
      <p>We will deliver your order soon 🚚</p>
    `;

    await sendOrderEmail({
      to: customer.email,
      subject: `Your Order Confirmation #${saved._id}`,
      html: customerHtml,
    });

    res.status(201).json({ message: "Order placed successfully", order: saved });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); 
    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
