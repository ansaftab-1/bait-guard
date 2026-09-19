import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Copy, Globe, Building2 } from 'lucide-react';
import LeadScoreBadge, { DataQualityBadge } from './LeadScoreBadge';

/**
 * LeadTable — responsive lead list.
 * Desktop: full table with all columns.
 * Mobile/tablet: card stack with key info.
 */
function LeadTable({ leads = [], onLeadClick }) {
  const navigate = useNavigate();

  const handleClick = (lead) => {
    if (onLeadClick) onLeadClick(lead);
    else navigate(`/lead-intelligence/${lead.id}`);
  };

  if (leads.length === 0) {
    return null; // handled by parent empty state
  }

  return (
    <>
      {/* ─── Desktop Table ────────────────────────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
            background: '#fff',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(16,24,40,0.04)',
            border: '1px solid #e4e7ec',
          }}
        >
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e4e7ec' }}>
              {['Company', 'Industry', 'Location', 'Revenue', 'Contact', 'Score', 'Priority', 'Data Quality', ''].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#64748b',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, idx) => (
              <TableRow
                key={lead.id}
                lead={lead}
                isLast={idx === leads.length - 1}
                onClick={() => handleClick(lead)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Mobile Card Stack ────────────────────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {leads.map((lead) => (
          <MobileCard key={lead.id} lead={lead} onClick={() => handleClick(lead)} />
        ))}
      </div>
    </>
  );
}

export default React.memo(LeadTable);


function TableRow({ lead, isLast, onClick }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
        background: hovered ? '#f8fafc' : '#fff',
        cursor: 'pointer',
        transition: 'background 0.1s',
      }}
    >
      {/* Company */}
      <td style={{ padding: '14px 16px', maxWidth: '220px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {lead.companyName}
          </span>
          {lead.isDuplicate && (
            <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Copy size={9} /> Potential Duplicate
            </span>
          )}
          {lead.website && (
            <span style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {lead.website.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          )}
        </div>
      </td>

      {/* Industry */}
      <td style={{ padding: '14px 16px', color: '#475569', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Building2 size={12} color="#94a3b8" />
          {lead.industry || '—'}
        </div>
      </td>

      {/* Location */}
      <td style={{ padding: '14px 16px', color: '#475569', whiteSpace: 'nowrap' }}>
        {lead.location || '—'}
      </td>

      {/* Revenue */}
      <td style={{ padding: '14px 16px', color: '#475569', whiteSpace: 'nowrap' }}>
        {lead.revenueLabel || '—'}
      </td>

      {/* Contact */}
      <td style={{ padding: '14px 16px', maxWidth: '180px' }}>
        {lead.contactName ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '12.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {lead.contactName}
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {lead.contactTitle || lead.email || ''}
            </span>
          </div>
        ) : (
          <span style={{ color: '#cbd5e1', fontSize: '12px' }}>No contact</span>
        )}
      </td>

      {/* Score */}
      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
        <span style={{
          fontSize: '16px',
          fontWeight: '800',
          color: lead.leadScore >= 80 ? '#15803d' : lead.leadScore >= 60 ? '#a16207' : '#dc2626',
          letterSpacing: '-0.3px',
        }}>
          {lead.leadScore}
        </span>
      </td>

      {/* Priority */}
      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
        <LeadScoreBadge score={lead.leadScore} priority={lead.priority} compact />
      </td>

      {/* Data Quality */}
      <td style={{ padding: '14px 16px' }}>
        <DataQualityBadge status={lead.dataQuality?.status} pct={lead.dataQuality?.pct} />
      </td>

      {/* Action */}
      <td style={{ padding: '14px 16px' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#2563eb',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            padding: '6px 10px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#dbeafe'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#eff6ff'; }}
        >
          View
          <ChevronRight size={12} />
        </button>
      </td>
    </tr>
  );
}

function MobileCard({ lead, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid #e4e7ec',
        borderRadius: '14px',
        padding: '16px',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(16,24,40,0.04)',
        transition: 'box-shadow 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(16,24,40,0.1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 6px rgba(16,24,40,0.04)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {lead.companyName}
          </div>
          {lead.isDuplicate && (
            <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: '600', marginTop: '2px' }}>
              ⚠ Potential Duplicate
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0, marginLeft: '12px' }}>
          <span style={{
            fontSize: '20px',
            fontWeight: '800',
            color: lead.leadScore >= 80 ? '#15803d' : lead.leadScore >= 60 ? '#a16207' : '#dc2626',
          }}>
            {lead.leadScore}
          </span>
          <LeadScoreBadge score={lead.leadScore} priority={lead.priority} compact />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
        {lead.industry && <div><span style={{ fontWeight: '600', color: '#94a3b8' }}>Industry</span><br />{lead.industry}</div>}
        {lead.location && <div><span style={{ fontWeight: '600', color: '#94a3b8' }}>Location</span><br />{lead.location}</div>}
        {lead.revenueLabel && lead.revenueLabel !== 'Unknown' && (
          <div><span style={{ fontWeight: '600', color: '#94a3b8' }}>Revenue</span><br />{lead.revenueLabel}</div>
        )}
        {lead.contactName && (
          <div><span style={{ fontWeight: '600', color: '#94a3b8' }}>Contact</span><br />{lead.contactName}</div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <DataQualityBadge status={lead.dataQuality?.status} pct={lead.dataQuality?.pct} />
        <button style={{
          display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600',
          color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer',
        }}>
          View Lead <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}
