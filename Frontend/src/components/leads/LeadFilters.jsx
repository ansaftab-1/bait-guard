import React from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

const PRIORITY_OPTIONS = [
  { value: 'all',    label: 'All Priorities' },
  { value: 'high',   label: '↑ High Priority' },
  { value: 'medium', label: '→ Medium Priority' },
  { value: 'low',    label: '↓ Low Priority' },
];

const SCORE_RANGE_OPTIONS = [
  { value: 'all',    label: 'All Scores' },
  { value: '80-100', label: '80–100 (High)' },
  { value: '60-79',  label: '60–79 (Medium)' },
  { value: '0-59',   label: '0–59 (Low)' },
];

const DATA_QUALITY_OPTIONS = [
  { value: 'all',         label: 'All Quality' },
  { value: 'good',        label: '✓ Good' },
  { value: 'needs_review',label: '⚠ Needs Review' },
  { value: 'poor',        label: '✗ Poor' },
];

/**
 * LeadFilters — search bar + filter dropdowns for the Lead Intelligence page.
 *
 * @param {object}   filters
 * @param {Function} setFilter
 * @param {Function} clearFilters
 * @param {boolean}  hasActiveFilters
 * @param {string[]} industries — dynamic list from lead data
 * @param {string[]} locations  — dynamic list from lead data
 */
function LeadFilters({
  filters,
  setFilter,
  clearFilters,
  hasActiveFilters,
  industries = [],
  locations  = [],
}) {
  const industryOptions = [
    { value: 'all', label: 'All Industries' },
    ...industries.map((i) => ({ value: i, label: i })),
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    ...locations.map((l) => ({ value: l, label: l })),
  ];

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e4e7ec',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(16,24,40,0.04)',
      }}
    >
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '14px' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8',
            pointerEvents: 'none',
          }}
        />
        <input
          id="lead-search"
          type="text"
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          placeholder="Search companies, contacts, domains..."
          style={{
            width: '100%',
            paddingLeft: '38px',
            paddingRight: filters.search ? '36px' : '14px',
            paddingTop: '10px',
            paddingBottom: '10px',
            fontSize: '13px',
            color: '#1e293b',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; }}
          onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
        />
        {filters.search && (
          <button
            onClick={() => setFilter('search', '')}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter dropdowns row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        <FilterSelect
          id="filter-priority"
          label="Priority"
          value={filters.priority}
          options={PRIORITY_OPTIONS}
          onChange={(v) => setFilter('priority', v)}
        />
        <FilterSelect
          id="filter-industry"
          label="Industry"
          value={filters.industry}
          options={industryOptions}
          onChange={(v) => setFilter('industry', v)}
        />
        <FilterSelect
          id="filter-location"
          label="Location"
          value={filters.location}
          options={locationOptions}
          onChange={(v) => setFilter('location', v)}
        />
        <FilterSelect
          id="filter-score"
          label="Score"
          value={filters.scoreRange}
          options={SCORE_RANGE_OPTIONS}
          onChange={(v) => setFilter('scoreRange', v)}
        />
        <FilterSelect
          id="filter-quality"
          label="Data Quality"
          value={filters.dataQuality}
          options={DATA_QUALITY_OPTIONS}
          onChange={(v) => setFilter('dataQuality', v)}
        />

        {/* Duplicate toggle */}
        <button
          onClick={() => setFilter('isDuplicate', !filters.isDuplicate)}
          style={{
            fontSize: '12px',
            fontWeight: '600',
            padding: '7px 12px',
            borderRadius: '8px',
            border: `1px solid ${filters.isDuplicate ? '#2563eb' : '#e2e8f0'}`,
            background: filters.isDuplicate ? '#eff6ff' : '#f8fafc',
            color: filters.isDuplicate ? '#2563eb' : '#64748b',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s',
          }}
        >
          {filters.isDuplicate ? '✓ ' : ''}Duplicates Only
        </button>

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: '600',
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #fca5a5',
              background: '#fff5f5',
              color: '#dc2626',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            <X size={12} />
            Clear Filters
          </button>
        )}
      </div>

      {/* Active filter summary chips */}
      {hasActiveFilters && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
          {filters.priority !== 'all' && (
            <ActiveChip label={`Priority: ${filters.priority}`} onRemove={() => setFilter('priority', 'all')} />
          )}
          {filters.industry !== 'all' && (
            <ActiveChip label={`Industry: ${filters.industry}`} onRemove={() => setFilter('industry', 'all')} />
          )}
          {filters.location !== 'all' && (
            <ActiveChip label={`Location: ${filters.location}`} onRemove={() => setFilter('location', 'all')} />
          )}
          {filters.scoreRange !== 'all' && (
            <ActiveChip label={`Score: ${filters.scoreRange}`} onRemove={() => setFilter('scoreRange', 'all')} />
          )}
          {filters.dataQuality !== 'all' && (
            <ActiveChip label={`Quality: ${filters.dataQuality.replace('_', ' ')}`} onRemove={() => setFilter('dataQuality', 'all')} />
          )}
          {filters.isDuplicate && (
            <ActiveChip label="Duplicates only" onRemove={() => setFilter('isDuplicate', false)} />
          )}
          {filters.search && (
            <ActiveChip label={`"${filters.search}"`} onRemove={() => setFilter('search', '')} />
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(LeadFilters);


function FilterSelect({ id, label, value, options, onChange }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          fontSize: '12px',
          fontWeight: '600',
          color: value !== 'all' ? '#2563eb' : '#374151',
          background: value !== 'all' ? '#eff6ff' : '#f8fafc',
          border: `1px solid ${value !== 'all' ? '#bfdbfe' : '#e2e8f0'}`,
          borderRadius: '8px',
          padding: '7px 30px 7px 10px',
          cursor: 'pointer',
          outline: 'none',
          transition: 'all 0.15s',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown
        size={12}
        style={{ position: 'absolute', right: '8px', pointerEvents: 'none', color: '#94a3b8' }}
      />
    </div>
  );
}

function ActiveChip({ label, onRemove }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        fontWeight: '600',
        padding: '3px 8px',
        borderRadius: '100px',
        background: '#eff6ff',
        color: '#2563eb',
        border: '1px solid #bfdbfe',
      }}
    >
      {label}
      <button
        onClick={onRemove}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', color: '#60a5fa' }}
      >
        <X size={10} />
      </button>
    </span>
  );
}
