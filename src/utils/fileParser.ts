import * as XLSX from "xlsx";

export interface DatasetIntelligence {
  suggestedTarget: string;
  suggestedFeatures: string[];
  schemaNotes: string;
}

export interface ParsedDataset {
  fileName: string;
  rowCount: number;
  colCount: number;
  headers: string[];
  rows: any[];
  summary: {
    [col: string]: {
      type: "numeric" | "categorical";
      missingCount: number;
      min?: number;
      max?: number;
      mean?: number;
      stdDev?: number;
      uniqueCount: number;
    };
  };
  intelligence?: DatasetIntelligence;
}

export function parseCsvContent(text: string): any[] {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
  if (lines.length === 0) return [];

  // Determine delimiter: comma, semicolon, or tab
  const firstLine = lines[0];
  let delimiter = ",";
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (semiCount > commaCount && semiCount > tabCount) {
    delimiter = ";";
  } else if (tabCount > commaCount && tabCount > semiCount) {
    delimiter = "\t";
  }

  // Parse headers
  const headers = firstLine.split(delimiter).map(h => h.replace(/^["']|["']$/g, "").trim());

  const rows: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split cell values keeping intact elements within double quotes
    const cells: string[] = [];
    let currentCell = "";
    let insideQuotes = false;

    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === delimiter && !insideQuotes) {
        cells.push(currentCell.replace(/^["']|["']$/g, "").trim());
        currentCell = "";
      } else {
        currentCell += char;
      }
    }
    cells.push(currentCell.replace(/^["']|["']$/g, "").trim());

    if (cells.length > 0) {
      const obj: any = {};
      headers.forEach((hdr, idx) => {
        obj[hdr] = cells[idx] !== undefined ? cells[idx] : "";
      });
      rows.push(obj);
    }
  }

  return rows;
}

export function analyzeDataset(fileName: string, rows: any[]): ParsedDataset {
  if (rows.length === 0) {
    return {
      fileName,
      rowCount: 0,
      colCount: 0,
      headers: [],
      rows: [],
      summary: {}
    };
  }

  const headers = Object.keys(rows[0] || {});
  const summary: ParsedDataset["summary"] = {};

  headers.forEach(hdr => {
    let missingCount = 0;
    const numericVals: number[] = [];
    const uniqueVals = new Set<string>();

    rows.forEach(row => {
      const cell = row[hdr];
      if (cell === null || cell === undefined || String(cell).trim() === "") {
        missingCount++;
      } else {
        uniqueVals.add(String(cell).trim());
        const num = Number(cell);
        if (!isNaN(num)) {
          numericVals.push(num);
        }
      }
    });

    const isNumeric = numericVals.length > 0 && (numericVals.length >= (rows.length - missingCount) * 0.7);

    if (isNumeric) {
      const sum = numericVals.reduce((a, b) => a + b, 0);
      const avg = numericVals.length > 0 ? sum / numericVals.length : 0;
      const squaredDiffs = numericVals.map(val => Math.pow(val - avg, 2));
      const variance = numericVals.length > 0 ? squaredDiffs.reduce((a, b) => a + b, 0) / numericVals.length : 0;
      const stdDev = Math.sqrt(variance);

      summary[hdr] = {
        type: "numeric",
        missingCount,
        min: numericVals.length > 0 ? Math.min(...numericVals) : 0,
        max: numericVals.length > 0 ? Math.max(...numericVals) : 0,
        mean: avg,
        stdDev,
        uniqueCount: uniqueVals.size
      };
    } else {
      summary[hdr] = {
        type: "categorical",
        missingCount,
        uniqueCount: uniqueVals.size
      };
    }
  });

  const datasetResult: ParsedDataset = {
    fileName,
    rowCount: rows.length,
    colCount: headers.length,
    headers,
    rows,
    summary
  };

  datasetResult.intelligence = runDatasetIntelligence(datasetResult);
  return datasetResult;
}

export function runDatasetIntelligence(dataset: ParsedDataset): DatasetIntelligence {
  const headers = dataset.headers;
  if (headers.length === 0) {
    return { suggestedTarget: "", suggestedFeatures: [], schemaNotes: "No columns found." };
  }

  // 1. Identify numeric columns
  const numericColumns = headers.filter(h => dataset.summary[h]?.type === "numeric");
  // 2. Identify categorical columns
  const categoricalColumns = headers.filter(h => dataset.summary[h]?.type === "categorical");

  let suggestedTarget = "";
  
  // Custom name priorities representing output regressors or targeted metrics
  const targetPattern = /(_target|target|_label|label|_y|y_|y_outcome|y|outcome|score|wear|hardness|roughness|price|cost|output|carbon|temp)/i;
  let targetCand = numericColumns.find(h => targetPattern.test(h));
  
  if (!targetCand && numericColumns.length > 0) {
    // Default to the last numeric column of the schema
    targetCand = numericColumns[numericColumns.length - 1];
  }
  
  suggestedTarget = targetCand || headers[headers.length - 1] || "";

  // 3. Recommended features: exclude target and any Row IDs or high-cardinality keys
  const idPattern = /^(id|index|uuid|row_id|no|num|row|key)$/i;
  const suggestedFeatures = headers.filter(h => {
    if (h === suggestedTarget) return false;
    if (idPattern.test(h) && (dataset.summary[h]?.uniqueCount === dataset.rowCount || dataset.summary[h]?.uniqueCount > 20)) return false;
    return true;
  });

  const schemaNotes = `Detected ${numericColumns.length} numeric variables and ${categoricalColumns.length} categorical variables. Selected target continuous column "${suggestedTarget}" as prediction goal, utilizing inputs: ${suggestedFeatures.slice(0, 4).join(", ")}${suggestedFeatures.length > 4 ? "..." : ""}.`;

  return {
    suggestedTarget,
    suggestedFeatures,
    schemaNotes
  };
}

export async function parseExcelBuffer(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const ab = e.target?.result as ArrayBuffer;
        const data = new Uint8Array(ab);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet);
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Unable to read Excel file buffer"));
    reader.readAsArrayBuffer(file);
  });
}
