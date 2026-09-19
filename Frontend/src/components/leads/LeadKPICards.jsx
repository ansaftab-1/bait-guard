import React from 'react';
import { TrendingUp, Users, AlertCircle, Star } from 'lucide-react';
import StatCard from '../ui/StatCard';

/**
 * LeadKPICards — four summary cards at the top of the Lead Intelligence page.
 * Computes all values from the `kpis` prop (never hard-coded).
 */
function LeadKPICards({ kpis, onDuplicatesClick }) {
  const {
    total        = 0,
    highPriority = 0,
    averageScore = 0,
    dataIssues   = 0,
    duplicates   = 0,
  } = kpis;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* Total Leads */}
      <StatCard
        title="Total Leads"
        value={total}
        subtitle="In your pipeline"
        icon={<Users size={18} />}
        color="#2563eb"
      />

      {/* High Priority */}
      <StatCard
        title="High Priority"
        value={highPriority}
        subtitle={total > 0 ? `${Math.round((highPriority / total) * 100)}% of total` : '—'}
        icon={<Star size={18} />}
        badge={highPriority > 0 ? 'ACTION' : undefined}
        color="#16a34a"
      />

      {/* Average Score */}
      <StatCard
        title="Average Lead Score"
        value={`${averageScore}/100`}
        subtitle={
          averageScore >= 70 ? 'Strong pipeline quality' :
          averageScore >= 50 ? 'Room for improvement' :
          'Needs attention'
        }
        icon={<TrendingUp size={18} />}
        color={averageScore >= 70 ? '#16a34a' : averageScore >= 50 ? '#d97706' : '#dc2626'}
      />

      {/* Data Issues / Duplicates */}
      <div
        className="cursor-pointer"
        onClick={dataIssues > 0 || duplicates > 0 ? onDuplicatesClick : undefined}
        title={duplicates > 0 ? `Click to see ${duplicates} potential duplicate(s)` : undefined}
      >
        <StatCard
          title="Data Quality Issues"
          value={dataIssues}
          subtitle={duplicates > 0 ? `+${duplicates} potential duplicate${duplicates > 1 ? 's' : ''}` : 'All records verified'}
          icon={<AlertCircle size={18} />}
          badge={dataIssues > 0 ? 'REVIEW' : undefined}
          color={dataIssues > 0 ? '#d97706' : '#16a34a'}
        />
      </div>
    </div>
  );
}

export default React.memo(LeadKPICards);

