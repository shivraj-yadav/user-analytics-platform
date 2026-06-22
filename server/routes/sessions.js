const express = require("express");
const router  = express.Router();
const Session = require("../models/Session");
const Event   = require("../models/Event");

// @route   GET /api/sessions
// @desc    Get all sessions with event counts
// @access  Public

router.get("/", async (req, res, next) => {
  try {
    const sessions = await Session.find()
      .sort({ last_active: -1 })
      .select("session_id created_at last_active total_events");

    res.status(200).json({
      success: true,
      count:   sessions.length,
      message: sessions.length === 0 ? "No sessions found" : "Sessions fetched successfully",
      data:    sessions,
    });

  } catch (error) {
    next(error);
  }
});

// @route   GET /api/sessions/:session_id/events
// @desc    Get all events for a specific session
// @access  Public

router.get("/:session_id/events", async (req, res, next) => {
  try {
    const { session_id } = req.params;

    // ─── Validate session_id ──────────────────────────
    if (!session_id || session_id.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "session_id is required",
      });
    }

    // ─── Check Session Exists ─────────────────────────
    const session = await Session.findOne({ session_id });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: `Session not found: ${session_id}`,
      });
    }

    // ─── Fetch Events ─────────────────────────────────
    const events = await Event.find({ session_id })
      .sort({ timestamp: 1 })
      .select("event_type page_url timestamp x y createdAt");

    res.status(200).json({
      success:    true,
      session_id,
      count:      events.length,
      message:    "Session events fetched successfully",
      data:       events,
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;