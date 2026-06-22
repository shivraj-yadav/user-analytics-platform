import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import SessionsPage from "./pages/SessionsPage";
import SessionDetailPage from "./pages/SessionDetailPage";
import HeatmapPage from "./pages/HeatmapPage";

function App() {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        <Navbar />
        <div style={styles.content}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<SessionsPage />} />
              <Route
                path="/sessions/:session_id"
                element={<SessionDetailPage />}
              />
              <Route path="/heatmap" element={<HeatmapPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>
    </BrowserRouter>
  );
}

const NotFound = () => (
  <div style={{ textAlign: "center", padding: "80px" }}>
    <p style={{ fontSize: "60px" }}>🔍</p>
    <p style={{ fontSize: "24px", color: "#1a1a2e", fontWeight: "bold" }}>
      404 — Page Not Found
    </p>
    <p style={{ fontSize: "15px", color: "#888", marginTop: "10px" }}>
      The page you are looking for does not exist.
    </p>
  </div>
);

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
  },
  content: {
    padding: "20px 0",
  },
};

export default App;
