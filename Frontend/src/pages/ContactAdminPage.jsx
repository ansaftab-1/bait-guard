import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import {
  CheckCircle,
  XCircle,
  Clock,
  SendHorizontal,
  ShieldAlert,
  Sparkles,
  Wrench,
  Shield,
  Eye,
  ArrowRight,
  Users,
  FileCheck2,
  History,
  Save,
  Check,
  RefreshCw,
} from 'lucide-react';

export default function ContactAdminPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const currentRole = (user?.role || 'viewer').toLowerCase();
  const isAdmin = currentRole === 'admin';

  const currentRoleLabel =
    currentRole === 'admin'
      ? 'System Administrator'
      : currentRole === 'technician'
      ? 'Field Technician'
      : 'Read-Only Viewer';

  // Active view tab for admin
  const [activeTab, setActiveTab] = useState(isAdmin ? 'users' : 'request');

  // ─── Requester State (Viewer / Technician) ─────────────────────────────────
  const [facility, setFacility] = useState('Warehouse A');
  const [requestedRole, setRequestedRole] = useState(currentRole === 'viewer' ? 'Technician' : 'Admin');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [myRequests, setMyRequests] = useState([]);

  // ─── Admin Management State ───────────────────────────────────────────────
  const [systemUsers, setSystemUsers] = useState([]);
  const [roleRequests, setRoleRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userRoleDrafts, setUserRoleDrafts] = useState({});
  const [savingUserId, setSavingUserId] = useState(null);
  const [processingRequestId, setProcessingRequestId] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Quick auto-fill templates for easy & fun role upgrade requests
  const applyTemplate = (role, fac, subj, msg) => {
    setRequestedRole(role);
    setFacility(fac);
    setSubject(subj);
    setMessage(msg);
  };

  const rolePerks = {
    Technician: [
      'Manage bait stations & record refills',
      'Resolve critical & warning rodent alerts',
      'Generate inspection and trap maintenance logs',
    ],
    Admin: [
      'Full facility access & device provisioning',
      'Approve team member requests & assign roles',
      'System-wide settings & audit logs',
    ],
    Viewer: [
      'Live station telemetry monitoring',
      'Facility overview & status reports',
    ],
  };

  // Load Admin Data (Users, Requests, Audit Logs) or Requester's own requests
  const loadData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      if (isAdmin) {
        const [usersRes, reqsRes, logsRes] = await Promise.allSettled([
          apiClient.get('/users'),
          apiClient.get('/role-requests'),
          apiClient.get('/audit-logs'),
        ]);

        if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value)) {
          setSystemUsers(usersRes.value);
          const initialDrafts = {};
          usersRes.value.forEach((u) => {
            initialDrafts[u.id] = u.role;
          });
          setUserRoleDrafts(initialDrafts);
        }

        if (reqsRes.status === 'fulfilled' && Array.isArray(reqsRes.value)) {
          setRoleRequests(reqsRes.value);
        }

        if (logsRes.status === 'fulfilled' && Array.isArray(logsRes.value)) {
          setAuditLogs(logsRes.value);
        }
      } else {
        const reqs = await apiClient.get('/role-requests');
        if (Array.isArray(reqs)) {
          setMyRequests(reqs);
        }
      }
    } catch (err) {
      console.warn('[ContactAdminPage] loadData:', err.message);
    } finally {
      setIsLoadingData(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Requester Action: Submit Role Request ─────────────────────────────────
  const handleSendRequest = async (e) => {
    if (e) e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setIsSubmitting(true);

    const finalSubject = subject.trim() || `Requesting ${requestedRole} role for ${facility}`;
    const finalMessage = message.trim() || `Hi Administrator, please upgrade my account role to ${requestedRole} with access to ${facility}. Thank you!`;

    try {
      const response = await apiClient.post('/role-requests', {
        requestedRole: requestedRole.toLowerCase(),
        facility,
        subject: finalSubject,
        message: finalMessage,
      });

      if (response && response.success) {
        setSubmitSuccess(`Your request for the "${requestedRole}" role was successfully submitted and is awaiting administrator review.`);
        setSubject('');
        setMessage('');
        loadData();
      } else {
        throw new Error(response?.error || 'Failed to submit request');
      }
    } catch (err) {
      const msg = err.body?.message || err.message || 'Failed to submit role request';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Admin Action: Change User Role Directly ───────────────────────────────
  const handleSaveUserRole = async (targetUser) => {
    const targetRole = userRoleDrafts[targetUser.id];
    if (!targetRole || targetRole === targetUser.role) return;

    setSavingUserId(targetUser.id);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await apiClient.patch(`/users/${targetUser.id}/role`, {
        role: targetRole,
        reason: `Direct administrative role assignment by ${user.email}`,
      });

      if (res && res.success) {
        setStatusMessage({
          type: 'success',
          text: `Role for ${targetUser.name} (${targetUser.email}) successfully changed from "${targetUser.role}" to "${targetRole}".`,
        });
        await loadData();
        if (refreshUser) refreshUser();
      } else {
        throw new Error(res?.message || 'Failed to update role');
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.body?.message || err.message || 'Failed to change user role',
      });
    } finally {
      setSavingUserId(null);
    }
  };

  // ─── Admin Action: Approve Role Request ────────────────────────────────────
  const handleApproveRequest = async (requestId) => {
    setProcessingRequestId(requestId);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await apiClient.patch(`/role-requests/${requestId}/approve`);
      if (res && res.success) {
        setStatusMessage({
          type: 'success',
          text: `Role request approved! User ${res.user?.name || ''} is now authorized as "${res.user?.role || 'upgraded'}".`,
        });
        await loadData();
        if (refreshUser) refreshUser();
      } else {
        throw new Error(res?.message || 'Failed to approve request');
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.body?.message || err.message || 'Failed to approve request',
      });
    } finally {
      setProcessingRequestId(null);
    }
  };

  // ─── Admin Action: Reject Role Request ─────────────────────────────────────
  const handleRejectRequest = async (requestId) => {
    setProcessingRequestId(requestId);
    setStatusMessage({ type: '', text: '' });

    try {
      const res = await apiClient.patch(`/role-requests/${requestId}/reject`, {
        reason: 'Administrative review decision',
      });
      if (res && res.success) {
        setStatusMessage({
          type: 'info',
          text: 'Role request was rejected. The user\'s current role remains unchanged.',
        });
        await loadData();
      } else {
        throw new Error(res?.message || 'Failed to reject request');
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.body?.message || err.message || 'Failed to reject request',
      });
    } finally {
      setProcessingRequestId(null);
    }
  };

  const pendingRequests = roleRequests.filter((r) => r.status === 'pending');

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight">
            Contact Administration & Role Governance
          </h1>
          <p className="text-sm text-[#64748b] font-medium mt-1">
            {isAdmin
              ? 'Manage user roles in real-time, approve/reject role upgrade requests, and inspect audit logs'
              : 'Request upgraded role permissions, facility access, or message system administrators'}
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={loadData}
            disabled={isLoadingData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#e2e8f0] bg-white text-xs font-bold text-[#475569] hover:bg-[#f8fafc] transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
            <span>Sync Database</span>
          </button>
        )}
      </div>

      {/* Global Status Banner */}
      {statusMessage.text && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center justify-between gap-3 animate-in fade-in text-sm font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            type="button"
            onClick={() => setStatusMessage({ type: '', text: '' })}
            className="text-xs font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs (Admin Mode) */}
      {isAdmin && (
        <div className="flex border-b border-[#e2e8f0] mb-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'border-[#2563eb] text-[#2563eb]'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Roles ({systemUsers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer relative ${
              activeTab === 'requests'
                ? 'border-[#2563eb] text-[#2563eb]'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Pending Requests</span>
            {pendingRequests.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#ef4444] text-white text-[10px] font-extrabold">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'border-[#2563eb] text-[#2563eb]'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('request')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'request'
                ? 'border-[#2563eb] text-[#2563eb]'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <SendHorizontal className="w-4 h-4" />
            <span>Test Request Form</span>
          </button>
        </div>
      )}

      {/* ══════════════ TAB 1: User Role Management (Admin) ══════════════ */}
      {isAdmin && activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#e2e8f0] flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-[#101828]">System User Directory & Roles</h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Change any user's role directly in the backend database. New permissions activate on their next request.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]">
              Database Single Source of Truth
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] text-[#64748b] font-bold uppercase tracking-wider text-[11px] border-b border-[#eaecf0]">
                  <th className="py-3 px-5">Name & User</th>
                  <th className="py-3 px-5">Email Address</th>
                  <th className="py-3 px-5">Current Database Role</th>
                  <th className="py-3 px-5">Assign New Role</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {systemUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#94a3b8]">
                      No users found in database.
                    </td>
                  </tr>
                ) : (
                  systemUsers.map((u) => {
                    const draftRole = userRoleDrafts[u.id] || u.role;
                    const hasChanged = draftRole !== u.role;
                    const isSaving = savingUserId === u.id;

                    return (
                      <tr key={u.id} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-3.5 px-5 font-bold text-[#0f172a]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#eff6ff] border border-[#bfdbfe] text-[#2563eb] font-extrabold flex items-center justify-center text-xs">
                              {u.initials || u.name?.slice(0, 2).toUpperCase() || 'US'}
                            </div>
                            <div>
                              <div>{u.name}</div>
                              <div className="text-[10px] text-[#94a3b8] font-mono">{u.id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-5 text-[#475569] font-medium font-mono text-[11.5px]">
                          {u.email}
                        </td>

                        <td className="py-3.5 px-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                              u.role === 'admin'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : u.role === 'technician'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {u.role === 'admin' && <Shield className="w-3.5 h-3.5" />}
                            {u.role === 'technician' && <Wrench className="w-3.5 h-3.5" />}
                            {u.role === 'viewer' && <Eye className="w-3.5 h-3.5" />}
                            <span className="capitalize">{u.role}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-5">
                          <select
                            value={draftRole}
                            onChange={(e) =>
                              setUserRoleDrafts({ ...userRoleDrafts, [u.id]: e.target.value })
                            }
                            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                              hasChanged
                                ? 'border-[#2563eb] bg-[#eff6ff] text-[#1d4ed8] ring-2 ring-[#2563eb]/20'
                                : 'border-[#cbd5e1] bg-white text-[#334155]'
                            }`}
                          >
                            <option value="viewer">Viewer (Read-Only)</option>
                            <option value="technician">Technician (Field Maintenance)</option>
                            <option value="admin">Admin (System Governance)</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => handleSaveUserRole(u)}
                            disabled={!hasChanged || isSaving}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              hasChanged
                                ? 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-xs'
                                : 'bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed'
                            }`}
                          >
                            {isSaving ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Save className="w-3.5 h-3.5" />
                            )}
                            <span>{isSaving ? 'Saving...' : 'Save Role'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════ TAB 2: Pending Role Requests (Admin) ══════════════ */}
      {isAdmin && activeTab === 'requests' && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#e2e8f0]">
            <h2 className="text-base font-extrabold text-[#101828]">Pending Role Upgrade Requests</h2>
            <p className="text-xs text-[#64748b] mt-0.5">
              Review and approve or reject role upgrade submissions. Approval updates the user's role atomically in the database.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] text-[#64748b] font-bold uppercase tracking-wider text-[11px] border-b border-[#eaecf0]">
                  <th className="py-3 px-5">Requester</th>
                  <th className="py-3 px-5">Current Role</th>
                  <th className="py-3 px-5">Requested Role</th>
                  <th className="py-3 px-5">Facility / Message</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Decisions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {roleRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#94a3b8]">
                      No role requests recorded.
                    </td>
                  </tr>
                ) : (
                  roleRequests.map((req) => {
                    const isPending = req.status === 'pending';
                    const isProcessing = processingRequestId === req.id;

                    return (
                      <tr key={req.id} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="font-bold text-[#0f172a]">{req.fullName}</div>
                          <div className="text-[11px] text-[#64748b] font-mono">{req.userEmail}</div>
                        </td>

                        <td className="py-3.5 px-5 font-semibold text-[#475569] capitalize">
                          {req.currentRole}
                        </td>

                        <td className="py-3.5 px-5">
                          <span className="font-extrabold text-[#2563eb] capitalize bg-[#eff6ff] px-2.5 py-1 rounded-md border border-[#bfdbfe]">
                            {req.requestedRole}
                          </span>
                        </td>

                        <td className="py-3.5 px-5 max-w-xs">
                          <div className="font-bold text-[#1e293b]">{req.facility}</div>
                          <div className="text-[11px] text-[#64748b] truncate">{req.message}</div>
                        </td>

                        <td className="py-3.5 px-5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              req.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : req.status === 'rejected'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {req.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                            {req.status === 'rejected' && <XCircle className="w-3 h-3" />}
                            {req.status === 'pending' && <Clock className="w-3 h-3" />}
                            <span className="capitalize">{req.status}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-5 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleApproveRequest(req.id)}
                                disabled={isProcessing}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectRequest(req.id)}
                                disabled={isProcessing}
                                className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#94a3b8] italic">
                              Reviewed by {req.reviewedBy || 'Admin'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════ TAB 3: Audit Trail (Admin) ══════════════ */}
      {isAdmin && activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#e2e8f0]">
            <h2 className="text-base font-extrabold text-[#101828]">Security & Role Governance Audit Logs</h2>
            <p className="text-xs text-[#64748b] mt-0.5">
              Immutable audit records for all role assignments, privilege escalations, and request decisions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] text-[#64748b] font-bold uppercase tracking-wider text-[11px] border-b border-[#eaecf0]">
                  <th className="py-3 px-5">Timestamp</th>
                  <th className="py-3 px-5">Action Event</th>
                  <th className="py-3 px-5">Target User</th>
                  <th className="py-3 px-5">Role Modification</th>
                  <th className="py-3 px-5">Authorized By</th>
                  <th className="py-3 px-5">Reason / Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#94a3b8]">
                      No audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-3 px-5 text-[#64748b] font-mono text-[11px] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>

                      <td className="py-3 px-5">
                        <span className="font-bold text-[#0f172a] text-[11px]">
                          {log.action}
                        </span>
                      </td>

                      <td className="py-3 px-5 text-[#334155] font-mono text-[11.5px]">
                        {log.targetUserEmail}
                      </td>

                      <td className="py-3 px-5">
                        <span className="font-semibold text-[#475569] capitalize">
                          {log.oldRole} → <strong className="text-[#2563eb]">{log.newRole}</strong>
                        </span>
                      </td>

                      <td className="py-3 px-5 text-[#475569] font-medium font-mono text-[11px]">
                        {log.changedBy}
                      </td>

                      <td className="py-3 px-5 text-[#64748b] text-[11.5px]">
                        {log.reason || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════ TAB 4 / Regular View: Submit Role Request ══════════════ */}
      {(!isAdmin || activeTab === 'request') && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-6">
          {/* Left — Send a Message & Role Change Form */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-5">
            {/* Interactive Current vs Target Role Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#eff6ff] to-[#f0fdf4] border border-[#dbeafe] flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-white border border-[#bfdbfe] flex items-center justify-center shadow-xs">
                  {currentRole === 'admin' ? (
                    <Shield className="w-5 h-5 text-[#2563eb]" />
                  ) : currentRole === 'technician' ? (
                    <Wrench className="w-5 h-5 text-[#7c3aed]" />
                  ) : (
                    <Eye className="w-5 h-5 text-[#0284c7]" />
                  )}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                    Current Account Role
                  </div>
                  <div className="text-sm font-extrabold text-[#0f172a]">{currentRoleLabel}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-[#94a3b8]" />
                <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#2563eb] text-white shadow-xs">
                  Target: {requestedRole}
                </span>
              </div>
            </div>

            {/* Error / Success Feedback Banners */}
            {submitError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Request Error:</strong> {submitError}
                </div>
              </div>
            )}

            {submitSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Success:</strong> {submitSuccess}
                </div>
              </div>
            )}

            {/* Quick Action Templates */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#475569]">
                <Sparkles className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Quick Role Upgrade Templates:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    applyTemplate(
                      'Technician',
                      'Warehouse B',
                      'Request Field Technician Access for Warehouse B',
                      'Hi Alex, could you please upgrade my account to Field Technician so I can manage stations, refill bait, and resolve active alerts for Warehouse B? Thank you!'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg border border-[#bfdbfe] bg-[#eff6ff] text-[#1d4ed8] text-xs font-bold hover:bg-[#dbeafe] transition-all cursor-pointer"
                >
                  ⚡ Upgrade to Field Technician
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyTemplate(
                      'Admin',
                      'Distribution Center',
                      'Request System Administrator Access',
                      'Hi Alex, I need System Administrator access to configure new facility traps, manage user approvals, and export audit compliance reports. Thank you!'
                    )
                  }
                  className="px-3 py-1.5 rounded-lg border border-[#e9d5ff] bg-[#faf5ff] text-[#7e22ce] text-xs font-bold hover:bg-[#f3e8ff] transition-all cursor-pointer"
                >
                  ⚡ Request Admin Governance
                </button>
              </div>
            </div>

            <h2 className="text-base font-extrabold text-[#101828] pt-1">Request Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#374151]">Target Facility / Warehouse</label>
                <select
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] text-sm font-medium text-[#101828] bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-all cursor-pointer"
                >
                  <option value="Warehouse A">Warehouse A</option>
                  <option value="Warehouse B">Warehouse B</option>
                  <option value="Distribution Center">Distribution Center</option>
                  <option value="Cold Storage">Cold Storage</option>
                  <option value="Manufacturing Plant">Manufacturing Plant</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#374151]">Requested Role Level</label>
                <select
                  value={requestedRole}
                  onChange={(e) => setRequestedRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] text-sm font-medium text-[#101828] bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-all cursor-pointer"
                >
                  <option value="Technician">Field Technician</option>
                  <option value="Admin">System Administrator</option>
                  <option value="Viewer">Read-Only Viewer</option>
                </select>
              </div>
            </div>

            {/* Permission Preview */}
            <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#f1f5f9]">
              <div className="text-xs font-bold text-[#334155] mb-2 flex items-center gap-1.5">
                <span>Access Granted Upon Approval ({requestedRole}):</span>
              </div>
              <ul className="space-y-1.5">
                {(rolePerks[requestedRole] || rolePerks.Viewer).map((perk, i) => (
                  <li key={i} className="text-xs text-[#475569] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#374151]">Subject / Topic</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={`e.g. Requesting ${requestedRole} access for ${facility}`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] text-sm font-medium text-[#101828] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#374151]">Message to Administrator</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Hi Alex, could you please upgrade my viewer permissions to allow telemetry and bait refill schedules for Warehouse B? Thank you!"
                rows={4}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8f0] text-sm font-medium text-[#101828] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 focus:border-[#2563eb] transition-all resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="px-5 py-2.5 rounded-xl border border-[#e2e8f0] text-sm font-bold text-[#374151] hover:bg-[#f8fafc] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendRequest}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] text-white text-sm font-bold hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md shadow-blue-200"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <SendHorizontal className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Submitting Request...' : 'Send Role Request'}</span>
              </button>
            </div>
          </div>

          {/* Right — System Administrator & Request Status Card */}
          <div className="flex flex-col gap-5">
            <div className="bg-[#0a1e3d] rounded-2xl p-6 flex flex-col gap-4 shadow-lg text-white">
              <span className="text-[10px] font-extrabold text-[#7b9cc7] tracking-widest uppercase">
                System Administrator
              </span>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-white font-extrabold text-sm shrink-0 ring-2 ring-white/10">
                  AD
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white leading-tight">Administrator</div>
                  <div className="text-[11px] font-semibold text-[#7b9cc7] uppercase tracking-wider mt-0.5">
                    System Administrator
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#93c5fd] leading-relaxed">
                💡 <strong>Instant Activation:</strong> Once your administrator approves your role change, your new dashboard and permissions activate automatically in the database without requiring a new account.
              </div>
            </div>

            {/* Requester's Submitted Requests History */}
            {!isAdmin && myRequests.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm flex flex-col gap-3">
                <h3 className="text-xs font-bold text-[#101828] uppercase tracking-wider">
                  My Role Requests ({myRequests.length})
                </h3>
                <div className="space-y-2.5">
                  {myRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-3 rounded-xl border border-[#f1f5f9] bg-[#f8fafc] flex flex-col gap-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0f172a] capitalize">
                          Target: {req.requestedRole}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold capitalize ${
                            req.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#64748b]">Facility: {req.facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
