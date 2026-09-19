/**
 * Lead Scoring Service
 *
 * Scores each lead 0–100 based on configurable criteria.
 * All target values are centralized in SCORING_CONFIG — never scattered in UI.
 *
 * Score breakdown:
 *   Industry Fit          25 pts
 *   Revenue Fit           20 pts
 *   Location Fit          15 pts
 *   Company Size          10 pts
 *   Contact Completeness  10 pts
 *   Website Quality       10 pts
 *   Data Freshness        10 pts
 *                        ─────
 *   Total                100 pts
 */

export const SCORING_CONFIG = {
  targetIndustries: ['Manufacturing', 'Logistics', 'Food & Beverage', 'Healthcare', 'Retail'],
  partialMatchIndustries: ['Technology', 'Finance', 'Construction'],

  targetLocations: ['Texas', 'California', 'New York', 'Florida', 'Illinois'],
  secondaryLocations: ['Georgia', 'Ohio', 'Pennsylvania', 'Michigan'],

  // Revenue target range in raw USD
  targetRevenueMin: 5_000_000,  // $5M
  targetRevenueMax: 50_000_000, // $50M
  nearTargetRevenueFactor: 0.5, // 50% of target weight for "close" range

  // Company size target range (employees)
  targetEmployeesMin: 50,
  targetEmployeesMax: 500,

  // Data freshness thresholds (days)
  freshnessThresholds: {
    fresh: 30,    // ≤30 days → full score
    recent: 90,   // ≤90 days → partial score
    stale: 180,   // ≤180 days → low score
  },

  weights: {
    industry: 25,
    revenue: 20,
    location: 15,
    companySize: 10,
    contactCompleteness: 10,
    website: 10,
    dataFreshness: 10,
  },
};

/** Score industry fit: 0, partial, or full weight */
function scoreIndustryFit(lead) {
  const { targetIndustries, partialMatchIndustries, weights } = SCORING_CONFIG;
  if (!lead.industry) return 0;
  const industry = lead.industry.trim();
  if (targetIndustries.includes(industry)) return weights.industry;
  if (partialMatchIndustries.includes(industry)) return Math.round(weights.industry * 0.5);
  return 0;
}

/** Score revenue fit: 0, partial, or full weight */
function scoreRevenueFit(lead) {
  const { targetRevenueMin, targetRevenueMax, weights } = SCORING_CONFIG;
  const rev = lead.revenueRaw || 0;
  if (rev === 0) return 0;
  if (rev >= targetRevenueMin && rev <= targetRevenueMax) return weights.revenue;
  // Close: within 2x of the range boundary
  const nearMin = targetRevenueMin * 0.5;
  const nearMax = targetRevenueMax * 1.5;
  if (rev >= nearMin && rev <= nearMax) return Math.round(weights.revenue * 0.5);
  return 0;
}

/** Score location fit: 0, partial, or full weight */
function scoreLocationFit(lead) {
  const { targetLocations, secondaryLocations, weights } = SCORING_CONFIG;
  if (!lead.location) return 0;
  const loc = lead.location.trim();
  if (targetLocations.includes(loc)) return weights.location;
  if (secondaryLocations.includes(loc)) return Math.round(weights.location * 0.5);
  return 0;
}

/** Score company size (employee count): proportional within target range */
function scoreCompanySize(lead) {
  const { targetEmployeesMin, targetEmployeesMax, weights } = SCORING_CONFIG;
  const emp = lead.employees || 0;
  if (emp === 0) return 0;
  if (emp >= targetEmployeesMin && emp <= targetEmployeesMax) return weights.companySize;
  if (emp > 0 && emp < targetEmployeesMin) return Math.round(weights.companySize * 0.5);
  if (emp > targetEmployeesMax) return Math.round(weights.companySize * 0.6);
  return 0;
}

/** Score contact completeness: each filled field contributes proportionally */
function scoreContactCompleteness(lead) {
  const { weights } = SCORING_CONFIG;
  const fields = [
    lead.contactName,
    lead.contactTitle,
    lead.email,
    lead.phone,
    lead.linkedin,
  ];
  const filled = fields.filter((f) => f && f.trim().length > 0).length;
  return Math.round((filled / fields.length) * weights.contactCompleteness);
}

/** Score website quality: check presence and domain validity */
function scoreWebsite(lead) {
  const { weights } = SCORING_CONFIG;
  if (!lead.website || lead.website.trim() === '') return 0;
  try {
    const url = new URL(lead.website);
    // Basic validation: must have a recognizable TLD
    if (url.hostname && url.hostname.includes('.')) return weights.website;
    return Math.round(weights.website * 0.5);
  } catch {
    return 0;
  }
}

/** Score data freshness based on updatedAt/createdAt */
function scoreDataFreshness(lead) {
  const { freshnessThresholds, weights } = SCORING_CONFIG;
  const dateStr = lead.updatedAt || lead.createdAt;
  if (!dateStr) return 0;
  const daysSince = (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince <= freshnessThresholds.fresh) return weights.dataFreshness;
  if (daysSince <= freshnessThresholds.recent) return Math.round(weights.dataFreshness * 0.7);
  if (daysSince <= freshnessThresholds.stale) return Math.round(weights.dataFreshness * 0.4);
  return Math.round(weights.dataFreshness * 0.1);
}

/** Convert total score to priority classification */
function toPriority(score) {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}

/** Evaluate data quality per field and return checklist + percentage */
function evaluateDataQuality(lead) {
  const checks = [
    { field: 'Company Name', key: 'companyName', value: lead.companyName },
    { field: 'Industry',     key: 'industry',    value: lead.industry },
    { field: 'Location',     key: 'location',    value: lead.location },
    { field: 'Revenue',      key: 'revenue',     value: lead.revenueRaw > 0 ? lead.revenueRaw : null },
    { field: 'Website',      key: 'website',     value: lead.website },
    { field: 'Contact Name', key: 'contactName', value: lead.contactName },
    { field: 'Email',        key: 'email',       value: lead.email },
    { field: 'Phone',        key: 'phone',       value: lead.phone },
  ];

  const evaluated = checks.map((c) => ({
    ...c,
    present: Boolean(c.value && String(c.value).trim().length > 0),
  }));

  const presentCount = evaluated.filter((c) => c.present).length;
  const pct = Math.round((presentCount / checks.length) * 100);

  let status;
  if (pct >= 80) status = 'good';
  else if (pct >= 50) status = 'needs_review';
  else status = 'poor';

  return { checks: evaluated, pct, status };
}

/**
 * Main scoring function. Computes score + breakdown for a single lead.
 * @param {object} lead
 * @returns {{ total, breakdown, priority, dataQuality }}
 */
export function scoreLead(lead) {
  const breakdown = {
    industryFit:          { score: scoreIndustryFit(lead),          max: SCORING_CONFIG.weights.industry },
    revenueFit:           { score: scoreRevenueFit(lead),           max: SCORING_CONFIG.weights.revenue },
    locationFit:          { score: scoreLocationFit(lead),          max: SCORING_CONFIG.weights.location },
    companySize:          { score: scoreCompanySize(lead),          max: SCORING_CONFIG.weights.companySize },
    contactCompleteness:  { score: scoreContactCompleteness(lead),  max: SCORING_CONFIG.weights.contactCompleteness },
    websiteQuality:       { score: scoreWebsite(lead),              max: SCORING_CONFIG.weights.website },
    dataFreshness:        { score: scoreDataFreshness(lead),        max: SCORING_CONFIG.weights.dataFreshness },
  };

  const total = Object.values(breakdown).reduce((sum, b) => sum + b.score, 0);
  const priority = toPriority(total);
  const dataQuality = evaluateDataQuality(lead);

  return { total, breakdown, priority, dataQuality };
}

/**
 * Produces human-readable "Why this lead?" and "Needs attention" lists.
 * @param {object} lead
 * @param {object} breakdown - from scoreLead()
 * @returns {{ strengths: string[], weaknesses: string[] }}
 */
export function generateInsights(lead, breakdown) {
  const strengths = [];
  const weaknesses = [];

  const { targetIndustries, targetLocations, targetRevenueMin, targetRevenueMax } = SCORING_CONFIG;

  // Industry
  if (lead.industry && targetIndustries.includes(lead.industry)) {
    strengths.push('Strong industry match');
  } else if (lead.industry) {
    weaknesses.push(`Industry (${lead.industry}) is outside the primary target market`);
  } else {
    weaknesses.push('Industry information is missing');
  }

  // Revenue
  if (lead.revenueRaw >= targetRevenueMin && lead.revenueRaw <= targetRevenueMax) {
    strengths.push('Revenue is within the target range');
  } else if (lead.revenueRaw > 0) {
    weaknesses.push(`Revenue (${lead.revenueLabel}) is outside the target range of $5M–$50M`);
  } else {
    weaknesses.push('Revenue information is not available');
  }

  // Location
  if (lead.location && targetLocations.includes(lead.location)) {
    strengths.push('Located in a primary target market');
  } else if (lead.location) {
    weaknesses.push(`Location (${lead.location}) is a secondary or non-target market`);
  } else {
    weaknesses.push('Location information is missing');
  }

  // Contact
  if (lead.contactTitle && ['CEO', 'President', 'COO', 'Owner', 'Founder'].some(t => lead.contactTitle.includes(t))) {
    strengths.push('Decision-maker identified');
  } else if (lead.contactName) {
    strengths.push('Contact person identified');
  } else {
    weaknesses.push('No contact person identified');
  }

  // Contact completeness
  if (lead.email && lead.phone && lead.contactName) {
    strengths.push('Complete contact information available');
  } else {
    if (!lead.email) weaknesses.push('Email address is missing');
    if (!lead.phone) weaknesses.push('Phone number has not been provided');
  }

  // Website
  if (lead.website) {
    strengths.push('Valid company website found');
  } else {
    weaknesses.push('No company website on record');
  }

  // Data freshness
  const updatedDaysAgo = lead.updatedAt
    ? Math.round((Date.now() - new Date(lead.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  if (updatedDaysAgo !== null && updatedDaysAgo <= 30) {
    strengths.push('Company data is recent and up to date');
  } else if (updatedDaysAgo !== null && updatedDaysAgo > 90) {
    weaknesses.push(`Company data is ${updatedDaysAgo} days old — consider refreshing`);
  }

  // Company size
  const { targetEmployeesMin, targetEmployeesMax } = SCORING_CONFIG;
  if (lead.employees >= targetEmployeesMin && lead.employees <= targetEmployeesMax) {
    strengths.push('Company size is within the target range');
  } else if (lead.employees > 0) {
    weaknesses.push(`Company size (${lead.employees} employees) is outside the target range`);
  }

  return { strengths, weaknesses };
}

/**
 * Detect potential duplicate leads in a collection.
 * Normalization: lowercase, strip punctuation, extract base domain.
 * A lead is flagged if it shares a domain, email, or normalized company name with another.
 *
 * @param {object[]} leads - array of raw leads (before scoring)
 * @returns {object[]} - same leads with `duplicateOf` and `isDuplicate` fields set
 */
export function detectDuplicates(leads) {
  const normalizeStr = (str) =>
    (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const extractDomain = (str) => {
    if (!str) return null;
    try {
      // Try URL first
      const url = new URL(str.includes('://') ? str : `https://${str}`);
      return url.hostname.replace(/^www\./, '');
    } catch {
      // Try email domain
      if (str.includes('@')) return str.split('@')[1]?.toLowerCase() || null;
      return null;
    }
  };

  // Build lookup maps indexed by first occurrence
  const domainMap = new Map();   // domain → leadId
  const emailMap  = new Map();   // email → leadId
  const nameMap   = new Map();   // normalizedName → leadId

  const enriched = leads.map((lead) => ({ ...lead, duplicateOf: null, isDuplicate: false }));

  for (const lead of enriched) {
    const domain       = extractDomain(lead.website) || extractDomain(lead.email);
    const email        = (lead.email || '').toLowerCase().trim();
    const normalName   = normalizeStr(lead.companyName);

    let duplicateOfId = null;
    let reason = null;

    if (domain && domainMap.has(domain)) {
      duplicateOfId = domainMap.get(domain);
      reason = 'Same company domain';
    } else if (email && emailMap.has(email)) {
      duplicateOfId = emailMap.get(email);
      reason = 'Same email address';
    } else if (normalName && nameMap.has(normalName)) {
      duplicateOfId = nameMap.get(normalName);
      reason = 'Similar company name';
    }

    if (duplicateOfId && duplicateOfId !== lead.id) {
      lead.isDuplicate = true;
      lead.duplicateOf = duplicateOfId;
      lead.duplicateReason = reason;
    } else {
      // Register this lead in lookup maps
      if (domain) domainMap.set(domain, lead.id);
      if (email)  emailMap.set(email, lead.id);
      if (normalName) nameMap.set(normalName, lead.id);
    }
  }

  return enriched;
}
