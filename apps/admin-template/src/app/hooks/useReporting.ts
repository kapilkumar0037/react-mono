/**
 * useReporting Hook
 * Manages report generation, scheduling, and retrieval
 */

import { useState, useCallback, useEffect } from 'react';
import {
  ReportConfig,
  ScheduledReport,
  GeneratedReport,
  ReportTemplate,
  ReportHistoryEntry,
  ReportPreferences,
  ReportStatus,
  ReportingStats,
} from '../types/reporting';
import {
  readReportConfigs,
  saveReportConfig,
  getReportConfig,
  deleteReportConfig,
  readGeneratedReports,
  saveGeneratedReport,
  getGeneratedReport,
  deleteGeneratedReport,
  readScheduledReports,
  saveScheduledReport,
  deleteScheduledReport,
  readTemplates,
  readReportHistory,
  addHistoryEntry,
  readPreferences,
  persistPreferences,
  getReportingStats,
  generateCSVFromReport,
  generateHTMLFromReport,
} from '../utils/reportingStorage';

export const useReporting = (userId: string) => {
  const [configs, setConfigs] = useState<ReportConfig[]>([]);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [history, setHistory] = useState<ReportHistoryEntry[]>([]);
  const [preferences, setPreferences] = useState<ReportPreferences | null>(null);
  const [stats, setStats] = useState<ReportingStats | null>(null);

  // Load data on mount
  useEffect(() => {
    setConfigs(readReportConfigs());
    setGeneratedReports(readGeneratedReports());
    setScheduledReports(readScheduledReports());
    setTemplates(readTemplates());
    setHistory(readReportHistory());
    setPreferences(readPreferences(userId));
    setStats(getReportingStats());
  }, [userId]);

  // Report Config Management
  const createReportConfig = useCallback((config: ReportConfig) => {
    saveReportConfig(config);
    setConfigs((prev) => [...prev, config]);
  }, []);

  const updateReportConfig = useCallback((id: string, updates: Partial<ReportConfig>) => {
    const config = getReportConfig(id);
    if (config) {
      const updated = { ...config, ...updates };
      saveReportConfig(updated);
      setConfigs((prev) => prev.map((c) => (c.id === id ? updated : c)));
    }
  }, []);

  const removeReportConfig = useCallback((id: string) => {
    deleteReportConfig(id);
    setConfigs((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Report Generation
  const generateReport = useCallback(
    (config: ReportConfig, mockData: Record<string, any>[]): GeneratedReport => {
      const startTime = Date.now();

      // Simulate filtering and aggregation
      let processedData = [...mockData];

      // Apply filters
      if (config.filters) {
        config.filters.forEach((filter) => {
          processedData = processedData.filter((row) => {
            const value = row[filter.field];
            switch (filter.operator) {
              case 'equals':
                return value === filter.value;
              case 'contains':
                return String(value).includes(String(filter.value));
              case 'gt':
                return Number(value) > Number(filter.value);
              case 'gte':
                return Number(value) >= Number(filter.value);
              case 'lt':
                return Number(value) < Number(filter.value);
              case 'lte':
                return Number(value) <= Number(filter.value);
              case 'in':
                return (filter.value as any[]).includes(value);
              default:
                return true;
            }
          });
        });
      }

      // Apply ordering
      if (config.orderBy) {
        config.orderBy.forEach((order) => {
          processedData.sort((a, b) => {
            const aVal = a[order.field];
            const bVal = b[order.field];
            const comparison = aVal > bVal ? 1 : -1;
            return order.direction === 'asc' ? comparison : -comparison;
          });
        });
      }

      // Apply limit
      if (config.limit) {
        processedData = processedData.slice(0, config.limit);
      }

      // Compute aggregations
      let aggregationResults: Record<string, number | string> = {};
      if (config.aggregations) {
        config.aggregations.forEach((agg) => {
          const values = mockData.map((row) => row[agg.field]);
          switch (agg.type) {
            case 'count':
              aggregationResults[agg.name] = processedData.length;
              break;
            case 'sum':
              aggregationResults[agg.name] = values
                .filter((v) => typeof v === 'number')
                .reduce((a, b) => a + b, 0);
              break;
            case 'avg':
              const numValues = values.filter((v) => typeof v === 'number');
              aggregationResults[agg.name] =
                numValues.length > 0 ? numValues.reduce((a, b) => a + b, 0) / numValues.length : 0;
              break;
            case 'min':
              aggregationResults[agg.name] = Math.min(...values.filter((v) => typeof v === 'number'));
              break;
            case 'max':
              aggregationResults[agg.name] = Math.max(...values.filter((v) => typeof v === 'number'));
              break;
            case 'distinct':
              aggregationResults[agg.name] = new Set(values).size;
              break;
          }
        });
      }

      const executionTime = Date.now() - startTime;

      const report: GeneratedReport = {
        id: `rpt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        configId: config.id,
        status: 'completed' as ReportStatus,
        type: config.type,
        dataSource: config.dataSource,
        title: config.name,
        data: processedData,
        summary: {
          totalRecords: mockData.length,
          recordsProcessed: processedData.length,
          generatedAt: new Date(),
          executionTime,
        },
        aggregationResults,
        generatedBy: userId,
        generatedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      };

      saveGeneratedReport(report);
      setGeneratedReports((prev) => [...prev, report]);

      // Add to history
      addHistoryEntry({
        id: `hist-${Date.now()}`,
        reportId: config.id,
        reportName: config.name,
        generatedAt: new Date(),
        generatedBy: userId,
        recordCount: processedData.length,
        executionTime,
        status: 'completed',
      });

      return report;
    },
    [userId],
  );

  // Scheduled Report Management
  const createScheduledReport = useCallback((schedule: ScheduledReport) => {
    saveScheduledReport(schedule);
    setScheduledReports((prev) => [...prev, schedule]);
  }, []);

  const updateScheduledReport = useCallback((id: string, updates: Partial<ScheduledReport>) => {
    const schedule = scheduledReports.find((s) => s.id === id);
    if (schedule) {
      const updated = { ...schedule, ...updates };
      saveScheduledReport(updated);
      setScheduledReports((prev) => prev.map((s) => (s.id === id ? updated : s)));
    }
  }, [scheduledReports]);

  const removeScheduledReport = useCallback((id: string) => {
    deleteScheduledReport(id);
    setScheduledReports((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Generated Report Management
  const removeGeneratedReport = useCallback((id: string) => {
    deleteGeneratedReport(id);
    setGeneratedReports((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const getReport = useCallback((id: string) => {
    return getGeneratedReport(id);
  }, []);

  // Export functions
  const exportReportAsCSV = useCallback((reportId: string): string | null => {
    const report = getGeneratedReport(reportId);
    if (!report) return null;
    return generateCSVFromReport(report);
  }, []);

  const exportReportAsHTML = useCallback((reportId: string): string | null => {
    const report = getGeneratedReport(reportId);
    if (!report) return null;
    return generateHTMLFromReport(report);
  }, []);

  // Preferences
  const updatePreferences = useCallback((newPrefs: Partial<ReportPreferences>) => {
    if (preferences) {
      const updated = { ...preferences, ...newPrefs };
      persistPreferences(updated);
      setPreferences(updated);
    }
  }, [preferences]);

  // Stats
  const refreshStats = useCallback(() => {
    setStats(getReportingStats());
  }, []);

  return {
    // State
    configs,
    generatedReports,
    scheduledReports,
    templates,
    history,
    preferences,
    stats,

    // Config management
    createReportConfig,
    updateReportConfig,
    removeReportConfig,

    // Report generation
    generateReport,

    // Scheduled management
    createScheduledReport,
    updateScheduledReport,
    removeScheduledReport,

    // Report access
    removeGeneratedReport,
    getReport,

    // Export
    exportReportAsCSV,
    exportReportAsHTML,

    // Preferences
    updatePreferences,

    // Stats
    refreshStats,
  };
};
