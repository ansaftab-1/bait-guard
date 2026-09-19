import React, { useRef } from 'react';
import { Upload, X, CheckCircle2, AlertCircle, FileText, Users, Star, AlertTriangle } from 'lucide-react';
import { parseCSVFile, importLeads } from '../../api/leadsData';

/**
 * ImportModal — CSV import dialog.
 *
 * States:
 *   idle     — ready to accept a file
 *   parsing  — reading and parsing the CSV
 *   preview  — showing parsed rows and a confirm button
 *   uploading — sending to the server
 *   success  — showing the import summary
 *   error    — showing an error message
 */
export default function ImportModal({ onClose, onImported }) {
  const [state, setState] = React.useState('idle');
  const [parsedLeads, setParsedLeads] = React.useState([]);
  const [summary, setSummary] = React.useState(null);
  const [error, setError] = React.useState('');
  const fileRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setError('Only CSV files are supported.');
      setState('error');
      return;
    }

    setState('parsing');
    setError('');
    try {
      const leads = await parseCSVFile(file);
      if (leads.length === 0) {
        setError('The CSV file appears to be empty or has no valid rows.');
        setState('error');
        return;
      }
      setParsedLeads(leads);
      setState('preview');
    } catch (err) {
      setError(err.message || 'Failed to parse the CSV file.');
      setState('error');
    }
  };

  const handleImport = async () => {
    setState('uploading');
    try {
      const result = await importLeads(parsedLeads);
      setSummary(result);
      setState('success');
      if (onImported) onImported(result);
    } catch (err) {
      setError(err.message || 'Import failed. Please try again.');
      setState('error');
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#fff', borderRadius: '18px', padding: '28px 32px',
        maxWidth: '520px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        animation: 'smoothPopupFade 0.22s cubic-bezier(0.16,1,0.3,1) forwards',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', margin: '0 0 2px' }}>Import Leads</h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Upload a CSV file to import leads into the system</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ─── Idle ─────────────────────────────────────────────────────── */}
        {state === 'idle' && (
          <div>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: '2px dashed #bfdbfe', borderRadius: '14px', padding: '32px 24px',
                textAlign: 'center', cursor: 'pointer', background: '#f8fbff',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#eff6ff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#bfdbfe'; e.currentTarget.style.background = '#f8fbff'; }}
            >
              <Upload size={28} color="#60a5fa" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                Click to select a CSV file
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Supported fields: company, industry, location, revenue, employees, contactName, email, phone, website
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div style={{ marginTop: '16px', fontSize: '11px', color: '#94a3b8', lineHeight: '1.6' }}>
              After import: leads will be automatically scored, deduplicated, and prioritized.
            </div>
          </div>
        )}

        {/* ─── Parsing ──────────────────────────────────────────────────── */}
        {state === 'parsing' && (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Reading file...</div>
          </div>
        )}

        {/* ─── Preview ──────────────────────────────────────────────────── */}
        {state === 'preview' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', color: '#15803d', fontWeight: '600' }}>
              <FileText size={15} />
              {parsedLeads.length} leads ready to import
            </div>

            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e4e7ec', borderRadius: '10px', marginBottom: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e4e7ec' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', color: '#64748b', fontWeight: '700' }}>Company</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', color: '#64748b', fontWeight: '700' }}>Industry</th>
                    <th style={{ padding: '8px 10px', textAlign: 'left', color: '#64748b', fontWeight: '700' }}>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedLeads.slice(0, 8).map((lead, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '7px 10px', color: '#374151', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.companyName || '—'}</td>
                      <td style={{ padding: '7px 10px', color: '#374151' }}>{lead.industry || '—'}</td>
                      <td style={{ padding: '7px 10px', color: '#374151', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.email || '—'}</td>
                    </tr>
                  ))}
                  {parsedLeads.length > 8 && (
                    <tr>
                      <td colSpan={3} style={{ padding: '7px 10px', color: '#94a3b8', fontSize: '11px', textAlign: 'center' }}>
                        ... and {parsedLeads.length - 8} more rows
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setState('idle'); setParsedLeads([]); }}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e4e7ec', background: '#f8fafc', color: '#374151', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                style={{ flex: 2, padding: '10px', borderRadius: '10px', border: 'none', background: '#2563eb', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                Import {parsedLeads.length} Leads
              </button>
            </div>
          </div>
        )}

        {/* ─── Uploading ────────────────────────────────────────────────── */}
        {state === 'uploading' && (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Importing and scoring leads...</div>
          </div>
        )}

        {/* ─── Success ──────────────────────────────────────────────────── */}
        {state === 'success' && summary && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <CheckCircle2 size={40} color="#16a34a" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>Import Complete</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <SummaryCard icon={<Users size={16} />} label="Leads Imported" value={summary.imported} color="#2563eb" />
              <SummaryCard icon={<Star size={16} />} label="High Priority" value={summary.highPriority} color="#16a34a" />
              <SummaryCard icon={<AlertTriangle size={16} />} label="Duplicates Detected" value={summary.duplicatesDetected} color="#d97706" />
              <SummaryCard icon={<AlertCircle size={16} />} label="Incomplete Records" value={summary.incompleteRecords} color="#dc2626" />
            </div>
            <button
              onClick={onClose}
              style={{ width: '100%', padding: '11px', borderRadius: '10px', border: 'none', background: '#2563eb', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
            >
              Done
            </button>
          </div>
        )}

        {/* ─── Error ────────────────────────────────────────────────────── */}
        {state === 'error' && (
          <div>
            <div style={{ padding: '14px', borderRadius: '10px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '13px', fontWeight: '500', marginBottom: '16px' }}>
              {error || 'An unexpected error occurred.'}
            </div>
            <button
              onClick={() => { setState('idle'); setError(''); }}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e4e7ec', background: '#f8fafc', color: '#374151', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, color }) {
  return (
    <div style={{
      padding: '12px 14px', borderRadius: '10px', background: '#f8fafc',
      border: '1px solid #e4e7ec', display: 'flex', flexDirection: 'column', gap: '4px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color, marginBottom: '2px' }}>
        {icon}
        <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      </div>
      <span style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{value}</span>
    </div>
  );
}
