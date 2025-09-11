import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: { type: String },
  quantity: { type: Number },
  price: { type: Number, required: true }, 
});

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    instructions: { type: String, default: "" },
  },
  items: { type: [orderItemSchema], required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ["Pending","Confirmed","Shipped","Delivered","Cancelled"], default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
