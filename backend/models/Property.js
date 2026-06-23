const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Property description is required"],
    },
    price: {
      type: Number,
      required: [true, "Property price is required"],
    },
    location: {
      type: String,
      required: [true, "Property location is required"],
    },
    type: {
      type: String,
      enum: ["apartment", "villa", "chalet", "office", "land"],
      required: [true, "Property type is required"],
    },
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
    mainImage: {
      type: String,
      required: [true, "Main property image is required"],
    },
    images: [
      {
        type: String,
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;