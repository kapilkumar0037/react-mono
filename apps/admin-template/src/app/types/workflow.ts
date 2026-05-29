/**
 * Workflow Automation Types
 * Feature 9: Rule-based automation for tasks and actions
 */

export enum TriggerType {
  ENTITY_CREATED = 'entity_created',       // Trigger when new entity is created
  ENTITY_UPDATED = 'entity_updated',       // Trigger when entity is updated
  ENTITY_DELETED = 'entity_deleted',       // Trigger when entity is deleted
  STATUS_CHANGED = 'status_changed',       // Trigger when status field changes
  FIELD_CHANGED = 'field_changed',         // Trigger when specific field changes
  TIME_BASED = 'time_based',               // Trigger at specific time/schedule
  THRESHOLD_REACHED = 'threshold_reached', // Trigger when value exceeds threshold
  MANUAL = 'manual',                       // Manual trigger
}

export enum ActionType {
  SEND_EMAIL = 'send_email',               // Send email notification
  SEND_SMS = 'send_sms',                   // Send SMS notification
  UPDATE_FIELD = 'update_field',           // Update field value
  CREATE_RECORD = 'create_record',         // Create new record
  DELETE_RECORD = 'delete_record',         // Delete record
  ASSIGN_TO_USER = 'assign_to_user',       // Assign to user
  CHANGE_STATUS = 'change_status',         // Change status field
  RUN_WEBHOOK = 'run_webhook',             // Call webhook
  LOG_ACTIVITY = 'log_activity',           // Log activity entry
  SEND_NOTIFICATION = 'send_notification', // Send in-app notification
}

export enum ConditionOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  BETWEEN = 'between',
  IN = 'in',
  NOT_IN = 'not_in',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty',
}

export enum WorkflowStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused',
  ERROR = 'error',
}

export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILED = 'failed',
  SKIPPED = 'skipped',
}

/**
 * Condition for evaluating rule applicability
 */
export interface WorkflowCondition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: string | number | boolean | (string | number)[];
  logicalOperator?: 'AND' | 'OR'; // AND is default
}

/**
 * Trigger definition
 */
export interface WorkflowTrigger {
  id: string;
  type: TriggerType;
  entityType: string; // e.g., 'user', 'order', 'customer'
  schedule?: string; // Cron expression for TIME_BASED triggers
  field?: string; // For FIELD_CHANGED and STATUS_CHANGED triggers
  conditions: WorkflowCondition[];
}

/**
 * Action to execute when rule matches
 */
export interface WorkflowAction {
  id: string;
  type: ActionType;
  config: Record<string, any>; // e.g., { email: 'user@example.com', subject: '...' }
  delay?: number; // Delay in seconds before executing action
  retryCount?: number; // Number of retry attempts
  retryDelay?: number; // Delay between retries in seconds
}

/**
 * Workflow rule definition
 */
export interface WorkflowRule {
  id: string;
  name: string;
  description?: string;
  entityType: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  conditions: WorkflowCondition[];
  status: WorkflowStatus;
  priority: number; // 1-10, higher = executed first
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

/**
 * Workflow execution instance
 */
export interface WorkflowExecution {
  id: string;
  ruleId: string;
  ruleName: string;
  triggerType: TriggerType;
  entityType: string;
  entityId: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  executedActions: string[]; // IDs of actions that ran
  failedActions?: { actionId: string; error: string }[];
  errorMessage?: string;
  metadata?: Record<string, any>;
  duration?: number; // milliseconds
}

/**
 * Workflow execution log entry
 */
export interface WorkflowExecutionLog {
  id: string;
  executionId: string;
  ruleId: string;
  timestamp: Date;
  action: string;
  result: 'success' | 'failure';
  details: string;
  metadata?: Record<string, any>;
}

/**
 * Workflow statistics
 */
export interface WorkflowStats {
  totalRules: number;
  activeRules: number;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  lastExecutionTime?: Date;
}

/**
 * Workflow template for reusable workflows
 */
export interface WorkflowTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  rules: WorkflowRule[];
  icon?: string;
  isPublic: boolean;
  createdAt: Date;
  usageCount?: number;
}

/**
 * User workflow preferences
 */
export interface WorkflowPreferences {
  userId: string;
  autoExecuteRules: boolean;
  notifyOnExecution: boolean;
  notifyOnError: boolean;
  retentionDays: number;
  maxConcurrentExecutions: number;
}

/**
 * Workflow builder state
 */
export interface WorkflowBuilderState {
  currentRule: WorkflowRule;
  preview?: {
    matchingRecords: number;
    affectedFields: string[];
  };
  validationErrors: string[];
  isDirty: boolean;
}
