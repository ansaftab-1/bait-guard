import { Router } from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware.js';

export const reportsRouter = Router();

reportsRouter.use(authenticateUser);

// GET /api/reports
reportsRouter.get('/', authorizeRoles('admin', 'technician', 'viewer'), (req, res) => {
  res.json({
    kpis: [
      {
        id: 'detections',
        label: 'Total Detections',
        value: '87',
        change: '+12%',
        isPositive: true,
        color: '#ef4444',
        badgeBg: '#ecfdf5',
        badgeColor: '#10b981',
      },
      {
        id: 'refills',
        label: 'Bait Refills',
        value: '34',
        change: '-4%',
        isPositive: false,
        color: '#f59e0b',
        badgeBg: '#fef2f2',
        badgeColor: '#ef4444',
      },
      {
        id: 'uptime',
        label: 'System Uptime',
        value: '99.1%',
        change: '+0.3%',
        isPositive: true,
        color: '#10b981',
        badgeBg: '#ecfdf5',
        badgeColor: '#10b981',
      },
      {
        id: 'confidence',
        label: 'AI Confidence',
        value: '96%',
        change: '+2%',
        isPositive: true,
        color: '#2563eb',
        badgeBg: '#ecfdf5',
        badgeColor: '#10b981',
      },
    ],
    exporters: [
      {
        id: 'monthly-activity',
        title: 'Monthly activity',
        subtitle: 'June 2026 · All stations',
        format: 'PDF',
        formatBg: '#eff6ff',
        formatColor: '#2563eb',
        iconBg: '#eff6ff',
        iconColor: '#2563eb',
        letter: 'D',
      },
      {
        id: 'bait-consumption',
        title: 'Bait consumption',
        subtitle: 'Last 90 days by site',
        format: 'CSV',
        formatBg: '#ecfdf5',
        formatColor: '#10b981',
        iconBg: '#ecfdf5',
        iconColor: '#10b981',
        letter: 'B',
      },
      {
        id: 'incident-history',
        title: 'Incident history',
        subtitle: 'Tamper & alert records',
        format: 'PDF',
        formatBg: '#eff6ff',
        formatColor: '#2563eb',
        iconBg: '#eff6ff',
        iconColor: '#2563eb',
        letter: 'I',
      },
    ],
    recentExports: [
      { id: 'exp-1', name: 'Site-Audit-Report-WH-B.pdf', date: 'Yesterday, 4:15 PM', size: '2.4 MB' },
      { id: 'exp-2', name: 'Q2-Rodent-Trend-Analytics.csv', date: '12 Jun, 11:20 AM', size: '840 KB' },
    ],
  });
});

// GET /api/reports/export/:id
reportsRouter.get('/export/:id', (req, res) => {
  const { id } = req.params;
  const format = req.query.format || 'csv';

  if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${id}-report.csv"`);
    return res.send(`Date,Station,Facility,RodentsDetected,BaitPercent,BatteryPercent,Status\n2026-09-05,RB-07,site_2,22,18,82,critical\n2026-09-05,RA-22,site_3,3,80,95,active`);
  }

  res.json({ success: true, reportId: id, downloadUrl: `/api/reports/export/${id}?format=csv` });
});
