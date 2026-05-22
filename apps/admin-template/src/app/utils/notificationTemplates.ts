import {
  NotificationTemplate,
  NotificationType,
  EmailNotification,
  NotificationPreference,
  NotificationPriority,
} from '../types/notification';

/**
 * Default notification templates
 */
export const DEFAULT_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tpl-critical-action',
    type: NotificationType.CRITICAL_ACTION,
    subject: 'Critical System Action: {{action}}',
    plainText: `A critical action was performed in your workspace:

Action: {{action}}
Performed by: {{userName}} ({{userEmail}})
Timestamp: {{timestamp}}
Details: {{details}}

If you did not authorize this action, please contact your administrator immediately.`,
    htmlTemplate: `<h2>Critical System Action Alert</h2>
<p>A critical action was performed in your workspace:</p>
<ul>
  <li><strong>Action:</strong> {{action}}</li>
  <li><strong>Performed by:</strong> {{userName}} ({{userEmail}})</li>
  <li><strong>Timestamp:</strong> {{timestamp}}</li>
  <li><strong>Details:</strong> {{details}}</li>
</ul>
<p><em>If you did not authorize this action, please contact your administrator immediately.</em></p>`,
    variables: ['action', 'userName', 'userEmail', 'timestamp', 'details'],
  },
  {
    id: 'tpl-bulk-delete',
    type: NotificationType.BULK_DELETE_WARNING,
    subject: 'Bulk Delete Warning: {{count}} items deleted',
    plainText: `A bulk delete operation was performed:

Count: {{count}} items
Entity Type: {{entityType}}
Deleted by: {{userName}}
Timestamp: {{timestamp}}

This action is permanent and cannot be undone.`,
    htmlTemplate: `<h2>Bulk Delete Operation Completed</h2>
<p>A bulk delete operation was performed:</p>
<ul>
  <li><strong>Items Deleted:</strong> {{count}}</li>
  <li><strong>Entity Type:</strong> {{entityType}}</li>
  <li><strong>Deleted by:</strong> {{userName}}</li>
  <li><strong>Timestamp:</strong> {{timestamp}}</li>
</ul>
<p><em>This action is permanent and cannot be undone.</em></p>`,
    variables: ['count', 'entityType', 'userName', 'timestamp'],
  },
  {
    id: 'tpl-user-created',
    type: NotificationType.USER_CREATED,
    subject: 'New User Created: {{newUserName}}',
    plainText: `A new user has been added to your workspace:

Name: {{newUserName}}
Email: {{newUserEmail}}
Role: {{role}}
Added by: {{addedByName}}
Timestamp: {{timestamp}}`,
    htmlTemplate: `<h2>New User Created</h2>
<p>A new user has been added to your workspace:</p>
<ul>
  <li><strong>Name:</strong> {{newUserName}}</li>
  <li><strong>Email:</strong> {{newUserEmail}}</li>
  <li><strong>Role:</strong> {{role}}</li>
  <li><strong>Added by:</strong> {{addedByName}}</li>
  <li><strong>Timestamp:</strong> {{timestamp}}</li>
</ul>`,
    variables: ['newUserName', 'newUserEmail', 'role', 'addedByName', 'timestamp'],
  },
  {
    id: 'tpl-user-role-changed',
    type: NotificationType.USER_ROLE_CHANGED,
    subject: 'User Role Changed: {{userName}}',
    plainText: `A user's role has been changed:

User: {{userName}}
Previous Role: {{oldRole}}
New Role: {{newRole}}
Changed by: {{changedByName}}
Timestamp: {{timestamp}}`,
    htmlTemplate: `<h2>User Role Changed</h2>
<p>A user's role has been changed:</p>
<ul>
  <li><strong>User:</strong> {{userName}}</li>
  <li><strong>Previous Role:</strong> {{oldRole}}</li>
  <li><strong>New Role:</strong> {{newRole}}</li>
  <li><strong>Changed by:</strong> {{changedByName}}</li>
  <li><strong>Timestamp:</strong> {{timestamp}}</li>
</ul>`,
    variables: ['userName', 'oldRole', 'newRole', 'changedByName', 'timestamp'],
  },
];

/**
 * Find template by notification type
 */
export const getTemplate = (type: NotificationType): NotificationTemplate | null => {
  return DEFAULT_TEMPLATES.find((t) => t.type === type) || null;
};

/**
 * Render template with variables
 */
export const renderTemplate = (
  template: NotificationTemplate,
  variables: Record<string, any>,
  renderHtml: boolean = false
): string => {
  let content = renderHtml ? template.htmlTemplate : template.plainText;

  for (const [key, value] of Object.entries(variables)) {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), String(value || ''));
  }

  return content;
};

/**
 * Create notification from template
 */
export const createNotificationFromTemplate = (
  type: NotificationType,
  recipient: string,
  recipientEmail: string,
  variables: Record<string, any>,
  priority: NotificationPriority = NotificationPriority.MEDIUM
): EmailNotification => {
  const template = getTemplate(type);

  if (!template) {
    throw new Error(`No template found for notification type: ${type}`);
  }

  const subject = renderTemplate(template, variables, false)
    .split('\n')[0]
    .replace('Subject: ', '');
  const message = renderTemplate(template, variables, false);
  const htmlContent = renderTemplate(template, variables, true);

  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    priority,
    recipient,
    recipientEmail,
    subject,
    message,
    htmlContent,
    metadata: variables,
    timestamp: Date.now(),
    status: 'pending',
    retryCount: 0,
    maxRetries: 3,
  };
};

/**
 * Get priority for notification type
 */
export const getPriorityForType = (type: NotificationType): NotificationPriority => {
  switch (type) {
    case NotificationType.CRITICAL_ACTION:
    case NotificationType.PERMISSION_DENIED:
    case NotificationType.SYSTEM_ERROR:
    case NotificationType.BULK_DELETE_WARNING:
      return NotificationPriority.CRITICAL;

    case NotificationType.USER_ROLE_CHANGED:
    case NotificationType.COMPLIANCE_ALERT:
    case NotificationType.AUDIT_THRESHOLD_REACHED:
      return NotificationPriority.HIGH;

    case NotificationType.USER_CREATED:
    case NotificationType.USER_DELETED:
    case NotificationType.BULK_EXPORT_COMPLETE:
      return NotificationPriority.MEDIUM;

    default:
      return NotificationPriority.LOW;
  }
};

/**
 * Should send notification based on preferences
 */
export const shouldSendNotification = (
  notificationType: NotificationType,
  preferences: NotificationPreference
): boolean => {
  // Check if critical alerts only
  if (preferences.criticalAlertsOnly) {
    const priority = getPriorityForType(notificationType);
    return priority === NotificationPriority.CRITICAL;
  }

  // Check if notification type is enabled
  const typePreference = preferences.notificationTypes[notificationType];
  if (typePreference === false) {
    return false;
  }

  // Check digest mode
  if (preferences.digestMode === 'off') {
    return false;
  }

  return true;
};
