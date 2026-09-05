import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff, Check, CheckCircle2 } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import AnimatedBellIcon from '../components/notifications/AnimatedBellIcon';
import NotificationDropdown from '../components/notifications/NotificationDropdown';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { unreadCount, pushEnabled } = useNotifications();
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Security requirements validation
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasDigit = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);

  const reqPassedCount = [hasMinLength, hasUppercase, hasDigit, hasSpecial].filter(Boolean).length;

  // Strength Rating calculation
  const getStrengthRating = () => {
    if (!newPassword) return { label: 'Empty', width: '0%', color: '#e2e8f0', textColor: '#94a3b8' };
    if (reqPassedCount <= 1) return { label: 'Weak', width: '25%', color: '#ef4444', textColor: '#ef4444' };
    if (reqPassedCount === 2) return { label: 'Fair', width: '50%', color: '#f59e0b', textColor: '#f59e0b' };
    if (reqPassedCount === 3) return { label: 'Good', width: '75%', color: '#3b82f6', textColor: '#3b82f6' };
    return { label: 'Strong', width: '100%', color: '#10b981', textColor: '#10b981' };
  };

  const strength = getStrengthRating();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!currentPassword) {
      setErrorMessage('Please enter your current password.');
      return;
    }

    if (reqPassedCount < 4) {
      setErrorMessage('New password does not meet all security requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);

    setSuccessMessage('Your password has been updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto font-sans min-h-screen">
      {/* ─── Top Header Bar ─── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] mb-2 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
            Back to Settings
          </button>
          <h1 className="text-2xl font-extrabold text-[#101828] tracking-tight">Change Password</h1>
          <p className="text-sm text-[#64748b] font-medium mt-0.5">Keep your telemetry access secure</p>
        </div>

        {/* Bell Button & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
            className="w-12 h-12 rounded-xl bg-white border border-[#e2e8f0] text-[#64748b] hover:text-[#101828] flex items-center justify-center shadow-sm transition-colors cursor-pointer relative"
            title={pushEnabled ? 'Notifications' : 'Notifications Muted'}
          >
            <AnimatedBellIcon pushEnabled={pushEnabled} hasUnread={unreadCount > 0} size={26} color="#64748b" />
            {pushEnabled && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-extrabold min-w-4 h-4 rounded-full flex items-center justify-center px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotificationsDropdown && (
            <NotificationDropdown onClose={() => setShowNotificationsDropdown(false)} />
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm font-bold shadow-sm animate-fadeIn">
          <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold shadow-sm">
          {errorMessage}
        </div>
      )}

      {/* ─── Main Grid Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left Column: Form Card */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 md:p-8 shadow-sm flex flex-col gap-6">
          <h2 className="text-base font-extrabold text-[#101828]">Update password credentials</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Current Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#374151]">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#e2e8f0] text-sm font-medium text-[#101828] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors cursor-pointer"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#374151]">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#2563eb] text-sm font-medium text-[#101828] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2563eb] hover:text-[#1d4ed8] transition-colors cursor-pointer"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword && (
                <div className="mt-2 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#64748b] font-semibold">Password Strength:</span>
                    <span className="font-bold" style={{ color: strength.textColor }}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300 rounded-full"
                      style={{ width: strength.width, backgroundColor: strength.color }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#374151]">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#e2e8f0] text-sm font-medium text-[#101828] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors cursor-pointer"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="px-6 py-2.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-sm font-bold text-[#374151] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#2563eb] text-white text-sm font-bold hover:bg-[#1d4ed8] disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-blue-200"
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Security Requirements Card */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm flex flex-col gap-4">
          <span className="text-[11px] font-extrabold text-[#475569] tracking-wider uppercase">
            Security Requirements
          </span>

          <div className="flex flex-col gap-3">
            {[
              { text: 'At least 8 characters long', isMet: hasMinLength },
              { text: 'At least one uppercase letter (A-Z)', isMet: hasUppercase },
              { text: 'At least one numerical digit (0-9)', isMet: hasDigit },
              { text: 'At least one special character (!@#$%^&*)', isMet: hasSpecial },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <Check
                  size={16}
                  className={item.isMet ? 'text-emerald-500 shrink-0' : 'text-[#cbd5e1] shrink-0'}
                />
                <span
                  className={`text-xs font-semibold ${
                    item.isMet ? 'text-[#101828]' : 'text-[#94a3b8]'
                  }`}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
