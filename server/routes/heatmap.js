const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// ─────────────────────────────────────────────────────────
// @route   GET /api/heatmap?page_url=
// @desc    Get all click data for a specific page
// @access  Public
// ─────────────────────────────────────────────────────────

router.get("/", async (req, res) => {
  try {
    const { page_url } = req.query;

    // Validate page_url
    if (!page_url) {
      return res.status(400).json({
        success: false,
        message: "page_url query parameter is required",
      });
    }

    // Fetch all click events for this page
    const clicks = await Event.find({
      event_type: "click",
      page_url: page_url,
    })
      .sort({ timestamp: -1 })
      .select("x y timestamp session_id");

    if (clicks.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No click data found for this page",
        page_url,
        count: 0,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      page_url,
      count: clicks.length,
      data: clicks,
    });
  } catch (error) {
    console.error(`❌ Heatmap Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch heatmap data",
    });
  }
});

module.exports = router;