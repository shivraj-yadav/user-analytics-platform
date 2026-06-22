const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    session_id: {
      type: String,
      required: [true, "Session ID is required"],
      unique: true,
      index: true,
    },

    created_at: {
      type: Date,
      default: Date.now,
    },

    last_active: {
      type: Date,
      default: Date.now,
    },

    total_events: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", SessionSchema);

module.exports = Session;