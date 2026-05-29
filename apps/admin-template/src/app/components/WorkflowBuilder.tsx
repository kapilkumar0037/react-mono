/**
 * WorkflowBuilder Component
 * UI for creating and editing workflow rules with visual builder
 */

import React, { useState } from 'react';
import { WorkflowRule, WorkflowTrigger, WorkflowAction, WorkflowCondition, TriggerType, ActionType, ConditionOperator } from '../types/workflow';

interface WorkflowBuilderProps {
  rule: WorkflowRule;
  onRuleChange: (rule: WorkflowRule) => void;
  onSave: (rule: WorkflowRule) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDarkMode?: boolean;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  rule,
  onRuleChange,
  onSave,
  onCancel,
  isLoading = false,
  isDarkMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'trigger' | 'conditions' | 'actions'>('basic');

  const handleNameChange = (name: string) => {
    onRuleChange({ ...rule, name });
  };

  const handleDescriptionChange = (description: string) => {
    onRuleChange({ ...rule, description });
  };

  const handleEntityTypeChange = (entityType: string) => {
    onRuleChange({ ...rule, entityType });
  };

  const handlePriorityChange = (priority: number) => {
    onRuleChange({ ...rule, priority: Math.max(1, Math.min(10, priority)) });
  };

  const handleTriggerTypeChange = (type: TriggerType) => {
    const trigger: WorkflowTrigger = {
      ...rule.trigger,
      type,
    };
    onRuleChange({ ...rule, trigger });
  };

  const addCondition = () => {
    const newCondition: WorkflowCondition = {
      id: `cond-${Date.now()}`,
      field: '',
      operator: ConditionOperator.EQUALS,
      value: '',
    };
    onRuleChange({ ...rule, conditions: [...rule.conditions, newCondition] });
  };

  const updateCondition = (id: string, updates: Partial<WorkflowCondition>) => {
    const conditions = rule.conditions.map((c) => (c.id === id ? { ...c, ...updates } : c));
    onRuleChange({ ...rule, conditions });
  };

  const removeCondition = (id: string) => {
    onRuleChange({ ...rule, conditions: rule.conditions.filter((c) => c.id !== id) });
  };

  const addAction = () => {
    const newAction: WorkflowAction = {
      id: `act-${Date.now()}`,
      type: ActionType.SEND_EMAIL,
      config: {},
    };
    onRuleChange({ ...rule, actions: [...rule.actions, newAction] });
  };

  const updateAction = (id: string, updates: Partial<WorkflowAction>) => {
    const actions = rule.actions.map((a) => (a.id === id ? { ...a, ...updates } : a));
    onRuleChange({ ...rule, actions });
  };

  const removeAction = (id: string) => {
    onRuleChange({ ...rule, actions: rule.actions.filter((a) => a.id !== id) });
  };

  const bgClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';
  const inputClass = isDarkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  return (
    <div className={`${bgClass} rounded-lg border p-6`}>
      <h2 className="mb-4 text-2xl font-bold">Workflow Builder</h2>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-gray-300 dark:border-gray-700">
        {(['basic', 'trigger', 'conditions', 'actions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab
                ? isDarkMode
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'border-b-2 border-blue-600 text-blue-600'
                : isDarkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Basic Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rule Name *</label>
            <input
              type="text"
              value={rule.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Auto-assign Orders"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={rule.description || ''}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Describe what this workflow does..."
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Entity Type *</label>
              <select
                value={rule.entityType}
                onChange={(e) => handleEntityTypeChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
              >
                <option value="">Select entity type</option>
                <option value="order">Order</option>
                <option value="customer">Customer</option>
                <option value="user">User</option>
                <option value="task">Task</option>
                <option value="invoice">Invoice</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priority (1-10)</label>
              <input
                type="number"
                value={rule.priority}
                onChange={(e) => handlePriorityChange(parseInt(e.target.value))}
                min="1"
                max="10"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rule.isActive}
              onChange={(e) => onRuleChange({ ...rule, isActive: e.target.checked })}
              className="h-4 w-4 rounded"
            />
            <label className="ml-2 text-sm font-medium">Active</label>
          </div>
        </div>
      )}

      {/* Trigger Tab */}
      {activeTab === 'trigger' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Trigger Type *</label>
            <select
              value={rule.trigger.type}
              onChange={(e) => handleTriggerTypeChange(e.target.value as TriggerType)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
            >
              <option value="">Select trigger</option>
              <option value="entity_created">Entity Created</option>
              <option value="entity_updated">Entity Updated</option>
              <option value="entity_deleted">Entity Deleted</option>
              <option value="status_changed">Status Changed</option>
              <option value="field_changed">Field Changed</option>
              <option value="time_based">Time-based Schedule</option>
              <option value="threshold_reached">Threshold Reached</option>
              <option value="manual">Manual Trigger</option>
            </select>
          </div>

          {rule.trigger.type === 'field_changed' && (
            <div>
              <label className="block text-sm font-medium mb-1">Field Name</label>
              <input
                type="text"
                value={rule.trigger.field || ''}
                onChange={(e) => onRuleChange({
                  ...rule,
                  trigger: { ...rule.trigger, field: e.target.value },
                })}
                placeholder="e.g., status"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
              />
            </div>
          )}

          {rule.trigger.type === 'time_based' && (
            <div>
              <label className="block text-sm font-medium mb-1">Schedule (Cron)</label>
              <input
                type="text"
                value={rule.trigger.schedule || ''}
                onChange={(e) => onRuleChange({
                  ...rule,
                  trigger: { ...rule.trigger, schedule: e.target.value },
                })}
                placeholder="e.g., 0 9 * * * (daily at 9 AM)"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
              />
            </div>
          )}
        </div>
      )}

      {/* Conditions Tab */}
      {activeTab === 'conditions' && (
        <div className="space-y-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Conditions (all must be true)</h3>
            <button
              onClick={addCondition}
              className="rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
            >
              + Add Condition
            </button>
          </div>

          {rule.conditions.length === 0 ? (
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No conditions added yet</p>
          ) : (
            rule.conditions.map((condition, idx) => (
              <div key={condition.id} className={`rounded-lg border p-4 ${cardClass}`}>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <input
                    type="text"
                    value={condition.field}
                    onChange={(e) => updateCondition(condition.id, { field: e.target.value })}
                    placeholder="Field name"
                    className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                  />
                  <select
                    value={condition.operator}
                    onChange={(e) => updateCondition(condition.id, { operator: e.target.value as ConditionOperator })}
                    className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                  >
                    <option value="equals">Equals</option>
                    <option value="not_equals">Not Equals</option>
                    <option value="contains">Contains</option>
                    <option value="greater_than">Greater Than</option>
                    <option value="less_than">Less Than</option>
                    <option value="is_empty">Is Empty</option>
                  </select>
                  <input
                    type="text"
                    value={String(condition.value)}
                    onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                    placeholder="Value"
                    className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                  />
                </div>
                <button
                  onClick={() => removeCondition(condition.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Actions Tab */}
      {activeTab === 'actions' && (
        <div className="space-y-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Actions (execute in order)</h3>
            <button
              onClick={addAction}
              className="rounded-md bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
            >
              + Add Action
            </button>
          </div>

          {rule.actions.length === 0 ? (
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No actions added yet</p>
          ) : (
            rule.actions.map((action, idx) => (
              <div key={action.id} className={`rounded-lg border p-4 ${cardClass}`}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <select
                    value={action.type}
                    onChange={(e) => updateAction(action.id, { type: e.target.value as ActionType })}
                    className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                  >
                    <option value="send_email">Send Email</option>
                    <option value="update_field">Update Field</option>
                    <option value="change_status">Change Status</option>
                    <option value="assign_to_user">Assign to User</option>
                    <option value="create_record">Create Record</option>
                    <option value="send_notification">Send Notification</option>
                    <option value="log_activity">Log Activity</option>
                  </select>
                  <input
                    type="number"
                    value={action.delay || 0}
                    onChange={(e) => updateAction(action.id, { delay: parseInt(e.target.value) })}
                    placeholder="Delay (seconds)"
                    className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
                  />
                </div>
                <button
                  onClick={() => removeAction(action.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
          }`}
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(rule)}
          disabled={isLoading || !rule.name || !rule.entityType}
          className="px-4 py-2 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Workflow'}
        </button>
      </div>
    </div>
  );
};
