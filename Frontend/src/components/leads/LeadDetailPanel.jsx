import React, { useState } from 'react';
import {
  ArrowLeft, Sparkles, Globe, Phone, Mail, ExternalLink,
  CheckCircle2, XCircle, AlertCircle, Building2, MapPin, DollarSign, Users,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import LeadScoreBadge, { DataQualityBadge } from './LeadScoreBadge';
import { analyzeLeadWithAI } from '../../api/leadsData';

const BREAKDOWN_LABELS = {
  industryFit:         'Industry Fit',
  revenueFit:          'Revenue Fit',
  locationFit:         'Location Fit',
  companySize:         'Company Size',
  contactCompleteness: 'Contact Completeness',
  websiteQuality:      'Website Quality',
  dataFreshness:       'Data Freshness',
};

/**
 * LeadDetailPanel — full detail view for a single lead.
 * Used inside the LeadDetailPage.
 *
 * @param {object}   lead
 * @param {Function} onBack — called to navigate back to the list
 */
export default function LeadDetailPanel({ lead, onBack }) {
  const [aiState, setAiState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [aiAnalysis, setAiAnalysis] = useState(lead?.aiAnalysis || null);
  const [showAllStrengths, setShowAllStrengths] = useState(false);

  if (!lead) return null;

  const handleAnalyze = async () => {
    setAiState('loading');
    try {
      const analysis = await analyzeLeadWithAI(lead.id);
      setAiAnalysis(analysis);
      setAiState('success');
    } catch {
      setAiState('error');
    }
  };

  const breakdown = lead.scoreBreakdown || {};
  const insights  = lead.insights || { strengths: [], weaknesses: [] };
  const dq        = lead.dataQuality || {};
  const strengths = insights.strengths || [];
  const weaknesses = insights.weaknesses || [];

  const visibleStrengths = showAllStrengths ? strengths : strengths.slice(0, 4);

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 0 40px' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600',
          color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer',
          marginBottom: '20px', padding: '0',
        }}
      >
        <ArrowLeft size={15} /> Back to Lead Intelligence
      </button>

      {/* ─── Header Card ────────────────────────────────────────────────────── */}
      <div style={{
        background: '#fff', border: '1px solid #e4e7ec', borderRadius: '16px',
        padding: '24px 28px', marginBottom: '16px',
        boxShadow: '0 4px 12px rgba(16,24,40,0.05)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
              {lead.companyName}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
              {lead.industry && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Building2 size={13} color="#94a3b8" /> {lead.industry}
                </span>
              )}
              {lead.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={13} color="#94a3b8" /> {lead.location}
                </span>
              )}
              {lead.revenueLabel && lead.revenueLabel !== 'Unknown' && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <DollarSign size={13} color="#94a3b8" /> {lead.revenueLabel}
                </span>
              )}
              {lead.employees > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Users size={13} color="#94a3b8" /> {lead.employees} employees
                </span>
              )}
            </div>
            {lead.website && (
              <a
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#2563eb', marginTop: '8px', textDecoration: 'none' }}
              >
                <Globe size={12} /> {lead.website.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            )}
          </div>

          {/* Score block */}
          <div style={{
            textAlign: 'center', padding: '16px 24px', borderRadius: '14px',
            background: lead.leadScore >= 80 ? '#f0fdf4' : lead.leadScore >= 60 ? '#fffbeb' : '#fef2f2',
            border: `1px solid ${lead.leadScore >= 80 ? '#bbf7d0' : lead.leadScore >= 60 ? '#fde68a' : '#fecaca'}`,
            flexShrink: 0,
          }}>
            <div style={{
              fontSize: '40px', fontWeight: '900', letterSpacing: '-2px', lineHeight: '1',
              color: lead.leadScore >= 80 ? '#15803d' : lead.leadScore >= 60 ? '#a16207' : '#dc2626',
            }}>
              {lead.leadScore}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '8px' }}>/100</div>
            <LeadScoreBadge score={lead.leadScore} priority={lead.priority} compact />
          </div>
        </div>

        {/* Duplicate warning */}
        {lead.isDuplicate && (
          <div style={{
            marginTop: '16px', padding: '10px 14px', borderRadius: '10px',
            background: '#fffbeb', border: '1px solid #fde68a',
            fontSize: '12px', color: '#a16207', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <AlertCircle size={14} />
            Potential duplicate — this lead may share a domain or contact with another record.
            {lead.duplicateOf && (
              <span style={{ color: '#64748b', fontWeight: '500' }}>
                {' '}Possible match: {lead.duplicateOf}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ─── Two-column body ────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="lead-detail-grid">

        {/* Score Breakdown */}
        <Card title="Score Breakdown">
          {Object.entries(breakdown).map(([key, val]) => (
            <ScoreRow
              key={key}
              label={BREAKDOWN_LABELS[key] || key}
              score={val.score}
              max={val.max}
            />
          ))}
          <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '14px' }}>
            <span style={{ color: '#0f172a' }}>Total</span>
            <span style={{ color: lead.leadScore >= 80 ? '#15803d' : lead.leadScore >= 60 ? '#a16207' : '#dc2626' }}>
              {lead.leadScore} / 100
            </span>
          </div>
        </Card>

        {/* Contact Information */}
        <Card title="Contact Information">
          {lead.contactName ? (
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' }}>
                {lead.contactName}
              </div>
              {lead.contactTitle && (
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>{lead.contactTitle}</div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {lead.email && (
                  <ContactRow icon={<Mail size={13} />} label={lead.email} href={`mailto:${lead.email}`} />
                )}
                {lead.phone && (
                  <ContactRow icon={<Phone size={13} />} label={lead.phone} href={`tel:${lead.phone}`} />
                )}
                {lead.linkedin && (
                  <ContactRow icon={<ExternalLink size={13} />} label="LinkedIn Profile" href={lead.linkedin} />
                )}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
              No contact information on record.
            </div>
          )}
        </Card>

        {/* Why This Lead? */}
        <Card title="Why This Lead?" fullWidth>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {strengths.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#15803d', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Strengths
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {visibleStrengths.map((s, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12.5px', color: '#166534' }}>
                      <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: '1px' }} />
                      {s}
                    </li>
                  ))}
                </ul>
                {strengths.length > 4 && (
                  <button
                    onClick={() => setShowAllStrengths(!showAllStrengths)}
                    style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '8px', fontSize: '11px', fontWeight: '600', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: '0' }}
                  >
                    {showAllStrengths ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {showAllStrengths ? 'Show less' : `+${strengths.length - 4} more`}
                  </button>
                )}
              </div>
            )}
            {weaknesses.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#b91c1c', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Needs Attention
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {weaknesses.map((w, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12.5px', color: '#7f1d1d' }}>
                      <AlertCircle size={14} color="#dc2626" style={{ flexShrink: 0, marginTop: '1px' }} />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {strengths.length === 0 && weaknesses.length === 0 && (
              <div style={{ color: '#94a3b8', fontSize: '13px', gridColumn: '1 / -1' }}>
                Insights not available for this lead.
              </div>
            )}
          </div>
        </Card>

        {/* Data Quality Checklist */}
        <Card title={`Data Quality — ${dq.pct ?? 0}%`}>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ background: '#f1f5f9', borderRadius: '100px', height: '6px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '100px', transition: 'width 0.5s',
                width: `${dq.pct ?? 0}%`,
                background: dq.pct >= 80 ? '#16a34a' : dq.pct >= 50 ? '#d97706' : '#dc2626',
              }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(dq.checks || []).map((check, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' }}>
                <span style={{ color: '#374151', fontWeight: '500' }}>{check.field}</span>
                {check.present ? (
                  <CheckCircle2 size={15} color="#16a34a" />
                ) : (
                  <XCircle size={15} color="#ef4444" />
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <DataQualityBadge status={dq.status} pct={dq.pct} />
          </div>
        </Card>
      </div>

      {/* ─── AI Analysis Section ─────────────────────────────────────────────── */}
      <div style={{
        background: '#fff', border: '1px solid #e4e7ec', borderRadius: '16px',
        padding: '24px 28px', marginTop: '16px',
        boxShadow: '0 4px 12px rgba(16,24,40,0.05)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: aiAnalysis ? '20px' : '0' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px' }}>
              AI Lead Analysis
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0' }}>
              Click to generate a structured AI business summary for this lead.
            </p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={aiState === 'loading'}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              fontSize: '13px', fontWeight: '700',
              padding: '10px 18px', borderRadius: '10px',
              background: aiState === 'loading' ? '#dbeafe' : '#2563eb',
              color: aiState === 'loading' ? '#60a5fa' : '#fff',
              border: 'none', cursor: aiState === 'loading' ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s', flexShrink: 0,
              opacity: aiState === 'loading' ? 0.8 : 1,
            }}
          >
            <Sparkles size={15} />
            {aiState === 'loading' ? 'Analyzing...' : aiState === 'success' ? 'Regenerate' : 'Analyze with AI'}
          </button>
        </div>

        {aiState === 'error' && (
          <div style={{
            padding: '14px 16px', borderRadius: '10px', marginTop: '16px',
            background: '#fef2f2', border: '1px solid #fecaca', fontSize: '13px', color: '#b91c1c',
          }}>
            <strong>Unable to analyze this lead.</strong> The AI service encountered an error. Please try again.
          </div>
        )}

        {aiState === 'loading' && (
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: '60px', borderRadius: '8px', background: '#f1f5f9', flex: '1 1 180px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        )}

        {aiState === 'success' && aiAnalysis && (
          <AIResult analysis={aiAnalysis} />
        )}

        {aiState === 'idle' && aiAnalysis && (
          <AIResult analysis={aiAnalysis} />
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Card({ title, children, fullWidth }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e4e7ec', borderRadius: '14px',
      padding: '20px 22px',
      boxShadow: '0 2px 8px rgba(16,24,40,0.04)',
      gridColumn: fullWidth ? '1 / -1' : undefined,
    }}>
      <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 14px' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function ScoreRow({ label, score, max }) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  const color = pct === 100 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626';
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
        <span style={{ color: '#374151', fontWeight: '500' }}>{label}</span>
        <span style={{ fontWeight: '700', color }}>{score}/{max}</span>
      </div>
      <div style={{ background: '#f1f5f9', borderRadius: '100px', height: '5px', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: '100px', width: `${pct}%`, background: color, transition: 'width 0.5s' }} />
      </div>
    </div>
  );
}

function ContactRow({ icon, label, href }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}
    >
      <span style={{ color: '#94a3b8' }}>{icon}</span>
      {label}
    </a>
  );
}

function AIResult({ analysis }) {
  const fields = [
    { key: 'summary',                label: 'Summary' },
    { key: 'whyItMatters',           label: 'Why It Matters' },
    { key: 'potentialOpportunity',   label: 'Potential Opportunity' },
    { key: 'dataConcerns',           label: 'Data Concerns' },
    { key: 'suggestedOutreach',      label: 'Suggested Outreach' },
    { key: 'priorityRecommendation', label: 'AI Recommendation' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {analysis.source === 'simulation' && (
        <div style={{
          fontSize: '11px', color: '#64748b', padding: '6px 10px', borderRadius: '6px',
          background: '#f8fafc', border: '1px solid #e2e8f0', display: 'inline-flex', alignItems: 'center', gap: '5px',
        }}>
          ℹ Simulated analysis — add an OpenAI key to Backend/.env for real AI insights
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
        {fields.map(({ key, label }) => (
          <div key={key} style={{
            padding: '12px 14px', borderRadius: '10px',
            background: key === 'priorityRecommendation' ? '#eff6ff' : '#f8fafc',
            border: `1px solid ${key === 'priorityRecommendation' ? '#bfdbfe' : '#e4e7ec'}`,
          }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px' }}>
              {label}
            </div>
            <div style={{
              fontSize: '12.5px', color: key === 'priorityRecommendation' ? '#1d4ed8' : '#374151',
              fontWeight: key === 'priorityRecommendation' ? '700' : '400', lineHeight: '1.5',
            }}>
              {analysis[key] || 'Information not available.'}
            </div>
          </div>
        ))}
      </div>
      {analysis.generatedAt && (
        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
          Generated at {new Date(analysis.generatedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}
