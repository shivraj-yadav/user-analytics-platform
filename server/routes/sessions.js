const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const Event = require("../models/Event");

// ─────────────────────────────────────────────────────────
// @route   GET /api/sessions
// @desc    Get all sessions with event counts
// @access  Public
// ─────────────────────────────────────────────────────────

router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find()
      .sort({ last_active: -1 })
      .select("session_id created_at last_active total_events");

    if (sessions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No sessions found",
        count: 0,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    console.error(`❌ Sessions Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions",
    });
  }
});

// ─────────────────────────────────────────────────────────
// @route   GET /api/sessions/:session_id/events
// @desc    Get all events for a specific session (user journey)
// @access  Public
// ─────────────────────────────────────────────────────────

router.get("/:session_id/events", async (req, res) => {
  try {
    const { session_id } = req.params;

    // Check if session exists
    const session = await Session.findOne({ session_id });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: `Session ${session_id} not found`,
      });
    }

    // Fetch all events for this session ordered by timestamp
    const events = await Event.find({ session_id })
      .sort({ timestamp: 1 })
      .select("event_type page_url timestamp x y");

    res.status(200).json({
      success: true,
      session_id,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error(`❌ Session Events Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch session events",
    });
  }
});

module.exports = router;