import { useState, useCallback } from 'react';
import {
  AuditLog,
  AuditFilter,
  AuditActionType,
} from '../types/auditLog';
import {
  readAuditLogs,
  persistAuditLogs,
  addAuditLog,
  filterAuditLogs,
  generateAuditSummary,
  getSeverityForAction,
} from '../utils/auditLogStorage';

export const useAuditLog = () => {
  const [logs, setLogs] = useState<AuditLog[]>(() => readAuditLogs());

  const logAction = useCallback(
    (
      actionType: AuditActionType,
      userId: string,
      userName: string,
      userEmail: string,
      entityType: string,
      options: {
        entityId?: string;
        entityName?: string;
        description: string;
        changes?: Record<string, { before: any; after: any }>;
        status?: 'success' | 'failure';
        errorMessage?: string;
        metadata?: Record<string, any>;
      }
    ) => {
      const severity = getSeverityForAction(actionType);
      const log = addAuditLog({
        timestamp: Date.now(),
        actionType,
        severity,
        userId,
        userName,
        userEmail,
        entityType,
        entityId: options.entityId,
        entityName: options.entityName,
        action: actionType.replace(/_/g, ' '),
        description: options.description,
        changes: options.changes,
        status: options.status || 'success',
        errorMessage: options.errorMessage,
        metadata: options.metadata,
      });

      setLogs((prev) => [...prev, log]);
      return log;
    },
    []
  );

  const getLogs = useCallback(() => {
    return logs;
  }, [logs]);

  const filterLogs = useCallback((filter: AuditFilter) => {
    return filterAuditLogs(logs, filter);
  }, [logs]);

  const getSummary = useCallback((filter?: AuditFilter) => {
    return generateAuditSummary(logs, filter);
  }, [logs]);

  const clearLogs = useCallback(() => {
    setLogs([]);
    persistAuditLogs([]);
  }, []);

  const exportLogsToCSV = useCallback(() => {
    const csvContent = logs
      .map(
        (log) =>
          `"${new Date(log.timestamp).toLocaleString()}","${log.action}","${log.userName}","${log.userEmail}","${log.entityType}","${log.entityName || '-'}","${log.status}","${log.severity}","${log.description}"`
      )
      .join('\n');

    const headers =
      '"Timestamp","Action","User","Email","Entity Type","Entity","Status","Severity","Description"';
    const fullCSV = [headers, csvContent].join('\n');

    const blob = new Blob([fullCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [logs]);

  return {
    logs,
    logAction,
    getLogs,
    filterLogs,
    getSummary,
    clearLogs,
    exportLogsToCSV,
  };
};
