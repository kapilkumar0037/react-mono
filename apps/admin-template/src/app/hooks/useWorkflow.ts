/**
 * useWorkflow Hook
 * Manages workflow rules, executions, and automation
 */

import { useState, useCallback, useEffect } from 'react';
import {
  WorkflowRule,
  WorkflowExecution,
  WorkflowExecutionLog,
  WorkflowTemplate,
  WorkflowPreferences,
  WorkflowStats,
  ExecutionStatus,
  TriggerType,
} from '../types/workflow';
import {
  readWorkflowRules,
  saveWorkflowRule,
  getWorkflowRule,
  deleteWorkflowRule,
  readWorkflowExecutions,
  recordWorkflowExecution,
  getWorkflowExecution,
  getExecutionsByRuleId,
  getExecutionsByStatus,
  readWorkflowLogs,
  addExecutionLog,
  getLogsByExecutionId,
  readTemplates,
  readPreferences,
  persistPreferences,
  getWorkflowStats,
  evaluateCondition,
} from '../utils/workflowStorage';

export const useWorkflow = (userId: string) => {
  const [rules, setRules] = useState<WorkflowRule[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [logs, setLogs] = useState<WorkflowExecutionLog[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [preferences, setPreferences] = useState<WorkflowPreferences | null>(null);
  const [stats, setStats] = useState<WorkflowStats | null>(null);

  // Load data on mount
  useEffect(() => {
    setRules(readWorkflowRules());
    setExecutions(readWorkflowExecutions());
    setLogs(readWorkflowLogs());
    setTemplates(readTemplates());
    setPreferences(readPreferences(userId));
    setStats(getWorkflowStats());
  }, [userId]);

  // Rule Management
  const createRule = useCallback((rule: WorkflowRule) => {
    saveWorkflowRule(rule);
    setRules((prev) => [...prev, rule]);
  }, []);

  const updateRule = useCallback((id: string, updates: Partial<WorkflowRule>) => {
    const rule = getWorkflowRule(id);
    if (rule) {
      const updated = { ...rule, ...updates, updatedAt: new Date() };
      saveWorkflowRule(updated);
      setRules((prev) => prev.map((r) => (r.id === id ? updated : r)));
    }
  }, []);

  const deleteRule = useCallback((id: string) => {
    deleteWorkflowRule(id);
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Rule Execution
  const executeRule = useCallback(
    (
      ruleId: string,
      entityId: string,
      entityData: Record<string, any>,
    ): WorkflowExecution | null => {
      const rule = getWorkflowRule(ruleId);
      if (!rule) return null;

      // Check if all conditions are met
      let conditionsMet = true;
      if (rule.conditions && rule.conditions.length > 0) {
        conditionsMet = rule.conditions.every((condition) => {
          const fieldValue = entityData[condition.field];
          return evaluateCondition(
            condition.field,
            fieldValue,
            condition.operator,
            condition.value,
          );
        });
      }

      if (!conditionsMet) {
        // Log skipped execution
        const skippedExecution: WorkflowExecution = {
          id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ruleId,
          ruleName: rule.name,
          triggerType: rule.trigger.type,
          entityType: rule.entityType,
          entityId,
          status: ExecutionStatus.SKIPPED,
          startedAt: new Date(),
          executedActions: [],
        };

        addExecutionLog({
          id: `log-${Date.now()}`,
          executionId: skippedExecution.id,
          ruleId,
          timestamp: new Date(),
          action: 'condition_check',
          result: 'failure',
          details: 'Rule conditions not met',
        });

        recordWorkflowExecution(skippedExecution);
        setExecutions((prev) => [...prev, skippedExecution]);

        return skippedExecution;
      }

      // Execute workflow
      const startTime = Date.now();
      const execution: WorkflowExecution = {
        id: `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ruleId,
        ruleName: rule.name,
        triggerType: rule.trigger.type,
        entityType: rule.entityType,
        entityId,
        status: ExecutionStatus.RUNNING,
        startedAt: new Date(),
        executedActions: [],
        failedActions: [],
      };

      // Execute actions in order
      let hasErrors = false;
      const executedActionIds: string[] = [];
      const failedActionsList: { actionId: string; error: string }[] = [];

      rule.actions.forEach((action) => {
        try {
          // Simulate action execution with delay
          if (action.delay) {
            // In real scenario, would schedule async execution
          }

          // Log action execution
          addExecutionLog({
            id: `log-${Date.now()}`,
            executionId: execution.id,
            ruleId,
            timestamp: new Date(),
            action: `execute_action_${action.type}`,
            result: 'success',
            details: `Executed ${action.type} action`,
            metadata: action.config,
          });

          executedActionIds.push(action.id);
        } catch (error) {
          hasErrors = true;
          failedActionsList.push({
            actionId: action.id,
            error: String(error),
          });

          addExecutionLog({
            id: `log-${Date.now()}`,
            executionId: execution.id,
            ruleId,
            timestamp: new Date(),
            action: `execute_action_${action.type}`,
            result: 'failure',
            details: `Failed to execute ${action.type}: ${error}`,
          });
        }
      });

      const duration = Date.now() - startTime;

      const finalExecution: WorkflowExecution = {
        ...execution,
        status: hasErrors ? ExecutionStatus.FAILED : ExecutionStatus.SUCCESS,
        completedAt: new Date(),
        executedActions: executedActionIds,
        failedActions: failedActionsList.length > 0 ? failedActionsList : undefined,
        duration,
      };

      recordWorkflowExecution(finalExecution);
      setExecutions((prev) => [...prev, finalExecution]);

      return finalExecution;
    },
    [],
  );

  // Trigger-based execution
  const triggerWorkflow = useCallback(
    (triggerType: TriggerType, entityType: string, entityId: string, entityData: Record<string, any>) => {
      const applicableRules = rules.filter(
        (r) => r.trigger.type === triggerType && r.entityType === entityType && r.isActive,
      );

      return applicableRules.map((rule) => executeRule(rule.id, entityId, entityData)).filter(Boolean);
    },
    [rules, executeRule],
  );

  // Get rule details
  const getRule = useCallback((id: string) => {
    return getWorkflowRule(id);
  }, []);

  // Get execution history
  const getRuleExecutions = useCallback((ruleId: string) => {
    return getExecutionsByRuleId(ruleId);
  }, []);

  // Get execution logs
  const getExecutionLogs = useCallback((executionId: string) => {
    return getLogsByExecutionId(executionId);
  }, []);

  // Get recent executions
  const getRecentExecutions = useCallback((limit: number = 10) => {
    return executions
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, limit);
  }, [executions]);

  // Statistics
  const refreshStats = useCallback(() => {
    setStats(getWorkflowStats());
  }, []);

  // Preferences
  const updatePreferences = useCallback((newPrefs: Partial<WorkflowPreferences>) => {
    if (preferences) {
      const updated = { ...preferences, ...newPrefs };
      persistPreferences(updated);
      setPreferences(updated);
    }
  }, [preferences]);

  return {
    // State
    rules,
    executions,
    logs,
    templates,
    preferences,
    stats,

    // Rule management
    createRule,
    updateRule,
    deleteRule,
    getRule,

    // Execution
    executeRule,
    triggerWorkflow,
    getRuleExecutions,
    getExecutionLogs,
    getRecentExecutions,

    // Preferences
    updatePreferences,

    // Stats
    refreshStats,
  };
};
