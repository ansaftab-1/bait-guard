import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchMapData } from '../api/mapData';
import { apiClient } from '../api/client';

export default function useMapData() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchMapData();
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

    // Real-Time Facility Map Subscription (WebSockets / Backend Event Stream)
    const unsubscribe = apiClient.subscribe('facility-map', (liveMapUpdate) => {
      if (liveMapUpdate && isMountedRef.current) {
        setData((prev) => ({
          ...prev,
          ...liveMapUpdate,
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
