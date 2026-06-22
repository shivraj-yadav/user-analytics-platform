# CausalFunnel User Analytics Platform

A full-stack user analytics application that tracks real user interactions (page views & clicks) on webpages and visualizes them through a live analytics dashboard — built as part of the CausalFunnel Full Stack Engineer hiring assignment.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
|  Dashboard | https://user-analytics-platform-beta.vercel.app |
|  Home Demo Page | https://user-analytics-platform-72v0.onrender.com/tracker/demo.html |
|  Shop Demo Page | https://user-analytics-platform-72v0.onrender.com/tracker/demo2.html |
|  API Health | https://user-analytics-platform-72v0.onrender.com/api/health |

> ⚠️ Backend is on Render's free tier — first request may take **20-30 seconds** to wake up.

---

## 🎬 Demo Video

[ Watch Demo Video](https://www.loom.com/share/df16884182454595bbb70d48418e4c49)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Tracker | Vanilla JavaScript |
| Hosting | Vercel + Render + MongoDB Atlas |

---

## 📁 Project Structure

```
causalfunnel-user-analytics/
│
├── client/                              → React Dashboard
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js                → Axios API helper
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── HeatmapCanvas.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── pages/
│   │   │   ├── SessionsPage.jsx
│   │   │   ├── SessionDetailPage.jsx
│   │   │   └── HeatmapPage.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .env.production
│   ├── vercel.json
│   └── package.json
│
├── server/                              → Node.js Backend
│   ├── config/
│   │   └── db.js                       → MongoDB connection
│   ├── middleware/
│   │   └── errorHandler.js             → Global error handler
│   ├── models/
│   │   ├── Event.js                    → Event schema
│   │   └── Session.js                  → Session schema
│   ├── routes/
│   │   ├── health.js
│   │   ├── events.js
│   │   ├── sessions.js
│   │   └── heatmap.js
│   ├── .env.example
│   ├── index.js
│   └── package.json
│
├── tracker/                             → JS Tracking Script
│   ├── tracker.js                       → Core tracking script
│   ├── demo.html                        → Home demo page
│   └── demo2.html                       → Shop demo page
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server and database status |
| POST | `/api/events` | Track a new event |
| GET | `/api/sessions` | List all sessions with event counts |
| GET | `/api/sessions/:session_id/events` | Get full user journey for a session |
| GET | `/api/heatmap?page_url=` | Get click coordinates for heatmap |

### POST /api/events — Request Body

```json
{
  "session_id": "uuid-here",
  "event_type": "click",
  "page_url": "https://example.com/page",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "x": 350,
  "y": 220
}
```

---

## 🗄 Database Schema

### Events Collection

| Field | Type | Description |
|-------|------|-------------|
| session_id | String | Unique session identifier |
| event_type | String | `page_view` or `click` |
| page_url | String | URL where event occurred |
| timestamp | Date | When event occurred |
| x | Number | Click X coordinate (null for page_view) |
| y | Number | Click Y coordinate (null for page_view) |

### Sessions Collection

| Field | Type | Description |
|-------|------|-------------|
| session_id | String | Unique session identifier |
| created_at | Date | First event timestamp |
| last_active | Date | Most recent event timestamp |
| total_events | Number | Total event count |

---

## ⚙️ Local Setup

### Prerequisites

- Node.js v16+
- MongoDB running locally or MongoDB Atlas account
- npm

### 1. Clone Repository

```bash
git clone https://github.com/your-username/causalfunnel-user-analytics.git
cd causalfunnel-user-analytics
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `/server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/user_analytics
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create `/client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_TRACKER_URL=http://localhost:5000/tracker
```

```bash
npm run dev
```

### 4. Open in Browser

| Page | URL |
|------|-----|
| Dashboard | http://localhost:5173 |
| Home Demo | http://localhost:5000/tracker/demo.html |
| Shop Demo | http://localhost:5000/tracker/demo2.html |
| API Health | http://localhost:5000/api/health |

---

## 🚀 Deployment

### Backend — Render

```
Root Directory : server
Build Command  : npm install
Start Command  : node index.js

Environment Variables:
MONGO_URI   = your_mongodb_atlas_connection_string
NODE_ENV    = production
CLIENT_URL  = https://your-app.vercel.app
```

### Frontend — Vercel

```
Root Directory : client
Build Command  : npm run build
Output Dir     : dist

Environment Variables:
VITE_API_URL     = https://your-backend.onrender.com/api
VITE_TRACKER_URL = https://your-backend.onrender.com/tracker
```

### Database — MongoDB Atlas

- Create free M0 cluster
- Whitelist `0.0.0.0/0` for Render dynamic IPs
- Add connection string to Render environment variables

---

## 📌 Assumptions & Trade-offs

| Area | Decision | Reason |
|------|----------|--------|
| Session ID | Generated client-side using `crypto.randomUUID()` | Simple and sufficient for this scope |
| Authentication | Not implemented | Out of scope for this assignment |
| Heatmap tracking | Works only on pages with `tracker.js` installed | By design — same approach as Google Analytics |
| X/Y Coordinates | Stored as `null` for `page_view` events | Not applicable for non-click events |
| Multi-website support | Not implemented | Would require a Project ID system — architecture supports this extension |
| Real-time updates | Not implemented | Would require WebSockets |
| Render free tier | Cold start delay ~30 seconds | Free hosting trade-off |

---

## 👨‍💻 Author

**Shivraj Yadav**

| Platform | Link |
|----------|------|
| GitHub | https://github.com/shivraj-yadav |
| LinkedIn | https://www.linkedin.com/in/shivraj-yadav/ |
| Email | shivrajyadav320@gmail.com |
