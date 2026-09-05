import React, { useState } from 'react';
import ReportsHeader from '../components/reports/ReportsHeader';
import ReportsKPIGrid from '../components/reports/ReportsKPIGrid';
import ReportsTrendCard from '../components/reports/ReportsTrendCard';
import ReportsExporterGrid from '../components/reports/ReportsExporterGrid';
import ReportsStationLedger from '../components/reports/ReportsStationLedger';
import ReportsRecentExports from '../components/reports/ReportsRecentExports';
import useReportsData from '../hooks/useReportsData';
import ErrorState from '../components/ui/ErrorState';

export default function ReportsPage() {
  const { data, isLoading, error, refresh } = useReportsData();
  const [activeTimeframe, setActiveTimeframe] = useState('Month');

  if (isLoading || !data) {
    return (
      <div className="p-6 animate-pulse space-y-6 w-full max-w-7xl mx-auto">
        <div className="h-12 bg-gray-200 rounded-xl w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-24 bg-gray-200 rounded-2xl"></div>
          <div className="h-24 bg-gray-200 rounded-2xl"></div>
          <div className="h-24 bg-gray-200 rounded-2xl"></div>
          <div className="h-24 bg-gray-200 rounded-2xl"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-64 bg-gray-200 rounded-2xl"></div>
          <div className="lg:col-span-5 h-64 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 w-full max-w-7xl mx-auto">
        <ErrorState onRetry={refresh} message="Failed to load compliance report data." />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 flex flex-col min-h-full w-full max-w-7xl mx-auto font-sans bg-[#f8fafc]">
      {/* 1. Header (Title, Subtitle, Segmented Time Pills, Month Selector) */}
      <ReportsHeader
        activeTimeframe={activeTimeframe}
        setActiveTimeframe={setActiveTimeframe}
      />

      {/* 2. Top KPI Cards Row (4 Cards) */}
      <ReportsKPIGrid kpis={data.kpis} />

      {/* 3. Middle Row: Detections Trend Chart (Left 7 cols) & Generate Report (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-stretch">
        <div className="lg:col-span-7">
          <ReportsTrendCard trendSeries={data.trendSeries} />
        </div>
        <div className="lg:col-span-5">
          <ReportsExporterGrid exporters={data.exporters} />
        </div>
      </div>

      {/* 4. Bottom Row: Station Ledger (Left 7 cols) & Recent Exports (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <ReportsStationLedger rows={data.stationLedger} />
        </div>
        <div className="lg:col-span-5">
          <ReportsRecentExports
            items={data.recentExports}
            onSeeAll={() => alert('Viewing all recent export logs...')}
          />
        </div>
      </div>
    </div>
  );
}
