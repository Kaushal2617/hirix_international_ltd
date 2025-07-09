/**
 * Utility functions for exporting data
 */

/**
 * Escapes a value for CSV format
 * @param value The value to escape
 */
export const escapeCsvValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }
    
    const stringValue = String(value);
    
    // If the value contains commas, quotes, or newlines, wrap it in quotes
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      // Double up any quotes
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  };
  
  /**
   * Exports data to CSV
   * @param headers Array of header names
   * @param data Array of data objects
   * @param filename The filename for the download
   */
  export const exportToCsv = (headers: { key: string, label: string }[], data: any[], filename: string): void => {
    // Create the CSV header row
    let csvContent = headers.map(header => escapeCsvValue(header.label)).join(',') + '\n';
    
    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => escapeCsvValue(item[header.key])).join(',');
      csvContent += row + '\n';
    });
    
    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and trigger it
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Release the URL object
    URL.revokeObjectURL(url);
  };
  
  /**
   * Exports data to Excel format (actually CSV that Excel can open)
   * @param headers Array of header names
   * @param data Array of data objects
   * @param filename The filename for the download
   */
  export const exportToExcel = (headers: { key: string, label: string }[], data: any[], filename: string): void => {
    filename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
    exportToCsv(headers, data, filename);
  };