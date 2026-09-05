import React from 'react';
import { useNavigate } from 'react-router-dom';
import OverviewContent from '../components/overview/OverviewContent';
import OverviewSkeleton from '../components/overview/OverviewSkeleton';
import ErrorState from '../components/ui/ErrorState';
import useOverviewData from '../hooks/useOverviewData';

export default function OverviewPage() {
  const navigate = useNavigate();
  const { data, isLoading, error, refresh } = useOverviewData();

  const handleQuickAction = (action) => {
    if (action === 'refresh') refresh();
    else if (action === 'map') navigate('/facility-map');
    else if (action === 'export') navigate('/reports');
    else if (action === 'config') navigate('/settings');
  };

  return (
    <div className="p-6 w-full box-border">
      {isLoading && <OverviewSkeleton />}
      {error && <ErrorState onRetry={refresh} />}
      {!isLoading && !error && data && (
        <OverviewContent
          data={data}
          onQuickAction={handleQuickAction}
          onViewAllAlerts={() => navigate('/stations')}
        />
      )}
    </div>
  );
}
