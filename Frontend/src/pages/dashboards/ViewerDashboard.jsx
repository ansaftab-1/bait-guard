import React from 'react';
import { useNavigate } from 'react-router-dom';
import useOverviewData from '../../hooks/useOverviewData';
import OverviewContent from '../../components/overview/OverviewContent';
import OverviewSkeleton from '../../components/overview/OverviewSkeleton';
import ErrorState from '../../components/ui/ErrorState';

export default function ViewerDashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error, refresh } = useOverviewData();

  const handleQuickAction = (action) => {
    if (action === 'refresh') {
      refresh();
    } else if (action === 'map') {
      navigate('/facility-map');
    } else if (action === 'export') {
      navigate('/reports');
    } else if (action === 'config') {
      navigate('/settings');
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: "'Inter', system-ui, sans-serif", width: '100%', boxSizing: 'border-box' }}>
      {isLoading && <OverviewSkeleton />}
      {error && <ErrorState onRetry={refresh} />}
      {!isLoading && !error && data && (
        <OverviewContent
          data={data}
          onQuickAction={handleQuickAction}
          onViewAllAlerts={() => navigate('/alerts')}
        />
      )}
    </div>
  );
}

