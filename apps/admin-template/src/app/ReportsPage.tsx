/**
 * Reports Page
 * Comprehensive reporting interface with builder, viewer, scheduler, and history
 */

import React, { useState, useMemo } from 'react';
import { useReporting } from './hooks/useReporting';
import { ReportBuilder } from './components/ReportBuilder';
import { ReportViewer } from './components/ReportViewer';
import { ScheduleReportModal } from './components/ScheduleReportModal';
import { ReportTemplateGallery } from './components/ReportTemplateGallery';
import { ReportHistory } from './components/ReportHistory';
import { ReportConfig, GeneratedReport } from './types/reporting';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface ReportsPageProps {
  isDarkMode?: boolean;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ isDarkMode = false }) => {
  const userId = 'current-user'; // In real app, get from auth context
  const reporting = useReporting(userId);

  const [activeTab, setActiveTab] = useState<'builder' | 'templates' | 'history' | 'scheduled'>(
    'builder',
  );
  const [currentConfig, setCurrentConfig] = useState<ReportConfig>({
    id: generateId(),
    name: 'New Report',
    type: 'summary',
    dataSource: 'users',
  });
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  // Mock data for report generation
  const mockDataBySource = {
    users: Array.from({ length: 150 }, (_, i) => ({
      id: `U${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: i % 3 === 0 ? 'inactive' : i % 2 === 0 ? 'active' : 'pending',
      joinDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      role: ['admin', 'user', 'moderator'][Math.floor(Math.random() * 3)],
    })),
    orders: Array.from({ length: 200 }, (_, i) => ({
      id: `ORD${i + 1}`,
      amount: Math.floor(Math.random() * 10000),
      status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      customer: `Customer ${Math.floor(Math.random() * 100)}`,
    })),
    customers: Array.from({ length: 100 }, (_, i) => ({
      id: `C${i + 1}`,
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      status: i % 4 === 0 ? 'inactive' : 'active',
      lifetime_value: Math.floor(Math.random() * 50000),
    })),
    audit_log: Array.from({ length: 300 }, (_, i) => ({
      id: `AL${i + 1}`,
      action: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'][Math.floor(Math.random() * 5)],
      user: `User ${Math.floor(Math.random() * 50)}`,
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      status: Math.random() > 0.1 ? 'success' : 'failed',
    })),
    activity: Array.from({ length: 250 }, (_, i) => ({
      id: `A${i + 1}`,
      type: ['view', 'edit', 'create', 'delete'][Math.floor(Math.random() * 4)],
      entity: `Entity ${Math.floor(Math.random() * 100)}`,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      user: `User ${Math.floor(Math.random() * 50)}`,
    })),
  };

  const handleGenerateReport = async (config: ReportConfig) => {
    setIsGenerating(true);
    try {
      // Simulate async generation
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockData =
        mockDataBySource[config.dataSource as keyof typeof mockDataBySource] || [];
      const report = reporting.generateReport(config, mockData);
      setGeneratedReport(report);
      reporting.refreshStats();
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveConfig = () => {
    reporting.createReportConfig(currentConfig);
    alert('Report configuration saved!');
  };

  const handleSelectTemplate = (template) => {
    const newConfig: ReportConfig = {
      ...template.config,
      id: generateId(),
      name: template.config.name,
    };
    setCurrentConfig(newConfig);
    setActiveTab('builder');
  };

  const handleExportCSV = () => {
    if (!generatedReport) return;
    const csv = reporting.exportReportAsCSV(generatedReport.id);
    if (csv) {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedReport.title}.csv`;
      a.click();
    }
  };

  const handleExportHTML = () => {
    if (!generatedReport) return;
    const html = reporting.exportReportAsHTML(generatedReport.id);
    if (html) {
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedReport.title}.html`;
      a.click();
    }
  };

  return (
    <div className={`min-h-screen ${bgClass} p-6`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className={`text-3xl font-bold ${textClass}`}>Reports & Analytics</h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Create, schedule, and manage custom reports
          </p>
        </div>

        {/* Stats */}
        {reporting.stats && (
          <div className="grid grid-cols-4 gap-4">
            <div className={`${cardBg} rounded-lg p-4 shadow`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Reports
              </p>
              <p className={`text-2xl font-bold ${textClass} mt-2`}>
                {reporting.stats.totalReports}
              </p>
            </div>
            <div className={`${cardBg} rounded-lg p-4 shadow`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Scheduled
              </p>
              <p className={`text-2xl font-bold ${textClass} mt-2`}>
                {reporting.stats.scheduledReports}
              </p>
            </div>
            <div className={`${cardBg} rounded-lg p-4 shadow`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                This Month
              </p>
              <p className={`text-2xl font-bold ${textClass} mt-2`}>
                {reporting.stats.generatedThisMonth}
              </p>
            </div>
            <div className={`${cardBg} rounded-lg p-4 shadow`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Success Rate
              </p>
              <p className={`text-2xl font-bold text-green-600 mt-2`}>
                {Math.round(reporting.stats.successRate)}%
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className={`${cardBg} rounded-lg shadow`}>
          <div className="flex border-b" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
            {[
              { id: 'builder', label: '📋 Builder', icon: '📋' },
              { id: 'templates', label: '🎯 Templates', icon: '🎯' },
              { id: 'history', label: '📜 History', icon: '📜' },
              { id: 'scheduled', label: '⏰ Scheduled', icon: '⏰' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? `border-b-2 ${isDarkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600'}`
                    : isDarkMode
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Builder Tab */}
            {activeTab === 'builder' && (
              <div className="space-y-6">
                <ReportBuilder
                  config={currentConfig}
                  onConfigChange={setCurrentConfig}
                  onGenerate={handleGenerateReport}
                  onSave={handleSaveConfig}
                  isLoading={isGenerating}
                  isDarkMode={isDarkMode}
                />

                {generatedReport && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowScheduleModal(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded font-medium"
                      >
                        ⏰ Schedule Report
                      </button>
                    </div>
                    <ReportViewer
                      report={generatedReport}
                      onExportCSV={handleExportCSV}
                      onExportHTML={handleExportHTML}
                      onClose={() => setGeneratedReport(null)}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <ReportTemplateGallery
                templates={reporting.templates}
                onSelectTemplate={handleSelectTemplate}
                isDarkMode={isDarkMode}
              />
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <ReportHistory
                history={reporting.history}
                onViewReport={(id) => {
                  const report = reporting.getReport(id);
                  if (report) setGeneratedReport(report);
                }}
                isDarkMode={isDarkMode}
              />
            )}

            {/* Scheduled Tab */}
            {activeTab === 'scheduled' && (
              <div className={`rounded-lg p-6 ${cardBg}`}>
                <h3 className={`text-lg font-semibold ${textClass} mb-4`}>Scheduled Reports</h3>
                {reporting.scheduledReports.length === 0 ? (
                  <p className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No scheduled reports yet. Create and schedule a report!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {reporting.scheduledReports.map((schedule) => (
                      <div
                        key={schedule.id}
                        className={`rounded p-4 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className={`font-medium ${textClass}`}>
                              Report {schedule.configId}
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {schedule.frequency} • {schedule.recipients.join(', ')} • {schedule.formats.join(', ')}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              schedule.isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                            }`}
                          >
                            {schedule.isActive ? '✓ Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleReportModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={(schedule) => {
          reporting.createScheduledReport(schedule);
          alert('Report scheduled successfully!');
        }}
        configId={currentConfig.id}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default ReportsPage;
