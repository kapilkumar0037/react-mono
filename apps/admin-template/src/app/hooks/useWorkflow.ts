/**
 * useWorkflow Hook
 * Manages workflow CRUD, execution, and templating
 */

import { useState, useCallback, useEffect } from 'react';
import {
  Workflow,
  WorkflowExecution,
  WorkflowTemplate,
  WorkflowSchedule,
  WorkflowStats,
} from '../types/workflow';
import {
  readWorkflows,
  saveWorkflow,
  deleteWorkflow,
  getWorkflow,
  readExecutions,
  saveExecution,
  getExecutionsByWorkflow,
  readTemplates,
  readSchedules,
  saveSchedule,
  getActiveSchedules,
  getWorkflowStats,
  validateWorkflow,
  simulateWorkflow,
} from '../utils/workflowStorage';

export const useWorkflow = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [schedules, setSchedules] = useState<WorkflowSchedule[]>([]);
  const [stats, setStats] = useState<WorkflowStats | null>(null);

  // Load data on mount
  useEffect(() => {
    setWorkflows(readWorkflows());
    setExecutions(readExecutions());
    setTemplates(readTemplates());
    setSchedules(readSchedules());
    setStats(getWorkflowStats());
  }, []);

  // Workflow Management
  const createWorkflow = useCallback((workflow: Workflow) => {
    const errors = validateWorkflow(workflow);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      throw new Error(`Workflow validation failed: ${errors.join(', ')}`);
    }

    saveWorkflow(workflow);
    setWorkflows((prev) => [...prev, workflow]);
  }, []);

  const updateWorkflow = useCallback((id: string, updates: Partial<Workflow>) => {
    const workflow = getWorkflow(id);
    if (!workflow) return;

    const updated: Workflow = {
      ...workflow,
      ...updates,
      updatedAt: new Date(),
    };

    const errors = validateWorkflow(updated);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      throw new Error(`Workflow validation failed: ${errors.join(', ')}`);
    }

    saveWorkflow(updated);
    setWorkflows((prev) => prev.map((w) => (w.id === id ? updated : w)));
  }, []);

  const removeWorkflow = useCallback((id: string) => {
    deleteWorkflow(id);
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  // Execution
  const executeWorkflow = useCallback(
    (workflowId: string, mockData?: Record<string, any>): WorkflowExecution => {
      const workflow = getWorkflow(workflowId);
      if (!workflow) throw new Error('Workflow not found');

      // Simulate execution
      const execution = simulateWorkflow(workflow, mockData || {});
      saveExecution(execution);
      setExecutions((prev) => [...prev, execution]);
      refreshStats();

      return execution;
    },
    [],
  );

  const simulateExecution = useCallback((workflowId: string): WorkflowExecution | null => {
    const workflow = getWorkflow(workflowId);
    if (!workflow) return null;

    return simulateWorkflow(workflow, {});
  }, []);

  // Execution History
  const getExecutionHistory = useCallback((workflowId: string): WorkflowExecution[] => {
    return getExecutionsByWorkflow(workflowId);
  }, []);

  const getAllExecutions = useCallback((): WorkflowExecution[] => {
    return executions;
  }, [executions]);

  // Templates
  const getTemplates = useCallback((): WorkflowTemplate[] => {
    return templates;
  }, [templates]);

  const createFromTemplate = useCallback((template: WorkflowTemplate, name: string): Workflow => {
    const newWorkflow: Workflow = {
      ...template.workflow,
      id: `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    createWorkflow(newWorkflow);
    return newWorkflow;
  }, [createWorkflow]);

  // Scheduling
  const createSchedule = useCallback((schedule: WorkflowSchedule) => {
    saveSchedule(schedule);
    setSchedules((prev) => [...prev, schedule]);
  }, []);

  const updateSchedule = useCallback((id: string, updates: Partial<WorkflowSchedule>) => {
    const schedule = schedules.find((s) => s.id === id);
    if (!schedule) return;

    const updated = { ...schedule, ...updates };
    saveSchedule(updated);
    setSchedules((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }, [schedules]);

  const removeSchedule = useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getActiveSchedules = useCallback((): WorkflowSchedule[] => {
    return schedules.filter((s) => s.isActive);
  }, [schedules]);

  // Stats
  const refreshStats = useCallback(() => {
    setStats(getWorkflowStats());
  }, []);

  // Bulk operations
  const duplicateWorkflow = useCallback((id: string, newName: string): Workflow | null => {
    const workflow = getWorkflow(id);
    if (!workflow) return null;

    const duplicate: Workflow = {
      ...workflow,
      id: `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newName,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    createWorkflow(duplicate);
    return duplicate;
  }, [createWorkflow]);

  const exportWorkflow = useCallback((id: string): string => {
    const workflow = getWorkflow(id);
    if (!workflow) return '';
    return JSON.stringify(workflow, null, 2);
  }, []);

  const importWorkflow = useCallback(
    (json: string): Workflow | null => {
      try {
        const workflow = JSON.parse(json) as Workflow;
        workflow.id = `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        createWorkflow(workflow);
        return workflow;
      } catch (error) {
        console.error('Error importing workflow:', error);
        return null;
      }
    },
    [createWorkflow],
  );

  return {
    // State
    workflows,
    executions,
    templates,
    schedules,
    stats,

    // Workflow management
    createWorkflow,
    updateWorkflow,
    removeWorkflow,

    // Execution
    executeWorkflow,
    simulateExecution,
    getExecutionHistory,
    getAllExecutions,

    // Templates
    getTemplates,
    createFromTemplate,

    // Scheduling
    createSchedule,
    updateSchedule,
    removeSchedule,
    getActiveSchedules,

    // Stats
    refreshStats,

    // Bulk operations
    duplicateWorkflow,
    exportWorkflow,
    importWorkflow,
  };
};
