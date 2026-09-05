import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PageLoader from './components/ui/PageLoader'
import { ROLES } from './services/authService'

// Lazy-loaded routes for code-splitting & performance optimization
const LandingPage = lazy(() => import('./pages/Landing-page'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'))
const RequestAccessPage = lazy(() => import('./pages/RequestAccessPage'))
const SubmissionConfirmedPage = lazy(() => import('./pages/SubmissionConfirmedPage'))
const FacilityMapPage = lazy(() => import('./pages/FacilityMapPage'))
const StationsPage = lazy(() => import('./pages/StationsPage'))
const StationDetailPage = lazy(() => import('./pages/StationDetailPage'))
const AddStationPage = lazy(() => import('./pages/AddStationPage'))
const EditStationPage = lazy(() => import('./pages/EditStationPage'))
const AlertsPage = lazy(() => import('./pages/AlertsPage'))
const AlertDetailPage = lazy(() => import('./pages/AlertDetailPage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const EditProfilePage = lazy(() => import('./pages/EditProfilePage'))
const ContactAdminPage = lazy(() => import('./pages/ContactAdminPage'))
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage'))

const AdminDashboard = lazy(() => import('./pages/dashboards/AdminDashboard'))
const ViewerDashboard = lazy(() => import('./pages/dashboards/ViewerDashboard'))
const TechnicianDashboard = lazy(() => import('./pages/dashboards/TechnicianDashboard'))
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'))
const AdminSystemPage = lazy(() => import('./pages/admin/AdminSystemPage'))
const AddSitePage = lazy(() => import('./pages/admin/AddSitePage'))
const AddUserPage = lazy(() => import('./pages/admin/AddUserPage'))

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Standalone Pages (Full screen, no sidebar layout) */}
              <Route path="/" element={<Navigate to="/landing" replace />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/Landing-page" element={<LandingPage />} />
              <Route path="/request-demo" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage initialMode="signin" />} />
              <Route path="/signup" element={<LoginPage initialMode="signup" />} />
              <Route path="/request-access" element={<RequestAccessPage />} />
              <Route path="/request-access/confirmed" element={<SubmissionConfirmedPage />} />
              <Route path="/request-access/confirm" element={<SubmissionConfirmedPage />} />
              <Route path="/request-access-confirmed" element={<SubmissionConfirmedPage />} />
              <Route path="/submission-confirmed" element={<SubmissionConfirmedPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* ─── Role-Based Dashboard Routes ─── */}
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

              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <DashboardLayout>
                      <AdminUsersPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/system"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <DashboardLayout>
                      <AdminSystemPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/system/add-site"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <DashboardLayout>
                      <AddSitePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/system/add-user"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <DashboardLayout>
                      <AddUserPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />


              <Route path="/dashboard" element={<Navigate to="/dashboard/viewer" replace />} />

              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <DashboardLayout>
                      <AdminDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/viewer"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TECHNICIAN, ROLES.VIEWER]}>
                    <DashboardLayout>
                      <ViewerDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/technician"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TECHNICIAN]}>
                    <DashboardLayout>
                      <TechnicianDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="/viewer/dashboard" element={<Navigate to="/dashboard/viewer" replace />} />
              <Route path="/technician/dashboard" element={<Navigate to="/dashboard/technician" replace />} />
              <Route
                path="/dashboard/operator"
                element={<Navigate to="/admin/dashboard" replace />}
              />


              <Route
                path="/facility-map"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <FacilityMapPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stations"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <StationsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stations/add"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <DashboardLayout>
                      <AddStationPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stations/:stationId"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <StationDetailPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stations/:stationId/edit"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <DashboardLayout>
                      <EditStationPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/alerts"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AlertsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alerts/:alertId"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AlertDetailPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ReportsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <SettingsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/edit-profile"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <EditProfilePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/edit-profile/:userId"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <EditProfilePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings/contact-admin"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ContactAdminPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/change-password"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ChangePasswordPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  )
}
