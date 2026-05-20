/**
 * PDF Export Utility
 * Converts data to HTML table and triggers print-to-PDF
 */

export interface PDFExportOptions {
  title?: string;
  filename?: string;
  columns?: string[];
  columnLabels?: Record<string, string>;
  includeTimestamp?: boolean;
}

export const exportToPDF = <T extends Record<string, any>>(
  data: T[],
  options: PDFExportOptions = {}
) => {
  const {
    title = 'Export Report',
    filename = `export-${new Date().toISOString().split('T')[0]}.pdf`,
    columns,
    columnLabels = {},
    includeTimestamp = true,
  } = options;

  if (data.length === 0) {
    return;
  }

  const allColumns = columns || Object.keys(data[0]);
  const headers = allColumns.map(col => columnLabels[col] || col);

  // Build HTML table
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        h1 {
          color: #1f2937;
          margin-bottom: 10px;
          font-size: 24px;
        }
        .timestamp {
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        thead {
          background-color: #f3f4f6;
          border-bottom: 2px solid #e5e7eb;
        }
        th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
        }
        tbody tr:nth-child(even) {
          background-color: #f9fafb;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 12px;
        }
        @media print {
          body {
            margin: 0;
          }
          table {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
  `;

  if (includeTimestamp) {
    html += `<div class="timestamp">Generated: ${new Date().toLocaleString()}</div>`;
  }

  html += `
      <table>
        <thead>
          <tr>
            ${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `;

  for (const row of data) {
    html += '<tr>';
    for (const col of allColumns) {
      const value = row[col];
      const displayValue = formatPDFValue(value);
      html += `<td>${escapeHtml(displayValue)}</td>`;
    }
    html += '</tr>';
  }

  html += `
        </tbody>
      </table>
      <div class="footer">
        <p>Total Records: ${data.length}</p>
        <p>Page ${'{PAGE}'} of ${'{PAGES}'}</p>
      </div>
    </body>
    </html>
  `;

  // Open in new window and trigger print dialog
  const printWindow = window.open('', '', 'width=900,height=600');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    // Trigger print dialog after a short delay to ensure content is rendered
    setTimeout(() => {
      printWindow.print();
      // Note: closing window after print can be prevented by browser security
      // printWindow.close();
    }, 250);
  }
};

/**
 * Format value for PDF display
 */
const formatPDFValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

/**
 * Escape HTML special characters
 */
const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Export to PDF with custom styling
 */
export const exportToPDFAdvanced = <T extends Record<string, any>>(
  data: T[],
  options: PDFExportOptions & {
    theme?: 'light' | 'professional' | 'minimal';
    headerColor?: string;
    headerTextColor?: string;
  } = {}
) => {
  const {
    theme = 'professional',
    headerColor = '#1f2937',
    headerTextColor = '#ffffff',
    ...pdfOptions
  } = options;

  if (data.length === 0) {
    return;
  }

  const allColumns = pdfOptions.columns || Object.keys(data[0]);
  const headers = allColumns.map(col => pdfOptions.columnLabels?.[col] || col);

  const themeStyles: Record<string, string> = {
    light: `
      body { background-color: #ffffff; }
      th { background-color: #f0f0f0; }
      tbody tr:nth-child(even) { background-color: #fafafa; }
    `,
    professional: `
      body { background-color: #ffffff; }
      th { background-color: ${headerColor}; color: ${headerTextColor}; }
      tbody tr:nth-child(even) { background-color: #f9fafb; }
    `,
    minimal: `
      body { background-color: #ffffff; }
      th { background-color: transparent; border-bottom: 3px solid #1f2937; }
      thead { border-bottom: none; }
      tbody tr { border-bottom: 1px solid #e5e7eb; }
    `,
  };

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${pdfOptions.title || 'Export Report'}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        h1 {
          color: #1f2937;
          margin-bottom: 10px;
          font-size: 24px;
        }
        .timestamp {
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        thead {
          border-bottom: 2px solid #e5e7eb;
        }
        th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
        }
        td {
          padding: 10px 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 13px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 12px;
        }
        @media print {
          body { margin: 0; }
          table { page-break-inside: avoid; }
        }
        ${themeStyles[theme]}
      </style>
    </head>
    <body>
      <h1>${pdfOptions.title || 'Export Report'}</h1>
  `;

  if (pdfOptions.includeTimestamp) {
    html += `<div class="timestamp">Generated: ${new Date().toLocaleString()}</div>`;
  }

  html += `
      <table>
        <thead>
          <tr>
            ${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `;

  for (const row of data) {
    html += '<tr>';
    for (const col of allColumns) {
      const value = row[col];
      const displayValue = formatPDFValue(value);
      html += `<td>${escapeHtml(displayValue)}</td>`;
    }
    html += '</tr>';
  }

  html += `
        </tbody>
      </table>
      <div class="footer">
        <p>Total Records: ${data.length}</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '', 'width=900,height=600');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};
