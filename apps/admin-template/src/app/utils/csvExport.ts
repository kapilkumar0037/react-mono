/**
 * CSV Export Utility
 * Converts data arrays to CSV format and triggers browser download
 */

export interface CSVExportOptions {
  filename?: string;
  columns?: string[];
  columnLabels?: Record<string, string>;
  dateFormat?: 'ISO' | 'US' | 'EU';
}

export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  options: CSVExportOptions = {}
) => {
  const {
    filename = `export-${new Date().toISOString().split('T')[0]}.csv`,
    columns,
    columnLabels = {},
    dateFormat = 'ISO',
  } = options;

  if (data.length === 0) {
    return;
  }

  // Determine columns to export
  const allColumns = columns || Object.keys(data[0]);
  const headers = allColumns.map(col => columnLabels[col] || col);

  // Format cell value
  const formatCell = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }

    if (value instanceof Date) {
      if (dateFormat === 'US') {
        return value.toLocaleDateString('en-US');
      } else if (dateFormat === 'EU') {
        return value.toLocaleDateString('de-DE');
      }
      return value.toISOString().split('T')[0];
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    const stringValue = String(value);
    // Escape quotes and wrap in quotes if contains comma, newline, or quotes
    if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  };

  // Build CSV content
  const csvRows: string[] = [];
  csvRows.push(headers.map(h => formatCell(h)).join(','));

  for (const row of data) {
    const cells = allColumns.map(col => formatCell(row[col]));
    csvRows.push(cells.join(','));
  }

  const csvContent = csvRows.join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate CSV report with summary statistics
 */
export const exportToCSVWithReport = <T extends Record<string, any>>(
  data: T[],
  options: CSVExportOptions & {
    reportTitle?: string;
    reportDate?: boolean;
    summary?: Record<string, any>;
  } = {}
) => {
  const {
    reportTitle,
    reportDate = true,
    summary,
    ...csvOptions
  } = options;

  const lines: string[] = [];

  if (reportTitle) {
    lines.push(reportTitle);
    lines.push('');
  }

  if (reportDate) {
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push('');
  }

  if (summary) {
    lines.push('Summary:');
    for (const [key, value] of Object.entries(summary)) {
      lines.push(`${key}: ${value}`);
    }
    lines.push('');
  }

  // Add data section
  const { columns, columnLabels } = csvOptions;
  const allColumns = columns || Object.keys(data[0] || {});
  const headers = allColumns.map(col => columnLabels?.[col] || col);

  const formatCell = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    const str = String(value);
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  lines.push(headers.map(h => formatCell(h)).join(','));
  for (const row of data) {
    const cells = allColumns.map(col => formatCell(row[col]));
    lines.push(cells.join(','));
  }

  const csvContent = lines.join('\n');
  const filename = csvOptions.filename || `report-${new Date().toISOString().split('T')[0]}.csv`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
