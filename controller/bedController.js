const mongoose = require("mongoose");
const Bed = require("../model/bedModel");

// =====================================================
// CREATE BED
// =====================================================

const createBed = async (req, res) => {
  try {
    const { hospital, bedNumber } = req.body;

    if (!hospital || !bedNumber) {
      return res.status(400).json({
        message: "Hospital and bed number are required",
      });
    }

    // Validate hospital ID
    if (!mongoose.Types.ObjectId.isValid(hospital)) {
      return res.status(400).json({
        message: "Invalid hospital ID",
      });
    }

    // Check duplicate bed number in same hospital
    const existingBed = await Bed.findOne({
      hospital,
      bedNumber,
    });

    if (existingBed) {
      return res.status(400).json({
        message: "Bed with this number already exists in this hospital",
      });
    }

    const bed = await Bed.create({
      hospital,
      bedNumber,
      status: "available",
    });

    return res.status(201).json({
      message: "Bed created successfully",
      bed,
    });
  } catch (error) {
    console.error("Create bed error:", error);

    return res.status(500).json({
      message: "Failed to create bed",
      error: error.message,
    });
  }
};


// =====================================================
// GET ALL BEDS
// =====================================================

const getAllBeds = async (req, res) => {
  try {
    const beds = await Bed.find()
      .populate("hospital")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: beds.length,
      beds,
    });
  } catch (error) {
    console.error("Get beds error:", error);

    return res.status(500).json({
      message: "Failed to fetch beds",
      error: error.message,
    });
  }
};


// =====================================================
// GET BED BY ID
// =====================================================

const getBedById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid bed ID",
      });
    }

    const bed = await Bed.findById(id).populate("hospital");

    if (!bed) {
      return res.status(404).json({
        message: "Bed not found",
      });
    }

    return res.status(200).json({
      bed,
    });
  } catch (error) {
    console.error("Get bed error:", error);

    return res.status(500).json({
      message: "Failed to fetch bed",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE BED
// =====================================================

const updateBed = async (req, res) => {
  try {
    const { id } = req.params;
    const { bedNumber, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid bed ID",
      });
    }

    const validStatuses = ["available", "occupied"];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid bed status",
      });
    }

    const bed = await Bed.findById(id);

    if (!bed) {
      return res.status(404).json({
        message: "Bed not found",
      });
    }

    // Check duplicate bed number
    if (bedNumber && bedNumber !== bed.bedNumber) {
      const existingBed = await Bed.findOne({
        hospital: bed.hospital,
        bedNumber,
        _id: { $ne: id },
      });

      if (existingBed) {
        return res.status(400).json({
          message: "Bed with this number already exists in this hospital",
        });
      }

      bed.bedNumber = bedNumber;
    }

    if (status) {
      bed.status = status;
    }

    await bed.save();

    return res.status(200).json({
      message: "Bed updated successfully",
      bed,
    });
  } catch (error) {
    console.error("Update bed error:", error);

    return res.status(500).json({
      message: "Failed to update bed",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE BED
// =====================================================

const deleteBed = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid bed ID",
      });
    }

    const bed = await Bed.findById(id);

    if (!bed) {
      return res.status(404).json({
        message: "Bed not found",
      });
    }

    // Don't delete an occupied bed
    if (bed.status === "occupied") {
      return res.status(400).json({
        message: "Cannot delete an occupied bed",
      });
    }

    await Bed.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Bed deleted successfully",
    });
  } catch (error) {
    console.error("Delete bed error:", error);

    return res.status(500).json({
      message: "Failed to delete bed",
      error: error.message,
    });
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createBed,
  getAllBeds,
  getBedById,
  updateBed,
  deleteBed,
};