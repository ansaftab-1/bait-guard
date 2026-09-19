import { Router } from 'express';
import { store } from '../db/store.js';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

export const leadsRouter = Router();

// All lead endpoints require authentication — admin only
leadsRouter.use(authenticateUser);
leadsRouter.use(authorizeRoles('admin'));

// ─── GET /api/leads ─────────────────────────────────────────────────────────
// Returns filtered lead list + KPI summary + dynamic filter options
leadsRouter.get('/', (req, res) => {
  try {
    const { priority, industry, location, dataQuality, search, isDuplicate, minScore, maxScore } = req.query;
    const result = store.getLeads({ priority, industry, location, dataQuality, search, isDuplicate, minScore, maxScore });
    res.json(result);
  } catch (err) {
    console.error('[leadsRouter] GET /api/leads error:', err);
    res.status(500).json({ error: 'Failed to fetch leads. Please try again.' });
  }
});

// ─── GET /api/leads/export ───────────────────────────────────────────────────
// Returns CSV for the currently filtered leads
leadsRouter.get('/export', (req, res) => {
  try {
    const { priority, industry, location, dataQuality, search, isDuplicate, minScore, maxScore } = req.query;
    const { leads } = store.getLeads({ priority, industry, location, dataQuality, search, isDuplicate, minScore, maxScore });

    const headers = [
      'Company', 'Industry', 'Location', 'Revenue', 'Employees',
      'Contact Name', 'Contact Title', 'Email', 'Phone', 'Website',
      'Lead Score', 'Priority', 'Data Quality', 'Duplicate', 'AI Summary',
    ];

    const csvRows = [
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

    const csv = csvRows.join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads-export.csv"');
    res.send(csv);
  } catch (err) {
    console.error('[leadsRouter] GET /api/leads/export error:', err);
    res.status(500).json({ error: 'Failed to export leads. Please try again.' });
  }
});

// ─── GET /api/leads/:id ──────────────────────────────────────────────────────
leadsRouter.get('/:id', (req, res) => {
  try {
    const lead = store.getLeadById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: `Lead "${req.params.id}" not found.` });
    }
    res.json(lead);
  } catch (err) {
    console.error('[leadsRouter] GET /api/leads/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch lead details. Please try again.' });
  }
});

// ─── POST /api/leads/import ──────────────────────────────────────────────────
// Accepts an array of raw lead objects in request body
leadsRouter.post('/import', (req, res) => {
  try {
    const raw = req.body;
    if (!Array.isArray(raw) || raw.length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty array of leads.' });
    }
    if (raw.length > 500) {
      return res.status(400).json({ error: 'Maximum 500 leads per import batch.' });
    }

    // Validate required field
    const invalid = raw.filter((l) => !l.companyName || typeof l.companyName !== 'string');
    if (invalid.length > 0) {
      return res.status(400).json({ error: `${invalid.length} leads are missing a company name and cannot be imported.` });
    }

    const summary = store.importLeads(raw);
    res.status(201).json({ success: true, ...summary });
  } catch (err) {
    console.error('[leadsRouter] POST /api/leads/import error:', err);
    res.status(500).json({ error: 'Failed to import leads. Please try again.' });
  }
});

// ─── POST /api/leads/:id/analyze ────────────────────────────────────────────
// Triggers on-demand AI analysis for a single lead
leadsRouter.post('/:id/analyze', async (req, res) => {
  try {
    const lead = store.getLeadById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: `Lead "${req.params.id}" not found.` });
    }

    const analysis = await analyzeLeadWithAI(lead);
    const updated = store.setLeadAiAnalysis(req.params.id, analysis);
    res.json({ success: true, analysis, lead: updated });
  } catch (err) {
    console.error('[leadsRouter] POST /api/leads/:id/analyze error:', err);
    res.status(500).json({ error: 'AI analysis failed. Please try again.' });
  }
});

// ─── AI Helper ───────────────────────────────────────────────────────────────

async function analyzeLeadWithAI(lead) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Graceful fallback: structured simulation based on actual lead data
    return buildSimulatedAnalysis(lead);
  }

  try {
    const prompt = buildPrompt(lead);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a B2B sales intelligence analyst. Analyze lead data and return a structured JSON analysis. 
Do NOT invent facts. If information is unavailable in the provided data, say "Information not available."
Always return valid JSON matching the exact schema requested.`,
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 600,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from OpenAI');

    const parsed = JSON.parse(content);
    return {
      ...parsed,
      generatedAt: new Date().toISOString(),
      source: 'openai',
    };
  } catch (err) {
    console.warn('[leadsRouter] OpenAI call failed, using simulation:', err.message);
    return buildSimulatedAnalysis(lead);
  }
}

function buildPrompt(lead) {
  const ctx = {
    company: lead.companyName || 'Unknown',
    industry: lead.industry || 'Unknown',
    location: lead.location || 'Unknown',
    revenue: lead.revenueLabel || 'Unknown',
    employees: lead.employees || 'Unknown',
    website: lead.website || 'Not available',
    contact: {
      name: lead.contactName || 'Not available',
      title: lead.contactTitle || 'Not available',
      email: lead.email || 'Not available',
    },
    leadScore: lead.leadScore,
    priority: lead.priority,
    dataQualityPct: `${lead.dataQuality?.pct || 0}%`,
  };

  return `Analyze this B2B sales lead and return a JSON object with exactly these fields:
{
  "summary": "2-3 sentence overview of the lead",
  "whyItMatters": "1-2 sentences on why this lead is or isn't valuable",
  "potentialOpportunity": "specific opportunity area based on industry/size",
  "dataConcerns": "any data quality or completeness concerns",
  "suggestedOutreach": "a specific outreach angle for a salesperson",
  "priorityRecommendation": "High Priority | Medium Priority | Low Priority",
  "confidenceLevel": "High | Medium | Low"
}

Lead data:
${JSON.stringify(ctx, null, 2)}`;
}

function buildSimulatedAnalysis(lead) {
  const priority = lead.priority;
  const isHigh = priority === 'high';
  const isMed = priority === 'medium';

  const prio = isHigh ? 'High Priority' : isMed ? 'Medium Priority' : 'Low Priority';
  const conf = isHigh ? 'High' : isMed ? 'Medium' : 'Low';

  const industry = lead.industry || 'this sector';
  const location = lead.location ? `in ${lead.location}` : '';
  const revenue = lead.revenueLabel && lead.revenueLabel !== 'Unknown' ? `with revenue of ${lead.revenueLabel}` : '';

  const summary = `${lead.companyName} is a ${industry} company ${location} ${revenue}. Based on available data, this lead ${isHigh ? 'shows strong alignment with the target customer profile' : isMed ? 'shows partial alignment with the target customer profile' : 'shows limited alignment with the target customer profile'}.`;

  const whyItMatters = isHigh
    ? `The combination of industry fit, company size, and location makes this a strong sales candidate worth prioritizing.`
    : isMed
    ? `Some signals are positive, but there are gaps in fit or data completeness that require follow-up before investing significant time.`
    : `This lead falls outside primary target criteria. Consider deprioritizing or gathering more information before outreach.`;

  const concerns = [];
  if (!lead.phone) concerns.push('phone number is missing');
  if (!lead.website) concerns.push('no company website on record');
  if (lead.isDuplicate) concerns.push('this may be a duplicate record');
  if (lead.dataQuality?.pct < 60) concerns.push('overall data completeness is below 60%');

  return {
    summary,
    whyItMatters,
    potentialOpportunity: lead.industry
      ? `Operational efficiency and supply chain optimization opportunities in the ${lead.industry} sector.`
      : 'Information not available.',
    dataConcerns: concerns.length > 0 ? `The following data issues were detected: ${concerns.join(', ')}.` : 'No major data concerns detected.',
    suggestedOutreach: lead.contactTitle
      ? `Contact ${lead.contactName || 'the decision-maker'} (${lead.contactTitle}) with a focused message around ${industry} operational improvements and cost reduction.`
      : `Information not available — identify the right contact before outreach.`,
    priorityRecommendation: prio,
    confidenceLevel: conf,
    generatedAt: new Date().toISOString(),
    source: 'simulation',
  };
}

/** Escape a cell value for CSV */
function csvCell(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
