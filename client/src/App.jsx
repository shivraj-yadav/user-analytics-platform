import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SessionsPage from "./pages/SessionsPage";
import SessionDetailPage from "./pages/SessionDetailPage";
import HeatmapPage from "./pages/HeatmapPage";

function App() {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        <Navbar />
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<SessionsPage />} />
            <Route
              path="/sessions/:session_id"
              element={<SessionDetailPage />}
            />
            <Route path="/heatmap" element={<HeatmapPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

const NotFound = () => (
  <div style={{ textAlign: "center", padding: "80px" }}>
    <p style={{ fontSize: "60px" }}>404</p>
    <p style={{ fontSize: "20px", color: "#888" }}>Page not found</p>
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
