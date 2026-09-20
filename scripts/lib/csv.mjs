/**
 * Minimal RFC 4180 CSV reader/writer.
 *
 * Written by hand rather than pulled from npm because the catalogue is the
 * one thing a non-developer edits, and a twenty-line parser we control is
 * easier to trust than a dependency. Handles quoted fields containing commas,
 * quotes and newlines, which is what Excel and Google Sheets produce.
 */

/** Quote a single field only when it needs it. */
function quote(value) {
  const s = value == null ? '' : String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Rows (array of objects) -> CSV text, using `columns` for order. */
export function toCsv(rows, columns) {
  const lines = [columns.join(',')];
  for (const row of rows) {
    lines.push(columns.map((c) => quote(row[c])).join(','));
  }
  // \r\n keeps Excel happy on Windows; a BOM stops it mangling ₹ and é.
  return '﻿' + lines.join('\r\n') + '\r\n';
}

/** CSV text -> array of objects keyed by the header row. */
export function fromCsv(text) {
  // Strip a BOM if the file came back from Excel.
  const src = text.replace(/^﻿/, '');

  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];

    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\r') {
      // handled by the \n that follows
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }

  // Trailing field/row with no closing newline.
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // Drop entirely blank lines — Excel likes to leave them at the end.
  const meaningful = rows.filter((r) => r.some((c) => c.trim() !== ''));
  if (meaningful.length === 0) return { headers: [], records: [] };

  const headers = meaningful[0].map((h) => h.trim());
  const records = meaningful.slice(1).map((cells, i) => {
    const obj = {};
    headers.forEach((h, j) => {
      obj[h] = (cells[j] ?? '').trim();
    });
    // Spreadsheet row number, so error messages point at what the user sees.
    obj.__row = i + 2;
    return obj;
  });

  return { headers, records };
}
