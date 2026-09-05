import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Check, AlertCircle, User, Mail, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROLE_LABELS } from '../services/authService';
import { updateSelfProfile } from '../services/userService';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentUser = user || {
    name: 'Viewer User',
    email: 'user@ratguard.ai',
    role: ROLES.VIEWER,
    facility: 'Warehouse A',
  };

  const isAdmin = currentUser.role === ROLES.ADMIN || currentUser.role === 'admin';

  // Derive initial values
  const nameParts = (currentUser.name || 'Viewer User').trim().split(' ');
  const initialFirstName = nameParts[0] || 'Viewer';
  const initialLastName = nameParts.slice(1).join(' ') || 'User';

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [jobTitle, setJobTitle] = useState(currentUser.jobTitle || 'Field Operator');
  const [department, setDepartment] = useState(currentUser.department || 'Facility Operations');
  const [assignedLocation, setAssignedLocation] = useState(currentUser.facility || 'Warehouse A');
  const [email, setEmail] = useState(currentUser.email || 'user@ratguard.ai');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phone || '+1 (555) 234-5678');
  const [role, setRole] = useState(currentUser.role || ROLES.VIEWER);
  const [bio, setBio] = useState(currentUser.bio || 'Pest management monitoring technician assigned to facility bait stations.');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Live Auto-Generated Initials
  const computedInitials = `${(firstName[0] || '').toUpperCase()}${(lastName[0] || '').toUpperCase()}` || 'VU';

  // Role Gating Permissions according to spec:
  // Admin editing Viewer: Can edit First Name, Last Name, Role, Email
  // Viewer editing self: Can ONLY edit Name (First/Last) and Short Bio. All other fields read-only.
  const canEditEmailAndRole = isAdmin;
  const canEditJobAndContact = isAdmin; // Viewer editing self has read-only Job Title, Department, Assigned Location, Phone Number

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!firstName.trim()) {
      setErrorMsg('First Name is required.');
      return;
    }

    setIsSaving(true);

    try {
      const updatedData = {
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        initials: computedInitials,
        bio: bio.trim(),
      };

      if (canEditEmailAndRole) {
        updatedData.email = email.trim();
        updatedData.role = role;
      }

      if (canEditJobAndContact) {
        updatedData.jobTitle = jobTitle.trim();
        updatedData.department = department.trim();
        updatedData.facility = assignedLocation.trim();
        updatedData.phone = phoneNumber.trim();
      }

      const targetUid = user?.uid || (user?.id && !user?.id?.startsWith('usr-') ? user.id : null);
      if (targetUid) {
        try {
          await updateSelfProfile(targetUid, {
            firstName,
            lastName,
            jobTitle,
            department,
            phone: phoneNumber,
            bio,
          });
        } catch (fsErr) {
          console.warn('[updateSelfProfile Firestore notice]:', fsErr.message);
        }
      }

      // Update in localStorage
      const stored = localStorage.getItem('baitguard_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = { ...parsed, ...updatedData };
        localStorage.setItem('baitguard_user', JSON.stringify(updated));
        window.dispatchEvent(new Event('baitguard_user_changed'));
      }

      setSuccessMsg('Profile changes saved successfully!');
      setTimeout(() => {
        navigate('/settings');
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[720px] mx-auto min-h-full font-sans bg-[#f8fafc]">
      {/* ─── Header ─── */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-xl bg-white border border-[#e2e8f0] flex items-center justify-center text-[#334155] hover:bg-[#f8fafc] shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-[24px] font-extrabold text-[#101828] tracking-tight">Edit Profile</h1>
          <p className="text-xs font-medium text-[#64748b] mt-0.5">Update your personal information</p>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* ─── Main Form Container ─── */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar & Badges Header Card */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-[0_4px_16px_rgba(16,24,40,0.03)] flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white flex items-center justify-center font-extrabold text-2xl shadow-md ring-4 ring-slate-100 mb-3">
            {computedInitials}
          </div>
          <p className="text-xs text-[#64748b] font-medium mb-3">
            Profile initials are generated automatically from your name.
          </p>

          {/* Badges Row */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 border border-purple-200 rounded-full text-xs font-bold shadow-xs">
              {role === ROLES.VIEWER || role === 'VIEWER' ? 'Viewer' : (ROLE_LABELS[role] || role)}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold shadow-xs">
              {assignedLocation || 'Warehouse A'}
            </span>
          </div>
        </div>

        {/* ─── 1. Personal Information ─── */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-[0_4px_16px_rgba(16,24,40,0.03)] space-y-4">
          <h3 className="text-sm font-bold text-[#101828] flex items-center gap-2 pb-2 border-b border-[#f1f5f9]">
            <User className="w-4 h-4 text-[#2563eb]" />
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name (Always Editable) */}
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs font-semibold text-[#101828] focus:bg-white focus:border-[#2563eb] focus:outline-none transition-all"
                placeholder="First Name"
              />
            </div>

            {/* Last Name (Always Editable) */}
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs font-semibold text-[#101828] focus:bg-white focus:border-[#2563eb] focus:outline-none transition-all"
                placeholder="Last Name"
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                disabled={!canEditJobAndContact}
                onChange={(e) => setJobTitle(e.target.value)}
                className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold transition-all ${
                  !canEditJobAndContact
                    ? 'bg-[#f1f5f9] text-[#94a3b8] border-[#e2e8f0] cursor-not-allowed'
                    : 'bg-[#f8fafc] text-[#101828] border-[#e2e8f0] focus:bg-white focus:border-[#2563eb] focus:outline-none'
                }`}
                placeholder="e.g. Field Operator"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Department
              </label>
              <input
                type="text"
                value={department}
                disabled={!canEditJobAndContact}
                onChange={(e) => setDepartment(e.target.value)}
                className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold transition-all ${
                  !canEditJobAndContact
                    ? 'bg-[#f1f5f9] text-[#94a3b8] border-[#e2e8f0] cursor-not-allowed'
                    : 'bg-[#f8fafc] text-[#101828] border-[#e2e8f0] focus:bg-white focus:border-[#2563eb] focus:outline-none'
                }`}
                placeholder="e.g. Operations"
              />
            </div>

            {/* Assigned Location */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Assigned Location / Facility
              </label>
              <input
                type="text"
                value={assignedLocation}
                disabled={!canEditJobAndContact}
                onChange={(e) => setAssignedLocation(e.target.value)}
                className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold transition-all ${
                  !canEditJobAndContact
                    ? 'bg-[#f1f5f9] text-[#94a3b8] border-[#e2e8f0] cursor-not-allowed'
                    : 'bg-[#f8fafc] text-[#101828] border-[#e2e8f0] focus:bg-white focus:border-[#2563eb] focus:outline-none'
                }`}
                placeholder="e.g. Warehouse A"
              />
            </div>
          </div>
        </div>

        {/* ─── 2. Contact Information & System Role ─── */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-[0_4px_16px_rgba(16,24,40,0.03)] space-y-4">
          <h3 className="text-sm font-bold text-[#101828] flex items-center gap-2 pb-2 border-b border-[#f1f5f9]">
            <Mail className="w-4 h-4 text-[#2563eb]" />
            Contact & System Role
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Email */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#334155]">
                  Company Email Address
                </label>
                {!canEditEmailAndRole && (
                  <span className="text-[11px] font-bold text-[#94a3b8] flex items-center gap-1 bg-[#f1f5f9] px-2.5 py-0.5 rounded-full border border-[#e2e8f0]">
                    <Lock className="w-3 h-3" />
                    Managed by admin
                  </span>
                )}
              </div>
              <input
                type="email"
                value={email}
                disabled={!canEditEmailAndRole}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold transition-all ${
                  !canEditEmailAndRole
                    ? 'bg-[#f1f5f9] text-[#94a3b8] border-[#e2e8f0] cursor-not-allowed'
                    : 'bg-[#f8fafc] text-[#101828] border-[#e2e8f0] focus:bg-white focus:border-[#2563eb] focus:outline-none'
                }`}
              />
              {!canEditEmailAndRole && (
                <p className="text-[11px] text-[#94a3b8] mt-1 font-medium">
                  Email address is managed by your system administrator. Contact admin to change email.
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={phoneNumber}
                disabled={!canEditJobAndContact}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`w-full h-10 px-3.5 border rounded-xl text-xs font-semibold transition-all ${
                  !canEditJobAndContact
                    ? 'bg-[#f1f5f9] text-[#94a3b8] border-[#e2e8f0] cursor-not-allowed'
                    : 'bg-[#f8fafc] text-[#101828] border-[#e2e8f0] focus:bg-white focus:border-[#2563eb] focus:outline-none'
                }`}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Role Selection (Editable by Admin, Disabled for Viewer) */}
            <div>
              <label className="block text-xs font-bold text-[#334155] mb-1.5">
                Account Role
              </label>
              {canEditEmailAndRole ? (
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-10 px-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs font-semibold text-[#101828] focus:bg-white focus:border-[#2563eb] focus:outline-none cursor-pointer"
                >
                  <option value={ROLES.ADMIN}>System Administrator</option>
                  <option value={ROLES.TECHNICIAN}>Field Technician</option>
                  <option value={ROLES.VIEWER}>Read-Only Viewer</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={ROLE_LABELS[role] || 'Read-Only Viewer'}
                  disabled
                  className="w-full h-10 px-3.5 bg-[#f1f5f9] text-[#94a3b8] border border-[#e2e8f0] rounded-xl text-xs font-semibold cursor-not-allowed"
                />
              )}
            </div>
          </div>
        </div>

        {/* ─── 3. About & Bio (Editable by Viewer) ─── */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-[0_4px_16px_rgba(16,24,40,0.03)] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
            <h3 className="text-sm font-bold text-[#101828] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2563eb]" />
              About & Bio
            </h3>
            <span className="text-[11px] font-bold text-[#94a3b8]">
              {bio.length}/200
            </span>
          </div>

          <div>
            <textarea
              maxLength={200}
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-xs font-semibold text-[#101828] focus:bg-white focus:border-[#2563eb] focus:outline-none transition-all"
              placeholder="Tell your team a little about yourself…"
            />
          </div>
        </div>

        {/* ─── Bottom Actions ─── */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="px-5 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-xs font-bold text-[#334155] hover:bg-[#f8fafc] transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-75"
          >
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
