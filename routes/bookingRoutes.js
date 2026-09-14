const express = require("express");
const protect = require("../middleware/jwtmiddleware");

const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require("../controller/bookingController");

const router = express.Router();

// CREATE BOOKING
router.post("/",protect , createBooking);

// GET ALL BOOKINGS
router.get("/", protect ,  getAllBookings);

// GET SINGLE BOOKING
router.get("/:id", protect,  getBookingById);

// UPDATE BOOKING
router.put("/:id", protect ,  updateBooking);

// DELETE BOOKING
router.delete("/:id", protect ,  deleteBooking);

module.exports = router;