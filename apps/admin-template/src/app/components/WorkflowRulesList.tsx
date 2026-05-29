/**
 * WorkflowRulesList Component
 * Displays all workflow rules with edit/delete/toggle actions
 */

import React, { useState } from 'react';
import { WorkflowRule } from '../types/workflow';

interface WorkflowRulesListProps {
  rules: WorkflowRule[];
  onEditRule: (rule: WorkflowRule) => void;
  onDeleteRule: (ruleId: string) => void;
  onToggleRule: (ruleId: string, isActive: boolean) => void;
  isDarkMode?: boolean;
}

export const WorkflowRulesList: React.FC<WorkflowRulesListProps> = ({
  rules,
  onEditRule,
  onDeleteRule,
  onToggleRule,
  isDarkMode = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filtered = rules.filter((rule) => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && rule.isActive) ||
      (filterStatus === 'inactive' && !rule.isActive);
    return matchesSearch && matchesStatus;
  });

  const bgClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';
  const inputClass = isDarkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';
  const rowHoverClass = isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  return (
    <div className={`${bgClass} rounded-lg border p-6`}>
      <h2 className="mb-6 text-2xl font-bold">Workflow Rules</h2>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search rules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-1 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className={`rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
        >
          <option value="all">All Rules</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Rules Grid */}
      {filtered.length === 0 ? (
        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p className="text-lg font-medium">No workflow rules found</p>
          <p className="text-sm opacity-75 mt-1">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((rule) => (
            <div
              key={rule.id}
              className={`rounded-lg border p-4 transition-all ${
                rule.isActive ? cardClass : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              } ${rowHoverClass}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{rule.name}</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {rule.entityType} • Priority: {rule.priority}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      rule.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  ></span>
                </div>
              </div>

              {/* Description */}
              {rule.description && (
                <p className={`text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {rule.description}
                </p>
              )}

              {/* Info Grid */}
              <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                <div className={`rounded px-2 py-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className="opacity-75">Trigger:</span>
                  <div className="font-medium capitalize">{rule.trigger.type.replace(/_/g, ' ')}</div>
                </div>
                <div className={`rounded px-2 py-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className="opacity-75">Actions:</span>
                  <div className="font-medium">{rule.actions.length}</div>
                </div>
                <div className={`rounded px-2 py-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className="opacity-75">Conditions:</span>
                  <div className="font-medium">{rule.conditions.length}</div>
                </div>
                <div className={`rounded px-2 py-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className="opacity-75">Status:</span>
                  <div className={`font-medium ${rule.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onToggleRule(rule.id, !rule.isActive)}
                  className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                    rule.isActive
                      ? isDarkMode
                        ? 'bg-red-900 text-red-100 hover:bg-red-800'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                      : isDarkMode
                        ? 'bg-green-900 text-green-100 hover:bg-green-800'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {rule.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => onEditRule(rule)}
                  className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                    isDarkMode
                      ? 'bg-blue-900 text-blue-100 hover:bg-blue-800'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this workflow rule?')) {
                      onDeleteRule(rule.id);
                    }
                  }}
                  className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                    isDarkMode
                      ? 'bg-red-900 text-red-100 hover:bg-red-800'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  Delete
                </button>
              </div>

              {/* Error Message */}
              {rule.errorMessage && (
                <div className={`mt-3 text-xs rounded px-2 py-1 ${
                  isDarkMode
                    ? 'bg-red-900 text-red-100'
                    : 'bg-red-100 text-red-700'
                }`}>
                  ⚠️ {rule.errorMessage}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
