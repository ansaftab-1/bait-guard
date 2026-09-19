import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import LeadDetailPanel from '../components/leads/LeadDetailPanel';
import { fetchLeadById } from '../api/leadsData';

export default function LeadDetailPage() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);

    fetchLeadById(leadId)
      .then((data) => { if (mounted) { setLead(data); setIsLoading(false); } })
      .catch((err) => { if (mounted) { setError(err); setIsLoading(false); } });

    return () => { mounted = false; };
  }, [leadId]);

  const handleBack = () => {
    navigate('/lead-intelligence');
  };

  if (isLoading) {
    return (
      <div className="p-6 animate-pulse space-y-4 max-w-3xl mx-auto">
        <div className="h-6 bg-gray-200 rounded w-32" />
        <div className="h-32 bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-40 bg-gray-200 rounded-2xl" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
        </div>
        <div className="h-48 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="p-6">
        <div style={{
          background: '#fff', border: '1px solid #fecaca', borderRadius: '16px',
          padding: '32px', textAlign: 'center', maxWidth: '480px', margin: '0 auto',
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
            Lead not found
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            This lead may have been deleted or the ID is incorrect.
          </div>
          <button
            onClick={handleBack}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
              background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '13px', fontWeight: '700', cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} /> Back to Lead Intelligence
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f8fafc] min-h-full">
      <LeadDetailPanel lead={lead} onBack={handleBack} />
    </div>
  );
}
