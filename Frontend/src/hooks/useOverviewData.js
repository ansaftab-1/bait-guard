import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchOverview } from '../api/overview';
import { apiClient } from '../api/client';

export default function useOverviewData() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchOverview();
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

    // Real-Time Overview Subscription (WebSockets / Backend Telemetry Stream)
    const unsubscribe = apiClient.subscribe('overview', (liveOverview) => {
      if (liveOverview && isMountedRef.current) {
        setData((prev) => ({
          ...prev,
          ...liveOverview,
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
