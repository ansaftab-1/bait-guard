import React from 'react';
import { Bell, AlertTriangle, Droplet, Hand, WifiOff, Mail, Moon } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationsGroupCard({ notifications, onChange }) {
  const { pushEnabled, setPushEnabled } = useNotifications();

  const items = [
    {
      key: 'rodentDetected',
      icon: AlertTriangle,
      title: 'Rodent Detection Alerts',
      desc: 'High priority alert when motion or AI detects rodent activity',
    },
    {
      key: 'lowBaitWarning',
      icon: Droplet,
      title: 'Low Bait Alerts',
      desc: 'Warn when station bait capacity drops below 25%',
    },
    {
      key: 'tamperDetected',
      icon: Hand,
      title: 'Tamper Alerts',
      desc: 'Alert when station casing or lid is displaced without auth',
    },
    {
      key: 'stationOffline',
      icon: WifiOff,
      title: 'Station Offline Alerts',
      desc: 'Alert if telemetry heartbeat ping is lost for > 15 minutes',
    },
    {
      key: 'pushEnabled',
      icon: Bell,
      title: 'Push Notifications',
      desc: 'Receive instant push alerts on your desktop browser & mobile',
    },
    {
      key: 'emailNotifications',
      icon: Mail,
      title: 'Email Notifications',
      desc: 'Receive daily summary digests and immediate critical emails',
    },
    {
      key: 'darkMode',
      icon: Moon,
      title: 'Dark Mode',
      desc: 'Switch interface contrast for night monitoring & low light',
    },
  ];

  const handleToggle = (key) => {
    const nextVal = !notifications?.[key];
    if (key === 'pushEnabled') {
      setPushEnabled(nextVal);
    }
    if (onChange) {
      onChange({
        ...notifications,
        [key]: nextVal,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0]/80 p-5 shadow-[0_4px_16px_rgba(16,24,40,0.03)] mb-6">
      <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-3 px-1">
        Notification & Interface Preferences
      </h3>

      <div className="divide-y divide-[#f1f5f9]">
        {items.map((item) => {
          const Icon = item.icon;
          const isChecked = item.key === 'pushEnabled'
            ? pushEnabled
            : Boolean(notifications?.[item.key]);

          return (
            <div
              key={item.key}
              onClick={() => handleToggle(item.key)}
              className="py-3 flex items-center justify-between gap-4 cursor-pointer group px-1"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#f8fafc] group-hover:bg-[#eff6ff] text-[#64748b] group-hover:text-[#2563eb] flex items-center justify-center transition-colors shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#101828]">{item.title}</div>
                  <div className="text-[11px] text-[#64748b] font-medium leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                  isChecked ? 'bg-[#2563eb]' : 'bg-[#cbd5e1]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    isChecked ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
