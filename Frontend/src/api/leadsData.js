/**
 * Lead Intelligence API Module
 *
 * Follows the same pattern as other api/*.js files:
 * - Calls the real backend when BACKEND_CONFIG.enableRealBackend is true
 * - Falls back to in-memory mock data otherwise
 */

import { apiClient } from './client';
import { BACKEND_CONFIG } from './config';

// ─── Mock fallback data (matches scoring output shape) ────────────────────
// A small subset for offline dev / testing without the backend

const MOCK_LEADS = [
  {
    id: 'lead-001',
    companyName: 'Apex Manufacturing Corp',
    industry: 'Manufacturing',
    location: 'Texas',
    revenueRaw: 12000000,
    revenueLabel: '$10M–$25M',
    employees: 185,
    website: 'https://apexmfg.com',
    contactName: 'David Chen',
    contactTitle: 'CEO',
    email: 'david.chen@apexmfg.com',
    phone: '+1 512-555-0142',
    linkedin: 'https://linkedin.com/in/davidchen-apex',
    leadScore: 92,
    priority: 'high',
    isDuplicate: false,
    scoreBreakdown: {
      industryFit:         { score: 25, max: 25 },
      revenueFit:          { score: 20, max: 20 },
      locationFit:         { score: 15, max: 15 },
      companySize:         { score: 10, max: 10 },
      contactCompleteness: { score: 10, max: 10 },
      websiteQuality:      { score: 10, max: 10 },
      dataFreshness:       { score: 2,  max: 10 },
    },
    dataQuality: {
      pct: 100,
      status: 'good',
      checks: [
        { field: 'Company Name', present: true },
        { field: 'Industry',     present: true },
        { field: 'Location',     present: true },
        { field: 'Revenue',      present: true },
        { field: 'Website',      present: true },
        { field: 'Contact Name', present: true },
        { field: 'Email',        present: true },
        { field: 'Phone',        present: true },
      ],
    },
    insights: {
      strengths: [
        'Strong industry match',
        'Revenue is within the target range',
        'Located in a primary target market',
        'Decision-maker identified',
        'Complete contact information available',
        'Valid company website found',
      ],
      weaknesses: [],
    },
    aiAnalysis: null,
    createdAt: new Date(Date.now() - 7 * 864e5).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 864e5).toISOString(),
  },
  {
    id: 'lead-002',
    companyName: 'Gulf Coast Logistics',
    industry: 'Logistics',
    location: 'Texas',
    revenueRaw: 28000000,
    revenueLabel: '$25M–$50M',
    employees: 320,
    website: 'https://gulfcoastlogistics.com',
    contactName: 'Maria Rodriguez',
    contactTitle: 'VP Operations',
    email: 'mrodriguez@gulfcoastlogistics.com',
    phone: '+1 713-555-0291',
    linkedin: 'https://linkedin.com/in/maria-rodriguez-gcl',
    leadScore: 88,
    priority: 'high',
    isDuplicate: false,
    scoreBreakdown: {
      industryFit:         { score: 25, max: 25 },
      revenueFit:          { score: 20, max: 20 },
      locationFit:         { score: 15, max: 15 },
      companySize:         { score: 10, max: 10 },
      contactCompleteness: { score: 10, max: 10 },
      websiteQuality:      { score: 10, max: 10 },
      dataFreshness:       { score: 8,  max: 10 },
    },
    dataQuality: {
      pct: 100,
      status: 'good',
      checks: [
        { field: 'Company Name', present: true },
        { field: 'Industry',     present: true },
        { field: 'Location',     present: true },
        { field: 'Revenue',      present: true },
        { field: 'Website',      present: true },
        { field: 'Contact Name', present: true },
        { field: 'Email',        present: true },
        { field: 'Phone',        present: true },
      ],
    },
    insights: {
      strengths: ['Strong industry match', 'Revenue is within the target range', 'Located in a primary target market', 'Decision-maker identified'],
      weaknesses: [],
    },
    aiAnalysis: null,
    createdAt: new Date(Date.now() - 14 * 864e5).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 864e5).toISOString(),
  },
  {
    id: 'lead-010',
    companyName: 'BlueSky Technology Partners',
    industry: 'Technology',
    location: 'Texas',
    revenueRaw: 6000000,
    revenueLabel: '$5M–$10M',
    employees: 72,
    website: 'https://blueskytech.io',
    contactName: 'Kevin Murphy',
    contactTitle: 'CTO',
    email: 'kmurphy@blueskytech.io',
    phone: '',
    linkedin: 'https://linkedin.com/in/kevin-murphy-bst',
    leadScore: 62,
    priority: 'medium',
    isDuplicate: false,
    scoreBreakdown: {
      industryFit:         { score: 12, max: 25 },
      revenueFit:          { score: 20, max: 20 },
      locationFit:         { score: 15, max: 15 },
      companySize:         { score: 10, max: 10 },
      contactCompleteness: { score: 6,  max: 10 },
      websiteQuality:      { score: 10, max: 10 },
      dataFreshness:       { score: 2,  max: 10 },
    },
    dataQuality: {
      pct: 75,
      status: 'needs_review',
      checks: [
        { field: 'Company Name', present: true },
        { field: 'Industry',     present: true },
        { field: 'Location',     present: true },
        { field: 'Revenue',      present: true },
        { field: 'Website',      present: true },
        { field: 'Contact Name', present: true },
        { field: 'Email',        present: true },
        { field: 'Phone',        present: false },
      ],
    },
    insights: {
      strengths: ['Revenue is within the target range', 'Located in a primary target market'],
      weaknesses: ['Industry (Technology) is outside the primary target market', 'Phone number has not been provided'],
    },
    aiAnalysis: null,
    createdAt: new Date(Date.now() - 30 * 864e5).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 864e5).toISOString(),
  },
  {
    id: 'lead-018',
    companyName: 'Unknown Ventures',
    industry: '',
    location: '',
    revenueRaw: 0,
    revenueLabel: 'Unknown',
    employees: 0,
    website: '',
    contactName: '',
    contactTitle: '',
    email: '',
    phone: '',
    linkedin: '',
    leadScore: 0,
    priority: 'low',
    isDuplicate: false,
    scoreBreakdown: {
      industryFit:         { score: 0, max: 25 },
      revenueFit:          { score: 0, max: 20 },
      locationFit:         { score: 0, max: 15 },
      companySize:         { score: 0, max: 10 },
      contactCompleteness: { score: 0, max: 10 },
      websiteQuality:      { score: 0, max: 10 },
      dataFreshness:       { score: 0, max: 10 },
    },
    dataQuality: {
      pct: 13,
      status: 'poor',
      checks: [
        { field: 'Company Name', present: true },
        { field: 'Industry',     present: false },
        { field: 'Location',     present: false },
        { field: 'Revenue',      present: false },
        { field: 'Website',      present: false },
        { field: 'Contact Name', present: false },
        { field: 'Email',        present: false },
        { field: 'Phone',        present: false },
      ],
    },
    insights: {
      strengths: [],
      weaknesses: [
        'Industry information is missing',
        'Revenue information is not available',
        'Location information is missing',
        'No contact person identified',
        'Email address is missing',
        'Phone number has not been provided',
        'No company website on record',
      ],
    },
    aiAnalysis: null,
    createdAt: new Date(Date.now() - 120 * 864e5).toISOString(),
    updatedAt: new Date(Date.now() - 100 * 864e5).toISOString(),
  },
];

const MOCK_RESPONSE = {
  leads: MOCK_LEADS,
  kpis: {
    total: 4,
    highPriority: 2,
    averageScore: 61,
    dataIssues: 2,
    duplicates: 0,
  },
  industries: ['Logistics', 'Manufacturing', 'Technology'],
  locations: ['Texas'],
  totalFiltered: 4,
};

// ─── API Functions ────────────────────────────────────────────────────────

/**
 * Fetch leads list with optional filters.
 * @param {object} filters
 * @returns {Promise<{ leads, kpis, industries, locations, totalFiltered }>}
 */
export async function fetchLeads(filters = {}) {
  const params = {};
  if (filters.priority && filters.priority !== 'all') params.priority = filters.priority;
  if (filters.industry && filters.industry !== 'all') params.industry = filters.industry;
  if (filters.location && filters.location !== 'all') params.location = filters.location;
  if (filters.dataQuality && filters.dataQuality !== 'all') params.dataQuality = filters.dataQuality;
  if (filters.search) params.search = filters.search;
  if (filters.isDuplicate) params.isDuplicate = 'true';
  if (filters.minScore !== undefined) params.minScore = filters.minScore;
  if (filters.maxScore !== undefined) params.maxScore = filters.maxScore;

  const result = await apiClient.get('/leads', params);
  if (result) return result;

  // Client-side fallback filtering on mock data
  return applyMockFilters(filters);
}

/**
 * Fetch a single lead by ID.
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function fetchLeadById(id) {
  const result = await apiClient.get(`/leads/${id}`);
  if (result) return result;

  const found = MOCK_LEADS.find((l) => l.id === id);
  if (!found) throw new Error(`Lead ${id} not found`);
  return found;
}

/**
 * Trigger AI analysis for a lead. Only called on explicit user action.
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function analyzeLeadWithAI(id) {
  if (!BACKEND_CONFIG.enableRealBackend) {
    // Simulate a delay for realism
    await new Promise((r) => setTimeout(r, 1800));
    return buildMockAnalysis(MOCK_LEADS.find((l) => l.id === id));
  }

  const response = await fetch(`${BACKEND_CONFIG.baseUrl}/leads/${id}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'AI analysis failed');
  }

  const data = await response.json();
  return data.analysis;
}

/**
 * Import leads from a parsed CSV/JSON array.
 * @param {object[]} leads
 * @returns {Promise<object>} import summary
 */
export async function importLeads(leads) {
  if (!BACKEND_CONFIG.enableRealBackend) {
    await new Promise((r) => setTimeout(r, 800));
    return {
      imported: leads.length,
      duplicatesDetected: 0,
      invalidEmails: 0,
      incompleteRecords: 0,
      highPriority: 0,
    };
  }

  const response = await fetch(`${BACKEND_CONFIG.baseUrl}/leads/import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(leads),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Import failed');
  }

  return response.json();
}

/**
 * Build the CSV export URL with current filters (triggers browser download).
 * @param {object} filters
 * @returns {string} URL to navigate to
 */
export function buildExportUrl(filters = {}) {
  const params = new URLSearchParams();
  if (filters.priority && filters.priority !== 'all') params.set('priority', filters.priority);
  if (filters.industry && filters.industry !== 'all') params.set('industry', filters.industry);
  if (filters.location && filters.location !== 'all') params.set('location', filters.location);
  if (filters.dataQuality && filters.dataQuality !== 'all') params.set('dataQuality', filters.dataQuality);
  if (filters.search) params.set('search', filters.search);
  if (filters.isDuplicate) params.set('isDuplicate', 'true');
  if (filters.minScore !== undefined) params.set('minScore', filters.minScore);
  if (filters.maxScore !== undefined) params.set('maxScore', filters.maxScore);

  const token = getToken();
  if (token) params.set('_token', token); // not ideal but needed for direct download

  return `${BACKEND_CONFIG.baseUrl}/leads/export?${params.toString()}`;
}

/**
 * Export leads as a client-side CSV download (works without backend).
 * @param {object[]} leads - already filtered lead array
 */
export function exportLeadsClientSide(leads) {
  const headers = [
    'Company', 'Industry', 'Location', 'Revenue', 'Employees',
    'Contact Name', 'Contact Title', 'Email', 'Phone', 'Website',
    'Lead Score', 'Priority', 'Data Quality', 'Duplicate', 'AI Summary',
  ];

  const csvCell = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = [
    headers.join(','),
    ...leads.map((l) => [
      csvCell(l.companyName),
      csvCell(l.industry),
      csvCell(l.location),
      csvCell(l.revenueLabel),
      l.employees || '',
      csvCell(l.contactName),
      csvCell(l.contactTitle),
      csvCell(l.email),
      csvCell(l.phone),
      csvCell(l.website),
      l.leadScore,
      l.priority,
      l.dataQuality?.status || '',
      l.isDuplicate ? 'Yes' : 'No',
      csvCell(l.aiAnalysis?.summary || ''),
    ].join(',')),
  ];

  const blob = new Blob([rows.join('\r\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leads-export.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Parse a CSV file into an array of raw lead objects.
 * @param {File} file
 * @returns {Promise<object[]>}
 */
export function parseCSVFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split(/\r?\n/).filter((l) => l.trim());
        if (lines.length < 2) return resolve([]);

        const headerLine = lines[0];
        const headers = headerLine.split(',').map((h) => h.trim().toLowerCase().replace(/\s+/g, ''));

        const leads = [];
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          if (values.length === 0) continue;
          const obj = {};
          headers.forEach((h, idx) => {
            obj[h] = (values[idx] || '').trim();
          });

          // Map common CSV field names to our data model
          leads.push({
            companyName: obj.company || obj.companyname || obj.name || '',
            industry: obj.industry || '',
            location: obj.location || obj.state || obj.city || '',
            revenueRaw: parseFloat(obj.revenueraw || obj.revenue || '0') || 0,
            revenueLabel: obj.revenue || obj.revenuelabel || '',
            employees: parseInt(obj.employees || obj.employeecount || '0') || 0,
            website: obj.website || obj.domain || '',
            contactName: obj.contactname || obj.contact || '',
            contactTitle: obj.contacttitle || obj.title || '',
            email: obj.email || '',
            phone: obj.phone || '',
            linkedin: obj.linkedin || '',
            createdAt: obj.createdat || new Date().toISOString(),
            updatedAt: obj.updatedat || new Date().toISOString(),
          });
        }
        resolve(leads);
      } catch (err) {
        reject(new Error('Failed to parse CSV: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function getToken() {
  try {
    const stored = localStorage.getItem('baitguard_user');
    if (stored) return JSON.parse(stored).token || 'mock_bearer_token';
  } catch {}
  return null;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current); current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function applyMockFilters(filters) {
  let leads = [...MOCK_LEADS];
  if (filters.priority && filters.priority !== 'all') leads = leads.filter((l) => l.priority === filters.priority);
  if (filters.industry && filters.industry !== 'all') leads = leads.filter((l) => l.industry === filters.industry);
  if (filters.location && filters.location !== 'all') leads = leads.filter((l) => l.location === filters.location);
  if (filters.dataQuality && filters.dataQuality !== 'all') leads = leads.filter((l) => l.dataQuality?.status === filters.dataQuality);
  if (filters.isDuplicate) leads = leads.filter((l) => l.isDuplicate);
  if (filters.minScore !== undefined) leads = leads.filter((l) => l.leadScore >= Number(filters.minScore));
  if (filters.maxScore !== undefined) leads = leads.filter((l) => l.leadScore <= Number(filters.maxScore));
  if (filters.search) {
    const q = filters.search.toLowerCase();
    leads = leads.filter((l) =>
      (l.companyName || '').toLowerCase().includes(q) ||
      (l.contactName || '').toLowerCase().includes(q) ||
      (l.email || '').toLowerCase().includes(q) ||
      (l.industry || '').toLowerCase().includes(q) ||
      (l.location || '').toLowerCase().includes(q)
    );
  }
  return {
    leads,
    kpis: MOCK_RESPONSE.kpis,
    industries: MOCK_RESPONSE.industries,
    locations: MOCK_RESPONSE.locations,
    totalFiltered: leads.length,
  };
}

function buildMockAnalysis(lead) {
  const prio = lead?.priority === 'high' ? 'High Priority' : lead?.priority === 'medium' ? 'Medium Priority' : 'Low Priority';
  return {
    summary: `${lead?.companyName || 'This company'} appears to be ${lead?.priority === 'high' ? 'a strong prospect' : 'a moderate prospect'} based on available profile data.`,
    whyItMatters: lead?.priority === 'high'
      ? 'Strong industry and location alignment with your target customer profile.'
      : 'Partial fit — follow up to gather more information before full investment.',
    potentialOpportunity: lead?.industry
      ? `Operational efficiency and cost reduction opportunities in the ${lead.industry} sector.`
      : 'Information not available.',
    dataConcerns: !lead?.phone ? 'Phone number has not been provided.' : 'No major data concerns detected.',
    suggestedOutreach: lead?.contactTitle
      ? `Reach out to ${lead.contactName || 'the decision-maker'} (${lead.contactTitle}) focusing on operational improvements.`
      : 'Identify the right contact before outreach.',
    priorityRecommendation: prio,
    confidenceLevel: lead?.priority === 'high' ? 'High' : 'Medium',
    generatedAt: new Date().toISOString(),
    source: 'simulation',
  };
}
