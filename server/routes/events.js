const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Session = require("../models/Session");

// @route   POST /api/events
// @desc    Receive and store tracking events
// @access  Public

router.post("/", async (req, res) => {
  try {
    const { session_id, event_type, page_url, timestamp, x, y } = req.body;

    // ─── Validation ──────────────────────────────────────
    if (!session_id || !event_type || !page_url) {
      return res.status(400).json({
        success: false,
        message: "session_id, event_type, and page_url are required",
      });
    }

    if (!["page_view", "click"].includes(event_type)) {
      return res.status(400).json({
        success: false,
        message: "event_type must be page_view or click",
      });
    }

    // ─── Save Event ──────────────────────────────────────
    const newEvent = await Event.create({
      session_id,
      event_type,
      page_url,
      timestamp: timestamp || Date.now(),
      x: event_type === "click" ? x : null,
      y: event_type === "click" ? y : null,
    });

    // ─── Create or Update Session ────────────────────────
    const existingSession = await Session.findOne({ session_id });

    if (existingSession) {
      existingSession.last_active = new Date();
      existingSession.total_events += 1;
      await existingSession.save();
    } else {
      await Session.create({
        session_id,
        created_at: new Date(),
        last_active: new Date(),
        total_events: 1,
      });
    }

    // ─── Response ────────────────────────────────────────
    res.status(201).json({
      success: true,
      message: "Event recorded successfully",
      data: {
        event_id: newEvent._id,
        session_id: newEvent.session_id,
      },
    });
  } catch (error) {
    console.error(`❌ Event Error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to record event",
    });
  }
});

module.exports = router;