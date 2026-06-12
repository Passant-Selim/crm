const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: String,

    source: {
      type: String,
      enum: [
        "Facebook",
        "Instagram",
        "Website",
        "Call Center",
        "Walk In"
      ]
    },

    budget: Number,

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Interested",
        "Site Visit",
        "Closed Won",
        "Closed Lost"
      ],
      default: "New",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Lead",
  leadSchema
);