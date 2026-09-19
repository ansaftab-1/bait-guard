import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Download, Upload, RefreshCw, Copy } from 'lucide-react';
import useLeadsData from '../hooks/useLeadsData';
import LeadKPICards from '../components/leads/LeadKPICards';
import LeadFilters from '../components/leads/LeadFilters';
import LeadTable from '../components/leads/LeadTable';
import ImportModal from '../components/leads/ImportModal';
import { exportLeadsClientSide } from '../api/leadsData';

export default function LeadIntelligencePage() {
  const navigate = useNavigate();
  const {
    leads, kpis, industries, locations, totalFiltered,
    isLoading, error, filters, setFilter, clearFilters, hasActiveFilters, refresh,
  } = useLeadsData();

  const [showImport, setShowImport] = useState(false);

  const handleLeadClick = useCallback((lead) => {
    navigate(`/lead-intelligence/${lead.id}`);
  }, [navigate]);

  const handleExport = useCallback(() => {
    exportLeadsClientSide(leads);
  }, [leads]);

  const handleDuplicatesClick = useCallback(() => {
    setFilter('isDuplicate', true);
  }, [setFilter]);

  const handleImported = useCallback(() => {
    setTimeout(() => {
      setShowImport(false);
      refresh();
    }, 1200);
  }, [refresh]);

  // ─── Loading State ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-6 animate-pulse space-y-5 w-full">
        <div className="h-9 bg-gray-200 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-200 rounded-2xl" />)}
        </div>
        <div className="h-28 bg-gray-200 rounded-2xl" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  // ─── Error State ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-6 w-full">
        <div
          style={{
            background: '#fff', border: '1px solid #fecaca', borderRadius: '16px',
            padding: '32px', textAlign: 'center', maxWidth: '480px', margin: '0 auto',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
            Something went wrong while loading leads.
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            Please try again.
          </div>
          <button
            onClick={refresh}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
              background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '13px', fontWeight: '700', cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col min-h-full w-full box-border bg-[#f8fafc]">

      {/* ─── Header ──────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          flexWrap: 'wrap', gap: '16px', marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
          }}>
            <Target size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
              Lead Intelligence
            </h1>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, marginTop: '2px' }}>
              Identify, score, and prioritize the companies worth contacting first.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            id="btn-import-leads"
            onClick={() => setShowImport(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px',
              border: '1px solid #e4e7ec', background: '#fff', borderRadius: '10px',
              fontSize: '13px', fontWeight: '600', color: '#374151', cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(16,24,40,0.05)', transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
          >
            <Upload size={14} /> Import Leads
          </button>
          <button
            id="btn-export-leads"
            onClick={handleExport}
            disabled={leads.length === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px',
              border: 'none', background: '#2563eb', borderRadius: '10px',
              fontSize: '13px', fontWeight: '700', color: '#fff', cursor: leads.length === 0 ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(37,99,235,0.25)', transition: 'all 0.15s',
              opacity: leads.length === 0 ? 0.7 : 1,
            }}
            onMouseEnter={(e) => { if (leads.length > 0) e.currentTarget.style.background = '#1d4ed8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#2563eb'; }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* ─── KPI Cards ───────────────────────────────────────────────────────── */}
      <LeadKPICards kpis={kpis} onDuplicatesClick={handleDuplicatesClick} />

      {/* ─── Filters ─────────────────────────────────────────────────────────── */}
      <LeadFilters
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        industries={industries}
        locations={locations}
      />

      {/* ─── Results Summary Row ─────────────────────────────────────────────── */}
      {totalFiltered > 0 && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '12px',
        }}>
          <span>
            Showing <strong style={{ color: '#0f172a' }}>{totalFiltered}</strong> of <strong style={{ color: '#0f172a' }}>{kpis.total}</strong> leads
            {hasActiveFilters && ' (filtered)'}
          </span>
          {kpis.duplicates > 0 && !filters.isDuplicate && (
            <button
              onClick={handleDuplicatesClick}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '12px', fontWeight: '600', color: '#d97706',
                background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px',
                padding: '4px 10px', cursor: 'pointer',
              }}
            >
              <Copy size={12} /> {kpis.duplicates} Potential Duplicate{kpis.duplicates > 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}

      {/* ─── Lead Table / Empty States ────────────────────────────────────────── */}
      {leads.length === 0 ? (
        hasActiveFilters ? (
          // Filtered empty state
          <div style={{
            background: '#fff', border: '1px solid #e4e7ec', borderRadius: '16px',
            padding: '48px 32px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              No matching leads
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Try changing your filters or search query.
            </div>
            <button
              onClick={clearFilters}
              style={{
                padding: '9px 20px', background: '#f8fafc', border: '1px solid #e4e7ec',
                borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#374151',
                cursor: 'pointer',
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          // No data at all
          <div style={{
            background: '#fff', border: '1px solid #e4e7ec', borderRadius: '16px',
            padding: '48px 32px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              No leads found
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Import a CSV or adjust your filters to get started.
            </div>
            <button
              onClick={() => setShowImport(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '10px 20px', background: '#2563eb', border: 'none',
                borderRadius: '10px', fontSize: '13px', fontWeight: '700', color: '#fff',
                cursor: 'pointer',
              }}
            >
              <Upload size={14} /> Import Leads
            </button>
          </div>
        )
      ) : (
        <LeadTable leads={leads} onLeadClick={handleLeadClick} />
      )}

      {/* ─── Import Modal ────────────────────────────────────────────────────── */}
      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onImported={handleImported}
        />
      )}
    </div>
  );
}
