const express      = require("express");
const cors         = require("cors");
const dotenv       = require("dotenv");
const path         = require("path");
const connectDB    = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// ─── CORS Configuration ───────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all for tracker script
      }
    },
    methods:     ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ─── Middleware ───────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve tracker static files
app.use(
  "/tracker",
  express.static(path.join(__dirname, "../tracker"))
);

// Request Logger
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────
app.use("/api/health",   require("./routes/health"));
app.use("/api/events",   require("./routes/events"));
app.use("/api/sessions", require("./routes/sessions"));
app.use("/api/heatmap",  require("./routes/heatmap"));

// ─── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("─────────────────────────────────────");
  console.log(`🚀 Server    : http://localhost:${PORT}`);
  console.log(`❤️  Health    : http://localhost:${PORT}/api/health`);
  console.log(`📋 Sessions  : http://localhost:${PORT}/api/sessions`);
  console.log(`🗺️  Heatmap   : http://localhost:${PORT}/api/heatmap?page_url=`);
  console.log(`🧪 Demo Page : http://localhost:${PORT}/tracker/demo.html`);
  console.log(`🌍 Env       : ${process.env.NODE_ENV || "development"}`);
  console.log("─────────────────────────────────────");
});