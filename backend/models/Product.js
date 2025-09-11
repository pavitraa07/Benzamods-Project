import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: ["car", "bike"], required: true },
    image: { type: String }, 
    description: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
