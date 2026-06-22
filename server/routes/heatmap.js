const express = require("express");
const router  = express.Router();
const Event   = require("../models/Event");

// @route   GET /api/heatmap?page_url=
// @desc    Get all click data for a specific page
// @access  Public

router.get("/", async (req, res, next) => {
  try {
    const { page_url } = req.query;

    // ─── Validate page_url ────────────────────────────
    if (!page_url || page_url.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "page_url query parameter is required",
        example: "/api/heatmap?page_url=http://localhost:5000/tracker/demo.html",
      });
    }

    // ─── Fetch Click Events ───────────────────────────
    const clicks = await Event.find({
      event_type: "click",
      page_url:   decodeURIComponent(page_url.trim()),
    })
      .sort({ timestamp: -1 })
      .select("x y timestamp session_id page_url");

    res.status(200).json({
      success:  true,
      page_url: decodeURIComponent(page_url),
      count:    clicks.length,
      message:  clicks.length === 0
        ? "No click data found for this page"
        : "Heatmap data fetched successfully",
      data: clicks,
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;