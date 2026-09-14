const express = require("express");

const {
  createBed,
  getAllBeds,
  getBedById,
  updateBed,
  deleteBed,
} = require("../controller/bedController");

const protect = require("../middleware/jwtmiddleware");

const router = express.Router();

// Create a bed
router.post("/", protect, createBed);

// Get all beds
router.get("/", protect, getAllBeds);

// Get bed by ID
router.get("/:id", protect, getBedById);

// Update bed
router.put("/:id", protect, updateBed);

// Delete bed
router.delete("/:id", protect, deleteBed);

module.exports = router;