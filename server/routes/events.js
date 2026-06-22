const express   = require("express");
const router    = express.Router();
const Event     = require("../models/Event");
const Session   = require("../models/Session");

// @route   POST /api/events
// @desc    Receive and store tracking events
// @access  Public

router.post("/", async (req, res, next) => {
  try {
    const { session_id, event_type, page_url, timestamp, x, y } = req.body;

    // ─── Validate Required Fields ─────────────────────
    if (!session_id || !event_type || !page_url) {
      return res.status(400).json({
        success: false,
        message: "session_id, event_type and page_url are required",
        received: { session_id, event_type, page_url },
      });
    }

    // ─── Validate Event Type ──────────────────────────
    if (!["page_view", "click"].includes(event_type)) {
      return res.status(400).json({
        success: false,
        message: "event_type must be page_view or click",
      });
    }

    // ─── Validate Click Coordinates ───────────────────
    if (event_type === "click") {
      if (x === undefined || x === null || y === undefined || y === null) {
        return res.status(400).json({
          success: false,
          message: "x and y coordinates are required for click events",
        });
      }

      if (typeof x !== "number" || typeof y !== "number") {
        return res.status(400).json({
          success: false,
          message: "x and y must be numbers",
        });
      }
    }

    // ─── Save Event ───────────────────────────────────
    const newEvent = await Event.create({
      session_id,
      event_type,
      page_url,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      x: event_type === "click" ? x : null,
      y: event_type === "click" ? y : null,
    });

    // ─── Create or Update Session ─────────────────────
    await Session.findOneAndUpdate(
      { session_id },
      {
        $set:  { last_active: new Date() },
        $inc:  { total_events: 1 },
        $setOnInsert: {
          session_id,
          created_at: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: "Event recorded successfully",
      data: {
        event_id:   newEvent._id,
        session_id: newEvent.session_id,
        event_type: newEvent.event_type,
      },
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;