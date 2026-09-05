import React from 'react';
import SettingsHeader from '../components/settings/SettingsHeader';
import ProfileGroupCard from '../components/settings/ProfileGroupCard';
import NotificationsGroupCard from '../components/settings/NotificationsGroupCard';
import StationPreferencesGroupCard from '../components/settings/StationPreferencesGroupCard';
import AccountGroupCard from '../components/settings/AccountGroupCard';
import AboutGroupCard from '../components/settings/AboutGroupCard';
import SignOutCard from '../components/settings/SignOutCard';
import useSettingsData from '../hooks/useSettingsData';
import { useAuth } from '../context/AuthContext';
import ErrorState from '../components/ui/ErrorState';
import FirebaseStatusChecker from '../components/FirebaseStatusChecker';

export default function SettingsPage() {
  const { user } = useAuth();
  const { settings, setSettings, isLoading, isSaving, error, refresh } = useSettingsData();

  if (isLoading || !settings) {
    return (
      <div className="p-6 max-w-[680px] mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
        <div className="h-28 bg-gray-200 rounded-2xl"></div>
        <div className="h-48 bg-gray-200 rounded-2xl"></div>
        <div className="h-36 bg-gray-200 rounded-2xl"></div>
        <div className="h-20 bg-gray-200 rounded-2xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-[680px] mx-auto">
        <ErrorState onRetry={refresh} message="Failed to load settings preferences." />
      </div>
    );
  }

  const handleNotificationChange = (newNotifs) => {
    setSettings({
      ...settings,
      notifications: newNotifs,
    });
  };

  const handleSiteChange = (newSite) => {
    setSettings({
      ...settings,
      site: newSite,
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-[680px] mx-auto min-h-full font-sans bg-[#f8fafc]">
      {/* Header */}
      <SettingsHeader />

      {/* 1. Profile Summary Card (Dark Top Card with Edit Profile Link) */}
      <ProfileGroupCard user={user} profile={settings.profile} />

      {/* 2. Notification Preferences Section */}
      <NotificationsGroupCard
        notifications={settings.notifications}
        onChange={handleNotificationChange}
      />

      {/* 3. Station Preferences Section */}
      <StationPreferencesGroupCard
        site={settings.site}
        onChange={handleSiteChange}
      />

      {/* 4. Account Section */}
      <AccountGroupCard />

      {/* 5. About Section */}
      <AboutGroupCard />

      {/* 5.1 Live Firebase Connection Indicator (Guide Section 2.3) */}
      <div className="mb-6 flex justify-center">
        <FirebaseStatusChecker />
      </div>

      {/* 6. Log Out Button */}
      <SignOutCard />

      {/* Saving Indicator */}
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50">
          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Saving preferences...
        </div>
      )}
    </div>
  );
}
