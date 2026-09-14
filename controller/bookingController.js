const mongoose = require("mongoose");
const Booking = require("../model/bookingModel");
const Bed = require("../model/bedModel");

// =====================================================
// CREATE BOOKING
// =====================================================
const createBooking = async (req, res) => {
  try {
    const { patient, hospital, bed } = req.body;

    console.log("BOOKING REQUEST:", {
      patient,
      hospital,
      bed,
    });

    if (!patient || !hospital || !bed) {
      return res.status(400).json({
        message: "Patient, hospital and bed are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(patient) ||
      !mongoose.Types.ObjectId.isValid(hospital) ||
      !mongoose.Types.ObjectId.isValid(bed)
    ) {
      return res.status(400).json({
        message: "Invalid patient, hospital or bed ID",
      });
    }

    const selectedBed = await Bed.findById(bed);

    if (!selectedBed) {
      return res.status(404).json({
        message: "Bed not found",
      });
    }

    if (selectedBed.hospital.toString() !== hospital.toString()) {
      return res.status(400).json({
        message: "This bed does not belong to the selected hospital",
      });
    }

    if (selectedBed.status === "occupied") {
      return res.status(400).json({
        message: "Bed is already occupied",
      });
    }

    const existingBooking = await Booking.findOne({
      patient,
      status: "booked",
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Patient already has an active booking",
      });
    }

    const booking = await Booking.create({
      patient,
      hospital,
      bed,
      status: "booked",
    });

    selectedBed.status = "occupied";
    await selectedBed.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("patient", "name email")
      .populate("hospital")
      .populate("bed");

    return res.status(201).json({
      message: "Bed booked successfully",
      booking: populatedBooking,
    });

  } catch (error) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL BOOKINGS
// =====================================================

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("patient", "name email")
      .populate("hospital")
      .populate("bed")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);

    return res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE BOOKING
// =====================================================

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id)
      .populate("patient", "name email")
      .populate("hospital")
      .populate("bed");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);

    return res.status(500).json({
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE BOOKING
// =====================================================

const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const validStatuses = [
      "booked",
      "cancelled",
      "completed",
    ];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status",
      });
    }

    // No status change
    if (!status || status === booking.status) {
      return res.status(200).json({
        message: "No changes made",
        booking,
      });
    }

    // ==========================================
    // BOOKED → CANCELLED / COMPLETED
    // ==========================================

    if (
      booking.status === "booked" &&
      (status === "cancelled" || status === "completed")
    ) {
      await Bed.findByIdAndUpdate(booking.bed, {
        status: "available",
      });

      booking.status = status;

      await booking.save();
    }

    // ==========================================
    // CANCELLED → BOOKED
    // ==========================================

    else if (
      booking.status === "cancelled" &&
      status === "booked"
    ) {
      const bed = await Bed.findById(booking.bed);

      if (!bed) {
        return res.status(404).json({
          message: "Bed not found",
        });
      }

      if (bed.status === "occupied") {
        return res.status(400).json({
          message: "Bed is already occupied",
        });
      }

      bed.status = "occupied";
      await bed.save();

      booking.status = "booked";
      await booking.save();
    }

    // ==========================================
    // COMPLETED → BOOKED NOT ALLOWED
    // ==========================================

    else {
      return res.status(400).json({
        message: `Cannot change booking status from ${booking.status} to ${status}`,
      });
    }

    const updatedBooking = await Booking.findById(id)
      .populate("patient", "name email")
      .populate("hospital")
      .populate("bed");

    return res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update booking error:", error);

    return res.status(500).json({
      message: "Failed to update booking",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE BOOKING
// =====================================================

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Release bed if booking is active
    if (booking.status === "booked") {
      await Bed.findByIdAndUpdate(booking.bed, {
        status: "available",
      });
    }

    await Booking.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Delete booking error:", error);

    return res.status(500).json({
      message: "Failed to delete booking",
      error: error.message,
    });
  }
};

// dashboard making
const getPatientDashboard = async (req, res) => {
  try {
    const patientId = req.user;

    if (!patientId) {
      return res.status(400).json({
        message: "Patient ID is required",
      });
    }

    const booking = await Booking.findOne({
      patient: patientId,
      status: "booked",
    })
      .populate("patient", "name email")
      .populate("hospital", "name");

    if (!booking) {
      return res.status(404).json({
        message: "No active booking found",
      });
    }

    return res.status(200).json({
      patient: {
        name: booking.patient.name,
        email: booking.patient.email,
      },
      hospital: {
        name: booking.hospital.name,
      },
    });

  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      message: "Failed to load dashboard",
      error: error.message,
    });
  }
};
// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getPatientDashboard,
};