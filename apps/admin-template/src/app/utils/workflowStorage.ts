/**
 * Workflow Storage Utilities
 * Handles persistence of workflows, executions, and templates
 */

import {
  Workflow,
  WorkflowExecution,
  WorkflowTemplate,
  WorkflowSchedule,
  WorkflowStats,
  WorkflowStatus,
  ExecutionStatus,
} from '../types/workflow';

const WORKFLOWS_KEY = 'workflows:definitions';
const EXECUTIONS_KEY = 'workflows:executions';
const TEMPLATES_KEY = 'workflows:templates';
const SCHEDULES_KEY = 'workflows:schedules';

// Workflows
export const readWorkflows = (): Workflow[] => {
  try {
    const data = localStorage.getItem(WORKFLOWS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const persistWorkflows = (workflows: Workflow[]): void => {
  try {
    const limited = workflows.slice(-200);
    localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error persisting workflows:', error);
  }
};

export const saveWorkflow = (workflow: Workflow): void => {
  const workflows = readWorkflows();
  const existing = workflows.findIndex((w) => w.id === workflow.id);
  if (existing >= 0) {
    workflows[existing] = workflow;
  } else {
    workflows.push(workflow);
  }
  persistWorkflows(workflows);
};

export const getWorkflow = (id: string): Workflow | undefined => {
  return readWorkflows().find((w) => w.id === id);
};

export const deleteWorkflow = (id: string): void => {
  const workflows = readWorkflows().filter((w) => w.id !== id);
  persistWorkflows(workflows);
};

export const getActiveWorkflows = (): Workflow[] => {
  return readWorkflows().filter((w) => w.status === WorkflowStatus.ACTIVE);
};

// Executions
export const readExecutions = (): WorkflowExecution[] => {
  try {
    const data = localStorage.getItem(EXECUTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const persistExecutions = (executions: WorkflowExecution[]): void => {
  try {
    const limited = executions.slice(-1000);
    localStorage.setItem(EXECUTIONS_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error persisting executions:', error);
  }
};

export const saveExecution = (execution: WorkflowExecution): void => {
  const executions = readExecutions();
  executions.push(execution);
  persistExecutions(executions);
};

export const getExecution = (id: string): WorkflowExecution | undefined => {
  return readExecutions().find((e) => e.id === id);
};

export const getExecutionsByWorkflow = (workflowId: string): WorkflowExecution[] => {
  return readExecutions().filter((e) => e.workflowId === workflowId);
};

export const clearOldExecutions = (daysOld: number = 30): void => {
  const executions = readExecutions();
  const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;
  const filtered = executions.filter((e) => new Date(e.startedAt).getTime() > cutoffTime);
  persistExecutions(filtered);
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
      id: 'tpl-user-notification',
      name: 'User Notification Workflow',
      description: 'Send notifications when new users register',
      category: 'User Management',
      icon: '👤',
      isPublic: true,
      createdAt: new Date(),
      createdBy: 'System',
      usageCount: 0,
      workflow: {
        id: 'workflow-template-1',
        name: 'User Notification',
        status: WorkflowStatus.DRAFT,
        version: 1,
        isPublic: true,
        createdAt: new Date(),
        createdBy: 'System',
        updatedAt: new Date(),
        updatedBy: 'System',
        trigger: {
          id: 'trig-1',
          type: 'event' as any,
          name: 'User Registered',
          config: { event: 'user.created' },
          enabled: true,
        },
        steps: [],
      },
    },
    {
      id: 'tpl-data-export',
      name: 'Data Export Workflow',
      description: 'Export data on schedule and send to recipients',
      category: 'Data Management',
      icon: '📊',
      isPublic: true,
      createdAt: new Date(),
      createdBy: 'System',
      usageCount: 0,
      workflow: {
        id: 'workflow-template-2',
        name: 'Data Export',
        status: WorkflowStatus.DRAFT,
        version: 1,
        isPublic: true,
        createdAt: new Date(),
        createdBy: 'System',
        updatedAt: new Date(),
        updatedBy: 'System',
        trigger: {
          id: 'trig-2',
          type: 'scheduled' as any,
          name: 'Daily Export',
          config: { schedule: 'daily', time: '08:00' },
          enabled: true,
        },
        steps: [],
      },
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

// Schedules
export const readSchedules = (): WorkflowSchedule[] => {
  try {
    const data = localStorage.getItem(SCHEDULES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const persistSchedules = (schedules: WorkflowSchedule[]): void => {
  try {
    localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.error('Error persisting schedules:', error);
  }
};

export const saveSchedule = (schedule: WorkflowSchedule): void => {
  const schedules = readSchedules();
  const existing = schedules.findIndex((s) => s.id === schedule.id);
  if (existing >= 0) {
    schedules[existing] = schedule;
  } else {
    schedules.push(schedule);
  }
  persistSchedules(schedules);
};

export const getActiveSchedules = (): WorkflowSchedule[] => {
  return readSchedules().filter((s) => s.isActive);
};

// Statistics
export const getWorkflowStats = (): WorkflowStats => {
  const workflows = readWorkflows();
  const executions = readExecutions();

  const active = workflows.filter((w) => w.status === WorkflowStatus.ACTIVE).length;
  const successful = executions.filter((e) => e.status === ExecutionStatus.SUCCESS).length;
  const failed = executions.filter((e) => e.status === ExecutionStatus.FAILED).length;

  const avgTime =
    executions.length > 0
      ? executions.reduce((sum, e) => sum + (e.executionTime || 0), 0) / executions.length
      : 0;

  const successRate = executions.length > 0 ? (successful / executions.length) * 100 : 0;

  return {
    totalWorkflows: workflows.length,
    activeWorkflows: active,
    totalExecutions: executions.length,
    successfulExecutions: successful,
    failedExecutions: failed,
    averageExecutionTime: avgTime,
    successRate,
  };
};

// Validation
export const validateWorkflow = (workflow: Workflow): string[] => {
  const errors: string[] = [];

  if (!workflow.name?.trim()) {
    errors.push('Workflow name is required');
  }

  if (!workflow.trigger) {
    errors.push('Workflow trigger is required');
  }

  if (!workflow.steps || workflow.steps.length === 0) {
    errors.push('Workflow must have at least one step');
  }

  workflow.steps.forEach((step, idx) => {
    if (!step.actions || step.actions.length === 0) {
      errors.push(`Step ${idx + 1} must have at least one action`);
    }
  });

  return errors;
};

// Simulation/Testing
export const simulateWorkflow = (
  workflow: Workflow,
  mockData: Record<string, any>,
): WorkflowExecution => {
  const execution: WorkflowExecution = {
    id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    workflowId: workflow.id,
    workflowName: workflow.name,
    triggeredBy: 'system',
    startedAt: new Date(),
    status: ExecutionStatus.SUCCESS,
    steps: [],
  };

  const startTime = Date.now();

  workflow.steps.forEach((step, idx) => {
    const stepExecution = {
      id: `step-exec-${idx}`,
      stepId: step.id,
      stepName: step.name,
      status: ExecutionStatus.SUCCESS,
      actions: step.actions.map((action) => ({
        id: `action-exec-${action.id}`,
        actionId: action.id,
        actionName: action.name,
        status: ExecutionStatus.SUCCESS,
        startedAt: new Date(),
        completedAt: new Date(),
        result: { simulated: true },
        retryAttempts: 0,
      })),
      startedAt: new Date(),
      completedAt: new Date(),
      result: { stepCompleted: true },
    };

    execution.steps.push(stepExecution);
  });

  execution.completedAt = new Date();
  execution.executionTime = Date.now() - startTime;

  return execution;
};
