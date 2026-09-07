import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as notificationService from '../services/notificationService';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [pushEnabled, setPushEnabledState] = useState(true);

  useEffect(() => {
    // Initial fetch
    setNotifications(notificationService.getNotifications());
    setPushEnabledState(notificationService.isPushEnabled());

    // Subscriptions
    const unsubNotifs = notificationService.subscribeNotifications((updated) => {
      setNotifications(updated);
    });

    const unsubPush = notificationService.subscribePushSettings((enabled) => {
      setPushEnabledState(enabled);
    });

    return () => {
      unsubNotifs();
      unsubPush();
    };
  }, []);

  const unreadCount = useMemo(
    () => (pushEnabled ? notifications.filter((n) => !n.read).length : 0),
    [pushEnabled, notifications]
  );

  const setPushEnabled = useCallback((enabled) => {
    notificationService.setPushEnabled(enabled);
    setPushEnabledState(enabled);
  }, []);

  const markAsRead = useCallback((id) => {
    const updated = notificationService.markAsRead(id);
    setNotifications(updated);
  }, []);

  const markAllAsRead = useCallback(() => {
    const updated = notificationService.markAllAsRead();
    setNotifications(updated);
  }, []);

  const clearAll = useCallback(() => {
    const updated = notificationService.clearAll();
    setNotifications(updated);
  }, []);

  const deleteNotification = useCallback((id) => {
    const updated = notificationService.deleteNotification(id);
    setNotifications(updated);
  }, []);

  const approveRequest = useCallback((notifId) => {
    const updated = notificationService.handleRequestAction(notifId, 'approve');
    setNotifications(updated);
  }, []);

  const rejectRequest = useCallback((notifId) => {
    const updated = notificationService.handleRequestAction(notifId, 'reject');
    setNotifications(updated);
  }, []);

  const addNotification = useCallback((data) => {
    const updated = notificationService.addNotification(data);
    setNotifications(updated);
  }, []);

  const contextValue = useMemo(
    () => ({
      notifications,
      pushEnabled,
      unreadCount,
      setPushEnabled,
      markAsRead,
      markAllAsRead,
      clearAll,
      deleteNotification,
      approveRequest,
      rejectRequest,
      addNotification,
    }),
    [
      notifications,
      pushEnabled,
      unreadCount,
      setPushEnabled,
      markAsRead,
      markAllAsRead,
      clearAll,
      deleteNotification,
      approveRequest,
      rejectRequest,
      addNotification,
    ]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
