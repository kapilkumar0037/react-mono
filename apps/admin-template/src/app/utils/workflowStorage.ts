/**
 * Workflow Storage Utilities
 * Handles persistence of workflow rules, executions, and logs
 */

import {
  WorkflowRule,
  WorkflowExecution,
  WorkflowExecutionLog,
  WorkflowTemplate,
  WorkflowPreferences,
  WorkflowStats,
  ExecutionStatus,
} from '../types/workflow';

const RULES_KEY = 'workflow:rules';
const EXECUTIONS_KEY = 'workflow:executions';
const LOGS_KEY = 'workflow:logs';
const TEMPLATES_KEY = 'workflow:templates';
const PREFERENCES_KEY = 'workflow:preferences';

// Workflow Rules
export const readWorkflowRules = (): WorkflowRule[] => {
  try {
    const data = localStorage.getItem(RULES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const persistWorkflowRules = (rules: WorkflowRule[]): void => {
  try {
    const limitedRules = rules.slice(-200);
    localStorage.setItem(RULES_KEY, JSON.stringify(limitedRules));
  } catch (error) {
    console.error('Error persisting workflow rules:', error);
  }
};

export const saveWorkflowRule = (rule: WorkflowRule): void => {
  const rules = readWorkflowRules();
  const existing = rules.findIndex((r) => r.id === rule.id);
  if (existing >= 0) {
    rules[existing] = rule;
  } else {
    rules.push(rule);
  }
  persistWorkflowRules(rules);
};

export const getWorkflowRule = (id: string): WorkflowRule | undefined => {
  return readWorkflowRules().find((r) => r.id === id);
};

export const deleteWorkflowRule = (id: string): void => {
  const rules = readWorkflowRules().filter((r) => r.id !== id);
  persistWorkflowRules(rules);
};

export const getActiveRules = (): WorkflowRule[] => {
  return readWorkflowRules().filter((r) => r.isActive);
};

export const getRulesByEntityType = (entityType: string): WorkflowRule[] => {
  return readWorkflowRules().filter((r) => r.entityType === entityType && r.isActive);
};

// Workflow Executions
export const readWorkflowExecutions = (): WorkflowExecution[] => {
  try {
    const data = localStorage.getItem(EXECUTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const persistWorkflowExecutions = (executions: WorkflowExecution[]): void => {
  try {
    const limitedExecutions = executions.slice(-500);
    localStorage.setItem(EXECUTIONS_KEY, JSON.stringify(limitedExecutions));
  } catch (error) {
    console.error('Error persisting workflow executions:', error);
  }
};

export const recordWorkflowExecution = (execution: WorkflowExecution): void => {
  const executions = readWorkflowExecutions();
  executions.push(execution);
  persistWorkflowExecutions(executions);
};

export const getWorkflowExecution = (id: string): WorkflowExecution | undefined => {
  return readWorkflowExecutions().find((e) => e.id === id);
};

export const getExecutionsByRuleId = (ruleId: string): WorkflowExecution[] => {
  return readWorkflowExecutions().filter((e) => e.ruleId === ruleId);
};

export const getExecutionsByStatus = (status: ExecutionStatus): WorkflowExecution[] => {
  return readWorkflowExecutions().filter((e) => e.status === status);
};

export const clearOldExecutions = (daysOld: number = 30): void => {
  const executions = readWorkflowExecutions();
  const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
  const filtered = executions.filter(
    (e) => new Date(e.startedAt).getTime() > cutoffTime,
  );
  persistWorkflowExecutions(filtered);
};

// Execution Logs
export const readWorkflowLogs = (): WorkflowExecutionLog[] => {
  try {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const persistWorkflowLogs = (logs: WorkflowExecutionLog[]): void => {
  try {
    const limitedLogs = logs.slice(-1000);
    localStorage.setItem(LOGS_KEY, JSON.stringify(limitedLogs));
  } catch (error) {
    console.error('Error persisting workflow logs:', error);
  }
};

export const addExecutionLog = (log: WorkflowExecutionLog): void => {
  const logs = readWorkflowLogs();
  logs.push(log);
  persistWorkflowLogs(logs);
};

export const getLogsByExecutionId = (executionId: string): WorkflowExecutionLog[] => {
  return readWorkflowLogs().filter((l) => l.executionId === executionId);
};

export const getLogsByRuleId = (ruleId: string): WorkflowExecutionLog[] => {
  return readWorkflowLogs().filter((l) => l.ruleId === ruleId);
};

export const clearOldLogs = (daysOld: number = 90): void => {
  const logs = readWorkflowLogs();
  const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
  const filtered = logs.filter((l) => new Date(l.timestamp).getTime() > cutoffTime);
  persistWorkflowLogs(filtered);
};

// Templates
export const readTemplates = (): WorkflowTemplate[] => {
  try {
    const data = localStorage.getItem(TEMPLATES_KEY);
    return data ? JSON.parse(data) : getDefaultTemplates();
  } catch {
    return getDefaultTemplates();
  }
};

export const getDefaultTemplates = (): WorkflowTemplate[] => {
  return [
    {
      id: 'tpl-auto-assign',
      name: 'Auto-assign New Orders',
      description: 'Automatically assign orders to available team members',
      category: 'Assignment',
      rules: [],
      icon: '👤',
      isPublic: true,
      createdAt: new Date(),
      usageCount: 0,
    },
    {
      id: 'tpl-escalation',
      name: 'Auto-escalate Overdue Tasks',
      description: 'Escalate tasks that exceed SLA threshold',
      category: 'Escalation',
      rules: [],
      icon: '📈',
      isPublic: true,
      createdAt: new Date(),
      usageCount: 0,
    },
    {
      id: 'tpl-notification',
      name: 'Notification on Status Change',
      description: 'Send notifications when order status changes',
      category: 'Notification',
      rules: [],
      icon: '📬',
      isPublic: true,
      createdAt: new Date(),
      usageCount: 0,
    },
    {
      id: 'tpl-cleanup',
      name: 'Auto-cleanup Draft Records',
      description: 'Delete draft records older than 30 days',
      category: 'Maintenance',
      rules: [],
      icon: '🧹',
      isPublic: true,
      createdAt: new Date(),
      usageCount: 0,
    },
  ];
};

export const persistTemplates = (templates: WorkflowTemplate[]): void => {
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('Error persisting templates:', error);
  }
};

export const saveTemplate = (template: WorkflowTemplate): void => {
  const templates = readTemplates();
  const existing = templates.findIndex((t) => t.id === template.id);
  if (existing >= 0) {
    templates[existing] = template;
  } else {
    templates.push(template);
  }
  persistTemplates(templates);
};

// Preferences
export const readPreferences = (userId: string): WorkflowPreferences => {
  try {
    const data = localStorage.getItem(`${PREFERENCES_KEY}:${userId}`);
    if (data) return JSON.parse(data);
  } catch {
    // Continue with defaults
  }

  return {
    userId,
    autoExecuteRules: true,
    notifyOnExecution: false,
    notifyOnError: true,
    retentionDays: 90,
    maxConcurrentExecutions: 5,
  };
};

export const persistPreferences = (preferences: WorkflowPreferences): void => {
  try {
    localStorage.setItem(`${PREFERENCES_KEY}:${preferences.userId}`, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error persisting preferences:', error);
  }
};

// Statistics
export const getWorkflowStats = (): WorkflowStats => {
  const rules = readWorkflowRules();
  const executions = readWorkflowExecutions();

  const activeRules = rules.filter((r) => r.isActive).length;
  const successful = executions.filter((e) => e.status === 'success').length;
  const failed = executions.filter((e) => e.status === 'failed').length;

  const avgTime =
    executions.length > 0
      ? executions.reduce((sum, e) => sum + (e.duration || 0), 0) / executions.length
      : 0;

  const recentExecution = executions.sort(
    (a, b) => new Date(b.completedAt || b.startedAt).getTime() - new Date(a.completedAt || a.startedAt).getTime(),
  )[0];

  return {
    totalRules: rules.length,
    activeRules,
    totalExecutions: executions.length,
    successfulExecutions: successful,
    failedExecutions: failed,
    averageExecutionTime: avgTime,
    lastExecutionTime: recentExecution ? new Date(recentExecution.completedAt || recentExecution.startedAt) : undefined,
  };
};

// Condition evaluation
export const evaluateCondition = (
  field: string,
  value: any,
  operator: any,
  conditionValue: any,
): boolean => {
  switch (operator) {
    case 'equals':
      return value === conditionValue;
    case 'not_equals':
      return value !== conditionValue;
    case 'contains':
      return String(value).includes(String(conditionValue));
    case 'not_contains':
      return !String(value).includes(String(conditionValue));
    case 'greater_than':
      return Number(value) > Number(conditionValue);
    case 'less_than':
      return Number(value) < Number(conditionValue);
    case 'between':
      return (
        Number(value) >= Number((conditionValue as any)[0]) &&
        Number(value) <= Number((conditionValue as any)[1])
      );
    case 'in':
      return (conditionValue as any[]).includes(value);
    case 'not_in':
      return !(conditionValue as any[]).includes(value);
    case 'is_empty':
      return !value || value === '';
    case 'is_not_empty':
      return !!value && value !== '';
    default:
      return true;
  }
};
