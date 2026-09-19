# Bait Guard — Intelligent Rodent Monitoring & Facility Governance System

Bait Guard is an enterprise-grade rodent detection, station telemetry, and facility governance platform. It features real-time IoT station tracking, automated alert classification, role-based access control (RBAC), and cloud synchronization with Firebase and Express REST APIs.

---

## Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                 Bait Guard Platform Ecosystem               │
├──────────────────────────────┬──────────────────────────────┤
│     Cloud Firestore & Auth   │    Express Backend Engine    │
│    - users/{uid}             │    - RESTful APIs (/api)     │
│    - accessRequests/{id}     │    - Real-time WebSockets    │
│    - firestore.rules         │    - RBAC & Audit Store      │
└──────────────▲───────────────┴──────────────▲───────────────┘
               │                              │
        ┌──────┴──────────────────────────────┴──────┐
        │            React Web Dashboard             │
        │  - Admin Governance & User Management       │
        │  - Technician Telemetry & Station Controls  │
        │  - Viewer Facility Roster & Read-Only Cards │
        └────────────────────────────────────────────┘
```

---

## Key Features

- **Role-Based Access Control (RBAC)**: Enforced across 3 distinct roles: `admin`, `technician`, and `viewer`.
- **Cloud Firestore Security**: Rules strictly enforce data access, verified admin approvals, and caller authorization.
- **Real-Time Telemetry & Alerts**: Live station monitoring, battery %, bait levels, and AI rodent motion detections.
- **Admin Governance**: Review and approve/reject user access requests, change user roles, and manage facility assignments.
- **Facility Isolation**: Automatic tenant/site filtering restricting data visibility based on assigned user facility IDs.

---

## Directory Structure

```text
├── Backend/                 # Express backend server with REST APIs, RBAC, and WebSockets
│   ├── src/
│   │   ├── db/              # In-memory operational datastore
│   │   ├── middleware/      # Authentication & authorization middlewares
│   │   ├── routes/          # API routes for stations, alerts, users, and requests
│   │   └── server.js        # Main server entry point
│   └── test/                # Comprehensive test suite (RBAC tests)
├── Frontend/                # Vite + React web application
│   ├── src/
│   │   ├── api/             # HTTP client and real-time event streaming
│   │   ├── components/      # Modular, reusable UI components
│   │   ├── context/         # AuthContext and NotificationContext
│   │   ├── firebase/        # Firebase configuration and connection verification
│   │   ├── pages/           # Role-specific dashboards and administration views
│   │   └── services/        # Firebase & Auth service modules
├── firebase.rules           # Cloud Firestore security rules specification
└── firestore.rules          # Firebase CLI deployment rules alias
```

---

## Quick Start

### 1. Backend Setup
```bash
cd Backend
npm install
npm run dev
# Server running at http://localhost:5000
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
# Web application running at http://localhost:5173
```

---

## Test Accounts

| Role | Email | Password | Assigned Facilities |
|---|---|---|---|
| **System Administrator** | `admin@baitguard.com` | `admin123` | All Facilities (`site_1`–`site_5`) |
| **Field Technician** | `technician@baitguard.com` | `tech123` | Warehouse A, Warehouse B (`site_1`, `site_2`) |
| **Read-Only Viewer** | `user@baitguard.com` | `user123` | Warehouse A (`site_1`) |

---

## Lead Intelligence & Prioritization

### Problem

Sales teams may have large numbers of leads but limited time to investigate each one. Not every lead deserves the same level of attention.

### Solution

The Lead Intelligence page cleans, scores, prioritizes, and analyzes leads so users can focus on higher-value opportunities.

### Workflow

```text
COLLECT → CLEAN → VALIDATE → DEDUPLICATE → SCORE → ANALYZE → PRIORITIZE → EXPORT
```

### Key Features

- **Lead Scoring (0–100)**: Automated multi-factor scoring (industry fit, revenue, location, company size, contact completeness, website quality, data freshness)
- **Priority Classification**: `HIGH` (80–100), `MEDIUM` (60–79), `LOW` (0–59)
- **Data Quality Checks**: Per-field checklist with overall quality percentage
- **Duplicate Detection**: Domain, email, and name normalization to flag potential duplicates
- **Search & Filtering**: Combinable filters by priority, industry, location, score range, and data quality
- **AI Lead Analysis**: On-demand OpenAI analysis with structured business insights (simulated if no API key)
- **CSV Import**: Upload and auto-score leads from a CSV file
- **CSV Export**: Export the current filtered lead list with all fields

### Access

The Lead Intelligence page (`/lead-intelligence`) is accessible to **Admin** role users only.

### Architecture

```text
Frontend (React + Vite)
    ↓ useLeadsData hook
    ↓ leadsData.js API module
    ↓ apiClient (JWT Bearer token)
Backend (Express.js)
    ↓ leadsRouter.js (/api/leads)
    ↓ leadScoring.js (scoring engine)
    ↓ DataStore (in-memory, singleton)
    ↓ OpenAI API (optional, via OPENAI_API_KEY in Backend/.env)
```

### Technologies

- **Frontend**: React 19, Vite, TailwindCSS v4, lucide-react
- **Backend**: Express.js, in-memory DataStore
- **Auth**: Firebase Auth (frontend) + JWT middleware (backend)
- **AI**: OpenAI GPT-4o-mini (optional; graceful simulation fallback if key is absent)
- **Export**: Client-side CSV generation via Blob API

### AI Setup (Optional)

To enable real AI analysis, add your OpenAI key to `Backend/.env`:

```env
OPENAI_API_KEY=sk-...
```

Without this key, the "Analyze with AI" button returns a structured simulation based on the actual lead data — no fake facts are invented.

