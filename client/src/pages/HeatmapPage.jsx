import { useState, useEffect } from "react";
import { fetchHeatmapData } from "../api";
import HeatmapCanvas from "../components/HeatmapCanvas";
import Loader from "../components/Loader";

const DEMO_PAGE_URL = "http://localhost:5000/tracker/demo.html";

const HeatmapPage = () => {
  const [pageUrl, setPageUrl] = useState(DEMO_PAGE_URL);
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);
  const [stats, setStats] = useState(null);

  // Auto fetch on mount
  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = async () => {
    if (!pageUrl.trim()) {
      setError("Please enter a valid page URL");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setFetched(false);

      const response = await fetchHeatmapData(pageUrl.trim());
      const data = response.data || [];

      setClicks(data);
      setFetched(true);

      // Calculate stats
      if (data.length > 0) {
        const xValues = data.map((c) => c.x);
        const yValues = data.map((c) => c.y);

        setStats({
          total: data.length,
          avgX: Math.round(xValues.reduce((a, b) => a + b, 0) / xValues.length),
          avgY: Math.round(yValues.reduce((a, b) => a + b, 0) / yValues.length),
          maxX: Math.max(...xValues),
          maxY: Math.max(...yValues),
        });
      } else {
        setStats(null);
      }
    } catch (err) {
      setError("Failed to fetch heatmap data. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleFetch();
  };

  const handleClear = () => {
    setClicks([]);
    setFetched(false);
    setStats(null);
    setError(null);
    setPageUrl(DEMO_PAGE_URL);
  };

  return (
    <div style={styles.container}>
      {/* ─── Page Header ──────────────────────────────── */}
      <div style={styles.header}>
        <h1 style={styles.title}>🗺️ Click Heatmap</h1>
        <p style={styles.subtitle}>
          Visualize where users are clicking on your pages
        </p>
      </div>

      {/* ─── URL Input Section ────────────────────────── */}
      <div style={styles.inputSection}>
        <div style={styles.inputWrapper}>
          <label style={styles.label}>🌐 Page URL</label>

          <div style={styles.inputRow}>
            <input
              type="text"
              value={pageUrl}
              onChange={(e) => setPageUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter page URL..."
              style={styles.input}
            />

            <button
              style={styles.fetchBtn}
              onClick={handleFetch}
              disabled={loading}
            >
              {loading ? "Fetching..." : "🔍 Fetch Clicks"}
            </button>

            <button
              style={styles.clearBtn}
              onClick={handleClear}
              disabled={loading}
            >
              🗑️ Clear
            </button>
          </div>

          {/* Quick URL Suggestion */}
          <p style={styles.suggestion}>
            💡 Try:{" "}
            <span
              style={styles.suggestionLink}
              onClick={() => setPageUrl(DEMO_PAGE_URL)}
            >
              {DEMO_PAGE_URL}
            </span>
          </p>
        </div>
      </div>

      {/* ─── Error State ──────────────────────────────── */}
      {error && <div style={styles.errorBox}>❌ {error}</div>}

      {/* ─── Loading State ────────────────────────────── */}
      {loading && <Loader message="Fetching click data..." />}

      {/* ─── Stats Bar ────────────────────────────────── */}
      {fetched && !loading && (
        <div style={styles.statsBar}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{clicks.length}</span>
            <span style={styles.statLabel}>Total Clicks</span>
          </div>

          {stats ? (
            <>
              <div style={styles.statCard}>
                <span style={styles.statNumber}>{stats.avgX}px</span>
                <span style={styles.statLabel}>Avg X Position</span>
              </div>

              <div style={styles.statCard}>
                <span style={styles.statNumber}>{stats.avgY}px</span>
                <span style={styles.statLabel}>Avg Y Position</span>
              </div>

              <div style={styles.statCard}>
                <span style={styles.statNumber}>{stats.maxX}px</span>
                <span style={styles.statLabel}>Max X</span>
              </div>

              <div style={styles.statCard}>
                <span style={styles.statNumber}>{stats.maxY}px</span>
                <span style={styles.statLabel}>Max Y</span>
              </div>
            </>
          ) : (
            <div style={styles.statCard}>
              <span style={styles.statNumber}>—</span>
              <span style={styles.statLabel}>No click data</span>
            </div>
          )}
        </div>
      )}

      {/* ─── Heatmap Canvas ───────────────────────────── */}
      {fetched && !loading && (
        <div style={styles.canvasSection}>
          {/* Legend */}
          <div style={styles.legend}>
            <span style={styles.legendTitle}>🎨 Intensity Legend:</span>
            <div style={styles.legendItems}>
              <div style={styles.legendItem}>
                <div
                  style={{ ...styles.legendDot, backgroundColor: "#ff3232" }}
                />
                <span>High</span>
              </div>
              <div style={styles.legendItem}>
                <div
                  style={{ ...styles.legendDot, backgroundColor: "#ff9632" }}
                />
                <span>Medium</span>
              </div>
              <div style={styles.legendItem}>
                <div
                  style={{ ...styles.legendDot, backgroundColor: "#ffc832" }}
                />
                <span>Low</span>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div style={styles.canvasContainer}>
            <HeatmapCanvas clicks={clicks} width={900} height={500} />
          </div>

          {/* Click Data Table */}
          {clicks.length > 0 && (
            <div style={styles.tableSection}>
              <h3 style={styles.tableTitle}>
                📋 Raw Click Data
                <span style={styles.tableCount}>({clicks.length} clicks)</span>
              </h3>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHead}>
                      <th style={styles.th}>#</th>
                      <th style={styles.th}>X Position</th>
                      <th style={styles.th}>Y Position</th>
                      <th style={styles.th}>Session ID</th>
                      <th style={styles.th}>Timestamp</th>
                    </tr>
                  </thead>

                  <tbody>
                    {clicks.map((click, index) => (
                      <tr
                        key={click._id || index}
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
                          <span style={styles.coordBadge}>{click.x}px</span>
                        </td>

                        <td style={styles.td}>
                          <span style={styles.coordBadge}>{click.y}px</span>
                        </td>

                        <td style={styles.td}>
                          <span style={styles.sessionBadge}>
                            {click.session_id
                              ? click.session_id.substring(0, 8) + "..."
                              : "N/A"}
                          </span>
                        </td>

                        <td style={styles.td}>
                          {new Date(click.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
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
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    color: "#1a1a2e",
    margin: "0 0 8px 0",
  },
  subtitle: {
    color: "#888",
    fontSize: "15px",
    margin: 0,
  },
  inputSection: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  inputWrapper: {
    width: "100%",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "10px",
  },
  inputRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    minWidth: "250px",
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    fontFamily: "monospace",
    color: "#333",
  },
  fetchBtn: {
    backgroundColor: "#4361ee",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  clearBtn: {
    backgroundColor: "#f5f5f5",
    color: "#666",
    border: "1px solid #ddd",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  suggestion: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#888",
  },
  suggestionLink: {
    color: "#4361ee",
    cursor: "pointer",
    textDecoration: "underline",
    fontFamily: "monospace",
    fontSize: "12px",
  },
  errorBox: {
    backgroundColor: "#fff0f0",
    border: "1px solid #ffcccc",
    color: "#e63946",
    padding: "14px 20px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  statsBar: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  statCard: {
    flex: 1,
    minWidth: "120px",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  statNumber: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#4361ee",
  },
  statLabel: {
    fontSize: "12px",
    color: "#888",
    marginTop: "4px",
    textAlign: "center",
  },
  canvasSection: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  legend: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  legendTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  legendItems: {
    display: "flex",
    gap: "16px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#555",
  },
  legendDot: {
    width: "14px",
    height: "14px",
    borderRadius: "50%",
  },
  canvasContainer: {
    overflowX: "auto",
    marginBottom: "30px",
  },
  tableSection: {
    marginTop: "20px",
  },
  tableTitle: {
    fontSize: "18px",
    color: "#1a1a2e",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  tableCount: {
    fontSize: "14px",
    color: "#888",
    fontWeight: "normal",
  },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "12px",
    border: "1px solid #f0f0f0",
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
    padding: "14px 20px",
    textAlign: "left",
    color: "#00ff88",
    fontWeight: "600",
    fontSize: "13px",
    fontFamily: "monospace",
  },
  tableRow: {
    borderBottom: "1px solid #f0f0f0",
    backgroundColor: "white",
    transition: "background-color 0.2s",
  },
  td: {
    padding: "14px 20px",
    fontSize: "14px",
    color: "#333",
  },
  coordBadge: {
    backgroundColor: "#f0f4ff",
    color: "#4361ee",
    padding: "4px 10px",
    borderRadius: "6px",
    fontFamily: "monospace",
    fontSize: "13px",
  },
  sessionBadge: {
    backgroundColor: "#f5f5f5",
    color: "#555",
    padding: "4px 10px",
    borderRadius: "6px",
    fontFamily: "monospace",
    fontSize: "12px",
  },
};

export default HeatmapPage;
