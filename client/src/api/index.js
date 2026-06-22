import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ─── Sessions APIs ────────────────────────────────────────

// Fetch all sessions
export const fetchSessions = async () => {
  const response = await API.get("/sessions");
  return response.data;
};

// Fetch all events for a specific session
export const fetchSessionEvents = async (session_id) => {
  const response = await API.get(`/sessions/${session_id}/events`);
  return response.data;
};

// ─── Heatmap API ──────────────────────────────────────────

// Fetch click data for a page
export const fetchHeatmapData = async (page_url) => {
  const response = await API.get(
    `/heatmap?page_url=${encodeURIComponent(page_url)}`
  );
  return response.data;
};