import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertsPageHeader from '../components/alerts/AlertsPageHeader';
import PriorityBanner from '../components/alerts/PriorityBanner';
import FilterChipRow from '../components/alerts/FilterChipRow';
import AlertGroup from '../components/alerts/AlertGroup';
import WeeklyActivityWidget from '../components/alerts/WeeklyActivityWidget';
import HotspotStationsWidget from '../components/alerts/HotspotStationsWidget';
import useAlertsData from '../hooks/useAlertsData';
import ErrorState from '../components/ui/ErrorState';
import AnimatedLottieIcon from '../components/ui/AnimatedLottieIcon';

export default function AlertsPage() {
  const navigate = useNavigate();
  const { data, isLoading, error, refresh } = useAlertsData();
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter alert items in groups based on active chip filter (memoized)
  const filteredGroups = useMemo(() => {
    if (!data?.groups) return [];
    return data.groups
      .map((group) => {
        if (activeFilter === 'all') return group;
        const filteredItems = group.items.filter((item) => item.type === activeFilter);
        return { ...group, items: filteredItems };
      })
      .filter((group) => group.items.length > 0);
  }, [data?.groups, activeFilter]);

  const handleAlertSelect = useCallback((alertItem) => {
    const alertId = alertItem.id || 'alt-1';
    navigate(`/alerts/${alertId}`);
  }, [navigate]);

  const handleBannerClick = useCallback(() => {
    navigate('/stations');
  }, [navigate]);

  if (isLoading || !data) {
    return (
      <div className="p-6 animate-pulse space-y-5 w-full">
        <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
        <div className="h-16 bg-gray-200 rounded-xl w-full"></div>
        <div className="h-8 bg-gray-200 rounded-full w-1/2"></div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
          <div className="h-[400px] bg-gray-200 rounded-xl"></div>
          <div className="h-[400px] bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 w-full">
        <ErrorState onRetry={refresh} message="Failed to load live alerts data." />
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col min-h-full w-full box-border font-sans bg-[#f8fafc]">
      {/* 1. Header Area (No greeting, dynamic role badge, facility dropdown, bell) */}
      <AlertsPageHeader unread={data.header.unreadCount} />

      {/* 2. Summary Cards Row (3 Cards: High, Medium, Low Severity) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Card 1: High Severity */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <AnimatedLottieIcon type="pulseAlert" colorTint="red" size={36} />
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#fef2f2] text-[#ef4444]">
              HIGH PRIORITY
            </span>
          </div>
          <span className="text-3xl font-extrabold text-[#0f172a] my-2 block">
            {data.summaryCards?.high?.count || 2}
          </span>
          <span className="text-xs font-bold text-[#0f172a] block">
            {data.summaryCards?.high?.title || 'High Severity Alerts'}
          </span>
          <span className="text-[11px] text-[#64748b] font-medium block mt-0.5">
            {data.summaryCards?.high?.description || 'Immediate response required'}
          </span>
        </div>

        {/* Card 2: Medium Severity */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <AnimatedLottieIcon type="pulseAlert" colorTint="amber" size={36} />
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#fffbeb] text-[#d97706]">
              MEDIUM SEVERITY
            </span>
          </div>
          <span className="text-3xl font-extrabold text-[#0f172a] my-2 block">
            {data.summaryCards?.medium?.count || 3}
          </span>
          <span className="text-xs font-bold text-[#0f172a] block">
            {data.summaryCards?.medium?.title || 'Medium Alerts'}
          </span>
          <span className="text-[11px] text-[#64748b] font-medium block mt-0.5">
            {data.summaryCards?.medium?.description || 'Pending refills and battery warnings'}
          </span>
        </div>

        {/* Card 3: Low Severity */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <AnimatedLottieIcon type="pulseAlert" colorTint="gray" size={36} />
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#f8fafc] text-[#64748b]">
              LOW SEVERITY
            </span>
          </div>
          <span className="text-3xl font-extrabold text-[#0f172a] my-2 block">
            {data.summaryCards?.low?.count || 1}
          </span>
          <span className="text-xs font-bold text-[#0f172a] block">
            {data.summaryCards?.low?.title || 'Low Alerts'}
          </span>
          <span className="text-[11px] text-[#64748b] font-medium block mt-0.5">
            {data.summaryCards?.low?.description || 'Routine diagnostic messages'}
          </span>
        </div>
      </div>

      {/* 3. Critical Alerts Active Banner */}
      <PriorityBanner
        title={data.priorityBanner.title}
        description={data.priorityBanner.description}
        onClick={handleBannerClick}
      />

      {/* 4. Filter Pills Row */}
      <FilterChipRow activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

      {/* 5. Two-Column Body (Left: Groups, Right: Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] gap-6 items-start w-full">
        {/* Left Column — Grouped Alert List */}
        <div className="min-w-0 w-full">
          {filteredGroups.map((group) => (
            <AlertGroup
              key={group.id}
              title={group.title}
              items={group.items}
              onSelectAlert={handleAlertSelect}
            />
          ))}

          {filteredGroups.length === 0 && (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 text-center text-[#64748b] text-xs font-medium w-full">
              No alerts match the selected filter.
            </div>
          )}
        </div>

        {/* Right Column — Sidebar Widgets */}
        <div className="w-full flex flex-col gap-6 shrink-0">
          <WeeklyActivityWidget data={data.weeklyActivity} />
          <HotspotStationsWidget hotspots={data.hotspots} />
        </div>
      </div>
    </div>
  );
}
