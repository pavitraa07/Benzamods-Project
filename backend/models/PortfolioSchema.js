import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  detailedDesc: { type: String }, 
  image: { type: String, required: true },
  gallery: {
    type: [String], 
    validate: [arr => arr.length <= 5, "{PATH} exceeds max limit of 5"], 
  },
});

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  detailedDesc: { type: String }, 
  image: { type: String },
  gallery: {
    type: [String],
    validate: [arr => arr.length <= 5, "{PATH} exceeds max limit of 5"], 
  },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ["Car", "Bike"], required: true },
  brand: { type: String, required: true },
  serviceType: { type: String },
  beforeImages: [{ type: String }],
  afterImages: [{ type: String }],
  clientReview: { type: String },
});

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  text: { type: String, required: true },
  beforeImage: { type: String },
  afterImage: { type: String },
  category: { type: String, enum: ["Product", "Service"], required: true },
});

const PortfolioSchema = new mongoose.Schema({
  products: [productSchema],
  services: [serviceSchema],
  projects: [projectSchema],
  reviews: [reviewSchema], 
});

export default mongoose.model("Portfolio", PortfolioSchema);
