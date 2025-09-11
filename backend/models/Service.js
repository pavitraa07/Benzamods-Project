// models/Service.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number },
    description: { type: String },
    image: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
