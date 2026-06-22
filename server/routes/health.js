const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// @route   GET /api/health
// @desc    Check server and database health
// @access  Public

router.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState;

  // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const dbStatusMap = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };

  res.status(200).json({
    success: true,
    message: "Server is running",
    database: {
      status: dbStatusMap[dbStatus],
      name: "user_analytics",
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;