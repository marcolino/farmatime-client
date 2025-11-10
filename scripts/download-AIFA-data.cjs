#!/usr/bin/env node

/**
 * AIFA Medicine Dataset Processor
 * --------------------------------
 * Downloads confezioni.csv, filters authorized medicines,
 * normalizes text, merges by commercial name,
 * and outputs two JS files:
 *  - AIFA-full.js: full structured data
 *  - AIFA.js: flattened display strings for autocomplete
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

// URL of the AIFA CSV
const url = 'https://drive.aifa.gov.it/farmaci/confezioni.csv';

// Output directories and file paths
const today = new Date().toISOString().split('T')[0];
const dataDir = './src/data';
const fullFile = path.join(dataDir, 'AIFA-full.js');
const flatFile = path.join(dataDir, 'AIFA.js');
const flatFileBackup = path.join(dataDir, `AIFA-${today}.js`);

/**
 * Download file content as text
 */
function downloadData(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let data = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => (data += chunk));
        response.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

/**
 * Parse semicolon-separated CSV (AIFA format)
 */
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const cols = lines[i].split(';').map((v) => v.trim());
    if (cols.length < 12 || !cols[0]) continue;

    result.push({
      codice_confezione: cols[0],
      codice_aic_base: cols[1],
      progressivo: cols[2],
      nome: cols[3],
      descrizione: cols[4],
      codice_azienda: cols[5],
      azienda: cols[6],
      stato: cols[7],
      procedura: cols[8],
      forma: cols[9],
      atc: cols[10],
      principio_attivo: cols[11],
    });
  }

  return result;
}

/**
 * Normalize text: trim, fix multiple spaces, capitalize nicely
 */
function normalizeText(text) {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b([A-ZÀ-Ü])([A-ZÀ-Ü]+)/g, (_, first, rest) => first + rest.toLowerCase());
}

/**
 * Create a canonical version of a name for grouping
 */
function canonicalName(name) {
  return normalizeText(name).toLowerCase().replace(/\W+/g, '');
}

/**
 * Write output safely with optional backup
 */
function writeOutput(file, content, backupPath = null) {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  if (backupPath && fs.existsSync(file)) {
    fs.copyFileSync(file, backupPath);
    console.log(`Backup created: ${backupPath}`);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Wrote: ${file}`);
}

/**
 * Main process
 */
async function main() {
  try {
    console.log('Downloading confezioni.csv...');
    const csvContent = await downloadData(url);

    console.log('Parsing CSV...');
    const rows = parseCSV(csvContent);

    console.log('Filtering authorized medicines...');
    const authorized = rows.filter((r) => r.stato?.toLowerCase().includes('autorizzata'));
    console.log(`${authorized.length} authorized confezioni`);

    console.log('Normalizing and grouping...');
    const grouped = {};

    for (const r of authorized) {
      const key = canonicalName(r.nome);
      if (!grouped[key]) {
        grouped[key] = {
          name: normalizeText(r.nome),
          principle: normalizeText(r.principio_attivo),
          atc: r.atc || '',
          company: normalizeText(r.azienda),
          forms: new Set(),
          confezioni: [],
        };
      }

      const desc = normalizeText(r.descrizione);
      grouped[key].forms.add(normalizeText(r.forma));
      grouped[key].confezioni.push({
        codice: r.codice_confezione,
        descrizione: desc,
      });
    }

    const medicines = Object.values(grouped).map((m, i) => ({
      id: i + 1,
      name: m.name,
      principle: m.principle,
      atc: m.atc,
      company: m.company,
      forms: Array.from(m.forms),
      confezioni: m.confezioni,
    }));

    console.log(`${medicines.length} unique medicine names`);

    // FULL dataset
    const fullContent = `// Auto-generated on ${today}
// Source: AIFA confezioni.csv
export const medicines = ${JSON.stringify(medicines, null, 2)};
`;

    // FLAT dataset (for client autocomplete)
    const flatArray = [];
    for (const m of medicines) {
      for (const c of m.confezioni) {
        flatArray.push(`${m.name} - ${c.descrizione.replace(/([^\s])-/, '$1 -').replace(/-([^\s])/, '- $1')}`);
      }
    }

//     const flatContent = `// Auto-generated on ${today}
// // Flattened medicine list for fast client-side autocomplete
// export const medicineList = ${JSON.stringify(flatArray, null, 2)};
// `;
    
    // Remove duplicates and sort alphabetically
    const flatArrayUnique = Array.from(new Set(flatArray)).sort();

    const flatContent = `// Auto-generated on ${today}
// Flattened medicine list for fast client-side autocomplete
export default ${JSON.stringify(flatArrayUnique, null, 2)};
`;

    if (fs.existsSync(flatFile)) {
      fs.copyFileSync(flatFile, flatFileBackup); // backup previous flat file
    }

    writeOutput(flatFile, flatContent);
    writeOutput(fullFile, fullContent);

    console.log('Done.');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
