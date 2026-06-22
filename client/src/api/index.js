import axios from "axios";

// ─── Axios Instance ──────────────────────────────────────
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ─────────────────────────────────
API.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ────────────────────────────────
API.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ API Error ${error.response.status}: ${error.response.data?.message}`);
    } else if (error.request) {
      console.error("❌ No response from server. Is backend running?");
    } else {
      console.error(`❌ Request Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

// ─── Sessions APIs ───────────────────────────────────────
export const fetchSessions = async () => {
  const response = await API.get("/sessions");
  return response.data;
};

export const fetchSessionEvents = async (session_id) => {
  const response = await API.get(`/sessions/${session_id}/events`);
  return response.data;
};

// ─── Heatmap API ─────────────────────────────────────────
export const fetchHeatmapData = async (page_url) => {
  const response = await API.get(
    `/heatmap?page_url=${encodeURIComponent(page_url)}`
  );
  return response.data;
};

// ─── Health API ──────────────────────────────────────────
export const fetchHealth = async () => {
  const response = await API.get("/health");
  return response.data;
};