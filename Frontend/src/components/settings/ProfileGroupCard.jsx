import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, CheckCircle2 } from 'lucide-react';
import { ROLES, ROLE_LABELS } from '../../services/authService';

export default function ProfileGroupCard({ user, profile }) {
  const navigate = useNavigate();
  const activeUser = user || profile || {};

  const name = activeUser.name || 'Viewer User';
  const initials = activeUser.initials || (name ? name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'VU');
  const email = activeUser.email || 'user@ratguard.ai';
  const role = activeUser.role || ROLES.VIEWER;
  const isViewer = role === ROLES.VIEWER || role === 'VIEWER';
  const facility = activeUser.facility || 'Warehouse A';

  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white rounded-2xl p-6 shadow-md mb-6 relative overflow-hidden">
      {/* Decorative Subtle Radial Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      {/* Top Header Row: User Info & Edit Profile Button */}
      <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-center gap-4">
          {/* Avatar Circle */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white flex items-center justify-center font-extrabold text-lg shadow-inner ring-4 ring-white/10 shrink-0">
            {initials}
          </div>

          <div>
            <h3 className="font-extrabold text-base text-white tracking-tight leading-snug">
              {name}
            </h3>
            <p className="text-xs text-[#94a3b8] font-medium mb-2">{email}</p>

            {/* Badges Row: Role badge (purple for viewer) + Facility badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs ${
                  isViewer
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                }`}
              >
                {isViewer ? 'Viewer' : (ROLE_LABELS[role] || role)}
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {facility}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Profile Link */}
        <button
          type="button"
          onClick={() => navigate('/settings/edit-profile')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15 cursor-pointer shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Green "Verified Enterprise Account" Confirmation Banner */}
      <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-2 text-emerald-400 text-xs font-semibold">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Verified enterprise account · Active monitoring node</span>
      </div>
    </div>
  );
}
