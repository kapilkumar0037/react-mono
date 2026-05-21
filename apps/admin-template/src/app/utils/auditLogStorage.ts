import { AuditLog, AuditFilter, AuditSummary, AuditActionType, AuditSeverity } from '../types/auditLog';

const STORAGE_KEY = 'audit-logs';

/**
 * Read all audit logs from localStorage
 */
export const readAuditLogs = (): AuditLog[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to read audit logs:', error);
    return [];
  }
};

/**
 * Persist audit logs to localStorage
 */
export const persistAuditLogs = (logs: AuditLog[]): void => {
  try {
    // Keep only last 1000 logs to prevent localStorage bloat
    const logsToStore = logs.slice(-1000);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logsToStore));
  } catch (error) {
    console.error('Failed to persist audit logs:', error);
  }
};

/**
 * Add a new audit log entry
 */
export const addAuditLog = (log: Omit<AuditLog, 'id'>): AuditLog => {
  const logs = readAuditLogs();
  const newLog: AuditLog = {
    ...log,
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  logs.push(newLog);
  persistAuditLogs(logs);
  return newLog;
};

/**
 * Filter audit logs based on criteria
 */
export const filterAuditLogs = (logs: AuditLog[], filter: AuditFilter): AuditLog[] => {
  return logs.filter((log) => {
    if (filter.startDate && log.timestamp < filter.startDate) return false;
    if (filter.endDate && log.timestamp > filter.endDate) return false;
    if (filter.actionTypes && !filter.actionTypes.includes(log.actionType)) return false;
    if (filter.severity && log.severity !== filter.severity) return false;
    if (filter.userId && log.userId !== filter.userId) return false;
    if (filter.entityType && log.entityType !== filter.entityType) return false;
    if (filter.status && log.status !== filter.status) return false;
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(query) ||
        log.description.toLowerCase().includes(query) ||
        log.userName.toLowerCase().includes(query) ||
        log.userEmail.toLowerCase().includes(query)
      );
    }
    return true;
  });
};

/**
 * Generate audit summary statistics
 */
export const generateAuditSummary = (logs: AuditLog[], filter?: AuditFilter): AuditSummary => {
  const filteredLogs = filter ? filterAuditLogs(logs, filter) : logs;

  if (filteredLogs.length === 0) {
    return {
      totalActions: 0,
      successCount: 0,
      failureCount: 0,
      criticalActions: 0,
      uniqueUsers: 0,
      dateRange: { start: 0, end: 0 },
      topActions: [],
      topUsers: [],
    };
  }

  const successCount = filteredLogs.filter((l) => l.status === 'success').length;
  const failureCount = filteredLogs.filter((l) => l.status === 'failure').length;
  const criticalActions = filteredLogs.filter((l) => l.severity === AuditSeverity.CRITICAL).length;

  const uniqueUsersMap = new Map<string, string>();
  filteredLogs.forEach((log) => {
    uniqueUsersMap.set(log.userId, log.userName);
  });

  const actionTypeCounts = new Map<string, number>();
  filteredLogs.forEach((log) => {
    actionTypeCounts.set(log.action, (actionTypeCounts.get(log.action) || 0) + 1);
  });

  const userActionCounts = new Map<string, { userId: string; userName: string; count: number }>();
  filteredLogs.forEach((log) => {
    const key = log.userId;
    if (!userActionCounts.has(key)) {
      userActionCounts.set(key, { userId: log.userId, userName: log.userName, count: 0 });
    }
    const entry = userActionCounts.get(key)!;
    entry.count++;
  });

  const timestamps = filteredLogs.map((l) => l.timestamp);

  return {
    totalActions: filteredLogs.length,
    successCount,
    failureCount,
    criticalActions,
    uniqueUsers: uniqueUsersMap.size,
    dateRange: {
      start: Math.min(...timestamps),
      end: Math.max(...timestamps),
    },
    topActions: Array.from(actionTypeCounts.entries())
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    topUsers: Array.from(userActionCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
  };
};

/**
 * Export audit logs to CSV
 */
export const exportAuditLogsToCSV = (logs: AuditLog[]): string => {
  const headers = [
    'Timestamp',
    'Action',
    'User',
    'Email',
    'Entity Type',
    'Entity',
    'Status',
    'Severity',
    'Description',
  ];

  const rows = logs.map((log) => [
    new Date(log.timestamp).toLocaleString(),
    log.action,
    log.userName,
    log.userEmail,
    log.entityType,
    log.entityName || '-',
    log.status,
    log.severity,
    log.description,
  ]);

  const csvContent = [
    headers.map((h) => `"${h}"`).join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return csvContent;
};

/**
 * Clear audit logs older than specified days
 */
export const clearOldAuditLogs = (days: number = 90): number => {
  const logs = readAuditLogs();
  const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
  const filtered = logs.filter((log) => log.timestamp > cutoffTime);
  const removedCount = logs.length - filtered.length;
  persistAuditLogs(filtered);
  return removedCount;
};

/**
 * Get severity level for an action
 */
export const getSeverityForAction = (actionType: AuditActionType): AuditSeverity => {
  switch (actionType) {
    case AuditActionType.USER_DELETED:
    case AuditActionType.BULK_DELETE:
    case AuditActionType.UNAUTHORIZED_ACCESS:
    case AuditActionType.USER_ROLE_CHANGED:
      return AuditSeverity.CRITICAL;

    case AuditActionType.BULK_UPDATE:
    case AuditActionType.DATA_EXPORTED:
    case AuditActionType.PERMISSION_DENIED:
    case AuditActionType.ERROR:
      return AuditSeverity.HIGH;

    case AuditActionType.USER_CREATED:
    case AuditActionType.USER_UPDATED:
    case AuditActionType.USER_STATUS_CHANGED:
    case AuditActionType.SETTING_CHANGED:
    case AuditActionType.WARNING:
      return AuditSeverity.MEDIUM;

    default:
      return AuditSeverity.LOW;
  }
};
