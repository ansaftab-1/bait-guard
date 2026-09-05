import React, { useState } from 'react'
import { Radio, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react'
import OverviewHeader from './OverviewHeader'
import StationHealthCard from './StationHealthCard'
import FacilityMapCard from './FacilityMapCard'
import QuickActions from './QuickActions'
import ActivityCard from './ActivityCard'
import SpeciesBreakdownCard from './SpeciesBreakdownCard'
import RecentAlertsCard from './RecentAlertsCard'
import StatCard from '../ui/StatCard'
import StationDetailViewerModal from '../stations/StationDetailViewerModal'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS } from '../../services/authService'

export default function OverviewContent({ data, onQuickAction, onViewAllAlerts, selectedStation, onSelectStation }) {
  const { user } = useAuth()
  const { health, stations, activity, species, alerts, meta } = data || {}
  const [selectedWarehouse, setSelectedWarehouse] = useState(meta?.facility || 'All Facilities')
  const [activeModalStation, setActiveModalStation] = useState(null)

  const displayUserName = user?.name || user?.email?.split('@')[0] || 'User'
  const userRoleLabel = ROLE_LABELS[user?.role] || user?.role || 'Viewer'

  const totalStations = stations?.length || 120
  const activeCount = stations?.filter(s => s.status === 'active' || s.status === 'ONLINE').length || 118
  const refillCount = stations?.filter(s => s.status === 'warning' || s.status === 'monitor' || s.status === 'LOW_BAIT').length || 8
  const offlineCount = stations?.filter(s => s.status === 'offline' || s.status === 'OFFLINE').length || 2

  const handleStationSelect = (st) => {
    setActiveModalStation(st)
    if (onSelectStation) onSelectStation(st)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* 1. Header with Dynamic User Props */}
      <OverviewHeader
        userName={displayUserName}
        role={userRoleLabel}
        warehouse={selectedWarehouse}
        lastUpdated={meta?.updatedAt || '2 mins ago'}
        notifications={alerts?.unreadCount || 3}
        onWarehouseChange={setSelectedWarehouse}
        onNotificationClick={() => onViewAllAlerts && onViewAllAlerts()}
      />

      {/* 2. Reusable Stat Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <StatCard
          title="Total Stations"
          value={totalStations}
          subtitle="Monitored across facility"
          icon={<Radio size={20} />}
          badge="100% COVERAGE"
          color="#2563eb"
        />
        <StatCard
          title="Active Stations"
          value={activeCount}
          subtitle="Live telemetry online"
          icon={<CheckCircle size={20} />}
          badge="ONLINE"
          color="#10b981"
        />
        <StatCard
          title="Need Refill"
          value={refillCount}
          subtitle="Low bait level warning"
          icon={<RefreshCw size={20} />}
          badge="ACTION REQUIRED"
          color="#f59e0b"
        />
        <StatCard
          title="Offline Stations"
          value={offlineCount}
          subtitle="Battery / connection lost"
          icon={<AlertTriangle size={20} />}
          badge="OFFLINE"
          color="#ef4444"
        />
      </div>

      {/* 3. Main Health Card & Live Facility Map Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <StationHealthCard
          score={health?.score || 87}
          status="Optimal"
          activeStations={activeCount}
          attention={refillCount}
          weeklyChange={4.2}
          stats={health?.stats}
        />
        <FacilityMapCard
          stations={stations || []}
          onSelect={handleStationSelect}
        />
      </div>

      {/* 4. Quick Actions */}
      <QuickActions onAction={onQuickAction} />

      {/* 5. Today's Detections & Species Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <ActivityCard
          total={activity?.total || 42}
          change={activity?.changePercent || 23}
          comparisonLabel={activity?.comparisonLabel || 'vs yesterday'}
          data={activity?.series}
        />
        <SpeciesBreakdownCard
          total={species?.total || 87}
          caption={species?.caption || 'Total Detections'}
          breakdown={species?.breakdown}
        />
      </div>

      {/* 6. Recent Alerts */}
      <RecentAlertsCard
        alerts={alerts?.items}
        unreadCount={alerts?.unreadCount}
        onViewAll={onViewAllAlerts}
      />

      {/* Station Detail Viewer Modal on map pin click */}
      <StationDetailViewerModal
        isOpen={Boolean(activeModalStation || selectedStation)}
        station={activeModalStation || selectedStation}
        onClose={() => {
          setActiveModalStation(null)
          if (onSelectStation) onSelectStation(null)
        }}
      />
    </div>
  )
}

