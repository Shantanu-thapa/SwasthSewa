const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    totalBeds: {
      type: Number,
      required: true,
    },

    availableBeds: {
      type: Number,
      required: true,
    },

    contactNumber: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
  
);

module.exports = mongoose.model("Hospital", hospitalSchema);