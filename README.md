# 🐀 Bait Guard — Intelligent Rodent Monitoring & Facility Telemetry Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite-61DAFB.svg?logo=react)]()
[![TailwindCSS](https://img.shields.io/badge/CSS-TailwindCSS%20v4-38B2AC.svg?logo=tailwind-css)]()
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933.svg?logo=node.js)]()
[![WebSocket](https://img.shields.io/badge/RealTime-WebSockets-010101.svg?logo=socketdotio)]()
[![Firebase](https://img.shields.io/badge/Auth-Firebase%20Auth-FFCA28.svg?logo=firebase)]()
[![License](https://img.shields.io/badge/license-ISC-blue.svg)]()

> **Bait Guard** is an enterprise-grade IoT rodent detection and facility telemetry platform. It bridges physical rodent monitoring stations with real-time cloud analytics, automated alert classification, and role-based access control (RBAC).

---

## 📺 Video Demonstration

Experience a full walkthrough of the Bait Guard platform in action, covering IoT telemetry, station monitoring, RBAC governance, and real-time alert dispatching:

🔗 **[Watch the Video Demonstration on Google Drive](https://drive.google.com/drive/folders/1YfIOKtQEOmgz1U_ulpWOnn_H-VqigXGV?usp=sharing)**

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Problem You Solved](#-problem-you-solved)
- [Key Features](#-key-features)
- [Screenshots](#-screenshots)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [Environment Variables](#-environment-variables)
- [Test Accounts](#-test-accounts)
- [API Reference](#-api-reference)

---

## 🌟 Project Overview

Commercial facilities—such as food processing plants, healthcare complexes, pharmaceutical hubs, and logistics warehouses—face stringent hygiene and regulatory requirements. Traditional rodent control involves manual trap inspections, which are slow, reactive, and lack real-time visibility.

**Bait Guard** solves this by providing:
1. **IoT Rodent Telemetry & Sensor Tracking**: Real-time telemetry monitoring bait consumption, battery life, ambient temperature/humidity, motion events, and tamper detection across multi-site facilities.
2. **Facility Governance & RBAC**: Role-based access control isolating data across facilities (`site_1` through `site_5`) with granular permissions for Administrators, Field Technicians, and Read-Only Viewers.
3. **Real-Time Alert Dispatching**: Sub-second alert broadcasting over WebSockets to notify technicians of critical rodent intrusions or low bait conditions.

---

## 🎯 Problem You Solved

### 1. The Facility & Pest Management Dilemma
- **Labor-Intensive Inspections**: Field technicians spend hours manually checking empty traps across sprawling warehouses. Traps with depleted bait or dead batteries often go unnoticed for weeks.
- **Delayed Intestation Response**: Unmonitored rodent activity leads to contamination, regulatory fines, and inventory destruction before anyone is alerted.
- **Fragmented Multi-Site Oversight**: Facility managers operating multiple locations lack a centralized pane of glass to audit station health, verify technician maintenance, and track compliance.

### 💡 The Bait Guard Solution
- **Automated IoT Traps**: Continuous telemetry streaming eliminates routine manual inspections; technicians only visit stations that require refills, battery swaps, or immediate incident investigation.
- **Strict Role-Based Multi-Tenancy**: Technicians only access their assigned warehouses, while Administrators maintain holistic governance, user approvals, and audit logs.
- **Instant Incident Workflow**: Automated alert triage directly connects IoT sensor events to field response teams without latency.

---

## 🚀 Key Features

### 📡 Real-Time IoT Telemetry & Station Management
- **Live Station Monitoring**: Real-time tracking of bait levels (%), battery life (%), connectivity status (Wi-Fi/Cellular), and hardware tamper events.
- **AI Motion Detection**: On-station infrared motion sensors with AI confidence scoring to distinguish rodent intrusions from false alarms.
- **Multi-Zone Filtering**: Filter stations across facilities, zones (Zone A–D), statuses (Active, Low Bait, Alert, Offline), and search queries.
- **Interactive Facility Map**: Interactive floor plan mapping stations, zone health indicators, and active alert heatmaps.

### ⚡ Real-Time WebSocket Alerts & Incident Workflow
- **Instant Event Broadcasting**: Critical rodent triggers, low-bait thresholds (<25%), and station disconnections broadcast instantly via WebSocket connections.
- **Lifecycle Triage**: Alerts progress through status workflows: `Active` → `In-Progress` → `Resolved` with full timestamped audit logs.

### 🛡️ Role-Based Access Control (RBAC) & Multi-Tenancy
- **3-Tier Permission Hierarchy**:
  - `Admin`: Full system control, station creation/editing, user approval/role assignment, and facility provisioning.
  - `Technician`: Operational management, station servicing, battery/bait refills, and alert resolution for assigned facilities.
  - `Viewer`: Read-only access to operational cards, compliance logs, and station summaries.
- **Facility Isolation**: Tenant data filtering ensures users only see stations, alerts, and metrics for their authorized facility IDs (`site_1` to `site_5`).

---

## 📸 Screenshots

### 1. Landing Page & Hero
The public landing page showcasing the Bait Guard platform ecosystem, live IoT features, and interactive access request flows.
![Landing Page](docs/screenshots/landing_page.png)

---

### 2. Authentication & RBAC Login
Secure login portal supporting Firebase Authentication, Firestore profile verification, role routing, and quick-fill test credentials.
![Login Page](docs/screenshots/login_page.png)

---

### 3. Admin Governance & Real-Time Dashboard
The central command center showing facility-wide telemetry, station status distribution, recent alert feeds, and quick navigation.
![Admin Dashboard](docs/screenshots/admin_dashboard.png)

---

### 4. Station Telemetry & Monitoring
Detailed view of all active rodent bait stations with live battery percentages, bait levels, connectivity indicators, and zone locations.
![Stations Monitoring](docs/screenshots/stations_page.png)

---

### 5. Alerts & Incident Management
Real-time incident dispatching and alert management interface for acknowledging and resolving rodent intrusions, low-bait alerts, and hardware tamper events.
![Alerts Management](docs/screenshots/alerts_page.png)

---

## 🏗️ System Architecture

### Architectural Diagram

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             Bait Guard Architecture                              │
└──────────────────────────────────────────────────────────────────────────────────┘

                       ┌─────────────────────────────────────┐
                       │          React 19 Frontend          │
                       │   (Vite + TailwindCSS + Router v7)  │
                       └──────────────────┬──────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  │ HTTPS REST (Bearer JWT)                       │ WSS (WebSockets)
                  ▼                                               ▼
     ┌────────────────────────┐                      ┌────────────────────────┐
     │   Express REST API     │                      │   WebSocket Server     │
     │   - /api/stations      │                      │   - Telemetry Stream   │
     │   - /api/alerts        │                      │   - Live Alert Push    │
     │   - /api/auth          │                      │   - Heartbeat Ping     │
     │   - /api/reports       │                      └────────────────────────┘
     └───────────┬────────────┘                                   │
                 │                                                │
    ┌────────────┼───────────────────────────┐                    │
    ▼            ▼                           ▼                    │
┌─────────┐ ┌──────────────┐      ┌─────────────────────┐         │
│  RBAC   │ │ Audit Logger │      │ In-Memory DataStore │◄────────┘
│ Auth Mw │ │  Middleware  │      │  (Reactive Events)  │
└─────────┘ └──────────────┘      └──────────┬──────────┘
                                             │
                                             ▼
                                  ┌─────────────────────┐
                                  │   Firebase Cloud    │
                                  │  (Auth & Firestore) │
                                  └─────────────────────┘
```

### Component Breakdown

1. **Frontend Presentation Tier (React 19 + Vite)**:
   - **`AuthContext` & `NotificationContext`**: Manages user authentication state, session hydration, and real-time toast alerts.
   - **Role-Based Routing (`ProtectedRoute`)**: Guards routes based on assigned user roles (`admin`, `technician`, `viewer`).
   - **Modular UI Components**: Clean separation between reusable UI components, page views, and API communication clients.

2. **API & Real-Time Gateway Tier (Express.js + `ws`)**:
   - **REST Router (`/api`)**: Endpoints for stations, alerts, users, facilities, and system settings.
   - **WebSocket Server (`/ws`)**: High-frequency telemetry broadcasting with 30s intervals and auto-reconnection.
   - **Security Middleware**: `helmet` security headers, CORS origin restriction, and JWT verification.

3. **Data Persistence & Security Tier**:
   - **In-Memory DataStore**: High-performance operational singleton store with event emitters for reactive UI updates.
   - **Cloud Firestore**: User profiles (`users/{uid}`) and access requests (`accessRequests/{id}`) governed by `firestore.rules`.
   - **Firebase Authentication**: Secure user identity verification with email/password and token generation.

---

## 💻 Tech Stack

### Frontend
- **Core**: [React 19](https://react.dev/), [Vite 8](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons & Animation**: [Lucide React](https://lucide.dev/), [@lottiefiles/dotlottie-react](https://lottiefiles.com/)
- **Auth & Storage**: [Firebase SDK v12](https://firebase.google.com/) (Auth & Cloud Firestore)

### Backend
- **Server**: [Node.js](https://nodejs.org/) (ES Modules), [Express 4.21](https://expressjs.com/)
- **Real-Time**: [`ws`](https://github.com/websockets/ws) (WebSocket Server)
- **Security**: [Helmet](https://helmetjs.github.io/), [CORS](https://github.com/expressjs/cors), [jsonwebtoken (JWT)](https://github.com/auth0/node-jsonwebtoken)
- **Logging**: [Morgan](https://github.com/expressjs/morgan)
- **Data Store**: In-Memory Reactive DataStore (Singleton)

### Cloud Infrastructure
- **Cloud Infrastructure**: Google Firebase (Authentication & Firestore Security Rules)

### Tooling & Testing
- **Testing**: Node.js Native Test Runner (`node --test`)
- **End-to-End & Screenshots**: [Playwright](https://playwright.dev/)
- **Linting**: [Oxlint](https://oxc.rs/)

---

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/ansaftab-1/bait-guard.git
cd bait-guard
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start development server
npm run dev
# Server running at http://localhost:5000 (WebSocket at ws://localhost:5000/ws)
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd Frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start Vite dev server
npm run dev
# Application running at http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend Configuration (`Backend/.env`)

| Variable | Required | Default | Description |
|---|:---:|---|---|
| `PORT` | No | `5000` | Port for Express REST API and WebSocket server |
| `HOST` | No | `0.0.0.0` | Host interface binding |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Allowed CORS origin for frontend client |
| `ENABLE_SIMULATED_TELEMETRY` | No | `true` | Enables background IoT station telemetry simulation |
| `TELEMETRY_INTERVAL_MS` | No | `30000` | Interval in milliseconds between simulated telemetry broadcasts |
| `JWT_SECRET` | No | `baitguard_super_secure...` | Secret key used to sign and verify JWT authorization tokens |
| `JWT_EXPIRY` | No | `7d` | Token validity duration |

### Frontend Configuration (`Frontend/.env`)

| Variable | Required | Default | Description |
|---|:---:|---|---|
| `VITE_ENABLE_REAL_BACKEND` | No | `true` | When `true`, connects to the Express REST & WebSocket backend |
| `VITE_API_BASE_URL` | No | `/api` | Base path or URL for backend REST endpoints |
| `VITE_WS_URL` | No | `ws://localhost:5000/ws` | WebSocket server connection URL |
| `VITE_FIREBASE_API_KEY` | Yes | — | Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | — | Firebase Auth domain |
| `VITE_FIREBASE_DATABASE_URL` | No | — | Firebase Realtime Database URL (optional) |
| `VITE_FIREBASE_PROJECT_ID` | Yes | — | Firebase Cloud Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET`| No | — | Firebase Cloud Storage bucket URL |
| `VITE_FIREBASE_MESSAGING_SENDER_ID`| No | — | Firebase Cloud Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Yes | — | Firebase Web Application ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | No | — | Google Analytics measurement ID |

---

## 👥 Test Accounts

For testing different roles and permissions, the following accounts are pre-seeded in the database:

| Role | Email | Password | Assigned Facilities | Permissions |
|---|---|---|---|---|
| **System Administrator** | `admin@baitguard.com` | `admin123` | All Facilities (`site_1`–`site_5`) | Full access, user management, station creation, facility management |
| **Field Technician** | `technician@baitguard.com` | `tech123` | Warehouse A, Warehouse B (`site_1`, `site_2`) | Station telemetry, servicing, bait refills, alert resolution |
| **Read-Only Viewer** | `user@baitguard.com` | `user123` | Warehouse A (`site_1`) | Read-only dashboard view, telemetry inspection, reports |

---

## 📡 API Reference

All backend API routes require a valid JWT token in the `Authorization: Bearer <token>` header, except `/api/auth/login` and `/api/auth/signup`.

### Authentication Endpoints
- `POST /api/auth/login` — Authenticate user and receive signed JWT.
- `POST /api/auth/signup` — Register a new account.
- `GET /api/auth/me` — Retrieve current authenticated user profile.
- `POST /api/auth/logout` — Invalidate user session.

### IoT Station Endpoints
- `GET /api/stations` — List stations with optional `facilityId`, `status`, `zone`, and `search` filters.
- `GET /api/stations/:id` — Retrieve single station telemetry details.
- `POST /api/stations` — Provision a new station *(Admin only)*.
- `PATCH /api/stations/:id` — Update station status or trigger refills.

### Alert Endpoints
- `GET /api/alerts` — List alerts with `severity`, `facilityId`, and `status` filters.
- `GET /api/alerts/:id` — Retrieve alert event details.
- `PATCH /api/alerts/:id` — Update alert status (`active`, `in_progress`, `resolved`).

---

## 📄 License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with care by the Bait Guard Engineering Team.</sub>
</div>
