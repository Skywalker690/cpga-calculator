/**
 * Parse CSV text into an array of objects
 * @param {string} csvText - The CSV text to parse
 * @returns {Array<Object>} Array of objects where keys are column headers
 */
export function parseCSV(csvText) {
  // Split into lines and filter out empty lines
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return [];
  }

  // Parse the header row
  const headers = parseCSVLine(lines[0]).map(cleanField);
  
  // Parse data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]).map(cleanField);
    
    // Create object from headers and values
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    data.push(row);
  }
  
  return data;
}

// Helper to clean field: remove surrounding quotes and trim
function cleanField(field) {
  return field.replace(/^"(.+)"$/, '$1').trim();
}

/**
 * Parse a single CSV line, handling quoted values
 * @param {string} line - A single line from CSV
 * @returns {Array<string>} Array of values (with quotes preserved for now)
 */
function parseCSVLine(line) {
  const values = [];
  let currentValue = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote inside quoted field  
        currentValue += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // Field separator outside quotes - end of value
      values.push(currentValue);
      currentValue = '';
    } else {
      // Regular character - add to current value
      currentValue += char;
    }
  }
  
  // Add the last value
  values.push(currentValue);
  
  return values;
}