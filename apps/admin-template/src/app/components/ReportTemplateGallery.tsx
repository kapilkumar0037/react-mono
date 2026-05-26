/**
 * Report Template Gallery Component
 * Browse and select pre-built report templates
 */

import React from 'react';
import { Button } from '@react-mono/ui-controls';
import { ReportTemplate } from '../types/reporting';

interface ReportTemplateGalleryProps {
  templates: ReportTemplate[];
  onSelectTemplate: (template: ReportTemplate) => void;
  isDarkMode?: boolean;
}

export const ReportTemplateGallery: React.FC<ReportTemplateGalleryProps> = ({
  templates,
  onSelectTemplate,
  isDarkMode = false,
}) => {
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverClass = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  // Group templates by category
  const groupedTemplates = templates.reduce(
    (acc, template) => {
      const category = template.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(template);
      return acc;
    },
    {} as Record<string, ReportTemplate[]>,
  );

  return (
    <div className={`${bgClass} rounded-lg shadow p-6`}>
      <h2 className={`text-2xl font-bold ${textClass} mb-6`}>Report Templates</h2>

      {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
        <div key={category} className="mb-8">
          <h3 className={`text-lg font-semibold ${textClass} mb-4`}>{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTemplates.map((template) => (
              <div
                key={template.id}
                className={`rounded-lg border ${borderClass} p-4 transition-colors ${hoverClass}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{template.icon}</div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      template.isPublic
                        ? isDarkMode
                          ? 'bg-green-900 text-green-200'
                          : 'bg-green-100 text-green-800'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {template.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>

                <h4 className={`font-semibold ${textClass} mb-2`}>{template.name}</h4>

                {template.description && (
                  <p
                    className={`text-sm mb-3 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {template.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-4 pt-3 border-t" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {template.usageCount || 0} uses
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {template.config.type}
                  </span>
                </div>

                <Button
                  onClick={() => onSelectTemplate(template)}
                  className="w-full bg-blue-600 text-white text-sm"
                >
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
