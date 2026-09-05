import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchSettingsData, saveSettingsData } from '../api/settingsData';

export default function useSettingsData() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchSettingsData();
      if (isMountedRef.current) {
        setSettings(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchData]);

  const updateSettings = async (updater) => {
    setSettings((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return next;
    });

    setIsSaving(true);
    try {
      const res = await saveSettingsData(settings);
      setLastSaved(res.timestamp);
    } catch {
      // Save failed — isSaving resets via finally; no UI error needed
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings,
    setSettings: updateSettings,
    isLoading,
    isSaving,
    lastSaved,
    error,
    refresh: fetchData,
  };
}
