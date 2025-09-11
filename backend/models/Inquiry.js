import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    vehicleName: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    contact: { type: String, required: true },
    details: { type: String, required: true },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PriorityService",
      required: true,
    },

    serviceTitle: { type: String },
    category: { type: String, enum: ["Car", "Bike"] },
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", InquirySchema);
