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
