const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },

    bedNumber: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "occupied"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bed", bedSchema);