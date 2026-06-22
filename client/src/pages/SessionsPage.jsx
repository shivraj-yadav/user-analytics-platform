import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSessions } from "../api";
import Loader from "../components/Loader";

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchSessions();
      setSessions(response.data || []);
    } catch (err) {
      setError("Failed to fetch sessions. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const shortenSessionId = (id) => {
    return id.substring(0, 8) + "...";
  };

  // ─── Loading State ──────────────────────────────────────
  if (loading) return <Loader message="Fetching sessions..." />;

  // ─── Error State ────────────────────────────────────────
  if (error) {
    return (
      <div style={styles.errorBox}>
        <p>❌ {error}</p>
        <button style={styles.retryBtn} onClick={loadSessions}>
          Retry
        </button>
      </div>
    );
  }

  // ─── Empty State ────────────────────────────────────────
  if (sessions.length === 0) {
    return (
      <div style={styles.emptyBox}>
        <p style={styles.emptyIcon}>📭</p>
        <p style={styles.emptyText}>No sessions found</p>
        <p style={styles.emptySubText}>
          Open the{" "}
          <a
            href="http://localhost:5000/tracker/demo.html"
            target="_blank"
            rel="noreferrer"
            style={styles.demoLink}
          >
            Demo Page
          </a>{" "}
          and interact to generate sessions.
        </p>
      </div>
    );
  }

  // ─── Sessions Table ─────────────────────────────────────
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📋 Sessions</h1>
        <div style={styles.badge}>{sessions.length} Total Sessions</div>
      </div>

      {/* Refresh Button */}
      <button style={styles.refreshBtn} onClick={loadSessions}>
        🔄 Refresh
      </button>

      {/* Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHead}>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Session ID</th>
              <th style={styles.th}>Total Events</th>
              <th style={styles.th}>First Seen</th>
              <th style={styles.th}>Last Active</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {sessions.map((session, index) => (
              <tr
                key={session.session_id}
                style={styles.tableRow}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0f4ff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                <td style={styles.td}>{index + 1}</td>

                <td style={styles.td}>
                  <span style={styles.sessionIdBadge}>
                    {shortenSessionId(session.session_id)}
                  </span>
                </td>

                <td style={styles.td}>
                  <span style={styles.eventCountBadge}>
                    {session.total_events} events
                  </span>
                </td>

                <td style={styles.td}>{formatDate(session.created_at)}</td>

                <td style={styles.td}>{formatDate(session.last_active)}</td>

                <td style={styles.td}>
                  <button
                    style={styles.viewBtn}
                    onClick={() => navigate(`/sessions/${session.session_id}`)}
                  >
                    View Journey →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "28px",
    color: "#1a1a2e",
    margin: 0,
  },
  badge: {
    backgroundColor: "#4361ee",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "14px",
  },
  refreshBtn: {
    backgroundColor: "#f0f4ff",
    border: "1px solid #4361ee",
    color: "#4361ee",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "20px",
  },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "12px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
  },
  tableHead: {
    backgroundColor: "#1a1a2e",
  },
  th: {
    padding: "16px 20px",
    textAlign: "left",
    color: "#00ff88",
    fontWeight: "600",
    fontSize: "14px",
    fontFamily: "monospace",
  },
  tableRow: {
    borderBottom: "1px solid #f0f0f0",
    backgroundColor: "white",
    transition: "background-color 0.2s",
  },
  td: {
    padding: "16px 20px",
    fontSize: "14px",
    color: "#333",
  },
  sessionIdBadge: {
    backgroundColor: "#f0f4ff",
    color: "#4361ee",
    padding: "4px 10px",
    borderRadius: "6px",
    fontFamily: "monospace",
    fontSize: "13px",
  },
  eventCountBadge: {
    backgroundColor: "#e8f8f5",
    color: "#2ec4b6",
    padding: "4px 10px",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "13px",
  },
  viewBtn: {
    backgroundColor: "#4361ee",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  },
  errorBox: {
    textAlign: "center",
    padding: "60px",
    color: "#e63946",
  },
  retryBtn: {
    marginTop: "16px",
    padding: "10px 24px",
    backgroundColor: "#e63946",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
  },
  emptyBox: {
    textAlign: "center",
    padding: "80px",
  },
  emptyIcon: {
    fontSize: "60px",
    marginBottom: "10px",
  },
  emptyText: {
    fontSize: "22px",
    color: "#333",
    fontWeight: "600",
  },
  emptySubText: {
    fontSize: "15px",
    color: "#888",
    marginTop: "10px",
  },
  demoLink: {
    color: "#4361ee",
  },
};

export default SessionsPage;
