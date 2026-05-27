/**
 * Automated Workflows Types
 * Feature 9: Workflow automation with triggers, conditions, and actions
 */

export enum WorkflowTriggerType {
  MANUAL = 'manual',              // Manually triggered
  DATA_CHANGE = 'data_change',    // Triggers when data changes
  SCHEDULED = 'scheduled',        // Scheduled trigger (cron-like)
  EVENT = 'event',                // Event-based trigger
  THRESHOLD = 'threshold',        // Threshold-based trigger
}

export enum WorkflowActionType {
  SEND_EMAIL = 'send_email',
  CREATE_RECORD = 'create_record',
  UPDATE_RECORD = 'update_record',
  DELETE_RECORD = 'delete_record',
  EXPORT_DATA = 'export_data',
  SEND_NOTIFICATION = 'send_notification',
  EXECUTE_SCRIPT = 'execute_script',
  WAIT = 'wait',
  BRANCH = 'branch',
}

export enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'gt',
  LESS_THAN = 'lt',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  IN = 'in',
  NOT_IN = 'not_in',
}

export enum WorkflowStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
}

export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Trigger definition
 */
export interface WorkflowTrigger {
  id: string;
  type: WorkflowTriggerType;
  name: string;
  config: Record<string, any>;
  enabled: boolean;
}

/**
 * Condition for decision making
 */
export interface WorkflowCondition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: string | number | boolean | string[];
  logicalOperator?: 'and' | 'or'; // For multiple conditions
}

/**
 * Action to execute
 */
export interface WorkflowAction {
  id: string;
  type: WorkflowActionType;
  name: string;
  description?: string;
  config: Record<string, any>;
  retryable: boolean;
  retryCount?: number;
  timeout?: number; // milliseconds
}

/**
 * Step in workflow
 */
export interface WorkflowStep {
  id: string;
  name: string;
  order: number;
  actions: WorkflowAction[];
  conditions?: WorkflowCondition[];
  errorHandling?: 'continue' | 'stop' | 'fallback';
  fallbackStepId?: string;
}

/**
 * Complete workflow definition
 */
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  version: number;
  isPublic: boolean;
  tags?: string[];
}

/**
 * Workflow execution record
 */
export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  triggeredBy: string;
  startedAt: Date;
  completedAt?: Date;
  status: ExecutionStatus;
  steps: WorkflowStepExecution[];
  result?: Record<string, any>;
  errorMessage?: string;
  executionTime?: number; // milliseconds
}

/**
 * Execution of a single step
 */
export interface WorkflowStepExecution {
  id: string;
  stepId: string;
  stepName: string;
  status: ExecutionStatus;
  actions: WorkflowActionExecution[];
  startedAt: Date;
  completedAt?: Date;
  result?: Record<string, any>;
  errorMessage?: string;
}

/**
 * Execution of a single action
 */
export interface WorkflowActionExecution {
  id: string;
  actionId: string;
  actionName: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  result?: Record<string, any>;
  errorMessage?: string;
  retryAttempts: number;
}

/**
 * Workflow template for reuse
 */
export interface WorkflowTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  workflow: Workflow;
  icon?: string;
  usageCount?: number;
  isPublic: boolean;
  createdAt: Date;
  createdBy: string;
}

/**
 * Workflow statistics
 */
export interface WorkflowStats {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  successRate: number;
}

/**
 * Workflow schedule configuration
 */
export interface WorkflowSchedule {
  id: string;
  workflowId: string;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';
  cronExpression?: string;
  timezone?: string;
  isActive: boolean;
  nextRun?: Date;
  lastRun?: Date;
}

/**
 * Builder state
 */
export interface WorkflowBuilderState {
  currentWorkflow: Workflow;
  isDirty: boolean;
  validationErrors: string[];
  selectedStepId?: string;
  isExecuting: boolean;
  lastExecution?: WorkflowExecution;
}
