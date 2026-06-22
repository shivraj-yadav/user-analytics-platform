# CausalFunnel User Analytics

A full-stack user analytics application that tracks webpage interactions
(page views & clicks), stores session data in MongoDB, and visualizes
user journeys and click heatmaps through a React dashboard.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Tracking Script**: Vanilla JavaScript

## Project Structure

causalfunnel-user-analytics/
├── client/ → React Dashboard
├── server/ → Node.js Backend
├── tracker/ → JS Tracking Script
└── README.md

## Setup Instructions

### Prerequisites

- Node.js v16+
- MongoDB Atlas Account
- npm or yarn

### Backend Setup

cd server
npm install
cp .env.example .env

# Add your MongoDB URI in .env

npm run dev

## Environment Variables

| Variable  | Description                |
| --------- | -------------------------- |
| PORT      | Server port (default 5000) |
| MONGO_URI | MongoDB connection string  |

## API Endpoints

| Method | Endpoint    | Description         |
| ------ | ----------- | ------------------- |
| GET    | /api/health | Server health check |

## Assumptions & Trade-offs

- session_id is generated client-side for simplicity
- Events store x/y as null for non-click events
- No authentication implemented (out of scope)
