import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSessionEvents } from "../api";
import Loader from "../components/Loader";

const SessionDetailPage = () => {
  const { session_id } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvents();
  }, [session_id]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchSessionEvents(session_id);
      setEvents(response.data || []);
    } catch (err) {
      setError("Failed to fetch session events.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getEventIcon = (event_type) => {
    switch (event_type) {
      case "page_view":
        return "👁️";
      case "click":
        return "🖱️";
      default:
        return "📌";
    }
  };

  const getEventColor = (event_type) => {
    switch (event_type) {
      case "page_view":
        return { bg: "#e8f8f5", color: "#2ec4b6" };
      case "click":
        return { bg: "#f0f4ff", color: "#4361ee" };
      default:
        return { bg: "#f9f9f9", color: "#666" };
    }
  };

  // ─── Loading State ──────────────────────────────────────
  if (loading) return <Loader message="Loading user journey..." />;

  // ─── Error State ────────────────────────────────────────
  if (error) {
    return (
      <div style={styles.errorBox}>
        <p>❌ {error}</p>
        <button style={styles.backBtn} onClick={() => navigate("/")}>
          ← Back to Sessions
        </button>
      </div>
    );
  }

  // ─── Main Render ────────────────────────────────────────
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/")}>
          ← Back
        </button>
        <div>
          <h1 style={styles.title}>🧭 User Journey</h1>
          <p style={styles.sessionLabel}>
            Session: <span style={styles.sessionId}>{session_id}</span>
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{events.length}</span>
          <span style={styles.statLabel}>Total Events</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>
            {events.filter((e) => e.event_type === "page_view").length}
          </span>
          <span style={styles.statLabel}>Page Views</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>
            {events.filter((e) => e.event_type === "click").length}
          </span>
          <span style={styles.statLabel}>Clicks</span>
        </div>
      </div>

      {/* Timeline */}
      <div style={styles.timeline}>
        {events.map((event, index) => {
          const color = getEventColor(event.event_type);
          return (
            <div key={event._id} style={styles.timelineItem}>
              {/* Step Number */}
              <div style={styles.stepNumber}>{index + 1}</div>

              {/* Connector Line */}
              {index < events.length - 1 && (
                <div style={styles.connector}></div>
              )}

              {/* Event Card */}
              <div style={styles.eventCard}>
                <div style={styles.eventCardHeader}>
                  {/* Event Type Badge */}
                  <span
                    style={{
                      ...styles.eventBadge,
                      backgroundColor: color.bg,
                      color: color.color,
                    }}
                  >
                    {getEventIcon(event.event_type)}{" "}
                    {event.event_type.replace("_", " ").toUpperCase()}
                  </span>

                  {/* Timestamp */}
                  <span style={styles.timestamp}>
                    🕐 {formatDate(event.timestamp)}
                  </span>
                </div>

                {/* Page URL */}
                <p style={styles.pageUrl}>🌐 {event.page_url}</p>

                {/* Coordinates (click only) */}
                {event.event_type === "click" &&
                  event.x !== null &&
                  event.y !== null && (
                    <div style={styles.coordinates}>
                      <span style={styles.coord}>📍 X: {event.x}px</span>
                      <span style={styles.coord}>📍 Y: {event.y}px</span>
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty Events */}
      {events.length === 0 && (
        <div style={styles.emptyBox}>
          <p>No events found for this session</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "30px",
  },
  backBtn: {
    backgroundColor: "#1a1a2e",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },
  title: {
    fontSize: "26px",
    color: "#1a1a2e",
    margin: "0 0 6px 0",
  },
  sessionLabel: {
    color: "#888",
    fontSize: "14px",
    margin: 0,
  },
  sessionId: {
    color: "#4361ee",
    fontFamily: "monospace",
    fontSize: "13px",
  },
  statsBar: {
    display: "flex",
    gap: "16px",
    marginBottom: "30px",
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#4361ee",
  },
  statLabel: {
    fontSize: "13px",
    color: "#888",
    marginTop: "4px",
  },
  timeline: {
    position: "relative",
  },
  timelineItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "16px",
    position: "relative",
  },
  stepNumber: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#1a1a2e",
    color: "#00ff88",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
    flexShrink: 0,
    fontFamily: "monospace",
  },
  connector: {
    position: "absolute",
    left: "17px",
    top: "36px",
    width: "2px",
    height: "26px",
    backgroundColor: "#e0e0e0",
  },
  eventCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "16px 20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  eventCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    flexWrap: "wrap",
    gap: "8px",
  },
  eventBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  timestamp: {
    color: "#888",
    fontSize: "13px",
  },
  pageUrl: {
    color: "#555",
    fontSize: "14px",
    margin: "0 0 8px 0",
    wordBreak: "break-all",
  },
  coordinates: {
    display: "flex",
    gap: "16px",
  },
  coord: {
    backgroundColor: "#f0f4ff",
    color: "#4361ee",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "13px",
    fontFamily: "monospace",
  },
  errorBox: {
    textAlign: "center",
    padding: "60px",
    color: "#e63946",
  },
  emptyBox: {
    textAlign: "center",
    padding: "60px",
    color: "#888",
  },
};

export default SessionDetailPage;
