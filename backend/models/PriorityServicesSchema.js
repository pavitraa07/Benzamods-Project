import mongoose from "mongoose";

const PriorityServiceSchema = new mongoose.Schema({
  serviceTitle: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  gallery: [{ type: String }],
  category: { 
    type: String, 
    enum: ["Car", "Bike"], 
    required: true 
  },
});

export default mongoose.model("PriorityService", PriorityServiceSchema);
