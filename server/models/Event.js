const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    session_id: {
      type: String,
      required: [true, "Session ID is required"],
      index: true,
    },

    event_type: {
      type: String,
      required: [true, "Event type is required"],
      enum: {
        values: ["page_view", "click"],
        message: "Event type must be page_view or click",
      },
    },

    page_url: {
      type: String,
      required: [true, "Page URL is required"],
      index: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },

    x: {
      type: Number,
      default: null,
    },

    y: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for heatmap queries
EventSchema.index({ page_url: 1, event_type: 1 });

// Compound index for session queries
EventSchema.index({ session_id: 1, timestamp: 1 });

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;