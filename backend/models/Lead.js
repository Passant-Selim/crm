const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Lead email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Lead phone number is required"],
      trim: true,
    },
    budget: {
      type: Number,
      required: [true, "Lead budget is required"],
    },
    interestedIn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property", 
      required: [true, "Please specify the property the lead is interested in"],
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "lost"],
      default: "new",
    },
    dealStatus: {
      type: String,
      enum: ["none", "pending", "won", "lost"],
      default: "none",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    notes: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);
module.exports = Lead;