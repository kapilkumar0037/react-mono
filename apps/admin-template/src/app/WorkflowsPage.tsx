/**
 * WorkflowsPage Component
 * Main page for workflow automation management
 */

import React, { useState, useEffect } from 'react';
import { useWorkflow } from '../hooks/useWorkflow';
import { WorkflowRule, WorkflowStats, WorkflowExecution } from '../types/workflow';
import { WorkflowBuilder } from '../components/WorkflowBuilder';
import { WorkflowRulesList } from '../components/WorkflowRulesList';
import { WorkflowExecutionDashboard } from '../components/WorkflowExecutionDashboard';
import { WorkflowTemplateGallery } from '../components/WorkflowTemplateGallery';
import { useGlobalToast } from '../hooks/useGlobalToast';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const WorkflowsPage: React.FC<{ isDarkMode?: boolean }> = ({ isDarkMode = false }) => {
  const userId = 'user-123';
  const { addToast } = useGlobalToast();
  const workflow = useWorkflow(userId);

  const [activeTab, setActiveTab] = useState<'rules' | 'create' | 'executions' | 'templates'>('rules');
  const [editingRule, setEditingRule] = useState<WorkflowRule | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize mock rules on first load
  useEffect(() => {
    if (workflow.rules.length === 0) {
      const mockRules: WorkflowRule[] = [
        {
          id: `rule-${generateId()}`,
          name: 'Auto-assign New Orders',
          description: 'Automatically assign orders to available team members when created',
          entityType: 'order',
          status: 'active',
          trigger: {
            id: `trigger-${generateId()}`,
            type: 'entity_created',
            entityType: 'order',
            conditions: [],
          },
          actions: [
            {
              id: `action-${generateId()}`,
              type: 'assign_to_user',
              config: { assignToTeamLead: true },
            },
            {
              id: `action-${generateId()}`,
              type: 'send_notification',
              config: { message: 'New order assigned to you' },
            },
          ],
          conditions: [],
          priority: 8,
          isActive: true,
          createdAt: new Date(),
          createdBy: userId,
          updatedAt: new Date(),
          updatedBy: userId,
        },
        {
          id: `rule-${generateId()}`,
          name: 'Auto-escalate Overdue Tasks',
          description: 'Escalate tasks that exceed SLA threshold to manager',
          entityType: 'task',
          status: 'active',
          trigger: {
            id: `trigger-${generateId()}`,
            type: 'threshold_reached',
            entityType: 'task',
            conditions: [],
          },
          actions: [
            {
              id: `action-${generateId()}`,
              type: 'change_status',
              config: { newStatus: 'escalated' },
            },
            {
              id: `action-${generateId()}`,
              type: 'send_email',
              config: { recipient: 'manager@example.com', subject: 'Task Escalation Alert' },
            },
          ],
          conditions: [
            {
              id: `cond-${generateId()}`,
              field: 'dueDate',
              operator: 'less_than',
              value: new Date().toISOString(),
            },
          ],
          priority: 9,
          isActive: true,
          createdAt: new Date(),
          createdBy: userId,
          updatedAt: new Date(),
          updatedBy: userId,
        },
        {
          id: `rule-${generateId()}`,
          name: 'Notification on Status Change',
          description: 'Send notifications when order status changes to completed',
          entityType: 'order',
          status: 'active',
          trigger: {
            id: `trigger-${generateId()}`,
            type: 'status_changed',
            entityType: 'order',
            field: 'status',
            conditions: [],
          },
          actions: [
            {
              id: `action-${generateId()}`,
              type: 'send_notification',
              config: { message: 'Order completed successfully' },
            },
            {
              id: `action-${generateId()}`,
              type: 'log_activity',
              config: { action: 'order_completed' },
            },
          ],
          conditions: [
            {
              id: `cond-${generateId()}`,
              field: 'status',
              operator: 'equals',
              value: 'completed',
            },
          ],
          priority: 7,
          isActive: false,
          createdAt: new Date(),
          createdBy: userId,
          updatedAt: new Date(),
          updatedBy: userId,
        },
      ];

      mockRules.forEach((rule) => workflow.createRule(rule));

      // Create mock executions
      mockRules.forEach((rule) => {
        for (let i = 0; i < 5; i++) {
          workflow.executeRule(rule.id, `entity-${i}`, {
            status: Math.random() > 0.2 ? 'active' : 'draft',
            dueDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          });
        }
      });
    }
  }, []);

  const handleCreateNewRule = () => {
    const newRule: WorkflowRule = {
      id: `rule-${generateId()}`,
      name: 'New Workflow Rule',
      entityType: 'order',
      status: 'draft',
      trigger: {
        id: `trigger-${generateId()}`,
        type: 'entity_created',
        entityType: 'order',
        conditions: [],
      },
      actions: [],
      conditions: [],
      priority: 5,
      isActive: false,
      createdAt: new Date(),
      createdBy: userId,
      updatedAt: new Date(),
      updatedBy: userId,
    };
    setEditingRule(newRule);
    setActiveTab('create');
  };

  const handleSaveRule = (rule: WorkflowRule) => {
    setIsLoading(true);
    setTimeout(() => {
      if (editingRule) {
        workflow.updateRule(rule.id, rule);
        addToast('Workflow rule updated successfully', 'success');
      } else {
        workflow.createRule(rule);
        addToast('Workflow rule created successfully', 'success');
      }
      setEditingRule(null);
      setActiveTab('rules');
      setIsLoading(false);
    }, 500);
  };

  const handleDeleteRule = (ruleId: string) => {
    workflow.deleteRule(ruleId);
    addToast('Workflow rule deleted', 'info');
  };

  const handleToggleRule = (ruleId: string, isActive: boolean) => {
    workflow.updateRule(ruleId, { isActive });
    addToast(isActive ? 'Workflow activated' : 'Workflow deactivated', 'info');
  };

  const handleSelectTemplate = (template: any) => {
    const newRule: WorkflowRule = {
      id: `rule-${generateId()}`,
      name: template.name,
      description: template.description,
      entityType: 'order',
      status: 'draft',
      trigger: {
        id: `trigger-${generateId()}`,
        type: 'entity_created',
        entityType: 'order',
        conditions: [],
      },
      actions: [],
      conditions: [],
      priority: 5,
      isActive: false,
      createdAt: new Date(),
      createdBy: userId,
      updatedAt: new Date(),
      updatedBy: userId,
    };
    setEditingRule(newRule);
    setActiveTab('create');
  };

  const bgClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  // Stats
  const stats = workflow.stats;

  return (
    <div className={`${bgClass} min-h-screen p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Workflow Automation</h1>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Create and manage automated workflows for your business processes
            </p>
          </div>
          <button
            onClick={handleCreateNewRule}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            + New Workflow
          </button>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className={`rounded-lg border p-4 ${cardClass}`}>
              <div className="text-sm font-medium opacity-75">Total Rules</div>
              <div className="mt-2 text-3xl font-bold">{stats.totalRules}</div>
            </div>
            <div className={`rounded-lg border p-4 ${cardClass}`}>
              <div className="text-sm font-medium opacity-75">Active Rules</div>
              <div className="mt-2 text-3xl font-bold text-green-600">{stats.activeRules}</div>
            </div>
            <div className={`rounded-lg border p-4 ${cardClass}`}>
              <div className="text-sm font-medium opacity-75">Total Executions</div>
              <div className="mt-2 text-3xl font-bold">{stats.totalExecutions}</div>
            </div>
            <div className={`rounded-lg border p-4 ${cardClass}`}>
              <div className="text-sm font-medium opacity-75">Success Rate</div>
              <div className="mt-2 text-3xl font-bold">
                {stats.totalExecutions > 0
                  ? Math.round((stats.successfulExecutions / stats.totalExecutions) * 100)
                  : 0}
                %
              </div>
            </div>
            <div className={`rounded-lg border p-4 ${cardClass}`}>
              <div className="text-sm font-medium opacity-75">Avg Duration</div>
              <div className="mt-2 text-3xl font-bold">{Math.round(stats.averageExecutionTime)}ms</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex border-b border-gray-300 dark:border-gray-700">
          {(['rules', 'create', 'executions', 'templates'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === tab
                  ? isDarkMode
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'border-b-2 border-blue-600 text-blue-600'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'rules' && `Rules (${workflow.rules.length})`}
              {tab === 'create' && (editingRule ? 'Edit Rule' : 'Create Rule')}
              {tab === 'executions' && `Executions (${workflow.executions.length})`}
              {tab === 'templates' && 'Templates'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'rules' && (
          <WorkflowRulesList
            rules={workflow.rules}
            onEditRule={(rule) => {
              setEditingRule(rule);
              setActiveTab('create');
            }}
            onDeleteRule={handleDeleteRule}
            onToggleRule={handleToggleRule}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'create' && editingRule && (
          <WorkflowBuilder
            rule={editingRule}
            onRuleChange={setEditingRule}
            onSave={handleSaveRule}
            onCancel={() => {
              setEditingRule(null);
              setActiveTab('rules');
            }}
            isLoading={isLoading}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'executions' && (
          <WorkflowExecutionDashboard
            executions={workflow.executions}
            onViewExecution={setSelectedExecution}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'templates' && (
          <WorkflowTemplateGallery
            templates={workflow.templates}
            onSelectTemplate={handleSelectTemplate}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
};
