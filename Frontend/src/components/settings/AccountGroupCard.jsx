import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, KeyRound, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../services/authService';

export default function AccountGroupCard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userRole = (user?.role || '').toLowerCase();
  const isAdminOrTech =
    userRole === ROLES.ADMIN.toLowerCase() ||
    userRole === ROLES.TECHNICIAN.toLowerCase() ||
    userRole === 'admin' ||
    userRole === 'technician';

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0]/80 p-5 shadow-[0_4px_16px_rgba(16,24,40,0.03)] mb-6">
      <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3 px-1">
        Account & Access Security
      </h3>

      <div className="divide-y divide-[#f1f5f9]">
        {/* Change Password */}
        <div
          onClick={() => navigate('/settings/change-password')}
          className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#f8fafc] px-2 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f8fafc] text-[#334155] flex items-center justify-center shrink-0">
              <KeyRound className="w-4 h-4 text-[#2563eb]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#101828]">Change Password</div>
              <div className="text-[11px] text-[#64748b] font-medium">Last changed 14 days ago</div>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
        </div>

        {/* Contact Administrator (Viewer / Non-Admin only) */}
        {!isAdminOrTech && (
          <div
            onClick={() => navigate('/settings/contact-admin')}
            className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#f8fafc] px-2 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f8fafc] text-[#334155] flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4 text-[#7c3aed]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#101828]">Contact Administrator</div>
                <div className="text-[11px] text-[#64748b] font-medium">Accounts are managed by admins</div>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-[#94a3b8]" />
          </div>
        )}
      </div>
    </div>
  );
}
