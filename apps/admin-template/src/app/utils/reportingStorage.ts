/**
 * Reporting Storage Utilities
 * Handles persistence of reports, configs, schedules, and templates
 */

import {
  ReportConfig,
  ReportFormat,
  ScheduledReport,
  GeneratedReport,
  ReportTemplate,
  ReportHistoryEntry,
  ReportPreferences,
  ReportStatus,
  ReportingStats,
} from '../types/reporting';

const REPORTS_KEY = 'reporting:configs';
const GENERATED_REPORTS_KEY = 'reporting:generated';
const SCHEDULED_REPORTS_KEY = 'reporting:scheduled';
const TEMPLATES_KEY = 'reporting:templates';
const HISTORY_KEY = 'reporting:history';
const PREFERENCES_KEY = 'reporting:preferences';

// Report Configs
export const readReportConfigs = (): ReportConfig[] => {
  try {
    const data = localStorage.getItem(REPORTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const persistReportConfigs = (configs: ReportConfig[]): void => {
  try {
    const limitedConfigs = configs.slice(-100); // Keep last 100
    localStorage.setItem(REPORTS_KEY, JSON.stringify(limitedConfigs));
  } catch (error) {
    console.error('Error persisting report configs:', error);
  }
};

export const saveReportConfig = (config: ReportConfig): void => {
  const configs = readReportConfigs();
  const existing = configs.findIndex((c) => c.id === config.id);
  if (existing >= 0) {
    configs[existing] = config;
  } else {
    configs.push(config);
  }
  persistReportConfigs(configs);
};

export const getReportConfig = (id: string): ReportConfig | undefined => {
  return readReportConfigs().find((c) => c.id === id);
};

export const deleteReportConfig = (id: string): void => {
  const configs = readReportConfigs().filter((c) => c.id !== id);
  persistReportConfigs(configs);
};

// Generated Reports
export const readGeneratedReports = (): GeneratedReport[] => {
  try {
    const data = localStorage.getItem(GENERATED_REPORTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const persistGeneratedReports = (reports: GeneratedReport[]): void => {
  try {
    const limitedReports = reports.slice(-50); // Keep last 50
    localStorage.setItem(GENERATED_REPORTS_KEY, JSON.stringify(limitedReports));
  } catch (error) {
    console.error('Error persisting generated reports:', error);
  }
};

export const saveGeneratedReport = (report: GeneratedReport): void => {
  const reports = readGeneratedReports();
  reports.push(report);
  persistGeneratedReports(reports);
};

export const getGeneratedReport = (id: string): GeneratedReport | undefined => {
  return readGeneratedReports().find((r) => r.id === id);
};

export const deleteGeneratedReport = (id: string): void => {
  const reports = readGeneratedReports().filter((r) => r.id !== id);
  persistGeneratedReports(reports);
};

export const clearOldGeneratedReports = (daysOld: number = 30): void => {
  const reports = readGeneratedReports();
  const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
  const filtered = reports.filter((r) => new Date(r.generatedAt).getTime() > cutoffTime);
  persistGeneratedReports(filtered);
};

// Scheduled Reports
export const readScheduledReports = (): ScheduledReport[] => {
  try {
    const data = localStorage.getItem(SCHEDULED_REPORTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const persistScheduledReports = (schedules: ScheduledReport[]): void => {
  try {
    localStorage.setItem(SCHEDULED_REPORTS_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.error('Error persisting scheduled reports:', error);
  }
};

export const saveScheduledReport = (schedule: ScheduledReport): void => {
  const schedules = readScheduledReports();
  const existing = schedules.findIndex((s) => s.id === schedule.id);
  if (existing >= 0) {
    schedules[existing] = schedule;
  } else {
    schedules.push(schedule);
  }
  persistScheduledReports(schedules);
};

export const deleteScheduledReport = (id: string): void => {
  const schedules = readScheduledReports().filter((s) => s.id !== id);
  persistScheduledReports(schedules);
};

export const getScheduledReport = (id: string): ScheduledReport | undefined => {
  return readScheduledReports().find((s) => s.id === id);
};

export const getActiveScheduledReports = (): ScheduledReport[] => {
  return readScheduledReports().filter((s) => s.isActive);
};

// Templates
export const readTemplates = (): ReportTemplate[] => {
  try {
    const data = localStorage.getItem(TEMPLATES_KEY);
    return data ? JSON.parse(data) : getDefaultTemplates();
  } catch {
    return getDefaultTemplates();
  }
};

export const getDefaultTemplates = (): ReportTemplate[] => {
  return [
    {
      id: 'tpl-user-summary',
      name: 'User Summary Report',
      description: 'Overview of active users, registration trends, and status breakdown',
      category: 'Users',
      config: {
        id: 'cfg-user-summary',
        name: 'User Summary',
        type: 'summary' as any,
        dataSource: 'users' as any,
        aggregations: [
          { name: 'Total Users', field: 'id', type: 'count' },
          { name: 'Active Users', field: 'status', type: 'count' },
        ],
      },
      icon: '👥',
      isPublic: true,
      createdAt: new Date(),
      createdBy: 'System',
      usageCount: 0,
    },
    {
      id: 'tpl-order-analysis',
      name: 'Order Analysis Report',
      description: 'Detailed order statistics with revenue breakdown by date',
      category: 'Orders',
      config: {
        id: 'cfg-order-analysis',
        name: 'Order Analysis',
        type: 'detailed' as any,
        dataSource: 'orders' as any,
        groupBy: ['status'],
      },
      icon: '📦',
      isPublic: true,
      createdAt: new Date(),
      createdBy: 'System',
      usageCount: 0,
    },
    {
      id: 'tpl-audit-compliance',
      name: 'Audit Compliance Report',
      description: 'Compliance and audit trail for management and review',
      category: 'Audit',
      config: {
        id: 'cfg-audit-compliance',
        name: 'Audit Compliance',
        type: 'detailed' as any,
        dataSource: 'audit_log' as any,
      },
      icon: '🔍',
      isPublic: true,
      createdAt: new Date(),
      createdBy: 'System',
      usageCount: 0,
    },
  ];
};

export const persistTemplates = (templates: ReportTemplate[]): void => {
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Error persisting templates:', error);
  }
};

export const saveTemplate = (template: ReportTemplate): void => {
  const templates = readTemplates();
  const existing = templates.findIndex((t) => t.id === template.id);
  if (existing >= 0) {
    templates[existing] = template;
  } else {
    templates.push(template);
  }
  persistTemplates(templates);
};

// History
export const readReportHistory = (): ReportHistoryEntry[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const persistReportHistory = (history: ReportHistoryEntry[]): void => {
  try {
    const limitedHistory = history.slice(-500);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error persisting report history:', error);
  }
};

export const addHistoryEntry = (entry: ReportHistoryEntry): void => {
  const history = readReportHistory();
  history.push(entry);
  persistReportHistory(history);
};

export const getHistoryByReportId = (reportId: string): ReportHistoryEntry[] => {
  return readReportHistory().filter((h) => h.reportId === reportId);
};

export const clearOldHistory = (daysOld: number = 90): void => {
  const history = readReportHistory();
  const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
  const filtered = history.filter((h) => new Date(h.generatedAt).getTime() > cutoffTime);
  persistReportHistory(filtered);
};

// Preferences
export const readPreferences = (userId: string): ReportPreferences => {
  try {
    const data = localStorage.getItem(`${PREFERENCES_KEY}:${userId}`);
    if (data) return JSON.parse(data);
  } catch {
    // Continue with defaults
  }

  return {
    userId,
    defaultFormat: 'pdf' as ReportFormat,
    defaultDateRange: 'month',
    autoGenerateOnSave: false,
    emailNotifications: false,
    retentionDays: 90,
    favoritedReports: [],
  };
};

export const persistPreferences = (preferences: ReportPreferences): void => {
  try {
    localStorage.setItem(`${PREFERENCES_KEY}:${preferences.userId}`, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error persisting preferences:', error);
  }
};

// Statistics
export const getReportingStats = (): ReportingStats => {
  const configs = readReportConfigs();
  const generated = readGeneratedReports();
  const scheduled = readScheduledReports();
  const history = readReportHistory();

  const thisMonth = new Date();
  thisMonth.setMonth(thisMonth.getMonth() - 1);
  const monthlyGenerated = history.filter((h) => new Date(h.generatedAt) > thisMonth).length;

  const successful = generated.filter((r) => r.status === 'completed').length;
  const successRate = generated.length > 0 ? (successful / generated.length) * 100 : 0;

  const totalDataProcessed = generated.reduce((sum, r) => sum + (r.summary?.recordsProcessed || 0), 0);
  const avgTime =
    generated.length > 0
      ? generated.reduce((sum, r) => sum + (r.summary?.executionTime || 0), 0) / generated.length
      : 0;

  return {
    totalReports: configs.length,
    scheduledReports: scheduled.filter((s) => s.isActive).length,
    generatedThisMonth: monthlyGenerated,
    totalDataProcessed,
    averageExecutionTime: avgTime,
    successRate,
  };
};

// Export utilities
export const generateCSVFromReport = (report: GeneratedReport): string => {
  if (report.data.length === 0) return '';

  const headers = Object.keys(report.data[0]);
  const rows = report.data.map((row) =>
    headers.map((header) => {
      const value = row[header];
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }),
  );

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
};

export const generateHTMLFromReport = (report: GeneratedReport): string => {
  const html = `
    <html>
      <head>
        <title>${report.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          .summary { margin-bottom: 20px; padding: 10px; background: #f5f5f5; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #4CAF50; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>${report.title}</h1>
        <div class="summary">
          <p><strong>Generated:</strong> ${new Date(report.generatedAt).toLocaleString()}</p>
          <p><strong>Total Records:</strong> ${report.summary?.totalRecords || 0}</p>
          <p><strong>Execution Time:</strong> ${report.summary?.executionTime || 0}ms</p>
        </div>
        <table>
          <thead>
            <tr>${Object.keys(report.data[0] || {})
              .map((k) => `<th>${k}</th>`)
              .join('')}</tr>
          </thead>
          <tbody>
            ${report.data.map((row) => `<tr>${Object.values(row).map((v) => `<td>${v}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;
  return html;
};
