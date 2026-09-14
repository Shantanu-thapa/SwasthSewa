const express = require("express");

const router = express.Router();

const { getPatientDashboard } = require("../controller/bookingController");
const protect = require("../middleware/jwtmiddleware");

router.get("/dashboard", protect, getPatientDashboard);

module.exports = router;