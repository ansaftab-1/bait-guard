import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAlertsData } from '../api/alertsData';
import { apiClient } from '../api/client';

export default function useAlertsData() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchAlertsData();
      if (isMountedRef.current) {
        setData(result);
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

    // Real-Time Alerts Subscription (WebSockets / Backend Event Stream)
    const unsubscribe = apiClient.subscribe('alerts', (liveAlert) => {
      if (liveAlert && isMountedRef.current) {
        setData((prev) => ({
          ...prev,
          ...liveAlert,
        }));
      }
    });

    return () => {
      isMountedRef.current = false;
      unsubscribe();
    };
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchData,
  };
}
