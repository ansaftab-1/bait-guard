# Bait Guard — Frontend Engineering & Architecture Guide

**Target Audience**: Frontend Engineers, Full-Stack Developers & AI Agents  
**Project Name**: Bait Guard Web Application  
**Framework**: React 19 + Vite 8 + Tailwind CSS v4 + React Router v7  
**Shared Firebase Project ID**: `bait-guard-6f470`  
**Last Updated**: September 6, 2026  

---

## 1. Executive Summary & Architecture Overview

The **Bait Guard Web Application** is an enterprise-grade IoT rodent telemetry, alert management, and facility governance frontend. Built with React 19 and Vite, it delivers sub-second operational dashboards, role-segmented user experiences, and real-time station monitoring.

The application operates on a **hybrid cloud model**:
1. **Firebase Authentication & Firestore**: Manages identity, user profiles (`users/{uid}`), and public access requests (`accessRequests/{id}`).
2. **Express REST & WebSocket Engine**: Supplies high-throughput station telemetry, automated alerts, report generation, live WebSocket broadcast events, and audit logging.

```text
┌─────────────────────────────────────────────────────────────┐
│                    Bait Guard Web Client                    │
│   (React 19 + Vite 8 + Tailwind v4 + React Router v7)       │
├──────────────────────────────┬──────────────────────────────┤
│    Firebase Cloud Layer      │    Express Backend Engine    │
│  - Firebase Auth             │  - REST APIs (/api/*)        │
│  - Firestore: users/{uid}    │  - WebSocket: ws://.../ws    │
│  - Firestore: accessRequests │  - Audit Logs & Telemetry    │
└──────────────┬───────────────┴──────────────┬───────────────┘
               │                              │
        ┌──────▼──────────────────────────────▼──────┐
        │        Application Context & Hooks         │
        │  - AuthContext (Identity & Active Role)    │
        │  - NotificationContext (Alerts/Pushes)     │
        │  - useStationsData / useAlertsData         │
        └──────────────────────┬─────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
┌──────▼────────┐       ┌──────▼────────┐       ┌──────▼────────┐
│ Admin Console │       │ Field Tech UI │       │ Viewer Portal │
│ - Governance  │       │ - Maintenance │       │ - Read-Only   │
│ - RBAC Engine │       │ - Station Map │       │ - KPIs & PDF  │
└───────────────┘       └───────────────┘       └───────────────┘
```

---

## 2. Directory Structure

```text
Frontend/
├── index.html                  # HTML5 entry shell
├── package.json                # Dependencies, build scripts, lint commands
├── vite.config.ts              # Vite 8 config with React & Tailwind plugins
└── src/
    ├── main.jsx                # DOM mounting & root instantiation
    ├── App.jsx                 # Route registry & ProtectedRoute definitions
    ├── index.css               # Global theme tokens & Tailwind v4 directives
    ├── api/                    # HTTP client & backend data services
    │   ├── client.js           # Fetch wrapper with JWT headers & error handling
    │   ├── config.js           # API base URLs & environment settings
    │   ├── stationsData.js     # Station telemetry & CRUD operations
    │   ├── alertsData.js       # Alert classification & resolution APIs
    │   ├── reportsData.js      # Aggregated metric endpoints & export jobs
    │   ├── overview.js         # KPI metrics for dashboard header counters
    │   ├── mapData.js          # GeoJSON station coordinates & status
    │   └── settingsData.js     # Account & facility configuration
    ├── components/             # Reusable UI components
    │   ├── auth/               # ProtectedRoute & RoleGate components
    │   ├── layout/             # DashboardLayout, Sidebar, Navbar, Breadcrumbs
    │   ├── overview/           # KPI cards, station health cards, quick actions
    │   ├── stations/           # StationsTable, DetailSidebar, Modals
    │   ├── reports/            # Data tables, export modals, KPI charts
    │   ├── settings/           # Profile, security, notifications cards
    │   └── ui/                 # StatCard, PageLoader, ErrorState, Chip, Modals
    ├── context/                # Global React Context providers
    │   ├── AuthContext.jsx     # Current user, role, permissions, auth status
    │   └── NotificationContext.jsx # In-app notification queue & web-push state
    ├── firebase/               # Firebase SDK client initialization
    │   └── config.js           # Firebase app, auth, and firestore singletons
    ├── hooks/                  # Custom lifecycle & SWR-like caching hooks
    │   ├── useStationsData.js  # Station query & polling hook
    │   ├── useAlertsData.js    # Alert feed hook
    │   ├── useOverviewData.js  # Summary KPIs hook
    │   ├── useReportsData.js   # Analytics ledger hook
    │   └── useSettingsData.js  # User preferences hook
    ├── pages/                  # Route view components
    │   ├── Landing-page.jsx    # Public showcase & product marketing
    │   ├── LoginPage.jsx       # Email/password authentication
    │   ├── RequestAccessPage.jsx # New user onboarding request form
    │   ├── StationsPage.jsx    # Central station monitoring list
    │   ├── StationDetailPage.jsx # Individual station sensors & logs
    │   ├── AlertsPage.jsx      # System warning and rodent detection feed
    │   ├── FacilityMapPage.jsx # Interactive floor plan / geo map
    │   ├── ReportsPage.jsx     # Audit reports & CSV/PDF exporter
    │   ├── SettingsPage.jsx    # User profile & organization preferences
    │   ├── dashboards/         # Role-specific primary views
    │   │   ├── AdminDashboard.jsx
    │   │   ├── TechnicianDashboard.jsx
    │   │   └── ViewerDashboard.jsx
    │   └── admin/              # Admin-only governance workflows
    │       ├── AdminUsersPage.jsx
    │       ├── AdminSystemPage.jsx
    │       ├── AddUserPage.jsx
    │       └── AddSitePage.jsx
    ├── services/               # Firestore & business services
    │   ├── authService.js      # Login, sign-up, sign-out, profile sync
    │   ├── accessRequestService.js # Access requests lifecycle
    │   ├── userService.js      # Firestore user queries
    │   └── notificationService.js # Notification dispatch & storage
    └── utils/                  # Utility helpers & role permission gates
        ├── permissions.js      # Permission matrices & capability checks
        ├── cleanupLegacyMocks.js # Storage hygiene
        └── testFirebaseConnection.js # Health test utility
```

---

## 3. Authentication & Role-Based Access Control (RBAC)

### 3.1 Role Hierarchy

Bait Guard enforces three hierarchical roles:

| Role | Hierarchy Level | Capabilities | Assigned Landing Route |
|---|---|---|---|
| `admin` | Level 3 (Superuser) | Full read/write, user management, site creation, role approvals, audit log inspection | `/admin/dashboard` |
| `technician` | Level 2 (Operator) | Station create/update, battery replacement, alert resolution, telemetry logging | `/technician/dashboard` |
| `viewer` | Level 1 (Auditor) | Read-only dashboards, report generation, station ledger inspection | `/viewer/dashboard` |

### 3.2 Route Protection (`ProtectedRoute.jsx`)

Routes are secured using higher-order route wrappers:

```jsx
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <DashboardLayout>
        <AdminDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
```

When an unauthorized user attempts access:
- If unauthenticated: Redirected to `/login?redirect=...`.
- If role does not match: Redirected to `/unauthorized` with an option to request elevated permissions.

---

## 4. Dual Data Layer Architecture

### 4.1 Firebase Cloud Operations
- **Authentication**: Managed through Firebase Auth SDK.
- **Identity Profile**: Stored in `users/{uid}` with fields:
  - `email`: string
  - `role`: `'admin' | 'technician' | 'viewer'`
  - `facilityIds`: array of site identifiers (e.g., `['site_1', 'site_2']`)
  - `createdAt`, `updatedAt`: Firestore Timestamp
- **Access Requests**: Stored in `accessRequests/{requestId}` for approval by Admins.

### 4.2 Backend REST & WebSocket Operations
- **Base Endpoint**: `http://localhost:5000/api`
- **Real-Time WebSocket**: `ws://localhost:5000/ws`
- **Events**:
  - `station:telemetry`: Emitted on live sensor reading updates (battery %, bait level).
  - `alert:created`: High-priority trigger on rodent detection.
  - `alert:resolved`: Dispatched when technician clears an issue.

---

## 5. Development & Verification Workflows

### 5.1 Environment Variables (`.env`)
```bash
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=bait-guard-6f470.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bait-guard-6f470
VITE_FIREBASE_STORAGE_BUCKET=bait-guard-6f470.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=609454017958
VITE_FIREBASE_APP_ID=your-app-id
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000/ws
```

### 5.2 Scripts & Commands
```bash
# Start local development server
npm run dev

# Run static analysis / linter
npm run lint

# Compile production bundle
npm run build

# Preview production build locally
npm run preview
```
