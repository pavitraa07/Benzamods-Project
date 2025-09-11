import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: true,trim: true,},
    email: {type: String,required: true,unique: true,lowercase: true,},
    contact: {type: String,required: true,},
    address: {type: String,required: true,},
    password: {type: String,required: false,},
    otp: {type: String,},
    otpExpires: {type: Date,},
    isVerified: {type: Boolean,default: false},
  },
  { timestamps: true, collection: "users" }
);

export default mongoose.model("User", userSchema);
