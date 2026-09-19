import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { fetchLeads } from '../api/leadsData';

const DEFAULT_FILTERS = {
  priority: 'all',
  industry: 'all',
  location: 'all',
  dataQuality: 'all',
  scoreRange: 'all',  // 'all' | '80-100' | '60-79' | '0-59'
  search: '',
  isDuplicate: false,
};

/**
 * Filter and sort leads client-side.
 * Replicates the backend filtering logic with 0ms latency and no network requests.
 */
function applyClientFilters(leads, filters) {
  if (!leads || !Array.isArray(leads)) return [];
  let list = [...leads];

  if (filters.priority && filters.priority !== 'all') {
    list = list.filter((l) => l.priority === filters.priority);
  }
  if (filters.industry && filters.industry !== 'all') {
    list = list.filter((l) => l.industry === filters.industry);
  }
  if (filters.location && filters.location !== 'all') {
    list = list.filter((l) => l.location === filters.location);
  }
  if (filters.dataQuality && filters.dataQuality !== 'all') {
    list = list.filter((l) => l.dataQuality?.status === filters.dataQuality);
  }
  if (filters.isDuplicate) {
    list = list.filter((l) => Boolean(l.isDuplicate));
  }

  // Score range
  if (filters.scoreRange === '80-100') {
    list = list.filter((l) => l.leadScore >= 80 && l.leadScore <= 100);
  } else if (filters.scoreRange === '60-79') {
    list = list.filter((l) => l.leadScore >= 60 && l.leadScore <= 79);
  } else if (filters.scoreRange === '0-59') {
    list = list.filter((l) => l.leadScore >= 0 && l.leadScore <= 59);
  }

  // Search query
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (l) =>
          (l.companyName || '').toLowerCase().includes(q) ||
          (l.contactName || '').toLowerCase().includes(q) ||
          (l.email || '').toLowerCase().includes(q) ||
          (l.website || '').toLowerCase().includes(q) ||
          (l.industry || '').toLowerCase().includes(q) ||
          (l.location || '').toLowerCase().includes(q)
      );
    }
  }

  // Always sort by score descending
  list.sort((a, b) => b.leadScore - a.leadScore);
  return list;
}

/**
 * useLeadsData — central data hook for the Lead Intelligence page.
 *
 * Performance optimized:
 * - Fetches all leads once on initial mount
 * - Applies filters instantly client-side (no network round-trip, no skeleton flash)
 * - Keeps KPI cards, industries, and locations stable across filter changes
 * - Only the filtered leads list updates when filters change
 */
export default function useLeadsData() {
  const [allLeads, setAllLeads]       = useState([]);
  const [kpis, setKpis]               = useState({ total: 0, highPriority: 0, averageScore: 0, dataIssues: 0, duplicates: 0 });
  const [industries, setIndustries]   = useState([]);
  const [locations, setLocations]     = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState(null);
  const [filters, setFilters]         = useState(DEFAULT_FILTERS);
  const isMountedRef                  = useRef(true);

  // Load all leads from API (only on mount or explicit refresh)
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);
    try {
      const result = await fetchLeads({});
      if (isMountedRef.current && result) {
        setAllLeads(result.leads || []);
        if (result.kpis) {
          setKpis(result.kpis);
        } else if (result.leads) {
          // Fallback KPI computation if not provided
          const all = result.leads;
          setKpis({
            total: all.length,
            highPriority: all.filter((l) => l.priority === 'high').length,
            averageScore: all.length > 0 ? Math.round(all.reduce((s, l) => s + l.leadScore, 0) / all.length) : 0,
            dataIssues: all.filter((l) => l.dataQuality?.status !== 'good').length,
            duplicates: all.filter((l) => l.isDuplicate).length,
          });
        }
        if (result.industries) setIndustries(result.industries);
        if (result.locations) setLocations(result.locations);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err);
      }
    } finally {
      if (isMountedRef.current && !isSilent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadData(false);
    return () => { isMountedRef.current = false; };
  }, [loadData]);

  // Client-side instant filtering with useMemo — 0ms latency, no full page re-render
  const filteredLeads = useMemo(() => {
    return applyClientFilters(allLeads, filters);
  }, [allLeads, filters]);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.priority !== 'all' ||
      filters.industry !== 'all' ||
      filters.location !== 'all' ||
      filters.dataQuality !== 'all' ||
      filters.scoreRange !== 'all' ||
      Boolean(filters.search && filters.search.trim()) ||
      Boolean(filters.isDuplicate)
    );
  }, [filters]);

  const refresh = useCallback(() => {
    return loadData(true);
  }, [loadData]);

  return {
    leads:         filteredLeads,
    kpis,
    industries,
    locations,
    totalFiltered: filteredLeads.length,
    isLoading,
    error,
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
    refresh,
  };
}
