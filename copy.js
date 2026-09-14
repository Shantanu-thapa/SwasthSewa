const mongoose = require("mongoose");
const Booking = require("../model/bookingModel");
const Bed = require("../model/bedModel");

// =====================================================
// CREATE BOOKING
// =====================================================

const createBooking = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { patient, hospital, bed } = req.body;

    if (!patient || !hospital || !bed) {
      return res.status(400).json({
        message: "Patient, hospital and bed are required",
      });
    }

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(patient) ||
      !mongoose.Types.ObjectId.isValid(hospital) ||
      !mongoose.Types.ObjectId.isValid(bed)
    ) {
      return res.status(400).json({
        message: "Invalid patient, hospital or bed ID",
      });
    }

    // Check bed
    const selectedBed = await Bed.findById(bed).session(session);

    if (!selectedBed) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Bed not found",
      });
    }

    // Check hospital ownership
    if (selectedBed.hospital.toString() !== hospital.toString()) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "This bed does not belong to the selected hospital",
      });
    }

    // Check availability
    if (selectedBed.status === "occupied") {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Bed is already occupied",
      });
    }

    // Check whether patient already has an active booking
    const existingBooking = await Booking.findOne({
      patient,
      status: "booked",
    }).session(session);

    if (existingBooking) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Patient already has an active booking",
      });
    }

    // Create booking
    const booking = await Booking.create(
      [
        {
          patient,
          hospital,
          bed,
          status: "booked",
        },
      ],
      { session }
    );

    // Occupy bed
    selectedBed.status = "occupied";
    await selectedBed.save({ session });

    await session.commitTransaction();

    // Populate booking after transaction
    const populatedBooking = await Booking.findById(booking[0]._id)
      .populate("patient", "name email")
      .populate("hospital")
      .populate("bed");

    return res.status(201).json({
      message: "Bed booked successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("Create booking error:", error);

    return res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
    });
  } finally {
    session.endSession();
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

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};