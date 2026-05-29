/**
 * WorkflowTemplateGallery Component
 * Browse and select pre-built workflow templates
 */

import React from 'react';
import { WorkflowTemplate } from '../types/workflow';

interface WorkflowTemplateGalleryProps {
  templates: WorkflowTemplate[];
  onSelectTemplate: (template: WorkflowTemplate) => void;
  isDarkMode?: boolean;
}

export const WorkflowTemplateGallery: React.FC<WorkflowTemplateGalleryProps> = ({
  templates,
  onSelectTemplate,
  isDarkMode = false,
}) => {
  // Group templates by category
  const groupedTemplates = templates.reduce(
    (acc, template) => {
      const category = template.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(template);
      return acc;
    },
    {} as Record<string, WorkflowTemplate[]>,
  );

  const bgClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';
  const cardHoverClass = isDarkMode ? 'hover:bg-gray-750 hover:border-gray-600' : 'hover:bg-white hover:border-blue-400';

  return (
    <div className={`${bgClass} rounded-lg border p-6`}>
      <h2 className="mb-6 text-2xl font-bold">Workflow Templates</h2>
      <p className={`mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Choose from pre-built templates to quickly create common automation workflows
      </p>

      {/* Templates by Category */}
      {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
        <div key={category} className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-blue-600 dark:text-blue-400">{category}</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {categoryTemplates.map((template) => (
              <div
                key={template.id}
                className={`rounded-lg border p-4 transition-all cursor-pointer ${cardClass} ${cardHoverClass}`}
                onClick={() => onSelectTemplate(template)}
              >
                {/* Icon */}
                <div className="mb-3 text-3xl">{template.icon || '⚙️'}</div>

                {/* Header */}
                <h4 className="font-bold text-lg mb-2">{template.name}</h4>
                <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {template.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs opacity-75">
                  <span>{template.usageCount || 0} uses</span>
                  <span>{template.isPublic ? '🌐 Public' : '🔒 Private'}</span>
                </div>

                {/* Button */}
                <button
                  className="mt-4 w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template);
                  }}
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {templates.length === 0 && (
        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p className="text-lg font-medium">No templates available</p>
          <p className="text-sm opacity-75 mt-1">Create your first workflow rule to get started</p>
        </div>
      )}
    </div>
  );
};
