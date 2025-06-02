//#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const path = require('path');

// URLs of the CSV files
const urls = {
  confezioni: 'https://drive.aifa.gov.it/farmaci/confezioni.csv',
  pa_confezioni: 'https://drive.aifa.gov.it/farmaci/PA_confezioni.csv',
  atc: 'https://drive.aifa.gov.it/farmaci/atc.csv'
};

// Function to download a file
function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => reject(err));
    });
  });
}

// Function to parse CSV
function parseCSV(content) {
  const lines = content.split('\n');
  const headers = lines[0].split(';').map(h => h.trim());
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(';').map(v => v.trim());
    const entry = {};
    headers.forEach((header, index) => {
      entry[header] = values[index] || '';
    });
    result.push(entry);
  }
  
  return result;
}

// Main function
async function main() {
  
  // Output file path
  const outputFile = './src/data/AIFA.js';

  try {
    // Download and process each file
    const confezioniFile = 'confezioni.csv';
    const paConfezioniFile = 'pa_confezioni.csv';
    const atcFile = 'atc.csv';
    
    await downloadFile(urls.confezioni, confezioniFile);
    await downloadFile(urls.pa_confezioni, paConfezioniFile);
    await downloadFile(urls.atc, atcFile);
    
    // Read and parse the files
    const confezioniContent = fs.readFileSync(confezioniFile, 'utf8');
    const paConfezioniContent = fs.readFileSync(paConfezioniFile, 'utf8');
    const atcContent = fs.readFileSync(atcFile, 'utf8');
    
    const confezioniData = parseCSV(confezioniContent);
    const paConfezioniData = parseCSV(paConfezioniContent);
    const atcData = parseCSV(atcContent);
    
    // Process anagrafica data
    const mockAnagrafica = confezioniData
      .reduce((acc, item) => {
        // Check if name already exists in accumulator
        if (!acc.some(x => x.denominazione === item.denominazione)) {
          acc.push(item);
        }
        return acc;
      }, [])
      .map(item => ({
        id: item.codice_aic,
        name: item.denominazione,
        holder: item.ragione_sociale,
        form: item.forma,
        atcCode: item.codice_atc
      }))
    ;
    
    // Process principi attivi data
    const mockPrincipiAttivi = paConfezioniData
      .reduce((acc, item) => {
        // Check if name already exists in accumulator
        if (!acc.some(x => x.principio_attivo === item.principio_attivo)) {
          acc.push(item);
        }
        return acc;
      }, [])
      .map((item, index) => ({
        id: `PA${String(index + 1).padStart(3, '0')}`,
        name: item.principio_attivo,
        description: `${item.quantita} ${item.unita_misura}`
      }))
    ;
    
    // Process ATC data
    const mockATC = atcData
       .reduce((acc, item) => {
        // Check if name already exists in accumulator
        if (!acc.some(x => x.descrizione === item.descrizione)) {
          acc.push(item);
        }
        return acc;
      }, [])
      .map(item => ({
        code: item.codice_atc,
        description: item.descrizione,
        level: getATCLevelDescription(item.codice_atc)
      }))
    ;
    
    // Generate the output file
    const output = `// Auto-generated mock data from AIFA sources
export const mockAnagrafica = ${JSON.stringify(mockAnagrafica, null, 2)};

export const mockPrincipiAttivi = ${JSON.stringify(mockPrincipiAttivi, null, 2)};

export const mockATC = ${JSON.stringify(mockATC, null, 2)};
`;
    
    fs.writeFileSync(outputFile, output);

    //console.log(`Data processing complete. Output saved to const ${outputFile}`);

    // Clean up temporary files
    fs.unlinkSync(confezioniFile);
    fs.unlinkSync(paConfezioniFile);
    fs.unlinkSync(atcFile);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Helper function to determine ATC level
function getATCLevelDescription(atcCode) {
  if (!atcCode) return 'Unknown';
  
  const length = atcCode.length;
  switch (length) {
    case 1: return 'Anatomico';
    case 3: return 'Terapeutico';
    case 4: return 'Farmacologico';
    case 5: return 'Chimico';
    case 7: return 'Principio attivo';
    default: return 'Unknown';
  }
}

main();
