/**
 * Schedule Report Modal
 * Configure scheduled report execution
 */

import React, { useState } from 'react';
import { Modal, Button, InputGroup, InputGroupInput } from '@react-mono/ui-controls';
import { ScheduledReport, ReportFrequency, ReportFormat } from '../types/reporting';

interface ScheduleReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (schedule: ScheduledReport) => void;
  configId: string;
  isDarkMode?: boolean;
}

export const ScheduleReportModal: React.FC<ScheduleReportModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  configId,
  isDarkMode = false,
}) => {
  const [frequency, setFrequency] = useState<ReportFrequency>(ReportFrequency.WEEKLY);
  const [recipients, setRecipients] = useState<string[]>(['']);
  const [formats, setFormats] = useState<ReportFormat[]>([ReportFormat.PDF]);
  const [isActive, setIsActive] = useState(true);

  const handleAddRecipient = () => {
    setRecipients([...recipients, '']);
  };

  const handleUpdateRecipient = (index: number, email: string) => {
    const updated = [...recipients];
    updated[index] = email;
    setRecipients(updated);
  };

  const handleRemoveRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const handleToggleFormat = (format: ReportFormat) => {
    if (formats.includes(format)) {
      setFormats(formats.filter((f) => f !== format));
    } else {
      setFormats([...formats, format]);
    }
  };

  const handleSchedule = () => {
    const validRecipients = recipients.filter((r) => r.trim());
    if (validRecipients.length === 0 || formats.length === 0) {
      alert('Please add at least one recipient and select at least one format');
      return;
    }

    const schedule: ScheduledReport = {
      id: `sch-${Date.now()}`,
      configId,
      frequency,
      nextRun: new Date(),
      recipients: validRecipients,
      formats,
      isActive,
      createdAt: new Date(),
      createdBy: 'current-user',
    };

    onSchedule(schedule);
    onClose();
  };

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const inputBg = isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Report" size="md">
      <div className={`space-y-4 max-h-96 overflow-y-auto ${bgClass}`}>
        {/* Frequency */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${textClass}`}>Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as ReportFrequency)}
            className={`w-full px-3 py-2 rounded border ${inputBg}`}
          >
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>

        {/* Recipients */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${textClass}`}>Email Recipients</label>
          <div className="space-y-2 mb-2">
            {recipients.map((email, idx) => (
              <div key={idx} className="flex gap-2">
                <InputGroup>
                  <InputGroupInput
                    type="email"
                    value={email}
                    onChange={(e) => handleUpdateRecipient(idx, e.target.value)}
                    placeholder="user@example.com"
                    className={inputBg}
                  />
                </InputGroup>
                {recipients.length > 1 && (
                  <button
                    onClick={() => handleRemoveRecipient(idx)}
                    className="px-2 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <Button onClick={handleAddRecipient} className="w-full bg-blue-600 text-white text-sm">
            + Add Recipient
          </Button>
        </div>

        {/* Export Formats */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${textClass}`}>Export Formats</label>
          <div className="space-y-2">
            {(['pdf', 'excel', 'csv', 'json'] as ReportFormat[]).map((format) => (
              <label key={format} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formats.includes(format)}
                  onChange={() => handleToggleFormat(format)}
                  className="w-4 h-4"
                />
                <span className={`text-sm ${textClass}`}>
                  {format === 'pdf' && '📄 PDF'}
                  {format === 'excel' && '📊 Excel'}
                  {format === 'csv' && '📋 CSV'}
                  {format === 'json' && '📦 JSON'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Active Status */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4"
          />
          <span className={`text-sm font-medium ${textClass}`}>Activate Schedule</span>
        </label>
      </div>

      {/* Footer */}
      <div className="flex gap-2 justify-end border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <Button onClick={onClose} className="bg-gray-500 text-white">
          Cancel
        </Button>
        <Button onClick={handleSchedule} className="bg-green-600 text-white">
          Schedule
        </Button>
      </div>
    </Modal>
  );
};
